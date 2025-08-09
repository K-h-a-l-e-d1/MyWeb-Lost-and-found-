<?php
// Start session to access session variables
session_start();

// Log the logout for debugging
error_log("User logout: " . ($_SESSION['user_email'] ?? 'Unknown') . " at " . date('Y-m-d H:i:s'));

// Destroy all session data
session_unset();     // Clear all session variables
session_destroy();   // Destroy the session

// Clear the session cookie
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// Clear remember me cookie
setcookie('remember_email', '', time() - 3600, "/");

// Prevent caching
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

// Redirect to login page
header('Location: login.html');
exit();
?>