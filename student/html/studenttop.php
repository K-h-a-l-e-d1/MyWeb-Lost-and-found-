<?php
// backend/get_complaints.php - Get user complaints
session_start();
require_once '../config/database.php';

// Check if user is logged in
if (!isLoggedIn()) {
    errorResponse('Please login first', 401);
}

try {
    $db = new DatabaseHelper();
    $userId = $_SESSION['user_id'];
    
    $sql = "SELECT 
                c.id,
                c.title,
                c.category,
                c.location,
                c.description,
                c.status,
                c.priority,
                c.created_at,
                c.updated_at,
                c.remarks,
                s.full_name as assigned_staff
            FROM complaints c
            LEFT JOIN users s ON c.assigned_to = s.id
            WHERE c.user_id = ?
            ORDER BY c.created_at DESC";
    
    $complaints = $db->getRows($sql, [$userId]);
    
    if ($complaints) {
        // Format dates and status for frontend
        foreach ($complaints as &$complaint) {
            $complaint['date'] = date('M j, Y', strtotime($complaint['created_at']));
            $complaint['time'] = date('g:i A', strtotime($complaint['created_at']));
        }
        successResponse($complaints);
    } else {
        successResponse([]); // Empty array for no complaints
    }

} catch (Exception $e) {
    error_log("Get Complaints Error: " . $e->getMessage());
    errorResponse('Failed to fetch complaints', 500);
}
?>

<?php
// backend/get_complaint_details.php - Get specific complaint details
session_start();
require_once '../config/database.php';

// Check if user is logged in
if (!isLoggedIn()) {
    errorResponse('Please login first', 401);
}

if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    errorResponse('Invalid complaint ID', 400);
}

try {
    $db = new DatabaseHelper();
    $complaintId = (int)$_GET['id'];
    $userId = $_SESSION['user_id'];
    
    // Get complaint details with security check (user can only view their own complaints)
    $sql = "SELECT 
                c.id,
                c.title,
                c.category,
                c.location,
                c.description,
                c.status,
                c.priority,
                c.created_at,
                c.updated_at,
                c.remarks,
                c.assigned_date,
                c.completed_date,
                s.full_name as assigned_staff,
                s.email as staff_email,
                u.full_name as submitted_by
            FROM complaints c
            LEFT JOIN users s ON c.assigned_to = s.id
            LEFT JOIN users u ON c.user_id = u.id
            WHERE c.id = ? AND c.user_id = ?";
    
    $complaint = $db->getRow($sql, [$complaintId, $userId]);
    
    if ($complaint) {
        // Format dates
        $complaint['date'] = date('M j, Y g:i A', strtotime($complaint['created_at']));
        $complaint['assignedTo'] = $complaint['assigned_staff'];
        
        // Get attachments
        $attachmentSql = "SELECT file_name, file_path FROM complaint_attachments WHERE complaint_id = ?";
        $attachments = $db->getRows($attachmentSql, [$complaintId]);
        $complaint['attachments'] = $attachments ?: [];
        
        // Get status history
        $historySql = "SELECT 
                        h.old_status,
                        h.new_status,
                        h.remarks,
                        h.changed_at,
                        u.full_name as changed_by
                    FROM complaint_status_history h
                    LEFT JOIN users u ON h.changed_by = u.id
                    WHERE h.complaint_id = ?
                    ORDER BY h.changed_at ASC";
        
        $history = $db->getRows($historySql, [$complaintId]);
        $complaint['history'] = $history ?: [];
        
        successResponse($complaint);
    } else {
        errorResponse('Complaint not found or access denied', 404);
    }

} catch (Exception $e) {
    error_log("Get Complaint Details Error: " . $e->getMessage());
    errorResponse('Failed to fetch complaint details', 500);
}
?>

<?php
// backend/submit_complaint.php - Submit new complaint
session_start();
require_once '../config/database.php';

