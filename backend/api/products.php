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

require __DIR__ . '/../includes/db.php';

try {
    $where = [];
    $params = [];
    
    $categorySlug = $_GET['category'] ?? null;
    $priceMin = isset($_GET['price_min']) && $_GET['price_min'] !== '' ? (int)$_GET['price_min'] : null;
    $priceMax = isset($_GET['price_max']) && $_GET['price_max'] !== '' ? (int)$_GET['price_max'] : null;
    $brand = $_GET['brand'] ?? '';
    $search = $_GET['search'] ?? '';
    
    $sql = "SELECT p.*, c.name AS category_name, c.slug AS category_slug 
            FROM products p 
            JOIN categories c ON p.category_id = c.id";
    
    if ($categorySlug) {
        $where[] = 'c.slug = ?';
        $params[] = $categorySlug;
    }
    
    if ($priceMin !== null) {
        $where[] = 'p.price >= ?';
        $params[] = $priceMin;
    }
    
    if ($priceMax !== null) {
        $where[] = 'p.price <= ?';
        $params[] = $priceMax;
    }
    
    if ($brand !== '') {
        $where[] = 'p.brand = ?';
        $params[] = $brand;
    }
    
    if ($search !== '') {
        $where[] = '(p.name LIKE ? OR p.description LIKE ?)';
        $searchParam = '%' . $search . '%';
        $params[] = $searchParam;
        $params[] = $searchParam;
    }
    
    if (!empty($where)) {
        $sql .= ' WHERE ' . implode(' AND ', $where);
    }
    
    $sql .= ' ORDER BY p.id';
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($products as &$product) {
        $product['id'] = (int)$product['id'];
        $product['price'] = (float)$product['price'];
        $product['stock'] = (int)$product['stock'];
        $product['category_id'] = (int)$product['category_id'];
        $product['inStock'] = $product['stock'] > 0;
    }
    
    echo json_encode([
        'success' => true,
        'data' => $products
    ], JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database error'
    ], JSON_UNESCAPED_UNICODE);
}

