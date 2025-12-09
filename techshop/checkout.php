<?php
session_start();
require __DIR__ . '/includes/db.php';
require __DIR__ . '/includes/header.php';

// Якщо кошик порожній
if (empty($_SESSION['cart'])) {
    echo "<h2>Кошик порожній</h2>";
    require __DIR__ . '/includes/footer.php';
    exit;
}
?>

<h2 class="mb-4">Оформлення замовлення</h2>

<form method="post" action="save-order.php" class="card p-4">

    <div class="mb-3">
        <label class="form-label fw-semibold">Ваше ім’я *</label>
        <input type="text" name="name" class="form-control" required minlength="2">
    </div>

    <div class="mb-3">
        <label class="form-label fw-semibold">Телефон *</label>
        <input type="text"
               name="phone"
               class="form-control"
               required
               pattern="^[0-9+\-\s()]{7,20}$"
               placeholder="+380 99 123 45 67">
    </div>

    <div class="mb-3">
        <label class="form-label fw-semibold">Email</label>
        <input type="email" name="email" class="form-control">
    </div>

    <div class="mb-3">
        <label class="form-label fw-semibold">Спосіб доставки:</label>
        <select name="delivery" class="form-select" required>
            <option value="Нова Пошта">Нова Пошта</option>
            <option value="Укрпошта">Укрпошта</option>
            <option value="Кур'єр">Кур'єр</option>
        </select>
    </div>

    <div class="mb-4">
        <label class="form-label fw-semibold">Адреса *</label>
        <input type="text"
               name="address"
               class="form-control"
               required
               minlength="5"
               placeholder="Київ, вул. Хрещатик, 25">
    </div>

    <button class="btn btn-success btn-lg w-100">
        Підтвердити замовлення
    </button>
</form>

<?php require __DIR__ . '/includes/footer.php'; ?>
