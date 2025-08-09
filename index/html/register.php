<?php
header('Content-Type: application/json; charset=utf-8');

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Database configuration
$host = 'localhost';
$dbname = 'mycomplaints_db';
$username = 'root'; 
$password = ''; 

function getConnection() {
    global $host, $dbname, $username, $password;
    
    try {
        $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        return $pdo;
    } catch(PDOException $e) {
        error_log("Database connection failed: " . $e->getMessage());
        throw new Exception("Database connection failed");
    }
}

function sendResponse($success, $message, $data = null) {
    $response = ['success' => $success, 'message' => $message];
    if ($data) {
        $response = array_merge($response, $data);
    }
    echo json_encode($response);
    exit();
}

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Only POST method allowed');
}

// Get and validate input data
$name = trim($_POST['username'] ?? '');
$email = trim($_POST['email'] ?? '');
$inputPassword = $_POST['password'] ?? '';
$confirmPassword = $_POST['confirmPassword'] ?? '';
$role = 'student'; // Force all registrations to be students

// Validate input
if (empty($name)) {
    sendResponse(false, 'Name is required');
}

if (empty($email)) {
    sendResponse(false, 'Email is required');
}

if (empty($inputPassword)) {
    sendResponse(false, 'Password is required');
}

if (empty($confirmPassword)) {
    sendResponse(false, 'Confirm password is required');
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendResponse(false, 'Invalid email format');
}

// Check password match
if ($inputPassword !== $confirmPassword) {
    sendResponse(false, 'Passwords do not match');
}

// Check password length
if (strlen($inputPassword) < 6) {
    sendResponse(false, 'Password must be at least 6 characters');
}

// Validate name length
if (strlen($name) < 2) {
    sendResponse(false, 'Name must be at least 2 characters');
}

if (strlen($name) > 100) {
    sendResponse(false, 'Name is too long (maximum 100 characters)');
}

try {
    $pdo = getConnection();
    
    // Check if email already exists
    $stmt = $pdo->prepare("SELECT id, user_type FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $existingUser = $stmt->fetch();
    
    if ($existingUser) {
        sendResponse(false, 'An account with this email already exists');
    }
    
    // Hash password securely
    $hashedPassword = password_hash($inputPassword, PASSWORD_DEFAULT);
    
    // Insert new user
    $stmt = $pdo->prepare("
        INSERT INTO users (name, email, password, user_type, is_active, created_at) 
        VALUES (?, ?, ?, 'student', 1, NOW())
    ");
    
    $result = $stmt->execute([$name, $email, $hashedPassword]);
    
    if ($result) {
        $userId = $pdo->lastInsertId();
        error_log("New student registered successfully: $email (ID: $userId)");
        
        sendResponse(true, 'Registration successful! You can now login with your credentials.', [
            'userId' => $userId,
            'redirectUrl' => 'login.html'
        ]);
    } else {
        throw new Exception("Failed to create user account");
    }
    
} catch(PDOException $e) {
    error_log("Registration database error: " . $e->getMessage());
    
    // Check for specific errors
    if ($e->getCode() == 23000) { // Duplicate entry
        sendResponse(false, 'An account with this email already exists');
    } else {
        sendResponse(false, 'Database error occurred. Please try again.');
    }
    
} catch(Exception $e) {
    error_log("Registration error: " . $e->getMessage());
    sendResponse(false, 'Registration failed. Please try again.');
}
?>