// Check if user is logged in
if (!isLoggedIn()) {
    errorResponse('Please login first', 401);
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    errorResponse('Method not allowed', 405);
}

// Get and validate form data
$title = sanitizeInput($_POST['title'] ?? '');
$category = sanitizeInput($_POST['category'] ?? '');
$location = sanitizeInput($_POST['location'] ?? '');
$description = sanitizeInput($_POST['description'] ?? '');

// Validation
if (empty($title) || empty($category) || empty($location) || empty($description)) {
    errorResponse('All fields are required');
}

if (!in_array($category, ['electricity', 'plumbing', 'wifi', 'cleaning', 'lost', 'other'])) {
    errorResponse('Invalid category selected');
}

try {
    $db = new DatabaseHelper();
    $userId = $_SESSION['user_id'];
    
    // Insert complaint
    $complaintData = [
        'user_id' => $userId,
        'title' => $title,
        'category' => $category,
        'location' => $location,
        'description' => $description,
        'status' => 'pending',
        'priority' => 'medium'
    ];
    
    $complaintId = $db->insert('complaints', $complaintData);
    
    if ($complaintId) {
        // Handle file uploads if any
        if (isset($_FILES['attachments']) && is_array($_FILES['attachments']['name'])) {
            $uploadDir = '../uploads/complaints/';
            
            for ($i = 0; $i < count($_FILES['attachments']['name']); $i++) {
                if ($_FILES['attachments']['error'][$i] === UPLOAD_ERR_OK) {
                    $file = [
                        'name' => $_FILES['attachments']['name'][$i],
                        'type' => $_FILES['attachments']['type'][$i],
                        'tmp_name' => $_FILES['attachments']['tmp_name'][$i],
                        'error' => $_FILES['attachments']['error'][$i],
                        'size' => $_FILES['attachments']['size'][$i]
                    ];
                    
                    $uploadResult = handleFileUpload($file, $uploadDir);
                    
                    if (isset($uploadResult['success'])) {
                        // Save file info to database
                        $attachmentData = [
                            'complaint_id' => $complaintId,
                            'file_name' => $uploadResult['fileName'],
                            'file_path' => $uploadResult['filePath'],
                            'file_type' => $uploadResult['fileType'],
                            'file_size' => $uploadResult['fileSize']
                        ];
                        
                        $db->insert('complaint_attachments', $attachmentData);
                    }
                }
            }
        }
        
        // Log status history
        $historyData = [
            'complaint_id' => $complaintId,
            'old_status' => null,
            'new_status' => 'pending',
            'changed_by' => $userId,
            'remarks' => 'Complaint submitted'
        ];
        
        $db->insert('complaint_status_history', $historyData);
        
        successResponse([
            'complaint_id' => $complaintId,
            'message' => 'Complaint submitted successfully'
        ], 'Complaint submitted successfully');
        
    } else {
        errorResponse('Failed to submit complaint', 500);
    }

} catch (Exception $e) {
    error_log("Submit Complaint Error: " . $e->getMessage());
    errorResponse('Failed to submit complaint', 500);
}
?>

<?php
// backend/auth.php - Authentication handler
session_start();
require_once '../config/database.php';

