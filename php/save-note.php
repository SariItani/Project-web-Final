<?php
session_start();

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo 'Not logged in';
    exit;
}

// Database connection
$host = 'localhost';
$db   = 'notes';
$user = '';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    die('Connection failed: ' . $e->getMessage());
}

// Handle note saving
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['title'] ?? '';
    $body = $_POST['body'] ?? '';
    $user_id = $_SESSION['user_id'];

    // Basic validation
    if (empty($title) && empty($body)) {
        echo 'Note is empty';
        exit;
    }

    try {
        // Check if note already exists (update if it does)
        $stmt = $pdo->prepare("
            INSERT INTO notes (user_id, title, body) 
            VALUES (?, ?, ?) 
            ON DUPLICATE KEY UPDATE 
            title = VALUES(title), 
            body = VALUES(body)
        ");
        $stmt->execute([$user_id, $title, $body]);
        
        echo 'success';
    } catch (Exception $e) {
        echo 'Failed to save note: ' . $e->getMessage();
    }
    exit;
}
?>