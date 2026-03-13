<?php
// Include CORS headers
include_once 'cors_headers.php';

try {
    // Mock unread count - replace with actual database query
    $unreadCount = 1; // Number of issues with admin_read = 0

    // Return success response
    echo json_encode([
        'status' => 'success',
        'message' => 'Unread count fetched successfully',
        'count' => $unreadCount
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to fetch unread count: ' . $e->getMessage()
    ]);
}
?>