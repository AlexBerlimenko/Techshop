<?php
require __DIR__ . '/includes/db.php';
require __DIR__ . '/includes/product-data.php';
require __DIR__ . '/includes/product-spec-parser.php';
require __DIR__ . '/includes/reviews.php';

/**
 * Генерує slug товару на основі назви
 */
function getProductSlug(string $name): string
{
    static $map = [
        'ASUS ROG Strix G16'          => 'asus-rog-strix-g16',
        'Lenovo Legion Pro 5 16IRX8'  => 'lenovo-legion-pro-5',
        'Logitech G502 HERO'          => 'logitech-g502-hero',
        'Razer DeathAdder V3 Pro Wireless' => 'razer-deathadder-v3-pro-wireless',
        'SteelSeries Apex Pro'        => 'steelseries-apex-pro',
        'HyperX Alloy Origins'        => 'hyperx-alloy-origins',
        'SteelSeries QcK Large'       => 'steelseries-qck-large',
        'Razer Acari'                 => 'razer-acari',
        'HyperX Cloud Alpha'          => 'hyperx-cloud-alpha',
        'Logitech G Pro X 2'          => 'logitech-g-pro-x-2',
        'DeepCool N200'               => 'deepcool-n200',
        'Cooler Master Notepal X150R' => 'notepal-x150r',
    ];

    if (isset($map[$name])) {
        return $map[$name];
    }

    $slug = mb_strtolower($name, 'UTF-8');
    $slug = preg_replace('~[^\pL\d]+~u', '-', $slug);
    return trim($slug, '-');
}

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

$stmt = $pdo->prepare("
    SELECT p.*, c.name AS category_name, c.slug AS category_slug
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.id = ?
");
$stmt->execute([$id]);
$product = $stmt->fetch();

/* -----------------------------------
   ✔ Если товара нет → 404.php
-------------------------------------- */
if (!$product) {
    header("Location: 404.php");
    exit;
}

$slug = getProductSlug($product['name']);
$currentDetails = $detailsBySlug[$slug] ?? null;
$productReviews = $reviewsBySlug[$slug] ?? [];

$pageTitle = $product['name'] . " – TechShop";
require __DIR__ . '/includes/header.php';
?>

<a href="index.php<?= $product['category_slug'] ? '?category=' . urlencode($product['category_slug']) : '' ?>"
   class="small text-decoration-none d-inline-flex align-items-center mb-3">
    ← Повернутися до каталогу
</a>

<div class="card product-shell">
    <div class="row g-0">

        <div class="col-lg-6 p-4 p-lg-5">
            <div class="product-image-wrap mb-4">
                <img src="images/<?= htmlspecialchars($product['image']) ?>"
                     alt="<?= htmlspecialchars($product['name']) ?>"
                     class="product-main-img img-fluid">
            </div>

            <div class="card reviews-card">
                <div class="card-header reviews-title">
                    Відгуки
                </div>

                <?php if ($productReviews): ?>
                    <div class="list-group list-group-flush">
                        <?php foreach ($productReviews as $review): ?>
                            <div class="list-group-item">
                                <div class="review-header d-flex justify-content-between align-items-center mb-1">
                                    <div class="review-name">
                                        <?= htmlspecialchars($review['name']) ?>
                                    </div>
                                    <div class="review-rating">
                                        <?php
                                        $stars = (int)($review['rating'] ?? 0);
                                        for ($i = 0; $i < 5; $i++) {
                                            echo $i < $stars ? '★' : '☆';
                                        }
                                        ?>
                                    </div>
                                </div>
                                <p class="review-text mb-0">
                                    <?= htmlspecialchars($review['text']) ?>
                                </p>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php else: ?>
                    <div class="card-body py-3">
                        <p class="mb-0 text-muted small">
                            Поки що немає відгуків. Будьте першим!
                        </p>
                    </div>
                <?php endif; ?>
            </div>
        </div>

        <div class="col-lg-6 p-4 p-lg-5 border-top border-lg-0">
            <h1 class="h3 mb-2"><?= htmlspecialchars($product['name']) ?></h1>

            <div class="text-muted mb-3">
                Категорія: <?= htmlspecialchars($product['category_name']) ?>
            </div>

            <div class="d-flex align-items-center gap-3 mb-3">
                <div class="price-big">
                    <?= number_format($product['price'], 0, ',', ' ') ?> ₴
                </div>

                <?php if ((int)$product['stock'] > 0): ?>
                    <span class="stock-pill bg-success-subtle text-success">
                        В наявності: <?= (int)$product['stock'] ?> шт.
                    </span>
                <?php else: ?>
                    <span class="stock-pill bg-danger-subtle text-danger">
                        Немає в наявності
                    </span>
                <?php endif; ?>
            </div>

            <p class="mb-4"><?= htmlspecialchars($product['description']) ?></p>

            <div class="d-flex flex-wrap gap-2 mb-4">
                <a href="cart.php?add=<?= $product['id'] ?>" class="btn btn-round btn-round-primary">
                    Додати в кошик
                </a>

                <a href="index.php" class="btn btn-outline-secondary btn-round">
                    Повернутися до магазину
                </a>
            </div>

            <?php if ($currentDetails): ?>
                <div class="card spec-card">
                    <div class="card-header">Характеристики</div>
                    <div class="card-body">
                        <div class="product-specs small">
                            <?= renderProductSpecs($currentDetails, $sectionNames) ?>
                        </div>
                    </div>
                </div>
            <?php else: ?>
                <div class="alert alert-light border">
                    Детальні характеристики будуть додані пізніше.
                </div>
            <?php endif; ?>
        </div>
    </div>
</div>

<?php require __DIR__ . '/includes/footer.php'; ?>
