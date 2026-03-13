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
    // Mock payment status data - replace with actual database queries
    $mockPaymentData = [
        'paid_percentage' => 75,
        'unpaid_percentage' => 25,
        'total_tenants' => 100,
        'paid_tenants' => 75,
        'unpaid_tenants' => 25
    ];

    // Return success response
    echo json_encode([
        'status' => 'success',
        'message' => 'Payment status overview fetched successfully',
        'data' => $mockPaymentData
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to fetch payment status overview: ' . $e->getMessage()
    ]);
}

/*
// Example with real database query:
try {
    $pdo = new PDO("mysql:host=localhost;dbname=plaza_db", $username, $password);
    
    // Get total tenant count
    $totalStmt = $pdo->prepare("SELECT COUNT(*) as total FROM tenants WHERE status = 'active'");
    $totalStmt->execute();
    $totalTenants = $totalStmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    // Get paid tenant count (assuming current month)
    $paidStmt = $pdo->prepare("
        SELECT COUNT(DISTINCT tenant_id) as paid_count 
        FROM rent_payments 
        WHERE MONTH(payment_date) = MONTH(CURDATE()) 
        AND YEAR(payment_date) = YEAR(CURDATE())
        AND payment_status = 'paid'
    ");
    $paidStmt->execute();
    $paidTenants = $paidStmt->fetch(PDO::FETCH_ASSOC)['paid_count'];
    
    $unpaidTenants = $totalTenants - $paidTenants;
    
    // Calculate percentages
    $paidPercentage = $totalTenants > 0 ? round(($paidTenants / $totalTenants) * 100) : 0;
    $unpaidPercentage = $totalTenants > 0 ? round(($unpaidTenants / $totalTenants) * 100) : 0;
    
    $paymentData = [
        'paid_percentage' => $paidPercentage,
        'unpaid_percentage' => $unpaidPercentage,
        'total_tenants' => $totalTenants,
        'paid_tenants' => $paidTenants,
        'unpaid_tenants' => $unpaidTenants
    ];
    
    echo json_encode([
        'status' => 'success',
        'data' => $paymentData
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
*/
?>