<?php
session_start();
header('Content-Type: application/json');

// Include database
require_once '../configdatabase.php';

// Get form data
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';
$userType = $_POST['userType'] ?? '';
$rememberMe = isset($_POST['rememberMe']);

// Simple validation
if (empty($email) || empty($password) || empty($userType)) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit();
}

try {
    $pdo = getConnection();
    
    // Check user
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? AND user_type = ? AND is_active = 1");
    $stmt->execute([$email, $userType]);
    $user = $stmt->fetch();
    
    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'Invalid email or user type']);
        exit();
    }
    
    // Check password
    if (!password_verify($password, $user['password'])) {
        echo json_encode(['success' => false, 'message' => 'Invalid password']);
        exit();
    }
    
    // Create session
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_name'] = $user['name'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['user_type'] = $user['user_type'];
    $_SESSION['logged_in'] = true;
    
    // Update last login
    $stmt = $pdo->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
    $stmt->execute([$user['id']]);
    
    // Set redirect URL
    $redirectUrls = [
        'admin' => '../admin/html/admindashboard.html',
        'staff' => '../maintenancestaff/html/maintenancestaffdashboard.html',
        'student' => '../student/html/studentdashboard.html'
    ];
    
    $redirectUrl = $redirectUrls[$userType];
    
    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'redirectUrl' => $redirectUrl
    ]);
    
} catch(Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Login failed. Please try again.']);
}
?>