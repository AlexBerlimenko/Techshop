<?php
require __DIR__ . '/../includes/db.php';

$id = (int)($_POST['id'] ?? 0);
$status = $_POST['status'] ?? 'new';

$stmt = $pdo->prepare("UPDATE orders SET status = ? WHERE id = ?");
$stmt->execute([$status, $id]);

header("Location: order_view.php?id=" . $id);
exit;
?>
