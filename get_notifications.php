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

// Get tenant ID from Authorization header
$tenant_id = null;
$headers = getallheaders();

if (isset($headers['Authorization'])) {
    $auth_header = $headers['Authorization'];
    if (preg_match('/Bearer\s+(.*)$/i', $auth_header, $matches)) {
        $token = $matches[1];
        // For demo purposes, extract tenant ID from token or use default
        // In production, decode JWT token to get tenant ID
        $tenant_id = 'T-001'; // Default for demo
    }
}

if (!$tenant_id) {
    http_response_code(401);
    echo json_encode([
        'status' => 'error',
        'message' => 'Unauthorized: No valid token found'
    ]);
    exit();
}

// Sample notifications data for different tenants
$tenant_notifications = [
    'T-001' => [
        [
            'notification_id' => 1,
            'message' => 'Rent due in 3 days - Your December rent of $2,500 is due on December 15, 2025.',
            'timestamp' => '2025-12-10 09:00:00',
            'status' => 'unread',
            'type' => 'reminder'
        ],
        [
            'notification_id' => 2,
            'message' => 'Payment received - Your November rent payment has been confirmed.',
            'timestamp' => '2025-11-05 14:30:00',
            'status' => 'read',
            'type' => 'payment'
        ],
        [
            'notification_id' => 3,
            'message' => 'Building maintenance scheduled for December 20, 2025 from 9:00 AM to 12:00 PM.',
            'timestamp' => '2025-12-08 16:45:00',
            'status' => 'unread',
            'type' => 'announcement'
        ],
        [
            'notification_id' => 4,
            'message' => 'Office closed on December 25th and January 1st. Emergency contact: +1-555-0199.',
            'timestamp' => '2025-12-01 10:00:00',
            'status' => 'read',
            'type' => 'announcement'
        ]
    ],
    'T-002' => [
        [
            'notification_id' => 5,
            'message' => 'Overdue payment alert - Your November rent is overdue. Please pay immediately.',
            'timestamp' => '2025-12-05 11:30:00',
            'status' => 'unread',
            'type' => 'overdue'
        ],
        [
            'notification_id' => 6,
            'message' => 'Lease renewal notice - Your lease expires on March 31, 2026.',
            'timestamp' => '2025-12-03 15:20:00',
            'status' => 'unread',
            'type' => 'reminder'
        ]
    ]
];

// Get notifications for the specific tenant
$notifications = $tenant_notifications[$tenant_id] ?? [];

// Calculate counts
$total = count($notifications);
$unread = count(array_filter($notifications, function($n) { return $n['status'] === 'unread'; }));
$read = count(array_filter($notifications, function($n) { return $n['status'] === 'read'; }));

// Return tenant-specific notifications in expected format
echo json_encode([
    'tenant_id' => $tenant_id,
    'notifications' => $notifications,
    'counts' => [
        'total' => $total,
        'unread' => $unread,
        'read' => $read
    ]
]);
?>