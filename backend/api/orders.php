<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

session_start();
require __DIR__ . '/../includes/db.php';

function getUserIdFromRequest() {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    
    if (preg_match('/Bearer\s+(.*)/', $authHeader, $matches)) {
        $token = $matches[1];
        $data = json_decode(base64_decode($token), true);
        return $data['user_id'] ?? null;
    }
    
    return isset($_SESSION['user']) ? $_SESSION['user']['id'] : null;
}

function getUserRoleFromRequest($pdo) {
    $userId = getUserIdFromRequest();
    if (!$userId) {
        return null;
    }
    
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (preg_match('/Bearer\s+(.*)/', $authHeader, $matches)) {
        try {
            $stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
            $stmt->execute([$userId]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            return $user ? $user['role'] : null;
        } catch (PDOException $e) {
            return null;
        }
    }
    
    return isset($_SESSION['user']) ? $_SESSION['user']['role'] : null;
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $userId = getUserIdFromRequest();
    
    if (!$userId) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => 'Not authenticated'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    $fullName = trim($data['full_name'] ?? '');
    $phone = trim($data['phone'] ?? '');
    $email = trim($data['email'] ?? '');
    $deliveryAddress = trim($data['delivery_address'] ?? '');
    $items = $data['items'] ?? [];
    
    if ($fullName === '' || $phone === '' || $email === '' || $deliveryAddress === '' || empty($items)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Заповніть всі обов\'язкові поля'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    try {
        $pdo->beginTransaction();
        
        $total = 0;
        foreach ($items as $item) {
            $productId = (int)($item['product_id'] ?? 0);
            $quantity = (int)($item['quantity'] ?? 0);
            
            if ($productId <= 0 || $quantity <= 0) {
                throw new Exception('Invalid item data');
            }
            
            $stmt = $pdo->prepare("SELECT price FROM products WHERE id = ?");
            $stmt->execute([$productId]);
            $product = $stmt->fetch();
            
            if (!$product) {
                throw new Exception('Product not found');
            }
            
            $total += $product['price'] * $quantity;
        }
        
        $stmt = $pdo->prepare("
            INSERT INTO orders (user_id, full_name, phone, email, delivery_address, total)
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([$userId, $fullName, $phone, $email, $deliveryAddress, $total]);
        
        $orderId = $pdo->lastInsertId();
        
        $itemStmt = $pdo->prepare("
            INSERT INTO order_items (order_id, product_id, quantity, price)
            VALUES (?, ?, ?, ?)
        ");
        
        foreach ($items as $item) {
            $productId = (int)($item['product_id'] ?? 0);
            $quantity = (int)($item['quantity'] ?? 0);
            
            $stmt = $pdo->prepare("SELECT price FROM products WHERE id = ?");
            $stmt->execute([$productId]);
            $product = $stmt->fetch();
            
            $itemStmt->execute([
                $orderId,
                $productId,
                $quantity,
                $product['price']
            ]);
        }
        
        $pdo->commit();
        
        echo json_encode([
            'success' => true,
            'data' => [
                'id' => (int)$orderId,
                'total' => $total
            ]
        ], JSON_UNESCAPED_UNICODE);
    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
    }
} elseif ($method === 'GET') {
    $userId = getUserIdFromRequest();
    
    if (!$userId) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => 'Not authenticated'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    $userRole = getUserRoleFromRequest($pdo);
    $isAdmin = $userRole === 'admin';
    
    try {
        if ($isAdmin) {
            $stmt = $pdo->prepare("
                SELECT o.*
                FROM orders o
                ORDER BY o.created_at DESC
            ");
            $stmt->execute();
        } else {
            $stmt = $pdo->prepare("
                SELECT o.*
                FROM orders o
                WHERE o.user_id = ?
                ORDER BY o.created_at DESC
            ");
            $stmt->execute([$userId]);
        }
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        foreach ($orders as &$order) {
            $orderId = (int)$order['id'];
            
            $itemsStmt = $pdo->prepare("
                SELECT oi.*, p.name, p.image, p.brand
                FROM order_items oi
                JOIN products p ON oi.product_id = p.id
                WHERE oi.order_id = ?
            ");
            $itemsStmt->execute([$orderId]);
            $items = $itemsStmt->fetchAll(PDO::FETCH_ASSOC);
            
            $order['id'] = $orderId;
            $order['user_id'] = (int)$order['user_id'];
            $order['total'] = (float)$order['total'];
            $order['items'] = $items;
        }
        
        echo json_encode([
            'success' => true,
            'data' => $orders
        ], JSON_UNESCAPED_UNICODE);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Database error'
        ], JSON_UNESCAPED_UNICODE);
    }
} elseif ($method === 'PUT') {
    $userId = getUserIdFromRequest();
    $userRole = getUserRoleFromRequest($pdo);
    
    if (!$userId || $userRole !== 'admin') {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'error' => 'Admin access required'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    $orderId = (int)($data['id'] ?? 0);
    $status = trim($data['status'] ?? '');
    
    $allowedStatuses = ['new', 'processing', 'completed', 'cancelled'];
    if ($orderId <= 0 || !in_array($status, $allowedStatuses)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Invalid order ID or status'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    try {
        $stmt = $pdo->prepare("UPDATE orders SET status = ? WHERE id = ?");
        $stmt->execute([$status, $orderId]);
        
        echo json_encode([
            'success' => true,
            'data' => ['id' => $orderId, 'status' => $status]
        ], JSON_UNESCAPED_UNICODE);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Database error'
        ], JSON_UNESCAPED_UNICODE);
    }
} elseif ($method === 'DELETE') {
    $userId = getUserIdFromRequest();
    $userRole = getUserRoleFromRequest($pdo);
    
    if (!$userId || $userRole !== 'admin') {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'error' => 'Admin access required'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    $orderId = (int)($_GET['id'] ?? 0);
    
    if ($orderId <= 0) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Invalid order ID'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    try {
        $pdo->beginTransaction();
        
        // Видаляємо товари замовлення
        $stmt = $pdo->prepare("DELETE FROM order_items WHERE order_id = ?");
        $stmt->execute([$orderId]);
        
        // Видаляємо замовлення
        $stmt = $pdo->prepare("DELETE FROM orders WHERE id = ?");
        $stmt->execute([$orderId]);
        
        $pdo->commit();
        
        echo json_encode([
            'success' => true,
            'data' => ['id' => $orderId]
        ], JSON_UNESCAPED_UNICODE);
    } catch (PDOException $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Database error'
        ], JSON_UNESCAPED_UNICODE);
    }
} else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Method not allowed'
    ], JSON_UNESCAPED_UNICODE);
}
