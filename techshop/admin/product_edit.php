<?php
$pageTitle = "Редагування товару";
require __DIR__ . '/header.php';
require __DIR__ . '/../includes/db.php';

// перевірка ID
if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    echo "<div class='alert alert-danger mt-4'>Невірний ID товару.</div>";
    require __DIR__ . '/footer.php';
    exit;
}

$id = (int)$_GET['id'];

// завантаження товару
$stmt = $pdo->prepare("
    SELECT * FROM products WHERE id = ?
");
$stmt->execute([$id]);
$product = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$product) {
    echo "<div class='alert alert-danger mt-4'>Товар не знайдено.</div>";
    require __DIR__ . '/footer.php';
    exit;
}

// завантаження списку категорій
$catStmt = $pdo->query("SELECT * FROM categories ORDER BY name");
$categories = $catStmt->fetchAll(PDO::FETCH_ASSOC);

// обробка форми
$success = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $name        = trim($_POST['name']);
    $price       = (float)$_POST['price'];
    $stock       = (int)$_POST['stock'];
    $brand       = trim($_POST['brand']);
    $category_id = (int)$_POST['category_id'];
    $description = trim($_POST['description']);
    $image       = $product['image']; // залишаємо старе зображення

    // валідація
    if ($name === '' || $price <= 0 || $stock < 0) {
        $error = "Заповніть усі обов'язкові поля правильно.";
    } else {
        // якщо завантажили нове фото
        if (!empty($_FILES['image']['name'])) {
            $uploadName = time() . '_' . basename($_FILES['image']['name']);
            $uploadPath = __DIR__ . '/../images/' . $uploadName;

            if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadPath)) {
                $image = $uploadName;
            } else {
                $error = "Не вдалося завантажити нове зображення.";
            }
        }

        if (!$error) {
            // оновлення товару
            $stmt = $pdo->prepare("
                UPDATE products
                SET name = ?, price = ?, stock = ?, brand = ?, category_id = ?, description = ?, image = ?
                WHERE id = ?
            ");
            $stmt->execute([
                $name, $price, $stock, $brand, $category_id, $description, $image, $id
            ]);

            $success = "Товар успішно оновлено!";
        }
    }
}

?>

<h2 class="mb-4">Редагувати товар</h2>

<?php if ($success): ?>
    <div class="alert alert-success"><?= $success ?></div>
<?php endif; ?>

<?php if ($error): ?>
    <div class="alert alert-danger"><?= $error ?></div>
<?php endif; ?>

<form method="post" enctype="multipart/form-data" class="mb-5">

    <div class="mb-3">
        <label class="form-label">Назва *</label>
        <input type="text" name="name" class="form-control"
               value="<?= htmlspecialchars($product['name']) ?>" required>
    </div>

    <div class="mb-3">
        <label class="form-label">Бренд *</label>
        <input type="text" name="brand" class="form-control"
               value="<?= htmlspecialchars($product['brand']) ?>" required>
    </div>

    <div class="mb-3">
        <label class="form-label">Ціна *</label>
        <input type="number" name="price" class="form-control" min="1"
               value="<?= htmlspecialchars($product['price']) ?>" required>
    </div>

    <div class="mb-3">
        <label class="form-label">Кількість *</label>
        <input type="number" name="stock" class="form-control" min="0"
               value="<?= htmlspecialchars($product['stock']) ?>" required>
    </div>

    <div class="mb-3">
        <label class="form-label">Категорія *</label>
        <select name="category_id" class="form-select" required>
            <?php foreach ($categories as $cat): ?>
                <option value="<?= $cat['id'] ?>"
                    <?= $cat['id'] == $product['category_id'] ? 'selected' : '' ?>>
                    <?= htmlspecialchars($cat['name']) ?>
                </option>
            <?php endforeach; ?>
        </select>
    </div>

    <div class="mb-3">
        <label class="form-label">Опис</label>
        <textarea name="description" class="form-control" rows="3"><?= htmlspecialchars($product['description']) ?></textarea>
    </div>

    <div class="mb-3">
        <label class="form-label">Поточне зображення</label><br>
        <img src="../images/<?= htmlspecialchars($product['image']) ?>" width="150" class="rounded border mb-2">
        <br>
        <label class="form-label">Нове зображення (необов’язково)</label>
        <input type="file" name="image" class="form-control">
    </div>

    <button class="btn btn-primary">Зберегти зміни</button>
</form>

<?php require __DIR__ . '/footer.php'; ?>
