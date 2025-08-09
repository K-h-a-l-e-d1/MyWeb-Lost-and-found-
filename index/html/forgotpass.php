<?php
session_start();
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

// Simple notification that password reset is not available
function handlePasswordResetRequest() {
    sendResponse(false, 'Password reset functionality is currently disabled. Please contact your administrator for password changes.');
}

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Only POST method allowed');
}

$email = trim($_POST['email'] ?? '');
$action = $_POST['action'] ?? '';

try {
    $pdo = getConnection();
    
    if ($action === 'send_reset') {
        // Simply inform that the feature is disabled
        if (empty($email)) {
            sendResponse(false, 'Email is required');
        }
        
        // Validate email format
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            sendResponse(false, 'Invalid email format');
        }
        
        // Check if user exists (just for validation)
        $stmt = $pdo->prepare("SELECT id, name, user_type FROM users WHERE email = ? AND is_active = 1");
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        
        if (!$user) {
            sendResponse(false, 'No active account found with this email address');
        }
        
        // Return message that feature is disabled
        sendResponse(false, 'Password reset feature is currently disabled. Please contact your system administrator to change your password.');
        
    } else if ($action === 'reset_password') {
        // Also disable this action
        sendResponse(false, 'Password reset functionality is not available.');
        
    } else {
        sendResponse(false, 'Invalid action specified');
    }
    
} catch(Exception $e) {
    error_log("Forgot password error: " . $e->getMessage());
    sendResponse(false, 'An error occurred while processing your request. Please contact administrator.');
}
?>