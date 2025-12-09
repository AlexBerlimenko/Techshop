<?php
require __DIR__ . '/header.php';
require __DIR__ . '/../includes/db.php';

// Получаем список категорий
$stmt = $pdo->query("SELECT * FROM categories ORDER BY id");
$categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<h2 class="mb-4">Категорії</h2>

<!-- Кнопка добавления -->
<div class="d-flex justify-content-end mb-3">
    <a href="category_add.php" class="btn btn-primary">
        Додати категорію
    </a>
</div>

<table class="table table-bordered table-striped align-middle">
    <thead class="table-light">
        <tr>
            <th style="width: 60px;">ID</th>
            <th>Назва</th>
            <th>Slug</th>
            <th style="width: 200px;">Дія</th>
        </tr>
    </thead>

    <tbody>
        <?php foreach ($categories as $c): ?>
            <tr>
                <td><?= $c['id'] ?></td>

                <td><?= htmlspecialchars($c['name']) ?></td>

                <td><?= htmlspecialchars($c['slug']) ?></td>

                <td>
                    <div class="d-flex gap-2">

                        <!-- Редактирование -->
                        <a href="category_edit.php?id=<?= $c['id'] ?>"
                           class="btn btn-warning btn-sm">
                            Редагувати
                        </a>

                        <!-- Удаление -->
                        <a href="category_delete.php?id=<?= $c['id'] ?>"
                           class="btn btn-danger btn-sm"
                           onclick="return confirm('Точно видалити категорію?');">
                            Видалити
                        </a>

                    </div>
                </td>
            </tr>
        <?php endforeach; ?>
    </tbody>
</table>

<?php require __DIR__ . '/footer.php'; ?>
