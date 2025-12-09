<?php
session_start();

require __DIR__ . '/includes/db.php';

// ---------- Категорії ----------
$categoriesStmt = $pdo->query("SELECT * FROM categories ORDER BY id");
$categories = $categoriesStmt->fetchAll(PDO::FETCH_ASSOC);

// Поточна категорія
$currentCategorySlug = $_GET['category'] ?? null;

/**
 * ❗ Якщо передано category, якого не існує в БД → 404
 */
if ($currentCategorySlug !== null) {
    $allSlugs = array_column($categories, 'slug');
    if (!in_array($currentCategorySlug, $allSlugs, true)) {
        header("Location: 404.php");
        exit;
    }
}

// ---------- Фільтри ціни ----------
$priceMin = isset($_GET['price_min']) && $_GET['price_min'] !== ''
    ? (int)$_GET['price_min']
    : null;

$priceMax = isset($_GET['price_max']) && $_GET['price_max'] !== ''
    ? (int)$_GET['price_max']
    : null;

// ---------- Фільтр по бренду ----------
$currentBrand = $_GET['brand'] ?? '';

// Список брендів (статичний)
$brands = [
    'ASUS',
    'Lenovo',
    'Logitech',
    'Razer',
    'SteelSeries',
    'HyperX',
    'DeepCool',
    'Cooler Master',
];

// ---------- Побудова SQL з урахуванням фільтрів ----------
$where  = [];
$params = [];

// категорія
if ($currentCategorySlug) {
    $where[]  = 'c.slug = ?';
    $params[] = $currentCategorySlug;
}

// ціна від
if ($priceMin !== null) {
    $where[]  = 'p.price >= ?';
    $params[] = $priceMin;
}

// ціна до
if ($priceMax !== null) {
    $where[]  = 'p.price <= ?';
    $params[] = $priceMax;
}

// бренд
if ($currentBrand !== '') {
    $where[]  = 'p.brand = ?';
    $params[] = $currentBrand;
}

$sql = "
    SELECT p.*, c.name AS category_name
    FROM products p
    JOIN categories c ON p.category_id = c.id
";

if ($where) {
    $sql .= ' WHERE ' . implode(' AND ', $where);
}

$sql .= ' ORDER BY p.id';

$productsStmt = $pdo->prepare($sql);
$productsStmt->execute($params);
$products = $productsStmt->fetchAll(PDO::FETCH_ASSOC);

// заголовок сторінки
$pageTitle = 'TechShop – інтернет-магазин ноутбуків та аксесуарів';

require __DIR__ . '/includes/header.php';
?>

<div class="row">

    <!-- Сайдбар з категоріями + фільтрами -->
    <aside class="col-md-3 mb-4">
        <div class="card sidebar-card mb-4">
            <div class="card-header">Категорії</div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item <?= $currentCategorySlug === null ? 'fw-bold' : '' ?>">
                    <a href="index.php" class="text-decoration-none">Усі товари</a>
                </li>
                <?php foreach ($categories as $cat): ?>
                    <li class="list-group-item <?= $currentCategorySlug === $cat['slug'] ? 'fw-bold' : '' ?>">
                        <a href="index.php?category=<?= htmlspecialchars($cat['slug']) ?>" class="text-decoration-none">
                            <?= htmlspecialchars($cat['name']) ?>
                        </a>
                    </li>
                <?php endforeach; ?>
            </ul>
        </div>

        <!-- Фільтри -->
        <div class="card sidebar-card">
            <div class="card-header">Фільтри</div>
            <div class="card-body">
                <form method="get" class="filters">
                    <?php if ($currentCategorySlug): ?>
                        <input type="hidden" name="category"
                               value="<?= htmlspecialchars($currentCategorySlug) ?>">
                    <?php endif; ?>

                    <label class="form-label">Ціна від</label>
                    <input type="number" name="price_min" class="form-control mb-2"
                           value="<?= $priceMin !== null ? htmlspecialchars($priceMin) : '' ?>">

                    <label class="form-label">Ціна до</label>
                    <input type="number" name="price_max" class="form-control mb-3"
                           value="<?= $priceMax !== null ? htmlspecialchars($priceMax) : '' ?>">

                    <label class="form-label">Бренд</label>
                    <select name="brand" class="form-select mb-3">
                        <option value="">Усі бренди</option>
                        <?php foreach ($brands as $brand): ?>
                            <option value="<?= htmlspecialchars($brand) ?>"
                                <?= $currentBrand === $brand ? 'selected' : '' ?>>
                                <?= htmlspecialchars($brand) ?>
                            </option>
                        <?php endforeach; ?>
                    </select>

                    <button class="btn btn-primary w-100 mb-2" type="submit">
                        Застосувати
                    </button>

                    <a href="index.php<?= $currentCategorySlug ? '?category=' . urlencode($currentCategorySlug) : '' ?>"
                       class="btn btn-outline-secondary w-100">
                        Скинути
                    </a>
                </form>
            </div>
        </div>
    </aside>

    <!-- Основний контент -->
    <main class="col-md-9">
        <h1 class="h4 mb-3">
            <?= $currentCategorySlug
                ? htmlspecialchars(array_column($categories, 'name', 'slug')[$currentCategorySlug] ?? 'Товари')
                : 'Усі товари' ?>
        </h1>

        <?php if (empty($products)): ?>
            <div class="alert alert-info">
                За обраними фільтрами товарів не знайдено.
            </div>
        <?php else: ?>
            <div class="row g-4">
                <?php foreach ($products as $product): ?>
                    <div class="col-md-4">
                        <div class="card product-card h-100">
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

                                <div class="stock-pill">
                                    В наявності: <?= (int)$product['stock'] ?> шт.
                                </div>

                                <p class="card-text small flex-grow-1">
                                    <?= htmlspecialchars($product['description']) ?>
                                </p>

                                <div class="fw-bold mb-3">
                                    <?= number_format($product['price'], 0, ',', ' ') ?> ₴
                                </div>

                                <a href="cart.php?add=<?= (int)$product['id'] ?>" class="btn btn-primary btn-sm w-100">
                                    Додати в кошик
                                </a>

                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </main>
</div>

<?php require __DIR__ . '/includes/footer.php'; ?>
