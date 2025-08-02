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
$userType = $_POST['userType'] ?? '';
$rememberMe = isset($_POST['rememberMe']); 


if (empty($email) || empty($password) || empty($userType)) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit();
}

try {
    $pdo = getConnection();
    
  
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? AND user_type = ? AND is_active = 1");
    $stmt->execute([$email, $userType]);
    $user = $stmt->fetch();
    
    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'Invalid email or user type']);
        exit();
    }
    

    if (!password_verify($password, $user['password'])) {
        echo json_encode(['success' => false, 'message' => 'Invalid password']);
        exit();
    }
    
   
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_name'] = $user['name'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['user_type'] = $user['user_type'];
    $_SESSION['logged_in'] = true;
    
    
    $stmt = $pdo->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
    $stmt->execute([$user['id']]);
    
    
    $redirectUrls = [
        'admin' => '../admin/html/admindashboard.html',
        'staff' => '../maintenancestaff/html/maintenancestaffdashboard.html',
        'student' => '../student/html/studentdashboard.html'
    ];
    
    
    if (isset($redirectUrls[$userType])) {
        $redirectUrl = $redirectUrls[$userType];
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid user type']);
        exit();
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'redirectUrl' => $redirectUrl
    ]);
    
} catch(Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Login failed. Please try again.']);
}
?>
