<?php
// Include CORS headers
include_once 'cors_headers.php';

try {
    // Mock data for testing - replace with actual database queries
    $mockIssues = [
        [
            'id' => 1,
            'tenant_id' => 'T-101',
            'tenant_name' => 'John Doe',
            'shop_number' => 'S-205',
            'phone_number' => '+923001234567',
            'issue_description' => 'Water leakage in the shop ceiling',
            'issue_status' => 'pending',
            'admin_read' => 0,
            'created_at' => date('Y-m-d H:i:s', strtotime('-2 hours'))
        ],
        [
            'id' => 2,
            'tenant_id' => 'T-089',
            'tenant_name' => 'Sarah Khan',
            'shop_number' => 'S-150',
            'phone_number' => '+923009876543',
            'issue_description' => 'Electrical problem - lights not working',
            'issue_status' => 'pending',
            'admin_read' => 1,
            'created_at' => date('Y-m-d H:i:s', strtotime('-1 day'))
        ],
        [
            'id' => 3,
            'tenant_id' => 'T-043',
            'tenant_name' => 'Ahmed Ali',
            'shop_number' => 'S-301',
            'phone_number' => '+923005555555',
            'issue_description' => 'Door lock is broken, need replacement',
            'issue_status' => 'resolved',
            'admin_read' => 1,
            'created_at' => date('Y-m-d H:i:s', strtotime('-3 days'))
        ]
    ];

    // Return success response
    echo json_encode([
        'status' => 'success',
        'message' => 'Issues fetched successfully',
        'data' => $mockIssues
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to fetch issues: ' . $e->getMessage()
    ]);
}
?>