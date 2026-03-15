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

// Sample tenant data
$tenant_data = [
    'T-001' => [
        'name' => 'John Smith',
        'notifications' => [
            [
                'id' => 'TN-001',
                'type' => 'reminder',
                'title' => 'Rent Due Reminder',
                'message' => 'Your December rent of $2,500 is due on December 15, 2025. Please ensure timely payment to avoid late fees.',
                'timestamp' => '2025-12-10 09:00:00',
                'read' => false,
                'priority' => 'medium'
            ],
            [
                'id' => 'TN-002',
                'type' => 'payment',
                'title' => 'Payment Confirmed',
                'message' => 'Your November rent payment of $2,500 has been received and confirmed. Thank you!',
                'timestamp' => '2025-11-05 14:30:00',
                'read' => true,
                'priority' => 'low'
            ],
            [
                'id' => 'TN-003',
                'type' => 'announcement',
                'title' => 'Scheduled Maintenance',
                'message' => 'Building maintenance is scheduled for December 20, 2025 from 9:00 AM to 12:00 PM. Water supply may be temporarily interrupted.',
                'timestamp' => '2025-12-08 16:45:00',
                'read' => false,
                'priority' => 'high'
            ],
            [
                'id' => 'TN-004',
                'type' => 'announcement',
                'title' => 'Holiday Notice',
                'message' => 'The management office will be closed on December 25th and January 1st. Emergency contact: +1-555-0199',
                'timestamp' => '2025-12-01 10:00:00',
                'read' => true,
                'priority' => 'low'
            ]
        ]
    ],
    'T-002' => [
        'name' => 'Sarah Johnson',
        'notifications' => [
            [
                'id' => 'TN-005',
                'type' => 'overdue',
                'title' => 'Overdue Payment Alert',
                'message' => 'Your November rent payment is overdue. Please make payment immediately to avoid additional penalties.',
                'timestamp' => '2025-12-05 11:30:00',
                'read' => false,
                'priority' => 'high'
            ],
            [
                'id' => 'TN-006',
                'type' => 'reminder',
                'title' => 'Lease Renewal Notice',
                'message' => 'Your lease expires on March 31, 2026. Please contact the office to discuss renewal options.',
                'timestamp' => '2025-12-03 15:20:00',
                'read' => false,
                'priority' => 'medium'
            ],
            [
                'id' => 'TN-007',
                'type' => 'announcement',
                'title' => 'New Parking Rules',
                'message' => 'New parking regulations will take effect January 1st, 2026. Please review the updated guidelines.',
                'timestamp' => '2025-12-01 14:00:00',
                'read' => true,
                'priority' => 'low'
            ]
        ]
    ]
];

// Get notifications for the specific tenant
if (isset($tenant_data[$tenant_id])) {
    $tenant_info = $tenant_data[$tenant_id];
    $notifications = $tenant_info['notifications'];
    
    // Calculate counts
    $total_count = count($notifications);
    $unread_count = 0;
    
    foreach ($notifications as $notification) {
        if (!$notification['read']) {
            $unread_count++;
        }
    }
    
    echo json_encode([
        'status' => 'success',
        'tenant_id' => $tenant_id,
        'tenant_name' => $tenant_info['name'],
        'notifications' => array_map(function($notification) {
            return [
                'id' => $notification['id'],
                'type' => $notification['type'],
                'title' => $notification['title'],
                'message' => $notification['message'],
                'timestamp' => $notification['timestamp'],
                'read_status' => $notification['read'],
                'priority' => $notification['priority']
            ];
        }, $notifications),
        'unread_count' => $unread_count,
        'total_count' => $total_count
    ]);
} else {
    // Tenant not found, return empty notifications
    echo json_encode([
        'status' => 'success',
        'tenant_id' => $tenant_id,
        'tenant_name' => 'Unknown Tenant',
        'notifications' => [],
        'unread_count' => 0,
        'total_count' => 0
    ]);
}
?>