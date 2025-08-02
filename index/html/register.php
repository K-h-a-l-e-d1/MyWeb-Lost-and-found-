<?php
header('Content-Type: application/json');

$host = 'localhost';
$dbname = 'Mycomplaints_db';
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


$username = $_POST['username'] ?? '';
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';
$confirmPassword = $_POST['confirmPassword'] ?? '';
$role = $_POST['role'] ?? '';


if (empty($username) || empty($email) || empty($password) || empty($confirmPassword) || empty($role)) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit();
}

if ($password !== $confirmPassword) {
    echo json_encode(['success' => false, 'message' => 'Passwords do not match']);
    exit();
}

if (strlen($password) < 6) {
    echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters']);
    exit();
}


$userTypeMap = [
    'student' => 'student',
    'admin' => 'admin', 
    'maintenance' => 'staff'
];

$userType = $userTypeMap[$role] ?? 'student'; 

try {
    $pdo = getConnection();
    
    // Check if email exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Email already exists']);
        exit();
    }
    
    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    // Insert user
    $stmt = $pdo->prepare("INSERT INTO users (name, email, password, user_type) VALUES (?, ?, ?, ?)");
    $stmt->execute([$username, $email, $hashedPassword, $userType]);
    
    echo json_encode([
        'success' => true, 
        'message' => 'Registration successful! You can now login.'
    ]);
    
} catch(Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Registration failed. Please try again.']);
}
?>
