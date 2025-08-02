<?php
session_start();
header('Content-Type: application/json');

// Include database
require_once '../configdatabase.php';

$action = $_POST['action'] ?? '';

if ($action === 'send_reset') {
    sendResetEmail();
} elseif ($action === 'reset_password') {
    resetPassword();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid action']);
}

function sendResetEmail() {
    $email = $_POST['email'] ?? '';
    
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid email address']);
        return;
    }
    
    try {
        $pdo = getConnection();
        
        // Check if user exists
        $stmt = $pdo->prepare("SELECT id, name FROM users WHERE email = ? AND is_active = 1");
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        
        if (!$user) {
            echo json_encode(['success' => false, 'message' => 'Email not found']);
            return;
        }
        
        // Generate simple reset code (6 digits)
        $resetCode = sprintf('%06d', mt_rand(100000, 999999));
        
        // Store reset code in database
        $stmt = $pdo->prepare("UPDATE users SET reset_code = ?, reset_time = NOW() WHERE email = ?");
        $stmt->execute([$resetCode, $email]);
        
        // For testing, just return success with the code (in real app, send email)
        echo json_encode([
            'success' => true, 
            'message' => 'Reset code generated. For testing: ' . $resetCode
        ]);
        
    } catch(Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Database error']);
    }
}

function resetPassword() {
    $email = $_POST['email'] ?? '';
    $resetCode = $_POST['resetCode'] ?? '';
    $newPassword = $_POST['newPassword'] ?? '';
    
    if (empty($email) || empty($resetCode) || empty($newPassword)) {
        echo json_encode(['success' => false, 'message' => 'All fields required']);
        return;
    }
    
    if (strlen($newPassword) < 6) {
        echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters']);
        return;
    }
    
    try {
        $pdo = getConnection();
        
        // Check reset code (valid for 30 minutes)
        $stmt = $pdo->prepare("
            SELECT id FROM users 
            WHERE email = ? 
            AND reset_code = ? 
            AND reset_time > DATE_SUB(NOW(), INTERVAL 30 MINUTE)
            AND is_active = 1
        ");
        $stmt->execute([$email, $resetCode]);
        $user = $stmt->fetch();
        
        if (!$user) {
            echo json_encode(['success' => false, 'message' => 'Invalid or expired reset code']);
            return;
        }
        
        // Update password
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("UPDATE users SET password = ?, reset_code = NULL, reset_time = NULL WHERE id = ?");
        $stmt->execute([$hashedPassword, $user['id']]);
        
        echo json_encode(['success' => true, 'message' => 'Password reset successful']);
        
    } catch(Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Database error']);
    }
}
?>