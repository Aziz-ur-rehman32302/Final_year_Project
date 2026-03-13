# Payment Status Overview API Test Guide

## API Endpoint
`http://localhost/plaza_management_system_backend/payment_status_overview.php`

## Expected Response Format
```json
{
  "status": "success",
  "message": "Payment status overview fetched successfully",
  "data": {
    "paid_percentage": 75,
    "unpaid_percentage": 25,
    "total_tenants": 100,
    "paid_tenants": 75,
    "unpaid_tenants": 25
  }
}
```

## Testing Steps

### 1. Manual Browser Test
Visit: `http://localhost/plaza_management_system_backend/payment_status_overview.php`

Expected: JSON response with payment status data

### 2. Frontend Integration Test
1. Open Admin Dashboard
2. Navigate to the dashboard with charts
3. Look for "Payment Status Overview" pie chart
4. Chart should show:
   - Loading message initially
   - Real percentages from API after loading
   - Error message if API fails

### 3. Browser Console Logs
Check for these logs:
- No errors related to payment status fetching
- Successful API response logs

### 4. Chart Verification
The pie chart should display:
- ✅ Blue section for paid percentage
- ✅ Red section for unpaid percentage
- ✅ Correct percentages below chart
- ✅ Proper donut chart styling

### 5. UI Numbers Verification
Below the chart should show:
- ✅ `{paid_percentage}%` in blue
- ✅ `{unpaid_percentage}%` in red
- ✅ "Paid" and "Unpaid" labels

Example:
```
75% (blue)    25% (red)
Paid          Unpaid
```

### 6. Error Handling Test
To test error handling:
1. Stop XAMPP/WAMP Apache
2. Refresh the dashboard
3. Chart should show "Failed to load payment data" message
4. Restart Apache
5. Click "Retry" button
6. Chart should load successfully

### 7. Loading State Test
To see loading state:
1. Add delay in PHP file (for testing):
```php
// Add this line at the top of payment_status_overview.php
sleep(2);
```
2. Refresh dashboard
3. Should see "Loading chart..." message and "--%" placeholders
4. Remove the sleep() line

### 8. Data Format Validation
Ensure API response has:
- `data.paid_percentage`: Number (0-100)
- `data.unpaid_percentage`: Number (0-100)
- Both percentages should add up to 100

### 9. Common Issues & Solutions

**Issue**: Chart shows "Loading chart..." forever
**Solution**: Check if API endpoint exists and returns valid JSON

**Issue**: Chart shows "Failed to load payment data"
**Solution**: Check browser console for network errors

**Issue**: Percentages don't add up to 100%
**Solution**: Verify backend calculation logic

**Issue**: Chart is empty but no error
**Solution**: Verify API returns correct data structure

**Issue**: CORS errors
**Solution**: Ensure `cors_headers.php` is included in the API file

### 10. Backend File Location
Make sure the file is in:
- XAMPP: `C:\xampp\htdocs\plaza_management_system_backend\payment_status_overview.php`
- WAMP: `C:\wamp64\www\plaza_management_system_backend\payment_status_overview.php`

### 11. Database Integration (Future)
To connect to real database, uncomment and modify the database query section in the PHP file:
```php
// Get total tenant count
$totalStmt = $pdo->prepare("SELECT COUNT(*) as total FROM tenants WHERE status = 'active'");

// Get paid tenant count
$paidStmt = $pdo->prepare("
    SELECT COUNT(DISTINCT tenant_id) as paid_count 
    FROM rent_payments 
    WHERE MONTH(payment_date) = MONTH(CURDATE()) 
    AND payment_status = 'paid'
");
```

### 12. Expected Visual Result
After successful integration:
- ✅ Pie chart with blue (paid) and red (unpaid) sections
- ✅ Dynamic percentages based on API data
- ✅ Smooth loading transition
- ✅ Error handling with retry option
- ✅ Same visual design as before