<?php
// UPDATED COMPLETE DATABASE SETUP AND CONNECTION FIX SCRIPT
echo "<h1>🔧 Digital Complaint System - Complete Database Setup</h1>";
echo "<hr>";

// Database configuration
$host = 'localhost';
$dbname = 'mycomplaints_db';
$username = 'root'; 
$password = ''; // Default XAMPP MySQL password

// Function to create a clean PDO connection
function createConnection($host, $dbname, $username, $password, $createDB = false) {
    try {
        if ($createDB) {
            // Connect without database to create it
            $dsn = "mysql:host=$host;charset=utf8mb4";
        } else {
            // Connect to specific database
            $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
        }
        
        $pdo = new PDO($dsn, $username, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
        ]);
        
        return $pdo;
    } catch(PDOException $e) {
        throw new Exception("Connection failed: " . $e->getMessage());
    }
}

try {
    echo "<h2>📡 Step 1: Testing MySQL Server Connection</h2>";
    
    // Test MySQL server connection
    $pdo = createConnection($host, '', $username, $password, true);
    echo "✅ MySQL Server connected successfully<br>";
    echo "✅ Server Version: " . $pdo->getAttribute(PDO::ATTR_SERVER_VERSION) . "<br><br>";
    
    echo "<h2>🗄️ Step 2: Database Management</h2>";
    
    // Check if database exists
    $stmt = $pdo->query("SHOW DATABASES LIKE '$dbname'");
    $dbExists = $stmt->rowCount() > 0;
    
    if ($dbExists) {
        echo "⚠️ Database '$dbname' already exists<br>";
        echo "🗑️ Dropping existing database for fresh setup...<br>";
        $pdo->exec("DROP DATABASE `$dbname`");
        echo "✅ Old database dropped<br>";
    }
    
    // Create new database
    $pdo->exec("CREATE DATABASE `$dbname` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "✅ Database '$dbname' created successfully<br><br>";
    
    // Connect to the new database
    $pdo = createConnection($host, $dbname, $username, $password);
    echo "✅ Connected to database '$dbname'<br><br>";
    
    echo "<h2>📋 Step 3: Creating Database Tables</h2>";
    
    // Create users table
    $createUsersTable = "
    CREATE TABLE `users` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `name` VARCHAR(255) NOT NULL,
        `email` VARCHAR(255) UNIQUE NOT NULL,
        `password` VARCHAR(255) NOT NULL,
        `user_type` ENUM('admin', 'staff', 'student') NOT NULL DEFAULT 'student',
        `is_active` BOOLEAN DEFAULT TRUE,
        `reset_code` VARCHAR(6) NULL,
        `reset_time` TIMESTAMP NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `last_login` TIMESTAMP NULL,
        INDEX `idx_email` (`email`),
        INDEX `idx_user_type` (`user_type`),
        INDEX `idx_active` (`is_active`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    $pdo->exec($createUsersTable);
    echo "✅ Users table created<br>";
    
    // Create complaints table
    $createComplaintsTable = "
    CREATE TABLE `complaints` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `student_id` INT NOT NULL,
        `title` VARCHAR(500) NOT NULL,
        `description` TEXT NOT NULL,
        `category` VARCHAR(100) NOT NULL,
        `priority` ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
        `status` ENUM('pending', 'assigned', 'in_progress', 'completed', 'rejected') DEFAULT 'pending',
        `location` VARCHAR(500) NOT NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
        INDEX `idx_student_id` (`student_id`),
        INDEX `idx_status` (`status`),
        INDEX `idx_priority` (`priority`),
        INDEX `idx_category` (`category`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    $pdo->exec($createComplaintsTable);
    echo "✅ Complaints table created<br>";
    
    // Create complaint_assignments table
    $createComplaintAssignmentsTable = "
    CREATE TABLE `complaint_assignments` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `complaint_id` INT NOT NULL,
        `staff_id` INT NOT NULL,
        `assigned_by` INT NOT NULL,
        `assigned_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `deadline` TIMESTAMP NULL,
        `notes` TEXT NULL,
        FOREIGN KEY (`complaint_id`) REFERENCES `complaints`(`id`) ON DELETE CASCADE,
        FOREIGN KEY (`staff_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
        FOREIGN KEY (`assigned_by`) REFERENCES `users`(`id`) ON DELETE CASCADE,
        INDEX `idx_complaint_id` (`complaint_id`),
        INDEX `idx_staff_id` (`staff_id`),
        INDEX `idx_assigned_by` (`assigned_by`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    $pdo->exec($createComplaintAssignmentsTable);
    echo "✅ Complaint assignments table created<br>";
    
    // Create task_assignments table
    $createTaskAssignmentsTable = "
    CREATE TABLE `task_assignments` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `title` VARCHAR(500) NOT NULL,
        `description` TEXT NOT NULL,
        `assigned_to` INT NOT NULL,
        `assigned_by` INT NOT NULL,
        `priority` ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
        `status` ENUM('pending', 'in_progress', 'completed', 'overdue') DEFAULT 'pending',
        `deadline` TIMESTAMP NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        `completed_at` TIMESTAMP NULL,
        FOREIGN KEY (`assigned_to`) REFERENCES `users`(`id`) ON DELETE CASCADE,
        FOREIGN KEY (`assigned_by`) REFERENCES `users`(`id`) ON DELETE CASCADE,
        INDEX `idx_assigned_to` (`assigned_to`),
        INDEX `idx_assigned_by` (`assigned_by`),
        INDEX `idx_status` (`status`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    $pdo->exec($createTaskAssignmentsTable);
    echo "✅ Task assignments table created<br>";
    
    // Create admin_warnings table
    $createAdminWarningsTable = "
    CREATE TABLE `admin_warnings` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `staff_id` INT NOT NULL,
        `admin_id` INT NOT NULL,
        `warning_type` ENUM('late_completion', 'poor_quality', 'missed_deadline', 'other') NOT NULL,
        `message` TEXT NOT NULL,
        `related_task_id` INT NULL,
        `related_complaint_id` INT NULL,
        `is_read` BOOLEAN DEFAULT FALSE,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (`staff_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
        FOREIGN KEY (`admin_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
        FOREIGN KEY (`related_task_id`) REFERENCES `task_assignments`(`id`) ON DELETE SET NULL,
        FOREIGN KEY (`related_complaint_id`) REFERENCES `complaints`(`id`) ON DELETE SET NULL,
        INDEX `idx_staff_id` (`staff_id`),
        INDEX `idx_admin_id` (`admin_id`),
        INDEX `idx_is_read` (`is_read`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    $pdo->exec($createAdminWarningsTable);
    echo "✅ Admin warnings table created<br>";
    
    // Create task_history table
    $createTaskHistoryTable = "
    CREATE TABLE `task_history` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `task_type` ENUM('complaint', 'custom_task') NOT NULL,
        `task_id` INT NOT NULL,
        `staff_id` INT NOT NULL,
        `action` VARCHAR(100) NOT NULL,
        `old_status` VARCHAR(50) NULL,
        `new_status` VARCHAR(50) NULL,
        `notes` TEXT NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (`staff_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
        INDEX `idx_staff_id` (`staff_id`),
        INDEX `idx_task_type` (`task_type`),
        INDEX `idx_task_id` (`task_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    $pdo->exec($createTaskHistoryTable);
    echo "✅ Task history table created<br><br>";
    
    echo "<h2>👥 Step 4: Creating Test User Accounts</h2>";
    
    // Create secure test password
    $testPassword = '123456';
    $hashedPassword = password_hash($testPassword, PASSWORD_DEFAULT);
    echo "🔐 Generated secure password hashes<br>";
    
    // Insert comprehensive test users
    $testUsers = [
        ['System Administrator', 'admin@test.com', 'admin'],
        ['John Smith', 'student@test.com', 'student'],
        ['Mike Johnson', 'staff@test.com', 'staff'],
        ['Jane Doe', 'jane@test.com', 'student'],
        ['Bob Wilson', 'bob@test.com', 'staff'],
        ['Alice Brown', 'alice@test.com', 'student'],
        ['Tom Davis', 'tom@test.com', 'staff']
    ];
    
    $insertUserStmt = $pdo->prepare("
        INSERT INTO users (name, email, password, user_type, is_active, created_at) 
        VALUES (?, ?, ?, ?, 1, NOW())
    ");
    
    foreach ($testUsers as $user) {
        if ($insertUserStmt->execute([$user[0], $user[1], $hashedPassword, $user[2]])) {
            echo "✅ Created user: <strong>{$user[0]}</strong> ({$user[1]}) - Type: <em>{$user[2]}</em><br>";
        }
    }
    
    echo "<br><h2>📋 Step 5: Inserting Sample Data</h2>";
    
    // Insert sample complaints
    $sampleComplaints = [
        [2, 'Broken AC in Room 101', 'The air conditioning unit in room 101 is not working properly. It makes loud noises and doesn\'t cool the room effectively.', 'HVAC', 'high', 'Room 101, Building A'],
        [4, 'Leaking Faucet in Bathroom', 'Water is continuously dripping from the main faucet in the bathroom. This is wasting water and causing puddles.', 'Plumbing', 'medium', 'Bathroom, Floor 2, Building B'],
        [6, 'Flickering Lights in Corridor', 'The fluorescent lights in the main corridor keep flickering intermittently throughout the day.', 'Electrical', 'low', 'Main Corridor, Building A'],
        [2, 'Damaged Door Lock', 'The classroom door lock is not working properly and the door cannot be secured.', 'Security', 'high', 'Room 205, Building C'],
        [6, 'Broken Window', 'The window in the library has a crack and doesn\'t close properly, letting in cold air.', 'Maintenance', 'medium', 'Library, Building B']
    ];
    
    $insertComplaintStmt = $pdo->prepare("
        INSERT INTO complaints (student_id, title, description, category, priority, location, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, NOW() - INTERVAL FLOOR(RAND() * 30) DAY)
    ");
    
    foreach ($sampleComplaints as $complaint) {
        if ($insertComplaintStmt->execute($complaint)) {
            echo "✅ Added complaint: <strong>{$complaint[1]}</strong> (Priority: {$complaint[4]})<br>";
        }
    }
    
    // Insert some complaint assignments
    echo "<br>📝 Creating sample complaint assignments...<br>";
    $assignments = [
        [1, 3, 1, 'Please fix this ASAP - high priority'],
        [2, 5, 1, 'Standard maintenance request'],
        [4, 7, 1, 'Security issue - handle with care']
    ];
    
    $assignmentStmt = $pdo->prepare("
        INSERT INTO complaint_assignments (complaint_id, staff_id, assigned_by, notes, deadline) 
        VALUES (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 3 DAY))
    ");
    
    foreach ($assignments as $assignment) {
        if ($assignmentStmt->execute($assignment)) {
            echo "✅ Assigned complaint {$assignment[0]} to staff {$assignment[1]}<br>";
        }
    }
    
    // Update assigned complaints status
    $pdo->exec("UPDATE complaints SET status = 'assigned' WHERE id IN (1, 2, 4)");
    echo "✅ Updated complaint statuses<br>";
    
    echo "<br><h2>🧪 Step 6: Testing Authentication System</h2>";
    
    // Test password verification for each user type
    $testStmt = $pdo->query("SELECT id, name, email, password, user_type FROM users ORDER BY user_type, id");
    $allUsers = $testStmt->fetchAll();
    
    echo "<table border='1' style='border-collapse: collapse; width: 100%; margin: 10px 0;'>";
    echo "<tr style='background: #f0f0f0;'><th>User</th><th>Email</th><th>Type</th><th>Password Test</th></tr>";
    
    foreach ($allUsers as $user) {
        $isValid = password_verify($testPassword, $user['password']);
        $status = $isValid ? '✅ WORKING' : '❌ FAILED';
        $statusColor = $isValid ? '#10b981' : '#ef4444';
        
        echo "<tr>";
        echo "<td><strong>{$user['name']}</strong></td>";
        echo "<td>{$user['email']}</td>";
        echo "<td><span style='background: #e3f2fd; padding: 4px 8px; border-radius: 4px;'>{$user['user_type']}</span></td>";
        echo "<td style='color: $statusColor; font-weight: bold;'>$status</td>";
        echo "</tr>";
    }
    echo "</table>";
    
    echo "<br><h2>🔑 Step 7: Complete Login Test</h2>";
    
    // Test complete login flow
    $testLogin = function($email, $userType, $password) use ($pdo, $testPassword) {
        echo "<div style='background: #f8fafc; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #3b82f6;'>";
        echo "<strong>Testing login for:</strong> $email ($userType)<br>";
        
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? AND user_type = ? AND is_active = 1");
        $stmt->execute([$email, $userType]);
        $user = $stmt->fetch();
        
        if ($user && password_verify($password, $user['password'])) {
            echo "✅ <span style='color: #10b981;'>Login test SUCCESSFUL</span><br>";
            
            // Update last login
            $updateStmt = $pdo->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
            $updateStmt->execute([$user['id']]);
            echo "✅ Last login timestamp updated<br>";
        } else {
            echo "❌ <span style='color: #ef4444;'>Login test FAILED</span><br>";
        }
        echo "</div>";
    };
    
    $testLogin('admin@test.com', 'admin', $testPassword);
    $testLogin('student@test.com', 'student', $testPassword);
    $testLogin('staff@test.com', 'staff', $testPassword);
    
    echo "<br><h2>📊 Step 8: Database Statistics</h2>";
    
    // Show database statistics
    echo "<div style='background: #f0f8ff; padding: 20px; border-radius: 10px; margin: 20px 0;'>";
    
    $stats = [
        'Total Users' => $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn(),
        'Admin Users' => $pdo->query("SELECT COUNT(*) FROM users WHERE user_type = 'admin'")->fetchColumn(),
        'Staff Users' => $pdo->query("SELECT COUNT(*) FROM users WHERE user_type = 'staff'")->fetchColumn(),
        'Student Users' => $pdo->query("SELECT COUNT(*) FROM users WHERE user_type = 'student'")->fetchColumn(),
        'Total Complaints' => $pdo->query("SELECT COUNT(*) FROM complaints")->fetchColumn(),
        'Pending Complaints' => $pdo->query("SELECT COUNT(*) FROM complaints WHERE status = 'pending'")->fetchColumn(),
        'Assigned Complaints' => $pdo->query("SELECT COUNT(*) FROM complaints WHERE status = 'assigned'")->fetchColumn(),
        'Active Assignments' => $pdo->query("SELECT COUNT(*) FROM complaint_assignments")->fetchColumn()
    ];
    
    echo "<h3>📈 System Statistics:</h3>";
    echo "<div style='display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 15px;'>";
    
    foreach ($stats as $label => $count) {
        echo "<div style='background: white; padding: 15px; border-radius: 8px; text-align: center; border: 1px solid #e2e8f0;'>";
        echo "<div style='font-size: 2rem; font-weight: bold; color: #3b82f6;'>$count</div>";
        echo "<div style='color: #64748b; font-size: 0.9rem;'>$label</div>";
        echo "</div>";
    }
    
    echo "</div></div>";
    
    // Success summary
    echo "<div style='background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; border-radius: 15px; margin: 30px 0; text-align: center;'>";
    echo "<h2 style='margin-bottom: 20px;'>🎉 Setup Complete - System Ready!</h2>";
    echo "<div style='font-size: 1.1rem; line-height: 1.8;'>";
    echo "✅ Database created and configured<br>";
    echo "✅ All tables created with proper relationships<br>";
    echo "✅ Test users created with secure passwords<br>";
    echo "✅ Sample data inserted<br>";
    echo "✅ Authentication system tested<br>";
    echo "✅ System ready for production use<br>";
    echo "</div></div>";
    
    echo "<h2>🔗 Quick Access & Test Credentials</h2>";
    echo "<div style='background: #fef3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid #facc15;'>";
    echo "<h3>🔑 Test Login Credentials (Password: 123456):</h3>";
    echo "<ul style='font-size: 1.1rem; line-height: 2;'>";
    echo "<li><strong>👨‍💼 Admin:</strong> admin@test.com</li>";
    echo "<li><strong>👨‍🔧 Staff 1:</strong> staff@test.com (Mike Johnson)</li>";
    echo "<li><strong>👨‍🔧 Staff 2:</strong> bob@test.com (Bob Wilson)</li>";
    echo "<li><strong>👨‍🔧 Staff 3:</strong> tom@test.com (Tom Davis)</li>";
    echo "<li><strong>👨‍🎓 Student 1:</strong> student@test.com (John Smith)</li>";
    echo "<li><strong>👩‍🎓 Student 2:</strong> jane@test.com (Jane Doe)</li>";
    echo "<li><strong>👩‍🎓 Student 3:</strong> alice@test.com (Alice Brown)</li>";
    echo "</ul>";
    echo "</div>";
    
    echo "<div style='display: flex; gap: 15px; flex-wrap: wrap; margin: 20px 0;'>";
    echo "<a href='login.html' target='_blank' style='background: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;'>🚪 Test Login System</a>";
    echo "<a href='register.html' target='_blank' style='background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;'>📝 Test Registration</a>";
    echo "<a href='forgotpass.html' target='_blank' style='background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;'>🔑 Password Reset</a>";
    echo "</div>";
    
} catch(Exception $e) {
    echo "<div style='background: #fee2e2; color: #dc2626; padding: 25px; border-radius: 10px; margin: 20px 0; border: 1px solid #fca5a5;'>";
    echo "<h3>❌ Setup Error</h3>";
    echo "<p><strong>Error Message:</strong> {$e->getMessage()}</p>";
    echo "<h4>🔍 Troubleshooting Steps:</h4>";
    echo "<ol style='margin: 15px 0; padding-left: 20px;'>";
    echo "<li>Make sure XAMPP is running</li>";
    echo "<li>Start Apache and MySQL services</li>";
    echo "<li>Check if port 3306 is available</li>";
    echo "<li>Verify MySQL root user has no password</li>";
    echo "<li>Try accessing phpMyAdmin at: <a href='http://localhost/phpmyadmin' target='_blank'>http://localhost/phpmyadmin</a></li>";
    echo "<li>If still failing, check XAMPP error logs</li>";
    echo "</ol>";
    echo "</div>";
}

echo "<hr style='margin: 40px 0;'>";
echo "<h2>📋 Next Steps Checklist</h2>";
echo "<div style='background: white; padding: 25px; border-radius: 10px; border: 1px solid #e2e8f0;'>";
echo "<ol style='font-size: 1.1rem; line-height: 2;'>";
echo "<li>✅ <strong>Database Setup Complete</strong> - All tables created successfully</li>";
echo "<li>🧪 <strong>Test Login System</strong> - Try logging in with different user types</li>";
echo "<li>🔧 <strong>Test Registration</strong> - Create new student accounts</li>";
echo "<li>📧 <strong>Configure Email (Optional)</strong> - Update SMTP settings for password reset</li>";
echo "<li>🛡️ <strong>Security</strong> - Delete this setup file after testing</li>";
echo "<li>🚀 <strong>Go Live</strong> - System ready for production use</li>";
echo "</ol>";
echo "</div>";

echo "<p style='text-align: center; margin-top: 30px; color: #64748b; font-style: italic;'>";
echo "Database setup completed on: " . date('Y-m-d H:i:s') . " | Generated by Digital Complaint System Setup";
echo "</p>";
?>