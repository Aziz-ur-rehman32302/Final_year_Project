# PaymentStatus Component Debug Guide

## Quick Test Steps

### 1. Test API Directly
Open browser and visit:
`http://localhost/plaza_management_system_backend/payment_status_overview.php`

**Expected Response:**
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

### 2. Check Browser Console
1. Open Admin Dashboard
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Look for any error messages related to payment status

### 3. Check Network Tab
1. In Developer Tools, go to Network tab
2. Refresh the dashboard
3. Look for request to `payment_status_overview.php`
4. Check if it returns 200 status and correct JSON

### 4. Component States
The component should show:
- **Loading**: "Loading chart..." when `pieData` is empty
- **Error**: Error message when API fails
- **Success**: Pie chart with percentages when data loads

### 5. Expected Data Flow
```javascript
// API Response
{
  "status": "success",
  "data": {
    "paid_percentage": 75,
    "unpaid_percentage": 25
  }
}

// Becomes pieData
[
  { name: "Paid", value: 75 },
  { name: "Unpaid", value: 25 }
]

// And percentages
{ paid: 75, unpaid: 25 }
```

### 6. Common Issues & Solutions

**Issue**: "Failed to load payment data"
**Solution**: 
- Check if XAMPP/WAMP is running
- Verify file exists at correct path
- Test API URL directly in browser

**Issue**: CORS errors
**Solution**: 
- CORS headers are now included directly in PHP file
- Make sure you're accessing from `http://localhost:5173`

**Issue**: "Loading chart..." forever
**Solution**:
- Check browser console for JavaScript errors
- Verify API returns valid JSON
- Check network tab for failed requests

**Issue**: Chart shows but percentages are 0
**Solution**:
- Verify API response has correct data structure
- Check that `paid_percentage` and `unpaid_percentage` fields exist

### 7. Manual Test
You can test the component manually by adding this to browser console:
```javascript
fetch("http://localhost/plaza_management_system_backend/payment_status_overview.php")
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

### 8. File Locations
Make sure these files exist:
- Frontend: `src/Components/AdminDashboard/PaymentStatus.jsx`
- Backend: `C:\xampp\htdocs\plaza_management_system_backend\payment_status_overview.php`

### 9. Quick Fix
If still not working, try running the setup script:
```cmd
cd "d:\Plaza_Management_System"
setup_backend.bat
```

This will copy all backend files to the correct location.