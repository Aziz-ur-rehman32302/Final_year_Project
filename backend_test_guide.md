# Backend PHP Verification Guide - UPDATED

## ✅ CONFIRMED API PATH
**Correct Endpoint**: `http://localhost/plaza_management_system_backend/process_payment.php`

## 1. Test PHP Endpoint Manually

Create a simple test file to verify your PHP endpoint works:

### Test File: `test_payment_api.php`
```php
<?php
// Test the payment API endpoint
$url = 'http://localhost/plaza_management_system_backend/process_payment.php';

$data = array(
    'tenantId' => 1,
    'paymentMethod' => 'JazzCash'
);

$options = array(
    'http' => array(
        'header'  => "Content-type: application/json\r\n" .
                     "Authorization: Bearer your_test_token\r\n",
        'method'  => 'POST',
        'content' => json_encode($data)
    )
);

$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);

echo "Response: " . $result;
?>
```

## 2. Required PHP Endpoint Structure

Your `process_payment.php` should look like this:

```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception('Invalid JSON input');
    }
    
    // Validate required fields
    if (!isset($input['tenantId']) || !isset($input['paymentMethod'])) {
        throw new Exception('Missing required fields: tenantId, paymentMethod');
    }
    
    $tenantId = $input['tenantId'];
    $paymentMethod = $input['paymentMethod'];
    
    // TODO: Add your database update logic here
    // Example:
    // $pdo = new PDO("mysql:host=localhost;dbname=plaza_db", $username, $password);
    // $stmt = $pdo->prepare("UPDATE tenants SET payment_status = 'Paid', payment_method = ? WHERE id = ?");
    // $stmt->execute([$paymentMethod, $tenantId]);
    
    // Return success response
    echo json_encode([
        'status' => 'success',
        'message' => 'Payment processed successfully',
        'data' => [
            'tenantId' => $tenantId,
            'paymentMethod' => $paymentMethod,
            'paymentStatus' => 'Paid',
            'timestamp' => date('Y-m-d H:i:s')
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
```

## 3. Database Update Query

Add this to your PHP file to update the database:

```php
// Database connection
$pdo = new PDO("mysql:host=localhost;dbname=your_database", $username, $password);

// Update payment status
$stmt = $pdo->prepare("
    UPDATE tenants 
    SET payment_status = 'Paid', 
        payment_method = ?, 
        payment_date = NOW() 
    WHERE id = ?
");

$result = $stmt->execute([$paymentMethod, $tenantId]);

if (!$result) {
    throw new Exception('Failed to update payment status in database');
}
```

## 4. Testing Steps

1. **Check if file exists**: Visit `http://localhost/plaza_management_system_backend/process_payment.php`
2. **Test with Postman**: 
   - URL: `http://localhost/plaza_management_system_backend/process_payment.php`
   - Method: POST
   - Headers: `Content-Type: application/json`, `Authorization: Bearer your_token`
   - Body: `{"tenantId": 1, "paymentMethod": "JazzCash"}`
3. **Check browser console**: Look for detailed error logs from React
4. **Verify database**: Check if payment_status updates to 'Paid'

## 5. React Frontend Verification

The React code now:
- ✅ Uses correct API path: `process_payment.php`
- ✅ Sends simplified JSON: `{tenantId, paymentMethod}`
- ✅ Includes Authorization header with Bearer token
- ✅ Handles all error types with user-friendly messages
- ✅ Updates Payment Status to "Paid" on success
- ✅ Shows engaging success animation
- ✅ Resets form fields after successful payment
- ✅ Updates Payment Due message dynamically

## 6. Debug Commands

Check browser console for these logs:
- 🔍 "Sending payment request to: process_payment.php"
- 📊 "Payment data: {tenantId, paymentMethod}"
- 🔐 "Authorization token: Present/Missing"
- 📡 "Response status: 200/404/500"
- ✅ "✅ Payment successful via JazzCash/EasyPaisa"

## 7. Common Network Error Solutions

### ❌ "Network Error: Unable to connect"
- **Check**: XAMPP/WAMP is running
- **Check**: File exists at correct path
- **Check**: No typos in URL

### ❌ "HTTP 404: Not Found"
- **Solution**: Create `process_payment.php` file
- **Solution**: Verify file path is correct

### ❌ "CORS Error"
- **Solution**: Add CORS headers (included in template above)

### ❌ "Empty Response"
- **Solution**: Check PHP error logs
- **Solution**: Add `error_reporting(E_ALL);` to PHP file