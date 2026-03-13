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
    // Mock recent activity data - replace with actual database queries
    $mockActivities = [
        [
            'id' => 1,
            'action' => 'Tenant T-101 paid rent for December',
            'time' => '2 hours ago',
            'type' => 'payment'
        ],
        [
            'id' => 2,
            'action' => 'New tenant registered: Shop S-205',
            'time' => '5 hours ago',
            'type' => 'registration'
        ],
        [
            'id' => 3,
            'action' => 'Rent reminder sent to 5 tenants',
            'time' => '1 day ago',
            'type' => 'notification'
        ],
        [
            'id' => 4,
            'action' => 'Tenant T-089 payment overdue',
            'time' => '2 days ago',
            'type' => 'alert'
        ],
        [
            'id' => 5,
            'action' => 'Monthly report generated',
            'time' => '3 days ago',
            'type' => 'report'
        ],
        [
            'id' => 6,
            'action' => 'Tenant T-043 updated contact info',
            'time' => '4 days ago',
            'type' => 'update'
        ],
        [
            'id' => 7,
            'action' => 'Tenant T-067 submitted maintenance request',
            'time' => '1 week ago',
            'type' => 'alert'
        ],
        [
            'id' => 8,
            'action' => 'Rent collection completed for November',
            'time' => '2 weeks ago',
            'type' => 'payment'
        ]
    ];

    // Return success response
    echo json_encode([
        'status' => 'success',
        'message' => 'Recent activities fetched successfully',
        'activities' => $mockActivities
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to fetch recent activities: ' . $e->getMessage()
    ]);
}

/*
// Example with real database query:
try {
    $pdo = new PDO("mysql:host=localhost;dbname=plaza_db", $username, $password);
    
    $stmt = $pdo->prepare("
        SELECT 
            id,
            action_description as action,
            CASE 
                WHEN TIMESTAMPDIFF(HOUR, created_at, NOW()) < 1 THEN 'Just now'
                WHEN TIMESTAMPDIFF(HOUR, created_at, NOW()) < 24 THEN CONCAT(TIMESTAMPDIFF(HOUR, created_at, NOW()), ' hours ago')
                WHEN TIMESTAMPDIFF(DAY, created_at, NOW()) < 7 THEN CONCAT(TIMESTAMPDIFF(DAY, created_at, NOW()), ' days ago')
                ELSE CONCAT(TIMESTAMPDIFF(WEEK, created_at, NOW()), ' weeks ago')
            END as time,
            activity_type as type
        FROM recent_activities 
        ORDER BY created_at DESC 
        LIMIT 20
    ");
    
    $stmt->execute();
    $activities = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'status' => 'success',
        'activities' => $activities
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
*/
?>