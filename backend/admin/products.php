<?php
require __DIR__ . '/header.php';
require __DIR__ . '/../includes/db.php';

// Завантаження товарів
$stmt = $pdo->query("
    SELECT p.*, c.name AS category_name
    FROM products p
    JOIN categories c ON p.category_id = c.id
    ORDER BY p.id DESC
");

$products = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<h2 class="mb-4 d-flex justify-content-between align-items-center">
    <span>Товари</span>
    <a href="product_add.php" class="btn btn-success btn-sm">Додати товар</a>
</h2>

<table class="table table-bordered table-striped align-middle">
    <thead>
        <tr>
            <th>ID</th>
            <th>Назва</th>
            <th>Категорія</th>
            <th>Ціна</th>
            <th>Наявність</th>
            <th style="width: 200px;">Дія</th>
        </tr>
    </thead>

    <tbody>
        <?php foreach ($products as $p): ?>
            <tr>
                <td><?= $p['id'] ?></td>
                <td><?= htmlspecialchars($p['name']) ?></td>
                <td><?= htmlspecialchars($p['category_name']) ?></td>
                <td><?= number_format($p['price'], 0, ',', ' ') ?> ₴</td>
                <td><?= $p['stock'] ?></td>
                <td class="d-flex gap-2">

                    <!-- Редагувати -->
                    <a href="product_edit.php?id=<?= $p['id'] ?>" class="btn btn-sm btn-warning">
                        Редагувати
                    </a>

                    <!-- Видалити -->
                    <a href="product_delete.php?id=<?= $p['id'] ?>"
                       class="btn btn-sm btn-danger"
                       onclick="return confirm('Видалити цей товар назавжди?');">
                        Видалити
                    </a>

                </td>
            </tr>
        <?php endforeach; ?>
    </tbody>
</table>

<?php require __DIR__ . '/footer.php'; ?>
