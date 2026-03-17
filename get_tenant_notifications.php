<?php
// CORS headers
$allowed_origins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins)) {
    header('Access-Control-Allow-Origin: ' . $origin);
} else {
    header('Access-Control-Allow-Origin: http://localhost:5173');
}

header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Start session for tenant authentication
session_start();

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "plaza_management_system";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
    exit();
}

// Handle both GET and POST methods
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get tenant ID from POST body
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['tenant_id'])) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Tenant ID is required in request body'
        ]);
        exit();
    }
    
    $tenant_id = $input['tenant_id'];
} else {
    // Fallback to session/GET method
    // 1. Check session first
    if (isset($_SESSION['tenant_id']) && !empty($_SESSION['tenant_id'])) {
        $tenant_id = $_SESSION['tenant_id'];
    }
    // 2. Check URL parameter (for testing)
    elseif (isset($_GET['tenant_id']) && !empty($_GET['tenant_id'])) {
        $tenant_id = $_GET['tenant_id'];
        $_SESSION['tenant_id'] = $tenant_id;
    }
    // 3. Default for demo (remove in production)
    else {
        $tenant_id = 'T-001';
        $_SESSION['tenant_id'] = $tenant_id;
    }
}

if (!$tenant_id) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Tenant ID is required'
    ]);
    exit();
}

try {
    // Determine tenant name 
    $tenant_name = "Tenant " . $tenant_id;
    
    // Get notifications from database
    $sql = "SELECT id, type, title, message, sent_date as timestamp, read_status, 'medium' as priority 
            FROM notification_logs 
            WHERE tenant_id = :tenant_id AND (is_deleted = 0 OR is_deleted IS NULL)
            ORDER BY sent_date DESC";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':tenant_id', $tenant_id);
    $stmt->execute();
    
    $notifications = [];
    $unread_count = 0;
    
    while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $is_read = (bool)$row['read_status'];
        if (!$is_read) $unread_count++;
        
        $notifications[] = [
            'id' => $row['id'],
            'type' => $row['type'],
            'title' => $row['title'] ?: ucfirst($row['type']) . ' Notification',
            'message' => $row['message'],
            'timestamp' => $row['timestamp'],
            'read' => $is_read,
            'read_status' => $is_read,
            'priority' => $row['priority'] ?: 'medium'
        ];
    }
    
    echo json_encode([
        'status' => 'success',
        'tenant_id' => $tenant_id,
        'tenant_name' => $tenant_name,
        'notifications' => $notifications,
        'unread_count' => $unread_count,
        'total_count' => count($notifications)
    ]);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>