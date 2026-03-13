import React, { useState, useEffect } from 'react';

const TenantIssues = ({ refreshTrigger }) => {
  const [tenantIssues, setTenantIssues] = useState([]);
  const [loadingIssues, setLoadingIssues] = useState(true);
  const [issuesError, setIssuesError] = useState('');

  const fetchTenantIssues = async () => {
    try {
      setLoadingIssues(true);
      setIssuesError('');
      
      const token = localStorage.getItem('token');
      const currentTenant = localStorage.getItem('tenant_name');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await fetch('http://localhost/plaza_management_system_backend/fetch_tenant_issues.php', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error('Bad request. Please check your data.');
        } else if (response.status === 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(`Network error: ${response.status}`);
        }
      }

      const responseText = await response.text();
      
      if (!responseText || responseText.trim() === '') {
        throw new Error('Empty response from server');
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error('Invalid JSON response from server');
      }
      
      if (data.status === 'success') {
        let issues = data.issues || data.data || [];
        
        // Filter issues for current tenant (case insensitive)
        if (currentTenant) {
          issues = issues.filter(issue => 
            issue.tenant_name && 
            issue.tenant_name.toLowerCase() === currentTenant.toLowerCase()
          );
        }
        
        // Sort issues by created_at in ascending order (oldest first = submission order)
        issues.sort((a, b) => {
          const dateA = new Date(a.created_at || 0);
          const dateB = new Date(b.created_at || 0);
          return dateA - dateB;
        });
        
        setTenantIssues(issues);
      } else {
        throw new Error(data.message || 'Failed to fetch issues');
      }
    } catch (error) {
      console.error('Error fetching tenant issues:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setIssuesError('Network connection failed. Please check your internet connection.');
      } else if (error.message.includes('Authentication token')) {
        setIssuesError('Authentication required. Please login again.');
      } else if (error.message.includes('Server error')) {
        setIssuesError('Server error. Please try again later.');
      } else if (error.message.includes('Bad request')) {
        setIssuesError('Invalid request. Please refresh and try again.');
      } else {
        setIssuesError('Failed to load issues. Please try again.');
      }
      setTenantIssues([]);
    } finally {
      setLoadingIssues(false);
    }
  };

  useEffect(() => {
    fetchTenantIssues();
  }, [refreshTrigger]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return 'Date not available';
    }
  };

  const getStatusBadge = (issueStatus) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    
    if (issueStatus?.toLowerCase() === 'resolved') {
      return `${baseClasses} bg-green-100 text-green-800`;
    } else {
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    }
  };

  const getCardHighlight = (issueStatus) => {
    if (issueStatus?.toLowerCase() === 'resolved') {
      return 'border-l-4 border-l-green-500 bg-green-50';
    } else {
      return 'border-l-4 border-l-yellow-500 bg-yellow-50';
    }
  };

  const getIssueSequenceNumber = (issue, allIssues) => {
    // Sort all issues by created_at to determine historical submission order
    const sortedIssues = [...allIssues].sort((a, b) => {
      const dateA = new Date(a.created_at || 0);
      const dateB = new Date(b.created_at || 0);
      return dateA - dateB;
    });
    
    // Find the position of this issue in the sorted list
    const sequenceNumber = sortedIssues.findIndex(sortedIssue => 
      sortedIssue.id === issue.id || 
      (sortedIssue.created_at === issue.created_at && 
       sortedIssue.issue_description === issue.issue_description)
    ) + 1;
    
    return sequenceNumber;
  };

  if (loadingIssues) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading your issues...</span>
        </div>
      </div>
    );
  }

  if (issuesError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{issuesError}</p>
      </div>
    );
  }

  if (tenantIssues.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-2">No issues reported yet</p>
        <p className="text-gray-500 text-sm">Use the form above to report any problems</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tenantIssues.map((issue, index) => {
        const sequenceNumber = getIssueSequenceNumber(issue, tenantIssues);
        const issueStatus = issue.issue_status || 'pending';
        const issueDescription = issue.issue_description || issue.description || 'No description provided';
        const adminResponse = issue.admin_response;
        const createdAt = issue.created_at;
        
        return (
          <div 
            key={`tenant-issue-${issue.id || `${createdAt}-${index}`}`} 
            className={`bg-white p-4 rounded-lg shadow border ${getCardHighlight(issueStatus)}`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-medium text-gray-900">Issue #{sequenceNumber}</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Submitted: {formatDate(createdAt)}
                </p>
              </div>
              <span className={getStatusBadge(issueStatus)}>
                {issueStatus.toLowerCase() === 'resolved' ? 'Resolved' : 'Pending'}
              </span>
            </div>
            
            <div className="mb-3">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Issue Description:</h5>
              <p className="text-gray-700 bg-gray-50 p-3 rounded border">
                {issueDescription}
              </p>
            </div>
            
            {adminResponse && (
              <div className="bg-green-50 border-2 border-green-300 p-4 rounded-lg mt-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-sm font-semibold text-green-900">Admin Response:</p>
                </div>
                <p className="text-sm text-green-800 bg-white p-3 rounded border border-green-200">
                  {adminResponse}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TenantIssues;