<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
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

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

if ($method === 'POST' && $action === 'login') {
    $data = json_decode(file_get_contents('php://input'), true);
    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';
    
    if ($email === '' || $password === '') {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Email та пароль обов\'язкові'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    try {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user && password_verify($password, $user['password_hash'])) {
            $_SESSION['user'] = [
                'id' => (int)$user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $user['role'],
            ];
            
            $token = base64_encode(json_encode([
                'user_id' => (int)$user['id'],
                'email' => $user['email'],
            ]));
            
            echo json_encode([
                'success' => true,
                'data' => [
                    'id' => (int)$user['id'],
                    'name' => $user['name'],
                    'email' => $user['email'],
                    'role' => $user['role'],
                    'token' => $token,
                ]
            ], JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'error' => 'Невірний email або пароль'
            ], JSON_UNESCAPED_UNICODE);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Database error'
        ], JSON_UNESCAPED_UNICODE);
    }
} elseif ($method === 'POST' && $action === 'register') {
    $data = json_decode(file_get_contents('php://input'), true);
    $name = trim($data['name'] ?? '');
    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';
    $phone = trim($data['phone'] ?? '');
    $address = trim($data['address'] ?? '');
    
    if ($name === '' || $email === '' || $password === '') {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Заповніть всі обов\'язкові поля'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Невірний формат email'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    if (mb_strlen($password) < 6) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Пароль повинен містити щонайменше 6 символів'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    try {
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
        $stmt->execute([$email]);
        
        if ($stmt->fetch()) {
            http_response_code(409);
            echo json_encode([
                'success' => false,
                'error' => 'Користувач з таким email вже існує'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }
        
        $hash = password_hash($password, PASSWORD_DEFAULT);
        
        $stmt = $pdo->prepare("
            INSERT INTO users (name, email, password_hash, phone, address, role, created_at)
            VALUES (?, ?, ?, ?, ?, 'customer', NOW())
        ");
        $stmt->execute([$name, $email, $hash, $phone, $address]);
        
        $userId = $pdo->lastInsertId();
        
        $_SESSION['user'] = [
            'id' => (int)$userId,
            'name' => $name,
            'email' => $email,
            'role' => 'customer',
        ];
        
        $token = base64_encode(json_encode([
            'user_id' => (int)$userId,
            'email' => $email,
        ]));
        
        echo json_encode([
            'success' => true,
            'data' => [
                'id' => (int)$userId,
                'name' => $name,
                'email' => $email,
                'role' => 'customer',
                'token' => $token,
            ]
        ], JSON_UNESCAPED_UNICODE);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Database error'
        ], JSON_UNESCAPED_UNICODE);
    }
} elseif ($method === 'POST' && $action === 'logout') {
    session_destroy();
    echo json_encode([
        'success' => true
    ], JSON_UNESCAPED_UNICODE);
} elseif ($method === 'GET' && $action === 'me') {
    $userId = getUserIdFromRequest();
    
    if ($userId) {
        try {
            $stmt = $pdo->prepare("SELECT id, name, email, role FROM users WHERE id = ?");
            $stmt->execute([$userId]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($user) {
                echo json_encode([
                    'success' => true,
                    'data' => [
                        'id' => (int)$user['id'],
                        'name' => $user['name'],
                        'email' => $user['email'],
                        'role' => $user['role'],
                    ]
                ], JSON_UNESCAPED_UNICODE);
            } else {
                http_response_code(401);
                echo json_encode([
                    'success' => false,
                    'error' => 'User not found'
                ], JSON_UNESCAPED_UNICODE);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Database error'
            ], JSON_UNESCAPED_UNICODE);
        }
    } else {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => 'Not authenticated'
        ], JSON_UNESCAPED_UNICODE);
    }
} else {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Invalid action'
    ], JSON_UNESCAPED_UNICODE);
}

