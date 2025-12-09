<?php
require __DIR__ . '/includes/header.php';

$orderId = $_GET['id'] ?? 0;
?>

<div class="card p-5 text-center">

    <h2 class="mb-3">🎉 Замовлення успішно оформлено!</h2>

    <p class="lead">Ваш номер замовлення: 
        <strong>#<?= htmlspecialchars($orderId) ?></strong>
    </p>

    <p>Наш менеджер скоро зв’яжеться з вами для уточнення деталей.</p>

    <a href="index.php" class="return-btn mx-auto mt-4">
        Повернутися до магазину
    </a>
</div>

<?php require __DIR__ . '/includes/footer.php'; ?>