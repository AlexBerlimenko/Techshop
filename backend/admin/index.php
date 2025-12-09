<?php
$pageTitle = "Адмін-панель";
require __DIR__ . '/header.php';
?>

<h1 class="mb-4">Ласкаво просимо, адміністраторе!</h1>

<div class="list-group">
    <a href="orders.php" class="list-group-item list-group-item-action">Замовлення</a>
    <a href="products.php" class="list-group-item list-group-item-action">Товари</a>
    <a href="categories.php" class="list-group-item list-group-item-action">Категорії</a>
</div>

<?php require __DIR__ . '/footer.php'; ?>
