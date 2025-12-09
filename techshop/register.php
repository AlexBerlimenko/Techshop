<?php
session_start();
require __DIR__ . '/includes/db.php';
require __DIR__ . '/includes/auth.php';

$errors = [];
$old = [
    'name'    => '',
    'email'   => '',
    'phone'   => '',
    'address' => '',
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $name     = trim($_POST['name'] ?? '');
    $email    = trim($_POST['email'] ?? '');
    $password = $_POST['password']  ?? '';
    $password2= $_POST['password2'] ?? '';
    $phone    = trim($_POST['phone'] ?? '');
    $address  = trim($_POST['address'] ?? '');

    // сохраняем старые значения
    $old = compact('name', 'email', 'phone', 'address');

    // ---- ВАЛИДАЦИЯ ----
    if ($name === '' || mb_strlen($name, 'UTF-8') < 2) {
        $errors['name'] = "Введіть коректне ім’я (мінімум 2 символи).";
    }

    if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = "Невірний формат email.";
    }

    if ($password === '' || mb_strlen($password) < 6) {
        $errors['password'] = "Пароль повинен містити щонайменше 6 символів.";
    }

    if ($password !== $password2) {
        $errors['password2'] = "Паролі не співпадають.";
    }

    // адрес можно оставить простым, но проверим длину
    if ($address !== '' && mb_strlen($address, 'UTF-8') < 5) {
        $errors['address'] = "Адреса занадто коротка.";
    }

    // если ошибок нет → проверяем email в БД
    if (!$errors) {
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
        $stmt->execute([$email]);

        if ($stmt->fetch()) {
            $errors['email'] = "Користувач з таким email вже існує.";
        } else {
            $hash = password_hash($password, PASSWORD_DEFAULT);

            $stmt = $pdo->prepare("
                INSERT INTO users (name, email, password_hash, phone, address, role, created_at)
                VALUES (?, ?, ?, ?, ?, 'customer', NOW())
            ");
            $stmt->execute([$name, $email, $hash, $phone, $address]);

            $_SESSION['success_reg'] = true;
            header("Location: login.php");
            exit;
        }
    }
}

$pageTitle = "Реєстрація";
require __DIR__ . '/includes/header.php';
?>

<div class="row justify-content-center">
    <div class="col-md-6">

        <h2 class="mb-4">Реєстрація</h2>

        <?php if ($errors): ?>
            <div class="alert alert-danger">Виправте помилки у формі.</div>
        <?php endif; ?>

        <form method="post" novalidate>

            <!-- ІМ'Я -->
            <div class="mb-3">
                <label class="form-label">Ім’я *</label>
                <input type="text" name="name"
                       class="form-control <?= isset($errors['name']) ? 'is-invalid' : '' ?>"
                       value="<?= htmlspecialchars($old['name']) ?>">

                <div class="invalid-feedback">
                    <?= $errors['name'] ?? "Введіть мінімум 2 символи." ?>
                </div>
            </div>

            <!-- EMAIL -->
            <div class="mb-3">
                <label class="form-label">Email *</label>
                <input type="email" name="email"
                       class="form-control <?= isset($errors['email']) ? 'is-invalid' : '' ?>"
                       value="<?= htmlspecialchars($old['email']) ?>">

                <div class="invalid-feedback">
                    <?= $errors['email'] ?? "Введіть коректний email." ?>
                </div>
            </div>

            <!-- Телефон (необов'язково) -->
            <div class="mb-3">
                <label class="form-label">Телефон</label>
                <input type="text" name="phone"
                       class="form-control"
                       value="<?= htmlspecialchars($old['phone']) ?>">
            </div>

            <!-- Адреса -->
            <div class="mb-3">
                <label class="form-label">Адреса</label>
                <input type="text" name="address"
                       class="form-control <?= isset($errors['address']) ? 'is-invalid' : '' ?>"
                       value="<?= htmlspecialchars($old['address']) ?>">

                <div class="invalid-feedback">
                    <?= $errors['address'] ?? "Введіть коректну адресу." ?>
                </div>
            </div>

            <!-- Пароль -->
            <div class="mb-3">
                <label class="form-label">Пароль *</label>
                <input type="password" name="password"
                       class="form-control <?= isset($errors['password']) ? 'is-invalid' : '' ?>">

                <div class="invalid-feedback">
                    <?= $errors['password'] ?? "Мінімум 6 символів." ?>
                </div>
            </div>

            <!-- Повтор -->
            <div class="mb-3">
                <label class="form-label">Повтор пароля *</label>
                <input type="password" name="password2"
                       class="form-control <?= isset($errors['password2']) ? 'is-invalid' : '' ?>">

                <div class="invalid-feedback">
                    <?= $errors['password2'] ?? "Паролі мають співпадати." ?>
                </div>
            </div>

            <button class="btn btn-success w-100">Зареєструватися</button>

        </form>

    </div>
</div>

<script>
// --- LIVE ВАЛІДАЦІЯ (мінімальна, без заморочек) ---

const fields = document.querySelectorAll("input");

fields.forEach(f => {
    f.addEventListener("input", () => {
        if (f.value.trim() === "") {
            f.classList.remove("is-invalid");
            return;
        }
        // простая проверка email
        if (f.name === "email") {
            const ok = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value);
            f.classList.toggle("is-invalid", !ok);
        }
        // имя — минимум 2 символа
        if (f.name === "name") {
            f.classList.toggle("is-invalid", f.value.trim().length < 2);
        }
        // пароль
        if (f.name === "password") {
            f.classList.toggle("is-invalid", f.value.length < 6);
        }
        if (f.name === "password2") {
            const pass = document.querySelector("input[name=password]").value;
            f.classList.toggle("is-invalid", f.value !== pass);
        }
        // адреса — просто минимальная длина
        if (f.name === "address") {
            f.classList.toggle("is-invalid", f.value.trim().length > 0 && f.value.trim().length < 5);
        }
    });
});
</script>

<?php require __DIR__ . '/includes/footer.php'; ?>
