<?php
session_start();

// Destroy all session data
session_destroy();

// Clear any cookies
setcookie('remember_email', '', time() - 3600, "/");

// Redirect to login page
header('Location: login.html');
exit();
?>