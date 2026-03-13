# Rent Collection Trends API Test Guide

## API Endpoint
`http://localhost/plaza_management_system_backend/rent_collection_trends.php`

## Expected Response Format
```json
{
  "status": "success",
  "message": "Rent collection trends fetched successfully",
  "data": [
    { "month": "Jan", "collected": 85000, "expected": 100000 },
    { "month": "Feb", "collected": 92000, "expected": 100000 },
    { "month": "Mar", "collected": 78000, "expected": 100000 },
    ...
  ]
}
```

## Testing Steps

### 1. Manual Browser Test
Visit: `http://localhost/plaza_management_system_backend/rent_collection_trends.php`

Expected: JSON response with rent trends data

### 2. Frontend Integration Test
1. Open Admin Dashboard
2. Navigate to the dashboard with charts
3. Look for "Rent Collection Trends" chart
4. Chart should show:
   - Loading message initially
   - Real data from API after loading
   - Error message if API fails

### 3. Browser Console Logs
Check for these logs:
- No errors related to rent trends fetching
- Successful API response logs

### 4. Chart Verification
The chart should display:
- ✅ Monthly data points (Jan-Dec)
- ✅ Blue line for collected amounts
- ✅ Gray dashed line for expected amounts
- ✅ Interactive tooltip on hover
- ✅ Proper axis labels

### 5. Error Handling Test
To test error handling:
1. Stop XAMPP/WAMP Apache
2. Refresh the dashboard
3. Chart should show "Failed to load chart data" message
4. Restart Apache
5. Click "Retry" button
6. Chart should load successfully

### 6. Loading State Test
To see loading state:
1. Add delay in PHP file (for testing):
```php
// Add this line at the top of rent_collection_trends.php
sleep(2);
```
2. Refresh dashboard
3. Should see "Loading chart..." message
4. Remove the sleep() line

### 7. Data Format Validation
Ensure each data item has:
- `month`: String (Jan, Feb, Mar, etc.)
- `collected`: Number (amount collected)
- `expected`: Number (expected amount)

### 8. Common Issues & Solutions

**Issue**: Chart shows "Loading chart..." forever
**Solution**: Check if API endpoint exists and returns valid JSON

**Issue**: Chart shows "Failed to load chart data"
**Solution**: Check browser console for network errors

**Issue**: Chart is empty but no error
**Solution**: Verify API returns `data` array with correct format

**Issue**: CORS errors
**Solution**: Ensure `cors_headers.php` is included in the API file

### 9. Backend File Location
Make sure the file is in:
- XAMPP: `C:\xampp\htdocs\plaza_management_system_backend\rent_collection_trends.php`
- WAMP: `C:\wamp64\www\plaza_management_system_backend\rent_collection_trends.php`

### 10. Database Integration (Future)
To connect to real database, uncomment and modify the database query section in the PHP file:
```php
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
```