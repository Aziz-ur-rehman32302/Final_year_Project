# UI Update Debug Guide

## Issue: UI Not Updating After Resolving Issues

### 1. Check Browser Console Logs

When you click "Mark as Resolved", look for these logs:

```
🔄 Resolving issue with ID: [number]
📡 Sending resolve request to API...
📊 Response status: 200
📄 Raw response: {"status":"success",...}
✅ Parsed response: {status: "success", ...}
🔄 Updating issue: [number] to resolved
📉 Decreasing unread count (if applicable)
✅ Issue resolved successfully
```

### 2. Check Issue Data Structure

Add this temporary debug code to see your issue structure:

```javascript
// Add this inside the issues.map() function, before the return statement
console.log('Issue data:', {
  id: issue.id,
  issue_id: issue.issue_id,
  issue_status: issue.issue_status,
  status: issue.status,
  admin_read: issue.admin_read,
  tenant_name: issue.tenant_name
});
```

### 3. Common Issues & Solutions

**Problem**: Status badge doesn't change
**Solution**: Check if your API returns `issue_status` or `status` field

**Problem**: "New" badge doesn't disappear  
**Solution**: Verify `admin_read` is being set to 1

**Problem**: Button still shows "Mark as Resolved"
**Solution**: Check if `isResolved` logic matches your data structure

### 4. Test with Mock Data

If API is not working, test with mock resolution:

```javascript
// Replace the API call with this for testing:
const mockResolve = () => {
  setIssues(prevIssues => prevIssues.map(issue => {
    const matchesId = (issue.id === issueId) || (issue.issue_id === issueId);
    if (matchesId) {
      return { 
        ...issue, 
        issue_status: 'resolved', 
        status: 'resolved', 
        admin_read: 1 
      };
    }
    return issue;
  }));
  showToast('Issue resolved successfully.', 'success');
};
```

### 5. Force Re-render

If local state update doesn't work, use re-fetch approach:

```javascript
// In resolveIssue function, after successful API response:
if (result.status === 'success') {
  // Instead of local state update, re-fetch all issues
  fetchIssues();
  showToast('Issue resolved successfully.', 'success');
}
```

### 6. Verify Backend Response

Your backend should return:

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

### 7. Check React DevTools

1. Install React DevTools browser extension
2. Find TenantIssues component
3. Watch the `issues` state array
4. Verify it updates when you click resolve

### 8. Quick Fix Options

**Option A**: Use re-fetch (guaranteed to work)
```javascript
// Uncomment this line in resolveIssue function:
fetchIssues();
```

**Option B**: Force component re-render
```javascript
// Add this state and trigger it after resolve:
const [refreshKey, setRefreshKey] = useState(0);
// After successful resolve:
setRefreshKey(prev => prev + 1);
// Add key to main div:
<div key={refreshKey} className='flex flex-col w-full pl-6'>
```

**Option C**: Use useCallback for better state updates
```javascript
const updateIssueStatus = useCallback((issueId) => {
  setIssues(prevIssues => 
    prevIssues.map(issue => {
      const matchesId = (issue.id === issueId) || (issue.issue_id === issueId);
      return matchesId 
        ? { ...issue, issue_status: 'resolved', status: 'resolved', admin_read: 1 }
        : issue;
    })
  );
}, []);
```