<?php
require __DIR__ . '/header.php';
require __DIR__ . '/../includes/db.php';

// Берём все заказы из таблицы orders
$stmt = $pdo->query("
    SELECT *
    FROM orders
    ORDER BY created_at DESC
");

$orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<h2 class="mb-4">Замовлення</h2>

<table class="table table-bordered table-striped align-middle">
    <thead class="table-light">
        <tr>
            <th>ID</th>
            <th>Клієнт</th>
            <th>Телефон</th>
            <th>Email</th>
            <th>Сума</th>
            <th>Статус</th>
            <th>Дата</th>
            <th style="width: 180px;">Дія</th>
        </tr>
    </thead>

    <tbody>
        <?php foreach ($orders as $o): ?>
            <tr>
                <td><?= $o['id'] ?></td>

                <td><?= htmlspecialchars($o['full_name']) ?></td>
                <td><?= htmlspecialchars($o['phone']) ?></td>
                <td><?= htmlspecialchars($o['email']) ?></td>

                <td><?= number_format($o['total'], 0, ',', ' ') ?> ₴</td>

                <td>
                    <?php
                    $status = $o['status'];
                    $badgeClass = 'bg-secondary';

                    if ($status === 'new')            $badgeClass = 'bg-secondary';
                    elseif ($status === 'processing') $badgeClass = 'bg-warning text-dark';
                    elseif ($status === 'completed')  $badgeClass = 'bg-success';
                    elseif ($status === 'canceled')   $badgeClass = 'bg-danger';
                    ?>
                    <span class="badge <?= $badgeClass ?>">
                        <?= htmlspecialchars($status) ?>
                    </span>
                </td>

                <td><?= $o['created_at'] ?></td>

                <td>
                    <div class="d-flex gap-2">

                        <!-- Перегляд -->
                        <a href="order_view.php?id=<?= $o['id'] ?>"
                           class="btn btn-primary btn-sm">
                            Переглянути
                        </a>

                        <!-- Видалити -->
                        <a href="order_delete.php?id=<?= $o['id'] ?>"
                           class="btn btn-danger btn-sm"
                           onclick="return confirm('Ви впевнені, що хочете видалити це замовлення?');">
                            Видалити
                        </a>

                    </div>
                </td>
            </tr>
        <?php endforeach; ?>
    </tbody>
</table>

<?php require __DIR__ . '/footer.php'; ?>
