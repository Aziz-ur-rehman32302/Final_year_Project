<?php
// Enable CORS
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        "status" => "error",
        "message" => "Method not allowed. Use POST request."
    ]);
    exit();
}

// Check for Authorization header
$headers = getallheaders();
$authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';

if (empty($authHeader) || !preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
    http_response_code(401);
    echo json_encode([
        "status" => "error",
        "message" => "Authorization token required"
    ]);
    exit();
}

$token = $matches[1];

// Validate admin authentication
// In a real application, you would validate the token and check if user is admin
// For demo purposes, we'll assume token validation passes and user is admin
$isAdmin = true; // This should be determined by token validation

if (!$isAdmin) {
    http_response_code(401);
    echo json_encode([
        "status" => "error",
        "message" => "Admin access required"
    ]);
    exit();
}

// Get POST data
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Invalid JSON input"
    ]);
    exit();
}

// Validate required fields
$issue_id = isset($input['issue_id']) ? intval($input['issue_id']) : 0;
$admin_response = isset($input['admin_response']) ? trim($input['admin_response']) : '';

if ($issue_id <= 0) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Valid issue_id is required"
    ]);
    exit();
}

if (empty($admin_response)) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Admin response cannot be empty"
    ]);
    exit();
}

try {
    // For demo purposes, we'll simulate database operations
    // In a real application, you would connect to your database
    
    /*
    // Real database connection example:
    $pdo = new PDO("mysql:host=localhost;dbname=plaza_management", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Check if issue exists
    $checkStmt = $pdo->prepare("SELECT id FROM tenant_issues WHERE id = ?");
    $checkStmt->execute([$issue_id]);
    
    if (!$checkStmt->fetch()) {
        http_response_code(404);
        echo json_encode([
            "status" => "error",
            "message" => "Issue not found"
        ]);
        exit();
    }
    
    // Update the issue with admin response and mark as resolved
    $updateStmt = $pdo->prepare("
        UPDATE tenant_issues 
        SET admin_response = ?, 
            issue_status = 'resolved',
            updated_at = NOW()
        WHERE id = ?
    ");
    
    $updateStmt->execute([$admin_response, $issue_id]);
    
    if ($updateStmt->rowCount() === 0) {
        throw new Exception("Failed to update issue");
    }
    */
    
    // Mock validation - check if issue_id exists in our mock data
    $mockIssues = [1, 2, 3, 4]; // Mock existing issue IDs
    
    if (!in_array($issue_id, $mockIssues)) {
        http_response_code(404);
        echo json_encode([
            "status" => "error",
            "message" => "Issue not found"
        ]);
        exit();
    }
    
    // Simulate successful database update
    // In real implementation, this would update the database
    
    // Return success response
    echo json_encode([
        "status" => "success",
        "message" => "Admin response saved successfully",
        "issue_id" => $issue_id,
        "admin_response" => $admin_response,
        "updated_at" => date('Y-m-d H:i:s')
    ], JSON_PRETTY_PRINT);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Internal server error: " . $e->getMessage()
    ]);
}

/*
// Complete real database implementation example:

try {
    // Database connection
    $host = 'localhost';
    $dbname = 'plaza_management';
    $username = 'your_db_username';
    $password = 'your_db_password';
    
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Begin transaction
    $pdo->beginTransaction();
    
    // Check if issue exists and get current status
    $checkStmt = $pdo->prepare("
        SELECT id, issue_status, tenant_id 
        FROM tenant_issues 
        WHERE id = ?
    ");
    $checkStmt->execute([$issue_id]);
    $issue = $checkStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$issue) {
        $pdo->rollBack();
        http_response_code(404);
        echo json_encode([
            "status" => "error",
            "message" => "Issue not found"
        ]);
        exit();
    }
    
    // Update the issue with admin response and mark as resolved
    $updateStmt = $pdo->prepare("
        UPDATE tenant_issues 
        SET admin_response = ?, 
            issue_status = 'resolved',
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    ");
    
    $result = $updateStmt->execute([$admin_response, $issue_id]);
    
    if (!$result || $updateStmt->rowCount() === 0) {
        $pdo->rollBack();
        throw new Exception("Failed to update issue");
    }
    
    // Log admin action (optional)
    $logStmt = $pdo->prepare("
        INSERT INTO admin_actions (admin_id, action_type, issue_id, description, created_at)
        VALUES (?, 'issue_response', ?, ?, CURRENT_TIMESTAMP)
    ");
    $logStmt->execute([
        $admin_id, // Get from token validation
        $issue_id,
        "Responded to tenant issue #$issue_id"
    ]);
    
    // Commit transaction
    $pdo->commit();
    
    // Return success response
    echo json_encode([
        "status" => "success",
        "message" => "Admin response saved successfully",
        "issue_id" => $issue_id,
        "admin_response" => $admin_response,
        "updated_at" => date('Y-m-d H:i:s')
    ], JSON_PRETTY_PRINT);
    
} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Database error: " . $e->getMessage()
    ]);
    
} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Internal server error: " . $e->getMessage()
    ]);
}
*/
?>