// Handle login
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'login') {
    
    $username = sanitizeInput($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';
    
    if (empty($username) || empty($password)) {
        errorResponse('Username and password are required');
    }
    
    try {
        $db = new DatabaseHelper();
        
        // Get user by username or email
        $sql = "SELECT id, username, email, password, full_name, user_type, status 
                FROM users 
                WHERE (username = ? OR email = ?) AND status = 'active'";
        
        $user = $db->getRow($sql, [$username, $username]);
        
        if ($user && verifyPassword($password, $user['password'])) {
            // Set session variables
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['email'] = $user['email'];
            $_SESSION['full_name'] = $user['full_name'];
            $_SESSION['user_type'] = $user['user_type'];
            $_SESSION['login_time'] = time();
            
            successResponse([
                'user_type' => $user['user_type'],
                'full_name' => $user['full_name'],
                'redirect' => getRedirectUrl($user['user_type'])
            ], 'Login successful');
            
        } else {
            errorResponse('Invalid username or password', 401);
        }
        
    } catch (Exception $e) {
        error_log("Login Error: " . $e->getMessage());
        errorResponse('Login failed', 500);
    }
}

// Handle registration
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'register') {
    
    $username = sanitizeInput($_POST['username'] ?? '');
    $email = sanitizeInput($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $fullName = sanitizeInput($_POST['full_name'] ?? '');
    $userType = sanitizeInput($_POST['user_type'] ?? 'student');
    $phone = sanitizeInput($_POST['phone'] ?? '');
    $department = sanitizeInput($_POST['department'] ?? '');
    $studentId = sanitizeInput($_POST['student_id'] ?? '');
    
    // Validation
    if (empty($username) || empty($email) || empty($password) || empty($fullName)) {
        errorResponse('All required fields must be filled');
    }
    
    if (!validateEmail($email)) {
        errorResponse('Invalid email format');
    }
    
    if (strlen($password) < 6) {
        errorResponse('Password must be at least 6 characters long');
    }
    
    try {
        $db = new DatabaseHelper();
        
        // Check if username or email already exists
        $checkSql = "SELECT id FROM users WHERE username = ? OR email = ?";
        $existing = $db->getRow($checkSql, [$username, $email]);
        
        if ($existing) {
            errorResponse('Username or email already exists');
        }
        
        // Create new user
        $userData = [
            'username' => $username,
            'email' => $email,
            'password' => hashPassword($password),
            'full_name' => $fullName,
            'user_type' => $userType,
            'phone' => $phone,
            'department' => $department,
            'student_id' => $studentId,
            'status' => 'active'
        ];
        
        $userId = $db->insert('users', $userData);
        
        if ($userId) {
            successResponse([
                'user_id' => $userId,
                'message' => 'Registration successful'
            ], 'Registration successful');
        } else {
            errorResponse('Failed to create account', 500);
        }
        
    } catch (Exception $e) {
        error_log("Registration Error: " . $e->getMessage());
        errorResponse('Registration failed', 500);
    }
}

// Handle logout
if (isset($_POST['action']) && $_POST['action'] === 'logout') {
    session_destroy();
    successResponse([], 'Logged out successfully');
}

function getRedirectUrl($userType) {
    switch ($userType) {
        case 'admin':
            return '../admin/admindashboard.html';
        case 'staff':
            return '../staff/staffdashboard.html';
        case 'student':
        default:
            return '../student/studentdashboard.html';
    }
}
?>

<?php
// backend/logout.php - Logout handler
session_start();

// Destroy all session data
$_SESSION = array();

// Delete session cookie
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// Destroy session
session_destroy();

// Redirect to login page
header("Location: ../../index/html/login.html");
exit;
?>

<?php
// backend/dashboard_data.php - Get dashboard statistics
session_start();
require_once '../config/database.php';

// Check if user is logged in
if (!isLoggedIn()) {
    errorResponse('Please login first', 401);
}

try {
    $db = new DatabaseHelper();
    $userId = $_SESSION['user_id'];
    $userType = $_SESSION['user_type'];
    
    $data = [];
    
    if ($userType === 'student') {
        // Student dashboard data
        $data['total_complaints'] = $db->count('complaints', 'user_id = ?', [$userId]);
        $data['pending_complaints'] = $db->count('complaints', 'user_id = ? AND status = ?', [$userId, 'pending']);
        $data['in_progress_complaints'] = $db->count('complaints', 'user_id = ? AND status = ?', [$userId, 'in-progress']);
        $data['completed_complaints'] = $db->count('complaints', 'user_id = ? AND status = ?', [$userId, 'completed']);
        
        // Recent complaints
        $recentSql = "SELECT id, title, status, created_at 
                      FROM complaints 
                      WHERE user_id = ? 
                      ORDER BY created_at DESC 
                      LIMIT 5";
        $data['recent_complaints'] = $db->getRows($recentSql, [$userId]);
        
    } elseif ($userType === 'staff') {
        // Staff dashboard data
        $data['assigned_complaints'] = $db->count('complaints', 'assigned_to = ?', [$userId]);
        $data['pending_assignments'] = $db->count('complaints', 'assigned_to = ? AND status = ?', [$userId, 'assigned']);
        $data['in_progress_work'] = $db->count('complaints', 'assigned_to = ? AND status = ?', [$userId, 'in-progress']);
        $data['completed_work'] = $db->count('complaints', 'assigned_to = ? AND status = ?', [$userId, 'completed']);
        
    } elseif ($userType === 'admin') {
        // Admin dashboard data
        $data['total_complaints'] = $db->count('complaints');
        $data['pending_complaints'] = $db->count('complaints', 'status = ?', ['pending']);
        $data['assigned_complaints'] = $db->count('complaints', 'status = ?', ['assigned']);
        $data['in_progress_complaints'] = $db->count('complaints', 'status = ?', ['in-progress']);
        $data['completed_complaints'] = $db->count('complaints', 'status = ?', ['completed']);
        
        $data['total_users'] = $db->count('users', 'status = ?', ['active']);
        $data['total_students'] = $db->count('users', 'user_type = ? AND status = ?', ['student', 'active']);
        $data['total_staff'] = $db->count('users', 'user_type = ? AND status = ?', ['staff', 'active']);
    }
    
    successResponse($data);
    
} catch (Exception $e) {
    error_log("Dashboard Data Error: " . $e->getMessage());
    errorResponse('Failed to fetch dashboard data', 500);
}
?>

<?php
// backend/update_complaint_status.php - Update complaint status (Staff/Admin)
session_start();
require_once '../config/database.php';

// Check if user is logged in and has permission
if (!isLoggedIn()) {
    errorResponse('Please login first', 401);
}

if (!in_array($_SESSION['user_type'], ['staff', 'admin'])) {
    errorResponse('Access denied', 403);
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    errorResponse('Method not allowed', 405);
}

$complaintId = (int)($_POST['complaint_id'] ?? 0);
$newStatus = sanitizeInput($_POST['status'] ?? '');
$remarks = sanitizeInput($_POST['remarks'] ?? '');

if (!$complaintId || empty($newStatus)) {
    errorResponse('Complaint ID and status are required');
}

$validStatuses = ['pending', 'assigned', 'in-progress', 'completed', 'cancelled'];
if (!in_array($newStatus, $validStatuses)) {
    errorResponse('Invalid status');
}

try {
    $db = new DatabaseHelper();
    $userId = $_SESSION['user_id'];
    
    // Get current complaint status
    $currentSql = "SELECT status, assigned_to FROM complaints WHERE id = ?";
    $current = $db->getRow($currentSql, [$complaintId]);
    
    if (!$current) {
        errorResponse('Complaint not found', 404);
    }
    
    $oldStatus = $current['status'];
    
    // Update complaint
    $updateData = [
        'status' => $newStatus,
        'remarks' => $remarks
    ];
    
    // Set completion date if status is completed
    if ($newStatus === 'completed') {
        $updateData['completed_date'] = date('Y-m-d H:i:s');
    }
    
    // Assign to current user if not assigned and status is assigned/in-progress
    if (in_array($newStatus, ['assigned', 'in-progress']) && !$current['assigned_to']) {
        $updateData['assigned_to'] = $userId;
        $updateData['assigned_date'] = date('Y-m-d H:i:s');
    }
    
    $updated = $db->update('complaints', $updateData, 'id = ?', [$complaintId]);
    
    if ($updated) {
        // Log status change
        $historyData = [
            'complaint_id' => $complaintId,
            'old_status' => $oldStatus,
            'new_status' => $newStatus,
            'changed_by' => $userId,
            'remarks' => $remarks
        ];
        
        $db->insert('complaint_status_history', $historyData);
        
        successResponse(['message' => 'Complaint status updated successfully']);
    } else {
        errorResponse('Failed to update complaint status', 500);
    }
    
} catch (Exception $e) {
    error_log("Update Status Error: " . $e->getMessage());
    errorResponse('Failed to update complaint status', 500);
}
?>

<?php
// backend/get_all_complaints.php - Get all complaints (Admin/Staff)
session_start();
require_once '../config/database.php';

// Check if user is logged in and has permission
if (!isLoggedIn()) {
    errorResponse('Please login first', 401);
}

if (!in_array($_SESSION['user_type'], ['staff', 'admin'])) {
    errorResponse('Access denied', 403);
}

try {
    $db = new DatabaseHelper();
    $userId = $_SESSION['user_id'];
    $userType = $_SESSION['user_type'];
    
    $sql = "SELECT 
                c.id,
                c.title,
                c.category,
                c.location,
                c.description,
                c.status,
                c.priority,
                c.created_at,
                c.updated_at,
                c.remarks,
                u.full_name as submitted_by,
                u.email as submitter_email,
                u.student_id,
                s.full_name as assigned_staff
            FROM complaints c
            LEFT JOIN users u ON c.user_id = u.id
            LEFT JOIN users s ON c.assigned_to = s.id";
    
    $params = [];
    
    // Staff can only see their assigned complaints or unassigned ones
    if ($userType === 'staff') {
        $sql .= " WHERE c.assigned_to = ? OR c.assigned_to IS NULL";
        $params[] = $userId;
    }
    
    $sql .= " ORDER BY c.created_at DESC";
    
    $complaints = $db->getRows($sql, $params);
    
    if ($complaints) {
        // Format dates for frontend
        foreach ($complaints as &$complaint) {
            $complaint['date'] = date('M j, Y', strtotime($complaint['created_at']));
            $complaint['time'] = date('g:i A', strtotime($complaint['created_at']));
        }
        successResponse($complaints);
    } else {
        successResponse([]);
    }

} catch (Exception $e) {
    error_log("Get All Complaints Error: " . $e->getMessage());
    errorResponse('Failed to fetch complaints', 500);
}
?>

<?php
// test_db.php - Database connection test file
require_once 'config/database.php';

echo "<h2>Database Connection Test</h2>";

// Test basic connection
$db = new Database();
if ($db->testConnection()) {
    echo "<p style='color: green;'>✓ Database connection successful!</p>";
} else {
    echo "<p style='color: red;'>✗ Database connection failed!</p>";
    exit;
}

// Test database helper
$helper = new DatabaseHelper();

// Test if tables exist
$tables = ['users', 'complaints', 'complaint_attachments', 'complaint_status_history', 'system_settings'];

foreach ($tables as $table) {
    $count = $helper->count($table);
    echo "<p>Table '{$table}': {$count} records</p>";
}

// Test sample queries
$sampleUser = $helper->getRow("SELECT * FROM users WHERE user_type = 'student' LIMIT 1");
if ($sampleUser) {
    echo "<p style='color: green;'>✓ Sample user found: " . $sampleUser['full_name'] . "</p>";
}

$sampleComplaints = $helper->count("complaints");
echo "<p>Total complaints in system: {$sampleComplaints}</p>";

echo "<h3>Test completed successfully!</h3>";
echo "<p>You can now use your complaint management system.</p>";
echo "<p><strong>Default login credentials:</strong></p>";
echo "<ul>";
echo "<li>Admin: admin / password</li>";
echo "<li>Student: john_doe / password</li>";
echo "<li>Staff: mike_wilson / password</li>";
echo "</ul>";
?>