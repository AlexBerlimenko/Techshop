<?php
session_start();

require __DIR__ . '/includes/db.php';
require __DIR__ . '/includes/auth.php';

$user = current_user();

if (!$user) {
    header("Location: login.php");
    exit;
}

$pageTitle = "Мої замовлення – TechShop";
require __DIR__ . '/includes/header.php';

// Беремо замовлення конкретного користувача
$stmt = $pdo->prepare("
    SELECT *
    FROM orders
    WHERE user_id = ?
    ORDER BY created_at DESC
");
$stmt->execute([$user['id']]);
$orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<h2 class="mb-4">Мої замовлення</h2>

<?php if (empty($orders)): ?>
    <div class="alert alert-info">
        У вас ще немає замовлень.
    </div>
<?php else: ?>
    <table class="table table-bordered table-striped align-middle">
        <thead class="table-light">
            <tr>
                <th>ID</th>
                <th>Дата</th>
                <th>Сума</th>
                <th>Статус</th>
                <th>Дія</th>
            </tr>
        </thead>
        <tbody>
        <?php foreach ($orders as $o): ?>
            <tr>
                <td><?= $o['id'] ?></td>
                <td><?= $o['created_at'] ?></td>
                <td><?= number_format($o['total'], 0, ',', ' ') ?> ₴</td>
                <td><?= htmlspecialchars($o['status']) ?></td>
                <td>
                    <a href="my_order_view.php?id=<?= $o['id'] ?>"
                       class="btn btn-sm btn-primary">
                        Переглянути
                    </a>
                </td>
            </tr>
        <?php endforeach; ?>
        </tbody>
    </table>
<?php endif; ?>

<?php require __DIR__ . '/includes/footer.php'; ?>
