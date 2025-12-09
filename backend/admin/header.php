<?php
session_start();
require __DIR__ . '/../includes/auth.php';

require_admin(); // блокируем доступ не-админам

if (!isset($pageTitle)) {
    $pageTitle = "Адмін-панель";
}
?>
<!doctype html>
<html lang="uk">
<head>
    <meta charset="utf-8">
    <title><?= htmlspecialchars($pageTitle) ?></title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>

<nav class="navbar navbar-dark bg-dark mb-4">
    <div class="container">
        <a href="index.php" class="navbar-brand">Адмін-панель</a>

        <div class="d-flex">
            <a href="../index.php" class="btn btn-outline-light btn-sm me-2">На сайт</a>
            <a href="logout.php" class="btn btn-danger btn-sm">Вихід</a>
        </div>
    </div>
</nav>

<div class="container">
