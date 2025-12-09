<?php
$pageTitle = "Додати товар";
require __DIR__ . '/header.php';
require __DIR__ . '/../includes/db.php';

// завантаження списку категорій
$catStmt = $pdo->query("SELECT * FROM categories ORDER BY name");
$categories = $catStmt->fetchAll(PDO::FETCH_ASSOC);

$success = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $name        = trim($_POST['name'] ?? '');
    $price       = isset($_POST['price']) ? (float)$_POST['price'] : 0;
    $stock       = isset($_POST['stock']) ? (int)$_POST['stock'] : 0;
    $brand       = trim($_POST['brand'] ?? '');
    $category_id = isset($_POST['category_id']) ? (int)$_POST['category_id'] : 0;
    $description = trim($_POST['description'] ?? '');
    $image       = null;

    if ($name === '' || $price <= 0 || $stock < 0 || $brand === '' || $category_id <= 0) {
        $error = "Заповніть усі обов'язкові поля правильно.";
    } else {

        // завантаження зображення (необов'язково)
        if (!empty($_FILES['image']['name'])) {
            $uploadName = time() . '_' . basename($_FILES['image']['name']);
            $uploadPath = __DIR__ . '/../images/' . $uploadName;

            if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadPath)) {
                $image = $uploadName;
            } else {
                $error = "Не вдалося завантажити зображення.";
            }
        }

        if (!$error) {
            $stmt = $pdo->prepare("
                INSERT INTO products (name, price, stock, brand, category_id, description, image)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ");

            $stmt->execute([
                $name,
                $price,
                $stock,
                $brand,
                $category_id,
                $description,
                $image ?? 'no-image.png'   // можеш поставити дефолт
            ]);

            $success = "Товар успішно додано!";
        }
    }
}
?>

<h2 class="mb-4">Додати товар</h2>

<?php if ($success): ?>
    <div class="alert alert-success"><?= htmlspecialchars($success) ?></div>
<?php endif; ?>

<?php if ($error): ?>
    <div class="alert alert-danger"><?= htmlspecialchars($error) ?></div>
<?php endif; ?>

<form method="post" enctype="multipart/form-data" class="mb-5">

    <div class="mb-3">
        <label class="form-label">Назва *</label>
        <input type="text" name="name" class="form-control" required>
    </div>

    <div class="mb-3">
        <label class="form-label">Бренд *</label>
        <input type="text" name="brand" class="form-control" required>
    </div>

    <div class="mb-3">
        <label class="form-label">Ціна *</label>
        <input type="number" name="price" class="form-control" min="1" required>
    </div>

    <div class="mb-3">
        <label class="form-label">Кількість *</label>
        <input type="number" name="stock" class="form-control" min="0" required>
    </div>

    <div class="mb-3">
        <label class="form-label">Категорія *</label>
        <select name="category_id" class="form-select" required>
            <option value="">Оберіть категорію</option>
            <?php foreach ($categories as $cat): ?>
                <option value="<?= $cat['id'] ?>">
                    <?= htmlspecialchars($cat['name']) ?>
                </option>
            <?php endforeach; ?>
        </select>
    </div>

    <div class="mb-3">
        <label class="form-label">Опис</label>
        <textarea name="description" class="form-control" rows="3"></textarea>
    </div>

    <div class="mb-3">
        <label class="form-label">Зображення (необов’язково)</label>
        <input type="file" name="image" class="form-control">
    </div>

    <button class="btn btn-primary">Додати товар</button>
</form>

<?php require __DIR__ . '/footer.php'; ?>
