# API Test Guide for resolve_issue.php

## Test the API Endpoint Manually

### 1. Using Browser (GET test)
Visit: `http://localhost/plaza_management_system_backend/resolve_issue.php`

Expected: Should return CORS headers and handle OPTIONS request

### 2. Using Postman or curl (POST test)

**URL:** `http://localhost/plaza_management_system_backend/resolve_issue.php`

**Method:** POST

**Headers:**
```
Content-Type: application/json
Authorization: Bearer your_test_token
```

**Body (JSON):**
```json
{
  "issue_id": 1
}
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "Issue resolved successfully",
  "data": {
    "issue_id": 1,
    "status": "resolved",
    "resolved_at": "2024-01-15 10:30:00"
  }
}
```

### 3. Test with curl command:
```bash
curl -X POST http://localhost/plaza_management_system_backend/resolve_issue.php \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test_token" \
  -d '{"issue_id": 1}'
```

### 4. Common Error Responses:

**400 Bad Request:**
```json
{
  "status": "error",
  "message": "Missing required field: issue_id"
}
```

**400 Bad Request (Invalid JSON):**
```json
{
  "status": "error", 
  "message": "Invalid JSON input"
}
```

### 5. Frontend Debug Steps:

1. Open browser console
2. Look for these logs when clicking "Mark as Resolved":
   - 🔄 Resolving issue with ID: [number]
   - 📡 Sending resolve request to API...
   - 📊 Response status: [status code]
   - 📄 Raw response: [response text]
   - ✅ Parsed response: [JSON object]

### 6. If still getting 400 errors:

Check that:
- ✅ XAMPP/WAMP Apache is running
- ✅ resolve_issue.php file exists in correct directory
- ✅ File has proper CORS headers
- ✅ JSON body contains "issue_id" field
- ✅ Content-Type header is "application/json"
- ✅ Authorization header is present

### 7. Backend File Location:
Make sure resolve_issue.php is in:
- XAMPP: `C:\xampp\htdocs\plaza_management_system_backend\resolve_issue.php`
- WAMP: `C:\wamp64\www\plaza_management_system_backend\resolve_issue.php`