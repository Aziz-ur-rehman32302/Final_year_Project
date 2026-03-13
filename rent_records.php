<?php
// CORS headers for localhost:5173 (Vite development server)
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    // Sample rent records data
    $rentRecords = [
        [
            'id' => '1',
            'tenantId' => 'T-101',
            'tenantName' => 'John Smith',
            'shopNumber' => 'S-101',
            'rentMonth' => 'December 2025',
            'dueAmount' => 2500,
            'paymentStatus' => 'Paid',
            'dueDate' => '2025-12-05',
            'paidDate' => '2025-12-03'
        ],
        [
            'id' => '2',
            'tenantId' => 'T-102',
            'tenantName' => 'Sarah Johnson',
            'shopNumber' => 'S-102',
            'rentMonth' => 'December 2025',
            'dueAmount' => 3000,
            'paymentStatus' => 'Unpaid',
            'dueDate' => '2025-12-05',
            'paidDate' => null
        ],
        [
            'id' => '3',
            'tenantId' => 'T-103',
            'tenantName' => 'Michael Brown',
            'shopNumber' => 'S-201',
            'rentMonth' => 'December 2025',
            'dueAmount' => 2800,
            'paymentStatus' => 'Overdue',
            'dueDate' => '2025-12-05',
            'paidDate' => null
        ],
        [
            'id' => '4',
            'tenantId' => 'T-104',
            'tenantName' => 'Emily Davis',
            'shopNumber' => 'S-202',
            'rentMonth' => 'December 2025',
            'dueAmount' => 2500,
            'paymentStatus' => 'Paid',
            'dueDate' => '2025-12-05',
            'paidDate' => '2025-12-04'
        ],
        [
            'id' => '5',
            'tenantId' => 'T-105',
            'tenantName' => 'David Wilson',
            'shopNumber' => 'S-203',
            'rentMonth' => 'December 2025',
            'dueAmount' => 3200,
            'paymentStatus' => 'Unpaid',
            'dueDate' => '2025-12-05',
            'paidDate' => null
        ],
        [
            'id' => '6',
            'tenantId' => 'T-106',
            'tenantName' => 'Lisa Martinez',
            'shopNumber' => 'S-301',
            'rentMonth' => 'December 2025',
            'dueAmount' => 2700,
            'paymentStatus' => 'Paid',
            'dueDate' => '2025-12-05',
            'paidDate' => '2025-12-02'
        ],
        [
            'id' => '7',
            'tenantId' => 'T-107',
            'tenantName' => 'James Garcia',
            'shopNumber' => 'S-302',
            'rentMonth' => 'November 2025',
            'dueAmount' => 2900,
            'paymentStatus' => 'Overdue',
            'dueDate' => '2025-12-05',
            'paidDate' => null
        ],
        [
            'id' => '8',
            'tenantId' => 'T-108',
            'tenantName' => 'Jennifer Taylor',
            'shopNumber' => 'S-303',
            'rentMonth' => 'December 2025',
            'dueAmount' => 2600,
            'paymentStatus' => 'Unpaid',
            'dueDate' => '2025-12-05',
            'paidDate' => null
        ],
        [
            'id' => '9',
            'tenantId' => 'T-109',
            'tenantName' => 'Robert Anderson',
            'shopNumber' => 'S-304',
            'rentMonth' => 'December 2025',
            'dueAmount' => 2750,
            'paymentStatus' => 'Paid',
            'dueDate' => '2025-12-05',
            'paidDate' => '2025-12-01'
        ],
        [
            'id' => '10',
            'tenantId' => 'T-110',
            'tenantName' => 'Maria Rodriguez',
            'shopNumber' => 'S-305',
            'rentMonth' => 'December 2025',
            'dueAmount' => 3100,
            'paymentStatus' => 'Unpaid',
            'dueDate' => '2025-12-05',
            'paidDate' => null
        ],
        [
            'id' => '11',
            'tenantId' => 'T-111',
            'tenantName' => 'Christopher Lee',
            'shopNumber' => 'S-401',
            'rentMonth' => 'December 2025',
            'dueAmount' => 2850,
            'paymentStatus' => 'Overdue',
            'dueDate' => '2025-12-05',
            'paidDate' => null
        ],
        [
            'id' => '12',
            'tenantId' => 'T-112',
            'tenantName' => 'Amanda White',
            'shopNumber' => 'S-402',
            'rentMonth' => 'December 2025',
            'dueAmount' => 2950,
            'paymentStatus' => 'Paid',
            'dueDate' => '2025-12-05',
            'paidDate' => '2025-12-03'
        ],
        [
            'id' => '13',
            'tenantId' => 'T-113',
            'tenantName' => 'Daniel Thompson',
            'shopNumber' => 'S-403',
            'rentMonth' => 'November 2025',
            'dueAmount' => 3050,
            'paymentStatus' => 'Unpaid',
            'dueDate' => '2025-12-05',
            'paidDate' => null
        ],
        [
            'id' => '14',
            'tenantId' => 'T-114',
            'tenantName' => 'Jessica Miller',
            'shopNumber' => 'S-404',
            'rentMonth' => 'December 2025',
            'dueAmount' => 2650,
            'paymentStatus' => 'Paid',
            'dueDate' => '2025-12-05',
            'paidDate' => '2025-12-02'
        ],
        [
            'id' => '15',
            'tenantId' => 'T-115',
            'tenantName' => 'Kevin Johnson',
            'shopNumber' => 'S-405',
            'rentMonth' => 'December 2025',
            'dueAmount' => 2800,
            'paymentStatus' => 'Overdue',
            'dueDate' => '2025-12-05',
            'paidDate' => null
        ],
        [
            'id' => '16',
            'tenantId' => 'T-116',
            'tenantName' => 'Michelle Davis',
            'shopNumber' => 'S-501',
            'rentMonth' => 'December 2025',
            'dueAmount' => 3200,
            'paymentStatus' => 'Unpaid',
            'dueDate' => '2025-12-05',
            'paidDate' => null
        ],
        [
            'id' => '17',
            'tenantId' => 'T-117',
            'tenantName' => 'Steven Wilson',
            'shopNumber' => 'S-502',
            'rentMonth' => 'November 2025',
            'dueAmount' => 2900,
            'paymentStatus' => 'Paid',
            'dueDate' => '2025-12-05',
            'paidDate' => '2025-11-30'
        ],
        [
            'id' => '18',
            'tenantId' => 'T-118',
            'tenantName' => 'Laura Martinez',
            'shopNumber' => 'S-503',
            'rentMonth' => 'December 2025',
            'dueAmount' => 2750,
            'paymentStatus' => 'Unpaid',
            'dueDate' => '2025-12-05',
            'paidDate' => null
        ],
        [
            'id' => '19',
            'tenantId' => 'T-119',
            'tenantName' => 'Brian Garcia',
            'shopNumber' => 'S-504',
            'rentMonth' => 'December 2025',
            'dueAmount' => 3000,
            'paymentStatus' => 'Overdue',
            'dueDate' => '2025-12-05',
            'paidDate' => null
        ],
        [
            'id' => '20',
            'tenantId' => 'T-120',
            'tenantName' => 'Nicole Brown',
            'shopNumber' => 'S-505',
            'rentMonth' => 'December 2025',
            'dueAmount' => 2850,
            'paymentStatus' => 'Paid',
            'dueDate' => '2025-12-05',
            'paidDate' => '2025-12-04'
        ],
        [
            'id' => '21',
            'tenantId' => 'T-121',
            'tenantName' => 'Ryan Taylor',
            'shopNumber' => 'S-601',
            'rentMonth' => 'December 2025',
            'dueAmount' => 2950,
            'paymentStatus' => 'Unpaid',
            'dueDate' => '2025-12-05',
            'paidDate' => null
        ],
        [
            'id' => '22',
            'tenantId' => 'T-122',
            'tenantName' => 'Ashley Anderson',
            'shopNumber' => 'S-602',
            'rentMonth' => 'November 2025',
            'dueAmount' => 3100,
            'paymentStatus' => 'Paid',
            'dueDate' => '2025-12-05',
            'paidDate' => '2025-11-28'
        ],
        [
            'id' => '23',
            'tenantId' => 'T-123',
            'tenantName' => 'Justin Thomas',
            'shopNumber' => 'S-603',
            'rentMonth' => 'December 2025',
            'dueAmount' => 2700,
            'paymentStatus' => 'Overdue',
            'dueDate' => '2025-12-05',
            'paidDate' => null
        ],
        [
            'id' => '24',
            'tenantId' => 'T-124',
            'tenantName' => 'Stephanie Jackson',
            'shopNumber' => 'S-604',
            'rentMonth' => 'December 2025',
            'dueAmount' => 2800,
            'paymentStatus' => 'Unpaid',
            'dueDate' => '2025-12-05',
            'paidDate' => null
        ],
        [
            'id' => '25',
            'tenantId' => 'T-125',
            'tenantName' => 'Jonathan White',
            'shopNumber' => 'S-605',
            'rentMonth' => 'December 2025',
            'dueAmount' => 3050,
            'paymentStatus' => 'Paid',
            'dueDate' => '2025-12-05',
            'paidDate' => '2025-12-01'
        ]
    ];

    // Return success response
    echo json_encode([
        'status' => 'success',
        'records' => $rentRecords,
        'message' => 'Rent records fetched successfully'
    ]);

} catch (Exception $e) {
    // Return error response
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to fetch rent records: ' . $e->getMessage()
    ]);
}
?>