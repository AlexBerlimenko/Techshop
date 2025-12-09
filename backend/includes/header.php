<?php
if (!isset($pageTitle)) {
    $pageTitle = "TechShop – інтернет-магазин ноутбуків та аксесуарів";
}

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
?>
<!doctype html>
<html lang="uk">
<head>
    <meta charset="utf-8">
    <title><?= htmlspecialchars($pageTitle) ?></title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Стилі -->
    <link href="css/main.css" rel="stylesheet">
    <link href="css/product.css" rel="stylesheet">
</head>
<body>

<nav class="navbar navbar-dark bg-dark mb-4">
    <div class="container d-flex justify-content-between align-items-center">

        <a class="navbar-brand" href="index.php">TechShop</a>

        <!-- ПОШУК -->
        <form action="search.php" method="get" class="d-flex" style="max-width: 320px; width: 100%;">
            <input type="text" name="q" class="form-control form-control-sm"
                   placeholder="Пошук..." required>
            <button class="btn btn-outline-light btn-sm ms-2" type="submit">🔍</button>
        </form>

        <!-- КОШИК + АВТОРИЗАЦІЯ -->
        <div class="d-flex align-items-center">

            <a href="cart.php" class="btn btn-outline-light btn-sm ms-3">
                🛒 Кошик
            </a>

            <?php
            $authUser = ($_SESSION['user'] ?? null);
            ?>

            <?php if ($authUser): ?>

                <?php if (($authUser['role'] ?? '') === 'admin'): ?>
                    <a href="admin/index.php" class="btn btn-warning btn-sm ms-3">
                        Адмін-панель
                    </a>
                <?php endif; ?>

                <!-- Мої замовлення -->
                <a href="my_orders.php" class="btn btn-outline-light btn-sm ms-3">
                    Мої замовлення
                </a>

                <span class="text-light small ms-3">
                    👤 <?= htmlspecialchars($authUser['name']) ?>
                </span>

                <a href="logout.php" class="btn btn-outline-light btn-sm ms-2">
                    Вихід
                </a>

            <?php else: ?>

                <a href="login.php" class="btn btn-outline-light btn-sm ms-3">
                    Вхід
                </a>
                <a href="register.php" class="btn btn-success btn-sm ms-2">
                    Реєстрація
                </a>

            <?php endif; ?>

        </div>

    </div>
</nav>

<div class="container mb-5">
