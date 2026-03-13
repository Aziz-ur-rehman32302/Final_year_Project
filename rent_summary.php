<?php
// Enable CORS
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        "status" => "error",
        "message" => "Method not allowed. Use GET request."
    ]);
    exit();
}

try {
    // Mock rent summary data matching the expected response format
    $rentSummary = [
        "TotalAmount" => 185997,      // Total rent due from all tenants
        "totalPaidAmount" => 59997,   // Total amount paid this month
        "totalUnPaidAmount" => 126000 // Total unpaid amount
    ];
    
    // Return success response in exact format expected by frontend
    echo json_encode([
        "status" => "success",
        "TotalAmount" => $rentSummary["TotalAmount"],
        "totalPaidAmount" => $rentSummary["totalPaidAmount"],
        "totalUnPaidAmount" => $rentSummary["totalUnPaidAmount"]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Internal server error:" . $e->getMessage()
    ]);
}

?>