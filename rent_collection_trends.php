<?php
// Include CORS headers
include_once 'cors_headers.php';

try {
    // Mock rent collection trends data - replace with actual database queries
    $mockTrendsData = [
        [
            'month' => 'Jan',
            'collected' => 85000,
            'expected' => 100000
        ],
        [
            'month' => 'Feb', 
            'collected' => 92000,
            'expected' => 100000
        ],
        [
            'month' => 'Mar',
            'collected' => 78000,
            'expected' => 100000
        ],
        [
            'month' => 'Apr',
            'collected' => 98000,
            'expected' => 100000
        ],
        [
            'month' => 'May',
            'collected' => 89000,
            'expected' => 100000
        ],
        [
            'month' => 'Jun',
            'collected' => 100000,
            'expected' => 100000
        ],
        [
            'month' => 'Jul',
            'collected' => 95000,
            'expected' => 100000
        ],
        [
            'month' => 'Aug',
            'collected' => 87000,
            'expected' => 100000
        ],
        [
            'month' => 'Sep',
            'collected' => 93000,
            'expected' => 100000
        ],
        [
            'month' => 'Oct',
            'collected' => 99000,
            'expected' => 100000
        ],
        [
            'month' => 'Nov',
            'collected' => 88000,
            'expected' => 100000
        ],
        [
            'month' => 'Dec',
            'collected' => 96000,
            'expected' => 100000
        ]
    ];

    // Return success response
    echo json_encode([
        'status' => 'success',
        'message' => 'Rent collection trends fetched successfully',
        'data' => $mockTrendsData
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to fetch rent collection trends: ' . $e->getMessage()
    ]);
}

/*
// Example with real database query:
try {
    $pdo = new PDO("mysql:host=localhost;dbname=plaza_db", $username, $password);
    
    $stmt = $pdo->prepare("
        SELECT 
            MONTHNAME(payment_date) as month,
            SUM(amount_paid) as collected,
            SUM(rent_amount) as expected
        FROM rent_payments 
        WHERE YEAR(payment_date) = YEAR(CURDATE())
        GROUP BY MONTH(payment_date)
        ORDER BY MONTH(payment_date)
    ");
    
    $stmt->execute();
    $trendsData = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'status' => 'success',
        'data' => $trendsData
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
*/
?>