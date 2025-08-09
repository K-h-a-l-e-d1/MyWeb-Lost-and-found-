<?php
// Updated Debug Script - Fixed Version
echo "<h1>🔍 System Debug & Test Tool</h1>";
echo "<hr>";

$host = 'localhost';
$dbname = 'mycomplaints_db';
$username = 'root'; 
$password = ''; 

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "✅ Database connection: SUCCESS<br>";
    
    echo "<h2>🗃️ Database Structure Check</h2>";
    
    // Check if users table exists
    $tableStmt = $pdo->query("SHOW TABLES LIKE 'users'");
    if ($tableStmt->rowCount() > 0) {
        echo "✅ Users table: EXISTS<br>";
        
        // Check table structure
        $structureStmt = $pdo->query("DESCRIBE users");
        $columns = $structureStmt->fetchAll(PDO::FETCH_ASSOC);
        echo "<strong>Table Structure:</strong><br>";
        foreach ($columns as $column) {
            echo "- {$column['Field']}: {$column['Type']}<br>";
        }
        
    } else {
        echo "❌ Users table: NOT FOUND<br>";
        echo "<p style='color: red;'><strong>Action needed:</strong> Run the complete fix script first!</p>";
        exit;
    }
    
    echo "<h2>👥 Current Users</h2>";
    
    $usersStmt = $pdo->query("SELECT id, name, email, user_type, is_active FROM users");
    $users = $usersStmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (count($users) > 0) {
        echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
        echo "<tr style='background: #f0f0f0;'><th>ID</th><th>Name</th><th>Email</th><th>Type</th><th>Active</th></tr>";
        foreach ($users as $user) {
            echo "<tr>";
            echo "<td>{$user['id']}</td>";
            echo "<td>{$user['name']}</td>";
            echo "<td>{$user['email']}</td>";
            echo "<td>{$user['user_type']}</td>";
            echo "<td>" . ($user['is_active'] ? 'Yes' : 'No') . "</td>";
            echo "</tr>";
        }
        echo "</table>";
    } else {
        echo "❌ No users found in database<br>";
    }
    
    echo "<h2>🔐 Password System Test</h2>";
    
    // Test password verification for admin
    $adminStmt = $pdo->prepare("SELECT * FROM users WHERE email = 'admin@test.com' AND user_type = 'admin'");
    $adminStmt->execute();
    $admin = $adminStmt->fetch(PDO::FETCH_ASSOC);
    
    if ($admin) {
        echo "<strong>Admin User Found:</strong><br>";
        echo "- Email: {$admin['email']}<br>";
        echo "- Password Hash: " . (isset($admin['password']) ? 'Present' : 'MISSING') . "<br>";
        
        if (isset($admin['password'])) {
            $testPassword = '123456';
            $passwordValid = password_verify($testPassword, $admin['password']);
            echo "- Password Verification (123456): " . ($passwordValid ? '✅ SUCCESS' : '❌ FAILED') . "<br>";
        }
    } else {
        echo "❌ Admin user not found<br>";
    }
    
    echo "<h2>🧪 Live Login Test</h2>";
    
    // Test form for actual login
    echo "<div style='background: #f9f9f9; padding: 20px; border-radius: 10px; margin: 20px 0;'>";
    echo "<h3>Test Login Form</h3>";
    echo "<form method='POST' action=''>";
    echo "<label>Email:</label><br>";
    echo "<input type='email' name='test_email' value='admin@test.com' style='padding: 8px; margin: 5px 0; width: 250px;'><br>";
    echo "<label>Password:</label><br>";
    echo "<input type='password' name='test_password' value='123456' style='padding: 8px; margin: 5px 0; width: 250px;'><br>";
    echo "<label>User Type:</label><br>";
    echo "<select name='test_userType' style='padding: 8px; margin: 5px 0; width: 250px;'>";
    echo "<option value='admin'>Admin</option>";
    echo "<option value='student'>Student</option>";
    echo "<option value='staff'>Staff</option>";
    echo "</select><br><br>";
    echo "<input type='submit' name='test_login' value='Test Login' style='background: #22c55e; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;'>";
    echo "</form>";
    echo "</div>";
    
    // Process test login
    if (isset($_POST['test_login'])) {
        echo "<div style='background: #e3f2fd; padding: 20px; border-radius: 10px; margin: 20px 0;'>";
        echo "<h3>🎯 Login Test Result:</h3>";
        
        $email = $_POST['test_email'] ?? '';
        $password = $_POST['test_password'] ?? '';
        $userType = $_POST['test_userType'] ?? '';
        
        echo "<strong>Testing with:</strong><br>";
        echo "- Email: $email<br>";
        echo "- Password: " . str_repeat('*', strlen($password)) . " (length: " . strlen($password) . ")<br>";
        echo "- User Type: $userType<br><br>";
        
        try {
            $loginStmt = $pdo->prepare("SELECT * FROM users WHERE email = ? AND user_type = ? AND is_active = 1");
            $loginStmt->execute([$email, $userType]);
            $user = $loginStmt->fetch(PDO::FETCH_ASSOC);
            
            if ($user) {
                echo "✅ User found: {$user['name']}<br>";
                
                if (isset($user['password'])) {
                    if (password_verify($password, $user['password'])) {
                        echo "✅ Password verified successfully<br>";
                        echo "<strong style='color: green;'>🎉 LOGIN WOULD BE SUCCESSFUL!</strong><br>";
                    } else {
                        echo "❌ Password verification failed<br>";
                        echo "<strong style='color: red;'>❌ LOGIN WOULD FAIL</strong><br>";
                    }
                } else {
                    echo "❌ Password field missing from database<br>";
                }
            } else {
                echo "❌ User not found or inactive<br>";
            }
            
        } catch (Exception $e) {
            echo "❌ Login test error: " . $e->getMessage() . "<br>";
        }
        echo "</div>";
    }
    
    echo "<h2>📧 Email System Test</h2>";
    
    // Test email configuration
    $emailConfigOk = true;
    $emailIssues = [];
    
    if (!function_exists('mail')) {
        $emailIssues[] = "PHP mail() function not available";
        $emailConfigOk = false;
    }
    
    if ($emailConfigOk) {
        echo "✅ Email system: Basic PHP mail available<br>";
        echo "📝 Note: Email will work in development mode (showing codes in logs)<br>";
    } else {
        echo "❌ Email system issues:<br>";
        foreach ($emailIssues as $issue) {
            echo "- $issue<br>";
        }
    }
    
    echo "<h2>⚙️ PHP Configuration</h2>";
    echo "- PHP Version: " . phpversion() . "<br>";
    echo "- JSON Extension: " . (extension_loaded('json') ? '✅ Loaded' : '❌ Not loaded') . "<br>";
    echo "- PDO Extension: " . (extension_loaded('pdo') ? '✅ Loaded' : '❌ Not loaded') . "<br>";
    echo "- PDO MySQL: " . (extension_loaded('pdo_mysql') ? '✅ Loaded' : '❌ Not loaded') . "<br>";
    
    echo "<h2>🔗 Quick Links</h2>";
    echo "<ul>";
    echo "<li><a href='login.html' target='_blank'>🚪 Login Page</a></li>";
    echo "<li><a href='register.html' target='_blank'>📝 Register Page</a></li>";
    echo "<li><a href='forgotpass.html' target='_blank'>🔑 Forgot Password</a></li>";
    echo "</ul>";
    
} catch(PDOException $e) {
    echo "<div style='background: #ffebee; padding: 20px; border-radius: 10px; color: #c62828;'>";
    echo "<h3>❌ Database Error:</h3>";
    echo "<p>{$e->getMessage()}</p>";
    echo "<p><strong>Check:</strong></p>";
    echo "<ul>";
    echo "<li>XAMPP is running</li>";
    echo "<li>MySQL service is started</li>";
    echo "<li>Database 'mycomplaints_db' exists</li>";
    echo "</ul>";
    echo "</div>";
}

echo "<hr>";
echo "<p><strong>🚀 If everything shows green checkmarks above, your system is ready!</strong></p>";
?>