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
require __DIR__ . '/../includes/product-data.php';
require __DIR__ . '/../includes/product-spec-parser.php';
require __DIR__ . '/../includes/reviews.php';

function getProductSlug(string $name): string
{
    static $map = [
        'ASUS ROG Strix G16' => 'asus-rog-strix-g16',
        'Lenovo Legion Pro 5 16IRX8' => 'lenovo-legion-pro-5',
        'Logitech G502 HERO' => 'logitech-g502-hero',
        'Razer DeathAdder V3 Pro Wireless' => 'razer-deathadder-v3-pro-wireless',
        'SteelSeries Apex Pro' => 'steelseries-apex-pro',
        'HyperX Alloy Origins' => 'hyperx-alloy-origins',
        'SteelSeries QcK Large' => 'steelseries-qck-large',
        'Razer Acari' => 'razer-acari',
        'HyperX Cloud Alpha' => 'hyperx-cloud-alpha',
        'Logitech G Pro X 2' => 'logitech-g-pro-x-2',
        'DeepCool N200' => 'deepcool-n200',
        'Cooler Master Notepal X150R' => 'notepal-x150r',
    ];
    
    if (isset($map[$name])) {
        return $map[$name];
    }
    
    $slug = mb_strtolower($name, 'UTF-8');
    $slug = preg_replace('~[^\pL\d]+~u', '-', $slug);
    return trim($slug, '-');
}

try {
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Invalid product ID'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    $stmt = $pdo->prepare("
        SELECT p.*, c.name AS category_name, c.slug AS category_slug
        FROM products p
        JOIN categories c ON p.category_id = c.id
        WHERE p.id = ?
    ");
    $stmt->execute([$id]);
    $product = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$product) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'error' => 'Product not found'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    $slug = getProductSlug($product['name']);
    $currentDetails = $detailsBySlug[$slug] ?? null;
    $productReviews = $reviewsBySlug[$slug] ?? [];
    
    $product['id'] = (int)$product['id'];
    $product['price'] = (float)$product['price'];
    $product['stock'] = (int)$product['stock'];
    $product['category_id'] = (int)$product['category_id'];
    $product['inStock'] = $product['stock'] > 0;
    $product['details'] = $currentDetails;
    $product['reviews'] = $productReviews;
    
    echo json_encode([
        'success' => true,
        'data' => $product
    ], JSON_UNESCAPED_UNICODE);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database error'
    ], JSON_UNESCAPED_UNICODE);
}

