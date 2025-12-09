<?php
session_start();
require __DIR__ . '/includes/db.php';

// Якщо кошик порожній
if (empty($_SESSION['cart']) || !is_array($_SESSION['cart'])) {
    header("Location: cart.php");
    exit;
}

// Дані з форми
$name     = trim($_POST['name'] ?? '');
$phone    = trim($_POST['phone'] ?? '');
$email    = trim($_POST['email'] ?? '');
$delivery = trim($_POST['delivery'] ?? '');
$address  = trim($_POST['address'] ?? '');

// Поточний користувач
$userId = $_SESSION['user']['id'] ?? null;

// -------------------------------
// 1️⃣ Серверна валідація
// -------------------------------

if ($name === '' || mb_strlen($name) < 2) {
    die("Помилка: некоректне ім’я.");
}

if ($phone === '' || !preg_match('/^[0-9+\-\s()]{7,20}$/', $phone)) {
    die("Помилка: некоректний номер телефону.");
}

if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    die("Помилка: некоректний email.");
}

if ($address === '' || mb_strlen($address) < 5) {
    die("Помилка: некоректна адреса.");
}

// -------------------------------
// 2️⃣ Забираємо товари кошика
// -------------------------------
$ids = array_keys($_SESSION['cart']);

if (empty($ids)) {
    die("Помилка: кошик порожній.");
}

$placeholders = implode(',', array_fill(0, count($ids), '?'));

$stmt = $pdo->prepare("SELECT * FROM products WHERE id IN ($placeholders)");
$stmt->execute($ids);
$products = $stmt->fetchAll(PDO::FETCH_ASSOC);

if (!$products) {
    die("Помилка: товари не знайдені.");
}

// -------------------------------
// 3️⃣ Підрахунок total
// -------------------------------
$total = 0;
foreach ($products as $p) {
    $qty = (int)$_SESSION['cart'][$p['id']];
    $total += $p['price'] * $qty;
}

// -------------------------------
// 4️⃣ Повна адреса доставка
// -------------------------------
$deliveryAddress = $delivery ? "$delivery: $address" : $address;

// -------------------------------
// 5️⃣ Зберігаємо замовлення
// -------------------------------
$stmt = $pdo->prepare("
    INSERT INTO orders (user_id, full_name, phone, email, delivery_address, total)
    VALUES (?, ?, ?, ?, ?, ?)
");

$stmt->execute([
    $userId,
    $name,
    $phone,
    $email,
    $deliveryAddress,
    $total
]);

$orderId = $pdo->lastInsertId();

// -------------------------------
// 6️⃣ Зберігаємо товари замовлення
// -------------------------------
$itemStmt = $pdo->prepare("
    INSERT INTO order_items (order_id, product_id, quantity, price)
    VALUES (?, ?, ?, ?)
");

foreach ($products as $p) {
    $qty = (int)$_SESSION['cart'][$p['id']];
    $itemStmt->execute([
        $orderId,
        $p['id'],
        $qty,
        $p['price']
    ]);
}

// -------------------------------
// 7️⃣ Очищення кошика та редірект
// -------------------------------
unset($_SESSION['cart']);

header("Location: order-success.php?id=" . $orderId);
exit;
