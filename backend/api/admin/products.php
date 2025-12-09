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
require __DIR__ . '/../../includes/db.php';

// Перевірка чи $pdo існує
if (!isset($pdo)) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database connection failed'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

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

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Invalid JSON data'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    $name = trim($data['name'] ?? '');
    $price = (float)($data['price'] ?? 0);
    $stock = (int)($data['stock'] ?? 0);
    $brand = trim($data['brand'] ?? '');
    $categoryId = (int)($data['category_id'] ?? 0);
    $description = trim($data['description'] ?? '');
    $image = trim($data['image'] ?? '');
    
    // Валідація ціни: DECIMAL(10,2) дозволяє максимум 99999999.99
    if ($price <= 0 || $price > 99999999.99) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Ціна повинна бути від 0.01 до 99,999,999.99'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    if ($name === '' || $categoryId <= 0 || $brand === '') {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Заповніть всі обов\'язкові поля (назва, ціна, категорія, бренд)'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    // Округлюємо ціну до 2 знаків після коми
    $price = round($price, 2);
    
    try {
        // Перевіряємо чи існує категорія
        $checkStmt = $pdo->prepare("SELECT id FROM categories WHERE id = ?");
        $checkStmt->execute([$categoryId]);
        if (!$checkStmt->fetch()) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Категорія не знайдена'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }
        
        $stmt = $pdo->prepare("
            INSERT INTO products (name, price, stock, brand, category_id, description, image)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([$name, $price, $stock, $brand, $categoryId, $description ?: null, $image ?: null]);
        
        $productId = $pdo->lastInsertId();
        
        echo json_encode([
            'success' => true,
            'data' => ['id' => (int)$productId]
        ], JSON_UNESCAPED_UNICODE);
    } catch (PDOException $e) {
        http_response_code(500);
        error_log('Product creation error: ' . $e->getMessage());
        echo json_encode([
            'success' => false,
            'error' => 'Database error: ' . $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
    }
} elseif ($method === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $productId = (int)($data['id'] ?? 0);
    $name = trim($data['name'] ?? '');
    $price = (float)($data['price'] ?? 0);
    $stock = (int)($data['stock'] ?? 0);
    $brand = trim($data['brand'] ?? '');
    $categoryId = (int)($data['category_id'] ?? 0);
    $description = trim($data['description'] ?? '');
    $image = trim($data['image'] ?? '');
    
    // Валідація ціни: DECIMAL(10,2) дозволяє максимум 99999999.99
    if ($price <= 0 || $price > 99999999.99) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Ціна повинна бути від 0.01 до 99,999,999.99'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    if ($productId <= 0 || $name === '' || $categoryId <= 0 || $brand === '') {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Invalid data'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    // Округлюємо ціну до 2 знаків після коми
    $price = round($price, 2);
    
    try {
        // Перевіряємо чи існує категорія
        $checkStmt = $pdo->prepare("SELECT id FROM categories WHERE id = ?");
        $checkStmt->execute([$categoryId]);
        if (!$checkStmt->fetch()) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Категорія не знайдена'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }
        
        $stmt = $pdo->prepare("
            UPDATE products 
            SET name = ?, price = ?, stock = ?, brand = ?, category_id = ?, description = ?, image = ?
            WHERE id = ?
        ");
        $stmt->execute([$name, $price, $stock, $brand, $categoryId, $description ?: null, $image ?: null, $productId]);
        
        echo json_encode([
            'success' => true,
            'data' => ['id' => $productId]
        ], JSON_UNESCAPED_UNICODE);
    } catch (PDOException $e) {
        http_response_code(500);
        error_log('Product update error: ' . $e->getMessage());
        echo json_encode([
            'success' => false,
            'error' => 'Database error: ' . $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
    }
} elseif ($method === 'DELETE') {
    $productId = (int)($_GET['id'] ?? 0);
    
    if ($productId <= 0) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Invalid product ID'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    try {
        $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([$productId]);
        
        echo json_encode([
            'success' => true,
            'data' => ['id' => $productId]
        ], JSON_UNESCAPED_UNICODE);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Database error: ' . $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
    }
} else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Method not allowed'
    ], JSON_UNESCAPED_UNICODE);
}

