<?php
require __DIR__ . '/header.php';
require __DIR__ . '/../includes/db.php';

// Обработка отправки формы
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $slug = trim($_POST['slug'] ?? '');

    if (!$name || !$slug) {
        echo "<div class='alert alert-danger'>Заповніть всі поля</div>";
    } else {
        // СОЗДАНИЕ
        $stmt = $pdo->prepare("INSERT INTO categories (name, slug) VALUES (?, ?)");
        $stmt->execute([$name, $slug]);

        header("Location: categories.php");
        exit;
    }
}
?>

<h2 class="mb-4">Додати категорію</h2>

<form method="post" class="w-50">
    <div class="mb-3">
        <label class="form-label">Назва</label>
        <input type="text" name="name" class="form-control" required>
    </div>

    <div class="mb-3">
        <label class="form-label">Slug</label>
        <input type="text" name="slug" class="form-control" required>
    </div>

    <button class="btn btn-success" type="submit">Створити</button>
    <a href="categories.php" class="btn btn-secondary">Назад</a>
</form>

<?php require __DIR__ . '/footer.php'; ?>
