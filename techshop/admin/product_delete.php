<?php
require __DIR__ . '/header.php';
require __DIR__ . '/../includes/db.php';

if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    die("Невірний ID.");
}

$id = (int)$_GET['id'];

// Видалення товару
$stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
$stmt->execute([$id]);

header("Location: products.php");
exit;
