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
    
    $name = trim($data['name'] ?? '');
    $slug = trim($data['slug'] ?? '');
    
    if ($name === '') {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Назва категорії обов\'язкова'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    if ($slug === '') {
        $slug = mb_strtolower($name, 'UTF-8');
        $slug = preg_replace('~[^\pL\d]+~u', '-', $slug);
        $slug = trim($slug, '-');
    }
    
    try {
        $stmt = $pdo->prepare("INSERT INTO categories (name, slug) VALUES (?, ?)");
        $stmt->execute([$name, $slug]);
        
        $categoryId = $pdo->lastInsertId();
        
        echo json_encode([
            'success' => true,
            'data' => ['id' => (int)$categoryId]
        ], JSON_UNESCAPED_UNICODE);
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) {
            http_response_code(409);
            echo json_encode([
                'success' => false,
                'error' => 'Категорія з таким slug вже існує'
            ], JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Database error'
            ], JSON_UNESCAPED_UNICODE);
        }
    }
} elseif ($method === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $categoryId = (int)($data['id'] ?? 0);
    $name = trim($data['name'] ?? '');
    $slug = trim($data['slug'] ?? '');
    
    if ($categoryId <= 0 || $name === '') {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Invalid data'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    if ($slug === '') {
        $slug = mb_strtolower($name, 'UTF-8');
        $slug = preg_replace('~[^\pL\d]+~u', '-', $slug);
        $slug = trim($slug, '-');
    }
    
    try {
        $stmt = $pdo->prepare("UPDATE categories SET name = ?, slug = ? WHERE id = ?");
        $stmt->execute([$name, $slug, $categoryId]);
        
        echo json_encode([
            'success' => true,
            'data' => ['id' => $categoryId]
        ], JSON_UNESCAPED_UNICODE);
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) {
            http_response_code(409);
            echo json_encode([
                'success' => false,
                'error' => 'Категорія з таким slug вже існує'
            ], JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Database error'
            ], JSON_UNESCAPED_UNICODE);
        }
    }
} elseif ($method === 'DELETE') {
    $categoryId = (int)($_GET['id'] ?? 0);
    
    if ($categoryId <= 0) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Invalid category ID'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    try {
        // Перевіряємо чи є товари в цій категорії
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM products WHERE category_id = ?");
        $stmt->execute([$categoryId]);
        $count = $stmt->fetchColumn();
        
        if ($count > 0) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Неможливо видалити категорію, в якій є товари'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }
        
        $stmt = $pdo->prepare("DELETE FROM categories WHERE id = ?");
        $stmt->execute([$categoryId]);
        
        echo json_encode([
            'success' => true,
            'data' => ['id' => $categoryId]
        ], JSON_UNESCAPED_UNICODE);
    } catch (PDOException $e) {
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

