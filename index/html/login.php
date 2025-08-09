<?php
session_start();

// Set proper headers for JSON response
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-cache, must-revalidate');

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
        throw new Exception("Database connection failed: " . $e->getMessage());
    }
}

// Function to send JSON response
function sendResponse($success, $message, $data = null) {
    $response = ['success' => $success, 'message' => $message];
    if ($data) {
        $response = array_merge($response, $data);
    }
    
    // Clean any output buffer
    if (ob_get_level()) {
        ob_clean();
    }
    
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    exit();
}

// Function to log detailed information
function logDebug($message) {
    error_log("[LOGIN DEBUG] " . date('Y-m-d H:i:s') . " - " . $message);
}

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Only POST method allowed');
}

// Check for connection test (empty POST or specific test parameter)
$isConnectionTest = empty($_POST) || isset($_POST['connection_test']);

if ($isConnectionTest) {
    try {
        $pdo = getConnection();
        logDebug("Connection test successful");
        sendResponse(true, 'Database connection successful - Ready for login');
    } catch(Exception $e) {
        logDebug("Connection test failed: " . $e->getMessage());
        sendResponse(false, 'Database connection failed: ' . $e->getMessage());
    }
}

// Get and sanitize POST data
$email = trim($_POST['email'] ?? '');
$inputPassword = $_POST['password'] ?? ''; 
$userType = strtolower(trim($_POST['userType'] ?? ''));
$rememberMe = ($_POST['rememberMe'] ?? '') === 'true' || ($_POST['rememberMe'] ?? '') === 'on'; 

// Log the login attempt (without password)
logDebug("Login attempt - Email: $email, UserType: $userType, RememberMe: " . ($rememberMe ? 'true' : 'false'));

// Validate required fields
if (empty($email)) {
    logDebug("Validation failed: Email is empty");
    sendResponse(false, 'Email is required');
}

if (empty($inputPassword)) {
    logDebug("Validation failed: Password is empty");
    sendResponse(false, 'Password is required');
}

if (empty($userType)) {
    logDebug("Validation failed: User type is empty");
    sendResponse(false, 'User type is required');
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    logDebug("Validation failed: Invalid email format - $email");
    sendResponse(false, 'Invalid email format');
}

// Validate user type
$validUserTypes = ['admin', 'staff', 'student'];
if (!in_array($userType, $validUserTypes)) {
    logDebug("Validation failed: Invalid user type - $userType");
    sendResponse(false, 'Invalid user type. Must be: admin, staff, or student');
}

try {
    $pdo = getConnection();
    logDebug("Database connection established successfully");
    
    // First, check if user exists with the provided email and user type
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? AND user_type = ? AND is_active = 1");
    $stmt->execute([$email, $userType]);
    $user = $stmt->fetch();
    
    logDebug("User lookup query executed for: $email with type: $userType");
    
    if (!$user) {
        logDebug("User not found with email: $email and type: $userType");
        
        // Check if user exists with different type
        $stmt = $pdo->prepare("SELECT user_type, is_active FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $existingUser = $stmt->fetch();
        
        if ($existingUser) {
            if (!$existingUser['is_active']) {
                logDebug("User found but inactive: $email");
                sendResponse(false, 'Your account has been deactivated. Please contact administrator.');
            } else {
                logDebug("User found with different type. Expected: $userType, Found: " . $existingUser['user_type']);
                sendResponse(false, 'Invalid user type for this email. Your account type is: ' . $existingUser['user_type']);
            }
        } else {
            logDebug("No user found with email: $email");
            sendResponse(false, 'No account found with this email address');
        }
    }
    
    logDebug("User found - ID: {$user['id']}, Name: {$user['name']}, Email: {$user['email']}, Type: {$user['user_type']}");
    
    // Verify password
    logDebug("Starting password verification for user: {$user['email']}");
    
    if (!isset($user['password']) || empty($user['password'])) {
        logDebug("Password field is missing or empty for user: {$user['email']}");
        sendResponse(false, 'Account password not properly configured. Please contact administrator.');
    }
    
    $passwordValid = password_verify($inputPassword, $user['password']);
    
    if (!$passwordValid) {
        logDebug("Password verification FAILED for user: {$user['email']}");
        sendResponse(false, 'Invalid password. Please check your password and try again.');
    }
    
    logDebug("Password verification SUCCESS for user: {$user['email']}");
    
    // Success - create session
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_name'] = $user['name'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['user_type'] = $user['user_type'];
    $_SESSION['logged_in'] = true;
    $_SESSION['login_time'] = time();
    
    logDebug("Session created successfully for user: {$user['email']}");
    
    // Update last login
    try {
        $stmt = $pdo->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
        $stmt->execute([$user['id']]);
        logDebug("Last login updated for user ID: {$user['id']}");
    } catch (Exception $e) {
        logDebug("Failed to update last login: " . $e->getMessage());
    }
    
    // Set remember me cookie if requested
    if ($rememberMe) {
        setcookie('remember_email', $email, time() + (30 * 24 * 60 * 60), "/", "", false, true);
        logDebug("Remember me cookie set for: $email");
    }
    
    // FIXED: Correct redirect URLs based on your file structure
    $redirectUrls = [
        'admin' => '../../admin/html/admindashboard.html',
        'staff' => '../../maintenancestaff/html/maintenancestaffdashboard.html', 
        'student' => '../../student/html/studentdashboard.html'
    ];
    
    $redirectUrl = $redirectUrls[$userType] ?? '../../student/html/studentdashboard.html';
    
    logDebug("Login successful for user: {$user['email']} as {$user['user_type']}");
    logDebug("Redirect URL: $redirectUrl");
    
    sendResponse(true, 'Login successful! Redirecting to your dashboard...', [
        'redirectUrl' => $redirectUrl,
        'user' => [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'type' => $user['user_type']
        ]
    ]);
    
} catch(PDOException $e) {
    logDebug("Database error: " . $e->getMessage());
    sendResponse(false, 'Database error occurred. Please try again later.');
} catch(Exception $e) {
    logDebug("General error: " . $e->getMessage());
    sendResponse(false, 'An error occurred: ' . substr($e->getMessage(), 0, 100));
}
?>