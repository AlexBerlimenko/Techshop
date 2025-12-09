<?php
session_start();

require __DIR__ . '/includes/db.php';
require __DIR__ . '/includes/header.php';

// Инициализация корзины
if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = [];
}

/* ------------------------
    ДОБАВЛЕНИЕ В КОРЗИНУ
------------------------- */

if (isset($_GET['add'])) {
    $id = (int)$_GET['add'];

    if (!isset($_SESSION['cart'][$id])) {
        $_SESSION['cart'][$id] = 1;
    } else {
        $_SESSION['cart'][$id]++;
    }

    header("Location: cart.php");
    exit;
}

/* ------------------------
    УМЕНЬШЕНИЕ КОЛИЧЕСТВА
------------------------- */
if (isset($_GET['dec'])) {
    $id = (int)$_GET['dec'];

    if (isset($_SESSION['cart'][$id])) {
        $_SESSION['cart'][$id]--;

        if ($_SESSION['cart'][$id] <= 0) {
            unset($_SESSION['cart'][$id]);
        }
    }

    header("Location: cart.php");
    exit;
}

/* ------------------------
      УДАЛЕНИЕ ТОВАРА
------------------------- */
if (isset($_GET['delete'])) {
    $id = (int)$_GET['delete'];
    unset($_SESSION['cart'][$id]);

    header("Location: cart.php");
    exit;
}

/* ------------------------
      ОЧИСТКА КОРЗИНЫ
------------------------- */
if (isset($_GET['clear'])) {
    $_SESSION['cart'] = [];
    header("Location: cart.php");
    exit;
}

/* ------------------------
  ПОЛУЧЕНИЕ ТОВАРОВ КОРЗИНЫ
------------------------- */

$productsInCart = [];

if (!empty($_SESSION['cart'])) {
    $ids = array_keys($_SESSION['cart']);
    $placeholders = implode(',', array_fill(0, count($ids), '?'));

    $stmt = $pdo->prepare("SELECT * FROM products WHERE id IN ($placeholders)");
    $stmt->execute($ids);

    while ($row = $stmt->fetch()) {
        $row['quantity'] = $_SESSION['cart'][$row['id']];
        $row['subtotal'] = $row['price'] * $row['quantity'];
        $productsInCart[] = $row;
    }
}

?>

<div class="container mb-5">
    <h2 class="mb-4">Кошик</h2>

    <?php if (empty($productsInCart)): ?>
        <div class="alert alert-info">
            Ваш кошик порожній.
        </div>
        <a href="index.php" class="btn btn-primary">Повернутися до магазину</a>

    <?php else: ?>

        <table class="table align-middle">
            <thead>
                <tr>
                    <th>Товар</th>
                    <th>Ціна</th>
                    <th>Кількість</th>
                    <th>Сума</th>
                    <th></th>
                </tr>
            </thead>

            <tbody>
                <?php $total = 0; ?>

                <?php foreach ($productsInCart as $p): ?>
                    <?php $total += $p['subtotal']; ?>

                    <tr>
                        <td>
                            <strong><?= htmlspecialchars($p['name']) ?></strong>
                        </td>

                        <td><?= number_format($p['price'], 0, ',', ' ') ?> ₴</td>

                        <td>
                            <div class="btn-group">
                                <a href="cart.php?dec=<?= $p['id'] ?>" class="btn btn-outline-secondary">–</a>
                                <button class="btn btn-light" disabled><?= $p['quantity'] ?></button>
                                <a href="cart.php?add=<?= $p['id'] ?>" class="btn btn-outline-secondary">+</a>
                            </div>
                        </td>

                        <td><?= number_format($p['subtotal'], 0, ',', ' ') ?> ₴</td>

                        <td>
                            <a href="cart.php?delete=<?= $p['id'] ?>" class="btn btn-sm btn-danger">
                                Видалити
                            </a>
                        </td>
                    </tr>

                <?php endforeach; ?>
            </tbody>
        </table>

        <div class="d-flex justify-content-between align-items-center mt-4">
            <h4>Всього: <?= number_format($total, 0, ',', ' ') ?> ₴</h4>

            <div class="d-flex gap-2">
                <a href="cart.php?clear=1" class="btn btn-outline-danger">
                    Очистити кошик
                </a>

                <a href="checkout.php" class="btn btn-success">
                    Оформити замовлення
                </a>
            </div>
        </div>

    <?php endif; ?>
</div>

<?php require __DIR__ . '/includes/footer.php'; ?>
