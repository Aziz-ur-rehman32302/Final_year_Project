<?php
// Include CORS headers
include_once 'cors_headers.php';

try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception('Invalid JSON input');
    }
    
    // Validate required fields
    if (!isset($input['issue_id'])) {
        throw new Exception('Missing required field: issue_id');
    }
    
    $issueId = $input['issue_id'];
    
    // Mock resolution - replace with actual database update
    // UPDATE issues SET issue_status = 'resolved', admin_read = 1 WHERE id = ?
    
    // Return success response
    echo json_encode([
        'status' => 'success',
        'message' => 'Issue resolved successfully',
        'data' => [
            'issue_id' => $issueId,
            'status' => 'resolved',
            'resolved_at' => date('Y-m-d H:i:s')
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>