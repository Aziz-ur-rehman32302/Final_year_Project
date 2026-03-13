# Backend Setup Guide - CORS Fix

## 🚨 IMMEDIATE FIX REQUIRED

The errors you're seeing are due to missing backend PHP files and CORS configuration. Here's how to fix them:

## 1. Move Backend Files to Correct Location

You need to move the PHP files I created to your web server directory:

### For XAMPP Users:
```bash
# Copy these files to: C:\xampp\htdocs\plaza_management_system_backend\
- cors_headers.php
- fetch_all_issues.php  
- unread_issues_count.php
- resolve_issue.php
```

### For WAMP Users:
```bash
# Copy these files to: C:\wamp64\www\plaza_management_system_backend\
- cors_headers.php
- fetch_all_issues.php
- unread_issues_count.php  
- resolve_issue.php
```

## 2. File Structure Should Look Like:
```
C:\xampp\htdocs\plaza_management_system_backend\
├── cors_headers.php
├── fetch_all_issues.php
├── unread_issues_count.php
├── resolve_issue.php
├── admin_dashboard_stats.php (if exists)
├── process_payment.php (if exists)
└── ... (other PHP files)
```

## 3. Test Backend Connection

Open your browser and test these URLs:
- http://localhost/plaza_management_system_backend/fetch_all_issues.php
- http://localhost/plaza_management_system_backend/unread_issues_count.php

You should see JSON responses instead of 404 errors.

## 4. Add CORS Headers to Existing PHP Files

If you have existing PHP files, add this line at the top of each file:
```php
<?php
include_once 'cors_headers.php';
// ... rest of your PHP code
```

## 5. Quick Commands to Copy Files

### Windows Command Prompt:
```cmd
# Navigate to your project directory
cd "d:\Plaza_Management_System"

# Copy files to XAMPP (adjust path if needed)
copy cors_headers.php "C:\xampp\htdocs\plaza_management_system_backend\"
copy fetch_all_issues.php "C:\xampp\htdocs\plaza_management_system_backend\"
copy unread_issues_count.php "C:\xampp\htdocs\plaza_management_system_backend\"
copy resolve_issue.php "C:\xampp\htdocs\plaza_management_system_backend\"
```

## 6. Verify XAMPP/WAMP is Running

Make sure these services are running:
- ✅ Apache Web Server
- ✅ MySQL Database (if using database)

## 7. Test the Fix

After copying files:
1. Refresh your React application
2. Navigate to Admin Dashboard → Tenant Issues
3. The CORS errors should be gone
4. You should see mock data in the issues panel

## 8. Replace Mock Data with Real Database

Once CORS is fixed, update the PHP files to use your actual database:

```php
// Example database connection
$pdo = new PDO("mysql:host=localhost;dbname=plaza_db", $username, $password);

// Example query for fetch_all_issues.php
$stmt = $pdo->prepare("SELECT * FROM issues ORDER BY created_at DESC");
$stmt->execute();
$issues = $stmt->fetchAll(PDO::FETCH_ASSOC);
```

## 🎯 Expected Result

After following these steps:
- ❌ CORS errors will be gone
- ✅ Issues will load in the admin panel
- ✅ Charts will display properly
- ✅ WhatsApp contact will work
- ✅ Resolve issue functionality will work

## 🆘 Still Having Issues?

If you still see errors:
1. Check browser console for new error messages
2. Verify file paths are correct
3. Ensure XAMPP/WAMP Apache is running on port 80
4. Test PHP files directly in browser first