# Tenant Issues API Test Guide

## API Endpoint
`http://localhost/plaza_management_system_backend/fetch_tenant_issues.php`

## Request Method
GET (with Authorization header)

## Expected Response Format
```json
{
  "status": "success",
  "message": "Tenant issues fetched successfully",
  "data": [
    {
      "id": 1,
      "issue_description": "Water leakage in the bathroom ceiling...",
      "issue_status": "pending",
      "status": "pending",
      "admin_response": null,
      "response": null,
      "created_at": "2024-01-15 10:30:00",
      "updated_at": "2024-01-15 10:30:00"
    },
    {
      "id": 2,
      "issue_description": "Electrical outlet in the kitchen...",
      "issue_status": "resolved",
      "status": "resolved",
      "admin_response": "We have contacted the electrician...",
      "response": "We have contacted the electrician...",
      "created_at": "2024-01-08 14:20:00",
      "updated_at": "2024-01-10 16:45:00"
    }
  ]
}
```

## Testing Steps

### 1. Manual Browser Test
Visit: `http://localhost/plaza_management_system_backend/fetch_tenant_issues.php`

Expected: Should return 401 error (Authorization required) since no token provided

### 2. Frontend Integration Test
1. Login as a tenant
2. Navigate to Tenant Dashboard
3. Look for "My Issues" section
4. Should show:
   - Loading state initially
   - List of issues after loading
   - Error message if API fails

### 3. Browser Console Logs
Check for these logs:
- No errors related to tenant issues fetching
- "Tenant Issues:" log with fetched data

### 4. UI Verification
The My Issues section should display:
- ✅ Issue ID (#1, #2, etc.)
- ✅ Issue description in gray box
- ✅ Status badge (Pending/Resolved)
- ✅ Created date formatted
- ✅ Admin response for resolved issues (green highlight)
- ✅ Proper icons and styling

### 5. Issue Status Display
**Pending Issues:**
- Yellow status badge
- No admin response section
- Standard white background

**Resolved Issues:**
- Green status badge
- Green highlighted section with admin response
- CheckCircle icon
- "Your issue has been resolved by the admin" message

### 6. Dynamic Updates Test
1. Submit a new issue using the form
2. Wait 1 second
3. New issue should appear in the list without page reload

### 7. Error Handling Test
To test error handling:
1. Stop XAMPP/WAMP Apache
2. Refresh the dashboard
3. Should show "Failed to load issues. Please try again." message
4. Restart Apache
5. Refresh page - issues should load

### 8. Empty State Test
To test empty state (modify PHP to return empty array):
```php
$mockTenantIssues = [];
```
Should show:
- MessageSquare icon
- "No issues reported yet"
- "Use the form above to report any problems"

### 9. Data Structure Validation
Each issue should contain:
- `id`: Number (for Issue #X display)
- `issue_description`: String (main content)
- `issue_status` or `status`: "pending" or "resolved"
- `admin_response` or `response`: String or null
- `created_at`: Date string (for formatting)

### 10. Authentication Test
API requires Bearer token:
```javascript
headers: {
  'Authorization': `Bearer ${token}`
}
```

### 11. Common Issues & Solutions

**Issue**: "No authentication token found"
**Solution**: Ensure user is logged in and token exists in localStorage

**Issue**: Issues not displaying
**Solution**: Check browser console for API errors, verify response format

**Issue**: Status badges not showing colors
**Solution**: Verify `issue_status` field contains "pending" or "resolved"

**Issue**: Admin responses not showing
**Solution**: Check `admin_response` field exists and is not null for resolved issues

**Issue**: Dates not formatting
**Solution**: Verify `created_at` field contains valid date string

### 12. Backend File Location
Make sure the file is in:
- XAMPP: `C:\xampp\htdocs\plaza_management_system_backend\fetch_tenant_issues.php`
- WAMP: `C:\wamp64\www\plaza_management_system_backend\fetch_tenant_issues.php`

### 13. Database Integration (Future)
To connect to real database, uncomment and modify the database query section:
```php
$stmt = $pdo->prepare("
    SELECT 
        id,
        issue_description,
        issue_status,
        admin_response,
        created_at,
        updated_at
    FROM tenant_issues 
    WHERE tenant_id = ? 
    ORDER BY created_at DESC
");
```