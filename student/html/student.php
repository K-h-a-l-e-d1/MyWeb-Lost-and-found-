<?php
// config/database.php - Database Configuration

// Database configuration
define('DB_HOST', 'localhost');
define('DB_USERNAME', 'root');
define('DB_PASSWORD', ''); // Default XAMPP password is empty
define('DB_NAME', 'complaint_maintenance_system');
define('DB_CHARSET', 'utf8mb4');

// Application configuration
define('APP_NAME', 'Digital Complaint & Maintenance System');
define('APP_VERSION', '1.0.0');
define('UPLOAD_DIR', '../uploads/');
define('MAX_FILE_SIZE', 5242880); // 5MB in bytes
define('ALLOWED_FILE_TYPES', ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx']);

// Session configuration
define('SESSION_TIMEOUT', 3600); // 1 hour in seconds

// Database connection class
class Database {
    private $host = DB_HOST;
    private $username = DB_USERNAME;
    private $password = DB_PASSWORD;
    private $database = DB_NAME;
    private $charset = DB_CHARSET;
    public $conn;

    // Database connection
    public function connect() {
        $this->conn = null;
        
        try {
            $dsn = "mysql:host=" . $this->host . ";dbname=" . $this->database . ";charset=" . $this->charset;
            $this->conn = new PDO($dsn, $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch(PDOException $e) {
            echo "Connection Error: " . $e->getMessage();
            die();
        }
        
        return $this->conn;
    }

    // Close connection
    public function disconnect() {
        $this->conn = null;
    }

    // Test connection
    public function testConnection() {
        try {
            $conn = $this->connect();
            if ($conn) {
                echo "Database connection successful!";
                return true;
            }
        } catch (Exception $e) {
            echo "Connection failed: " . $e->getMessage();
            return false;
        }
    }
}

// Database helper functions
class DatabaseHelper {
    private $db;
    private $conn;

    public function __construct() {
        $this->db = new Database();
        $this->conn = $this->db->connect();
    }

    // Execute query with parameters
    public function query($sql, $params = []) {
        try {
            $stmt = $this->conn->prepare($sql);
            $stmt->execute($params);
            return $stmt;
        } catch (PDOException $e) {
            error_log("Database Query Error: " . $e->getMessage());
            return false;
        }
    }

    // Get single record
    public function getRow($sql, $params = []) {
        $stmt = $this->query($sql, $params);
        return $stmt ? $stmt->fetch() : false;
    }

    // Get multiple records
    public function getRows($sql, $params = []) {
        $stmt = $this->query($sql, $params);
        return $stmt ? $stmt->fetchAll() : false;
    }

    // Insert record
    public function insert($table, $data) {
        $keys = array_keys($data);
        $columns = implode(', ', $keys);
        $placeholders = ':' . implode(', :', $keys);
        
        $sql = "INSERT INTO {$table} ({$columns}) VALUES ({$placeholders})";
        
        $stmt = $this->query($sql, $data);
        return $stmt ? $this->conn->lastInsertId() : false;
    }

    // Update record
    public function update($table, $data, $where, $whereParams = []) {
        $setParts = [];
        foreach (array_keys($data) as $key) {
            $setParts[] = "{$key} = :{$key}";
        }
        $setClause = implode(', ', $setParts);
        
        $sql = "UPDATE {$table} SET {$setClause} WHERE {$where}";
        
        $params = array_merge($data, $whereParams);
        return $this->query($sql, $params) ? true : false;
    }

    // Delete record
    public function delete($table, $where, $params = []) {
        $sql = "DELETE FROM {$table} WHERE {$where}";
        return $this->query($sql, $params) ? true : false;
    }

    // Get record count
    public function count($table, $where = '1=1', $params = []) {
        $sql = "SELECT COUNT(*) as count FROM {$table} WHERE {$where}";
        $result = $this->getRow($sql, $params);
        return $result ? (int)$result['count'] : 0;
    }
}

// Utility functions
function sanitizeInput($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

function generateToken($length = 32) {
    return bin2hex(random_bytes($length));
}

function hashPassword($password) {
    return password_hash($password, PASSWORD_DEFAULT);
}

function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

// Response helper
function jsonResponse($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function errorResponse($message, $status = 400) {
    jsonResponse(['error' => true, 'message' => $message], $status);
}

function successResponse($data = [], $message = 'Success') {
    jsonResponse(['error' => false, 'message' => $message, 'data' => $data]);
}

// Session management
function startSession() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
}

function isLoggedIn() {
    startSession();
    return isset($_SESSION['user_id']) && isset($_SESSION['user_type']);
}

function requireLogin() {
    if (!isLoggedIn()) {
        header('Location:../../index/html/login.html');
        exit;
    }
}

function requireUserType($allowedTypes) {
    startSession();
    if (!isLoggedIn() || !in_array($_SESSION['user_type'], $allowedTypes)) {
        http_response_code(403);
        echo "Access denied";
        exit;
    }
}

// File upload helper
function handleFileUpload($file, $uploadDir = UPLOAD_DIR) {
    if (!isset($file) || $file['error'] !== UPLOAD_ERR_OK) {
        return false;
    }

    $fileName = $file['name'];
    $fileSize = $file['size'];
    $fileTmpName = $file['tmp_name'];
    $fileType = $file['type'];
    $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

    // Validate file size
    if ($fileSize > MAX_FILE_SIZE) {
        return ['error' => 'File size too large. Maximum allowed: ' . (MAX_FILE_SIZE / 1024 / 1024) . 'MB'];
    }

    // Validate file type
    if (!in_array($fileExtension, ALLOWED_FILE_TYPES)) {
        return ['error' => 'File type not allowed. Allowed types: ' . implode(', ', ALLOWED_FILE_TYPES)];
    }

    // Create upload directory if it doesn't exist
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    // Generate unique filename
    $newFileName = uniqid() . '_' . time() . '.' . $fileExtension;
    $uploadPath = $uploadDir . $newFileName;

    // Move uploaded file
    if (move_uploaded_file($fileTmpName, $uploadPath)) {
        return [
            'success' => true,
            'fileName' => $fileName,
            'newFileName' => $newFileName,
            'filePath' => $uploadPath,
            'fileSize' => $fileSize,
            'fileType' => $fileType
        ];
    }

    return ['error' => 'Failed to upload file'];
}

// Initialize database connection test
if (isset($_GET['test_db'])) {
    $db = new Database();
    $db->testConnection();
}
?>