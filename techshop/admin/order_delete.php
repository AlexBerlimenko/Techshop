<?php
require __DIR__ . '/../includes/db.php';

$orderId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($orderId <= 0) {
    die("Невірний ID замовлення.");
}

// Видаляємо товари замовлення
$stmt = $pdo->prepare("DELETE FROM order_items WHERE order_id = ?");
$stmt->execute([$orderId]);

// Видаляємо саме замовлення
$stmt = $pdo->prepare("DELETE FROM orders WHERE id = ?");
$stmt->execute([$orderId]);

// Переходимо назад до списку
header("Location: orders.php?deleted=1");
exit;
