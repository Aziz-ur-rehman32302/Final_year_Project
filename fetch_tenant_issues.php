<?php
// Include CORS headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    // Get Authorization header
    $headers = getallheaders();
    $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
    
    if (empty($authHeader) || !preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode([
            'status' => 'error',
            'message' => 'Authorization token required'
        ]);
        exit();
    }
    
    $token = $matches[1];
    
    // Mock tenant issues data with the exact structure specified in requirements
    $mockTenantIssues = [
        [
            'id' => 1,
            'tenant_name' => 'Aslam Ali',
            'issue_description' => 'The air conditioning unit in my shop is not working properly. It\'s making strange noises and not cooling effectively.',
            'issue_status' => 'pending',
            'admin_response' => null,
            'created_at' => '2024-01-15 10:30:00'
        ],
        [
            'id' => 2,
            'tenant_name' => 'Aslam Ali',
            'issue_description' => 'Water leakage from the ceiling near the entrance. This is causing damage to my inventory.',
            'issue_status' => 'resolved',
            'admin_response' => 'We have fixed the pipe leak and cleaned up the water damage. The ceiling has been repaired and painted. Please let us know if you notice any further issues.',
            'created_at' => '2024-01-10 14:20:00'
        ],
        [
            'id' => 3,
            'tenant_name' => 'Sarah Johnson',
            'issue_description' => 'Electrical outlet near the counter is not working. I need it for my cash register.',
            'issue_status' => 'resolved',
            'admin_response' => 'Our electrician has replaced the faulty outlet. The new outlet is now working properly and has been tested. Please check and confirm it meets your needs.',
            'created_at' => '2024-01-12 09:15:00'
        ],
        [
            'id' => 4,
            'tenant_name' => 'Aslam Ali',
            'issue_description' => 'The front door lock is loose and doesn\'t secure properly. This is a security concern.',
            'issue_status' => 'resolved',
            'admin_response' => 'Lock has been replaced with a new high-security lock. Keys have been provided. Please test and confirm it\'s working properly.',
            'created_at' => '2024-01-08 16:45:00'
        ],
        [
            'id' => 5,
            'tenant_name' => 'Aslam Ali',
            'issue_description' => 'Parking space lighting is not working. It\'s difficult to see at night.',
            'issue_status' => 'pending',
            'admin_response' => null,
            'created_at' => '2024-01-16 08:30:00'
        ]
    ];

    // Return the response in the exact format specified in requirements
    echo json_encode([
        'status' => 'success',
        'issues' => $mockTenantIssues
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to fetch tenant issues: ' . $e->getMessage()
    ]);
}

/*
// Example with real database query:
try {
    // Decode JWT token to get tenant ID
    $payload = json_decode(base64_decode(str_replace('_', '/', str_replace('-', '+', explode('.', $token)[1]))), true);
    $tenantId = $payload['user_id'] ?? $payload['tenant_id'] ?? null;
    
    if (!$tenantId) {
        throw new Exception('Invalid token: tenant ID not found');
    }
    
    $pdo = new PDO("mysql:host=localhost;dbname=plaza_db", $username, $password);
    
    $stmt = $pdo->prepare("
        SELECT 
            id,
            issue_description,
            issue_status,
            issue_status as status,
            admin_response,
            admin_response as response,
            created_at,
            updated_at
        FROM tenant_issues 
        WHERE tenant_id = ? 
        ORDER BY created_at DESC
    ");
    
    $stmt->execute([$tenantId]);
    $issues = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'status' => 'success',
        'data' => $issues
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
*/
?>