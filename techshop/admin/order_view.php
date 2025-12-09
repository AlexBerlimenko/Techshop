<?php
require __DIR__ . '/../includes/db.php';

$orderId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

// Завантажуємо замовлення
$stmt = $pdo->prepare("SELECT * FROM orders WHERE id = ?");
$stmt->execute([$orderId]);
$order = $stmt->fetch(PDO::FETCH_ASSOC);

// ❗ Якщо замовлення не існує → 404
if (!$order) {
    header("Location: ../404.php");
    exit;
}

require __DIR__ . '/header.php';

// Завантажуємо товари замовлення
$itemStmt = $pdo->prepare("
    SELECT oi.*, p.name
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ?
");
$itemStmt->execute([$orderId]);
$items = $itemStmt->fetchAll(PDO::FETCH_ASSOC);

// Розділяємо спосіб доставки та адресу
$deliveryRaw = $order['delivery_address'] ?? '';
[$deliveryMethod, $deliveryAddress] = array_pad(explode(':', $deliveryRaw, 2), 2, '');
$deliveryMethod = trim($deliveryMethod);
$deliveryAddress = trim($deliveryAddress);
?>

<h2 class="mb-4">Замовлення №<?= $orderId ?></h2>

<div class="card p-4 mb-4">
    <h5 class="mb-3">Інформація про покупця</h5>

    <p><strong>Ім’я:</strong> <?= htmlspecialchars($order['full_name']) ?></p>
    <p><strong>Телефон:</strong> <?= htmlspecialchars($order['phone']) ?></p>
    <p><strong>Email:</strong> <?= htmlspecialchars($order['email']) ?></p>

    <p><strong>Спосіб доставки:</strong>
        <?= $deliveryMethod ? htmlspecialchars($deliveryMethod) : '—' ?>
    </p>

    <p><strong>Адреса:</strong>
        <?= $deliveryAddress ? htmlspecialchars($deliveryAddress) : '—' ?>
    </p>

    <p><strong>Дата оформлення:</strong> <?= $order['created_at'] ?></p>

    <p><strong>Статус замовлення:</strong>
        <span class="badge bg-secondary"><?= htmlspecialchars($order['status']) ?></span>
    </p>

    <!-- Форма зміни статусу -->
    <form method="post" action="order_status_update.php" class="mt-3 d-flex gap-2">
        <input type="hidden" name="id" value="<?= $orderId ?>">

        <select name="status" class="form-select w-auto">
            <option value="new"        <?= $order['status']=='new' ? 'selected' : '' ?>>new</option>
            <option value="processing" <?= $order['status']=='processing' ? 'selected' : '' ?>>processing</option>
            <option value="completed"  <?= $order['status']=='completed' ? 'selected' : '' ?>>completed</option>
        </select>

        <button class="btn btn-success">Оновити статус</button>
    </form>

    <!-- Кнопка видалення -->
    <a href="order_delete.php?id=<?= $orderId ?>"
       class="btn btn-danger mt-3"
       onclick="return confirm('Ви впевнені, що хочете видалити це замовлення?');">
        🗑 Видалити замовлення
    </a>

</div>

<h4 class="mb-3">Товари замовлення</h4>

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

<h5 class="mt-3">Сума замовлення: 
    <?= number_format($order['total'], 0, ',', ' ') ?> ₴
</h5>

<a href="orders.php" class="btn btn-secondary mt-4">← Повернутися до списку</a>

<?php require __DIR__ . '/footer.php'; ?>
