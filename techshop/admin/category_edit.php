<?php
require __DIR__ . '/header.php';
require __DIR__ . '/../includes/db.php';

$id = $_GET['id'] ?? null;
$category = null;

if (!$id) {
    echo "<div class='alert alert-danger'>ID категорії не вказано</div>";
    require __DIR__ . '/footer.php';
    exit;
}

// Загружаем категорию
$stmt = $pdo->prepare("SELECT * FROM categories WHERE id = ?");
$stmt->execute([$id]);
$category = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$category) {
    echo "<div class='alert alert-danger'>Категорію не знайдено</div>";
    require __DIR__ . '/footer.php';
    exit;
}

// Обработка формы
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $slug = trim($_POST['slug'] ?? '');

    if (!$name || !$slug) {
        echo "<div class='alert alert-danger'>Заповніть всі поля</div>";
    } else {
        $stmt = $pdo->prepare("UPDATE categories SET name = ?, slug = ? WHERE id = ?");
        $stmt->execute([$name, $slug, $id]);

        header("Location: categories.php");
        exit;
    }
}
?>

<h2 class="mb-4">Редагувати категорію</h2>

<form method="post" class="w-50">
    <div class="mb-3">
        <label class="form-label">Назва</label>
        <input type="text" name="name" class="form-control"
               value="<?= htmlspecialchars($category['name']) ?>" required>
    </div>

    <div class="mb-3">
        <label class="form-label">Slug</label>
        <input type="text" name="slug" class="form-control"
               value="<?= htmlspecialchars($category['slug']) ?>" required>
    </div>

    <button class="btn btn-success" type="submit">Зберегти</button>
    <a href="categories.php" class="btn btn-secondary">Назад</a>
</form>

<?php require __DIR__ . '/footer.php'; ?>
