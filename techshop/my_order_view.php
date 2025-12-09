<?php
session_start();

require __DIR__ . '/includes/db.php';
require __DIR__ . '/includes/auth.php';

$user = current_user();

if (!$user) {
    header("Location: login.php");
    exit;
}

$orderId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

// Тягнемо замовлення тільки цього користувача
$stmt = $pdo->prepare("
    SELECT *
    FROM orders
    WHERE id = ? AND user_id = ?
");
$stmt->execute([$orderId, $user['id']]);
$order = $stmt->fetch(PDO::FETCH_ASSOC);

// ❗ Якщо замовлення не знайдено → 404
if (!$order) {
    header("Location: 404.php");
    exit;
}

// Товари замовлення
$itemStmt = $pdo->prepare("
    SELECT oi.*, p.name
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ?
");
$itemStmt->execute([$orderId]);
$items = $itemStmt->fetchAll(PDO::FETCH_ASSOC);

// Розбираємо адресу доставки
$deliveryRaw = $order['delivery_address'] ?? '';
[$deliveryMethod, $deliveryAddress] = array_pad(explode(':', $deliveryRaw, 2), 2, '');
$deliveryMethod = trim($deliveryMethod);
$deliveryAddress = trim($deliveryAddress);

$pageTitle = "Замовлення №{$orderId} – TechShop";
require __DIR__ . '/includes/header.php';
?>

<h2 class="mb-4">Замовлення №<?= $orderId ?></h2>

<div class="card p-4 mb-4">
    <h5 class="mb-3">Інформація про замовлення</h5>

    <p><strong>Дата оформлення:</strong> <?= $order['created_at'] ?></p>
    <p><strong>Статус:</strong> <?= htmlspecialchars($order['status']) ?></p>

    <p><strong>Спосіб доставки:</strong>
        <?= $deliveryMethod ? htmlspecialchars($deliveryMethod) : '—' ?>
    </p>

    <p><strong>Адреса доставки:</strong>
        <?= $deliveryAddress ? htmlspecialchars($deliveryAddress) : '—' ?>
    </p>
</div>

<h4 class="mb-3">Товари у замовленні</h4>

<table class="table table-bordered">
    <thead>
        <tr>
            <th>Товар</th>
            <th>Кількість</th>
            <th>Ціна</th>
            <th>Разом</th>
        </tr>
    </thead>
    <tbody>
        <?php foreach ($items as $item): ?>
            <tr>
                <td><?= htmlspecialchars($item['name']) ?></td>
                <td><?= $item['quantity'] ?></td>
                <td><?= number_format($item['price'], 0, ',', ' ') ?> ₴</td>
                <td><?= number_format($item['price'] * $item['quantity'], 0, ',', ' ') ?> ₴</td>
            </tr>
        <?php endforeach; ?>
    </tbody>
</table>

<h5 class="mt-3">
    Сума замовлення:
    <?= number_format($order['total'], 0, ',', ' ') ?> ₴
</h5>

<a href="my_orders.php" class="btn btn-secondary mt-4">
    ← Повернутися до списку замовлень
</a>

<?php require __DIR__ . '/includes/footer.php'; ?>
