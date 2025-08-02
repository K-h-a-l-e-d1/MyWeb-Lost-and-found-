<?php
session_start();
header('Content-Type: application/json');

$host = 'localhost';
$dbname = 'mycomplaints_db';
$username = 'root'; 
$password = ''; 

function getConnection() {
    global $host, $dbname, $username, $password;
    
    try {
        $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch(PDOException $e) {
        error_log("Database connection failed: " . $e->getMessage());
        throw new Exception("Database connection failed: " . $e->getMessage());
    }
}

$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';
$resetCode = $_POST['resetCode'] ?? '';
$newPassword = $_POST['newPassword'] ?? '';

if (empty($email) || empty($password) || empty($resetCode) || empty($newPassword)) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit();
}

try {
    $pdo = getConnection();
    
  
    $stmt = $pdo->prepare("
        SELECT id, reset_code FROM users WHERE email = ? AND reset_code = ? AND is_active = 1
    ");
    $stmt->execute([$email, $resetCode]);
    $user = $stmt->fetch();
    
    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'Invalid email or reset code']);
        exit();
    }
    
    $stmt = $pdo->prepare("
        SELECT id FROM users 
        WHERE email = ? 
        AND reset_code = ? 
        AND reset_time > DATE_SUB(NOW(), INTERVAL 30 MINUTE)
    ");
    $stmt->execute([$email, $resetCode]);
    $user = $stmt->fetch();
    
    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'Reset code expired']);
        exit();
    }
    
    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("UPDATE users SET password = ?, reset_code = NULL, reset_time = NULL WHERE id = ?");
    $stmt->execute([$hashedPassword, $user['id']]);
    
    
    echo json_encode(['success' => true, 'message' => 'Password reset successful']);
    
} catch(Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error processing request. Please try again later.']);
}
?>
