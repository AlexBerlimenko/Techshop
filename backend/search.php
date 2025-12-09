<?php
require __DIR__ . '/includes/db.php';
require __DIR__ . '/includes/header.php';

$q = trim($_GET['q'] ?? '');

if ($q === '') {
    echo "<div class='alert alert-warning'>Введіть текст для пошуку.</div>";
    require __DIR__ . '/includes/footer.php';
    exit;
}

$sql = "
    SELECT p.*, c.name AS category_name
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.name LIKE ? OR p.description LIKE ?
";

$stmt = $pdo->prepare($sql);
$like = "%{$q}%";
$stmt->execute([$like, $like]);
$results = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<h2 class="mb-4">Результати пошуку: «<?= htmlspecialchars($q) ?>»</h2>

<?php if (empty($results)): ?>

    <div class="alert alert-info">
        Нічого не знайдено 😢
    </div>

<?php else: ?>

    <div class="row g-4">
        <?php foreach ($results as $product): ?>
            <div class="col-md-4">
                <div class="card h-100">

                    <!-- ВАЖНО: тот же контейнер, что й на головній -->
                    <div class="product-img-box">
                        <img src="images/<?= htmlspecialchars($product['image']) ?>"
                             alt="<?= htmlspecialchars($product['name']) ?>">
                    </div>

                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">
                            <a href="product.php?id=<?= (int)$product['id'] ?>" class="text-decoration-none">
                                <?= htmlspecialchars($product['name']) ?>
                            </a>
                        </h5>

                        <div class="text-muted small mb-2">
                            <?= htmlspecialchars($product['category_name']) ?>
                        </div>

                        <p class="card-text small flex-grow-1">
                            <?= htmlspecialchars($product['description']) ?>
                        </p>

                        <div class="fw-bold mb-3">
                            <?= number_format($product['price'], 0, ',', ' ') ?> ₴
                        </div>

                        <a class="btn btn-primary btn-sm w-100"
                           href="product.php?id=<?= (int)$product['id'] ?>">
                            Переглянути
                        </a>
                    </div>

                </div>
            </div>
        <?php endforeach; ?>
    </div>

<?php endif; ?>

<?php require __DIR__ . '/includes/footer.php'; ?>
