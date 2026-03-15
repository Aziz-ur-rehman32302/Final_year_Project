<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS headers - MUST be set before any output
// Allow multiple origins for development
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
    header('Access-Control-Allow-Origin: http://localhost:5174'); // Default to current port
}

header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true'); // CRITICAL for sessions/cookies
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Start session BEFORE any output
session_start();

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "plaza_management_system";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Get tenant_id from multiple sources (in order of priority)
    $tenant_id = null;
    
    // 1. Check session first
    if (isset($_SESSION['tenant_id']) && !empty($_SESSION['tenant_id'])) {
        $tenant_id = $_SESSION['tenant_id'];
    }
    // 2. Check URL parameter (for testing)
    elseif (isset($_GET['tenant_id']) && !empty($_GET['tenant_id'])) {
        $tenant_id = $_GET['tenant_id'];
        // Store in session for future requests
        $_SESSION['tenant_id'] = $tenant_id;
    }
    // 3. Check Authorization header (Bearer token)
    elseif (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $auth_header = $_SERVER['HTTP_AUTHORIZATION'];
        if (preg_match('/Bearer\s+(.*)$/i', $auth_header, $matches)) {
            $token = $matches[1];
            // For demo: extract tenant_id from token or decode JWT
            // You can implement JWT decoding here
            $tenant_id = 'T-001'; // Default for demo
            $_SESSION['tenant_id'] = $tenant_id;
        }
    }
    // 4. Default for testing (remove in production)
    else {
        $tenant_id = 'T-001';
        $_SESSION['tenant_id'] = $tenant_id;
    }
    
    // Validate tenant_id
    if (!$tenant_id) {
        http_response_code(401);
        echo json_encode([
            'status' => 'error',
            'message' => 'Unauthorized: No tenant session found',
            'debug' => [
                'session_data' => $_SESSION,
                'get_data' => $_GET,
                'origin' => $origin
            ]
        ]);
        exit();
    }
    
    // Create sample data if table doesn't exist or is empty
    $sample_data = [
        [
            'id' => 'N-001',
            'tenant_id' => 'T-001',
            'type' => 'reminder',
            'title' => 'Rent Due Reminder',
            'message' => 'Your December rent of $2,500 is due on December 5, 2025. Please ensure timely payment.',
            'channel' => 'Email',
            'status' => 'sent',
            'sent_date' => '2025-12-02 09:00:00',
            'read_status' => 0
        ],
        [
            'id' => 'N-002',
            'tenant_id' => 'T-001',
            'type' => 'payment',
            'title' => 'Payment Confirmed',
            'message' => 'Your November rent payment of $2,500 has been received and confirmed.',
            'channel' => 'SMS',
            'status' => 'sent',
            'sent_date' => '2025-11-05 14:30:00',
            'read_status' => 1
        ],
        [
            'id' => 'N-003',
            'tenant_id' => 'T-001',
            'type' => 'overdue',
            'title' => 'Overdue Payment Alert',
            'message' => 'Your October rent payment is overdue. Please make payment immediately to avoid penalties.',
            'channel' => 'Email',
            'status' => 'sent',
            'sent_date' => '2025-10-10 10:00:00',
            'read_status' => 0
        ]
    ];
    
    // Try to fetch from database first
    try {
        $sql = "SELECT 
                    id,
                    type,
                    COALESCE(title, CONCAT(UPPER(SUBSTRING(type, 1, 1)), SUBSTRING(type, 2), ' Notification')) as title,
                    message,
                    COALESCE(channel, 'Email') as channel,
                    CASE 
                        WHEN read_status = 1 THEN 'Read'
                        WHEN status = 'failed' THEN 'Failed'
                        ELSE 'Sent'
                    END as status,
                    DATE_FORMAT(sent_date, '%Y-%m-%d %h:%i %p') as sentDate,
                    read_status
                FROM notification_logs 
                WHERE tenant_id = :tenant_id 
                AND type IN ('reminder', 'overdue', 'payment')
                AND (is_deleted = 0 OR is_deleted IS NULL)
                ORDER BY sent_date DESC, id DESC
                LIMIT 50";
        
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':tenant_id', $tenant_id, PDO::PARAM_STR);
        $stmt->execute();
        
        $notifications = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $notifications[] = [
                'id' => $row['id'],
                'type' => $row['type'],
                'title' => $row['title'],
                'message' => $row['message'],
                'channel' => $row['channel'],
                'status' => $row['status'],
                'sentDate' => $row['sentDate']
            ];
        }
        
        // If no data found in database, use sample data
        if (empty($notifications)) {
            $notifications = [];
            foreach ($sample_data as $sample) {
                if ($sample['tenant_id'] === $tenant_id) {
                    $status = 'Sent';
                    if ($sample['read_status'] == 1) {
                        $status = 'Read';
                    } elseif ($sample['status'] == 'failed') {
                        $status = 'Failed';
                    }
                    
                    $notifications[] = [
                        'id' => $sample['id'],
                        'type' => $sample['type'],
                        'recipient' => 'John Smith (T-001)',
                        'message' => $sample['message'],
                        'channel' => $sample['channel'],
                        'status' => $status,
                        'sentDate' => date('Y-m-d h:i A', strtotime($sample['sent_date']))
                    ];
                }
            }
        }
        
    } catch (PDOException $db_error) {
        // If database query fails, use sample data
        $notifications = [];
        foreach ($sample_data as $sample) {
            if ($sample['tenant_id'] === $tenant_id) {
                $status = 'Sent';
                if ($sample['read_status'] == 1) {
                    $status = 'Read';
                } elseif ($sample['status'] == 'failed') {
                    $status = 'Failed';
                }
                
                $notifications[] = [
                    'id' => $sample['id'],
                    'type' => $sample['type'],
                    'recipient' => 'John Smith (T-001)',
                    'message' => $sample['message'],
                    'channel' => $sample['channel'],
                    'status' => $status,
                    'sentDate' => date('Y-m-d h:i A', strtotime($sample['sent_date']))
                ];
            }
        }
    }
    
    // Calculate statistics
    $total = count($notifications);
    $sent = 0;
    $failed = 0;
    
    foreach ($notifications as $notification) {
        if ($notification['status'] === 'Sent' || $notification['status'] === 'Read') {
            $sent++;
        } elseif ($notification['status'] === 'Failed') {
            $failed++;
        }
    }
    
    // Return success response with statistics
    echo json_encode([
        'status' => 'success',
        'total' => $total,
        'sent' => $sent,
        'failed' => $failed,
        'logs' => $notifications,
        'tenant_id' => $tenant_id,
        'session_id' => session_id(),
        'origin' => $origin
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}

$conn = null;
?>