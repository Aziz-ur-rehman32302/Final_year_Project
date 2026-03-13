import React, { useState, useEffect } from 'react'
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Bell, 
  LogOut, 
  AlertCircle, 
  X,
  TrendingUp,
  DollarSign,
  Calendar,
  Activity,
  MessageSquare, 
  Clock,
  Loader2,
  CheckCircle,
  MessageCircle
} from 'lucide-react';
import RentTrends from './RentTrends';
import { PaymentStatus } from './PaymentStatus';
import { getToken } from '../../utils/auth';
 


const TenantIssues = () => {
  // Issues states
  const [issues, setIssues] = useState([]);
  const [loadingIssues, setLoadingIssues] = useState(true);
  const [issuesError, setIssuesError] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [resolvingIssues, setResolvingIssues] = useState(new Set());
  
  // Fetch all issues function (extracted for reuse)
  const fetchIssues = async () => {
    try {
      const token = getToken();
      if (!token) {
        setIssuesError('No authentication token found');
        setLoadingIssues(false);
        return;
      }

      const response = await fetch('http://localhost/plaza_management_system_backend/fetch_all_issues.php', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseText = await response.text();
      
      if (!responseText || responseText.trim() === '') {
        throw new Error('Empty response from server');
      }

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error('Invalid response format');
      }

      if (result.status === 'success') {
        // Sort issues with new/unread first, then by creation time (newest first)
        const sortedIssues = (result.data || []).sort((a, b) => {
          // First priority: unread issues
          if (a.admin_read !== b.admin_read) {
            return a.admin_read - b.admin_read; // 0 (unread) comes before 1 (read)
          }
          // Second priority: newest first
          return new Date(b.created_at) - new Date(a.created_at);
        });
        
        setIssues(sortedIssues);
        console.log('Issues:', sortedIssues);
      } else {
        setIssuesError(result.message || 'Failed to fetch issues');
      }
    } catch (err) {
      console.error('Issues fetch error:', err);
      setIssuesError('Failed to load issues. Please try again.');
    } finally {
      setLoadingIssues(false);
    }
  };

  // Fetch all issues
  useEffect(() => {
    fetchIssues();
  }, []);
  
  // Fetch unread count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const token = getToken();
        if (!token) return;

        const response = await fetch('http://localhost/plaza_management_system_backend/unread_issues_count.php', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.status === 'success') {
            setUnreadCount(result.count || 0);
          }
        }
      } catch (err) {
        console.error('Unread count fetch error:', err);
      }
    };

    fetchUnreadCount();
  }, []);
  
  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Resolve issue function
  const resolveIssue = async (issueId) => {
    console.log('🔄 Resolving issue with ID:', issueId);
    setResolvingIssues(prev => new Set([...prev, issueId]));
    
    try {
      const token = getToken();
      if (!token) {
        showToast('Authentication required. Please login again.', 'error');
        return;
      }

      console.log('📡 Sending resolve request to API...');
      const response = await fetch('http://localhost/plaza_management_system_backend/resolve_issue.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          issue_id: issueId
        })
      });

      console.log('📊 Response status:', response.status);
      
      // Handle HTTP errors
      if (!response.ok) {
        if (response.status === 400) {
          throw new Error('Bad Request: Invalid issue ID or missing data');
        } else if (response.status === 401) {
          throw new Error('Unauthorized: Please login again');
        } else if (response.status === 404) {
          throw new Error('API endpoint not found');
        } else if (response.status === 500) {
          throw new Error('Server error: Please try again later');
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }

      // Get response text first
      const responseText = await response.text();
      console.log('📄 Raw response:', responseText);
      
      if (!responseText || responseText.trim() === '') {
        throw new Error('Empty response from server');
      }

      // Parse JSON response
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Invalid JSON response from server');
      }
      
      console.log('✅ Parsed response:', result);
      
      if (result.status === 'success') {
        // Find the issue before updating to check if it was unread
        const issueToResolve = issues.find(issue => 
          (issue.id === issueId) || (issue.issue_id === issueId)
        );
        
        // Update local state - mark issue as resolved
        setIssues(prevIssues => prevIssues.map(issue => {
          const matchesId = (issue.id === issueId) || (issue.issue_id === issueId);
          if (matchesId) {
            console.log('🔄 Updating issue:', issue.id || issue.issue_id, 'to resolved');
            return { 
              ...issue, 
              issue_status: 'resolved', 
              status: 'resolved', 
              admin_read: 1 
            };
          }
          return issue;
        }));
        
        // Update unread count if this was an unread issue
        if (issueToResolve && issueToResolve.admin_read === 0) {
          console.log('📉 Decreasing unread count');
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
        
        showToast('Issue resolved successfully.', 'success');
        console.log('✅ Issue resolved successfully');
        
        // Alternative approach: Re-fetch issues to ensure UI is in sync
        // Uncomment the line below if you prefer to re-fetch instead of local state update
        // fetchIssues();
      } else if (result.status === 'error') {
        // Show API error message
        showToast(result.message || 'Failed to resolve issue', 'error');
      } else {
        // Unexpected response format
        showToast('Unexpected response from server', 'error');
      }
    } catch (err) {
      console.error('❌ Resolve issue error:', err);
      
      // Handle different types of errors
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        showToast('Network error: Unable to connect to server', 'error');
      } else if (err.message.includes('JSON')) {
        showToast('Server response error: Invalid data format', 'error');
      } else {
        showToast(err.message || 'Failed to resolve issue. Please try again.', 'error');
      }
    } finally {
      setResolvingIssues(prev => {
        const newSet = new Set(prev);
        newSet.delete(issueId);
        return newSet;
      });
    }
  };
  
  // WhatsApp contact function
  const contactTenant = (phoneNumber) => {
    if (!phoneNumber || phoneNumber.trim() === '') {
      showToast('Tenant phone number not available.', 'error');
      return;
    }
    
    // Clean phone number (remove spaces, dashes, etc.)
    const cleanPhone = phoneNumber.replace(/[^0-9+]/g, '');
    
    // Open WhatsApp
    const whatsappUrl = `https://wa.me/${cleanPhone}`;
    window.open(whatsappUrl, '_blank');
    showToast('Opening WhatsApp chat...', 'success');
  };
  
  // Format time ago
  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const issueDate = new Date(dateString);
    const diffInMs = now - issueDate;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };
  
  const recentActivities = [
    { id: 1, action: 'Tenant T-101 paid rent for December', time: '2 hours ago', type: 'payment' },
    { id: 2, action: 'New tenant registered: Shop S-205', time: '5 hours ago', type: 'registration' },
    { id: 3, action: 'Rent reminder sent to 5 tenants', time: '1 day ago', type: 'notification' },
    { id: 4, action: 'Tenant T-089 payment overdue', time: '2 days ago', type: 'alert' },
    { id: 5, action: 'Monthly report generated', time: '3 days ago', type: 'report' },
    { id: 6, action: 'Tenant T-043 updated contact info', time: '4 days ago', type: 'update' },
  ];



  return (
    <div className='flex flex-col w-full pl-6'>
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
      
      <div className='w-full py-4 border rounded border-gray-300'>
        {/* Tenant Issues Header */}
        <div className='flex justify-between w-full border-b pb-4 border-gray-300 bg-white'>
          <div className='flex pl-4 gap-2 items-center'>
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h3 className="text-gray-900 mb-1">Tenant Issues</h3>
          </div>
          {unreadCount > 0 && (
            <div className="bg-red-600 mr-4 w-fit px-3 text-white text-center py-1 rounded text-sm">
              <span className='pr-1'>{unreadCount}</span>New
            </div>
          )}
        </div>
        
        {/* Loading State */}
        {loadingIssues && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-blue-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading issues...</span>
            </div>
          </div>
        )}
        
        {/* Error State */}
        {issuesError && !loadingIssues && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg m-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{issuesError}</span>
            <button 
              onClick={() => window.location.reload()}
              className="ml-auto bg-red-100 hover:bg-red-200 px-3 py-1 rounded text-sm transition-colors"
            >
              Retry
            </button>
          </div>
        )}
        
        {/* Issues List */}
        {!loadingIssues && !issuesError && (
          <div>
            {issues.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-lg font-medium">No issues reported</p>
                <p className="text-sm">All tenant issues will appear here</p>
              </div>
            ) : (
              issues.map((issue, index) => {
                const isUnread = issue.admin_read === 0;
                const isResolved = issue.issue_status === 'resolved' || issue.status === 'resolved';
                const issueId = issue.id || issue.issue_id;
                const isResolving = resolvingIssues.has(issueId);
                
                return (
                  <div 
                    key={issueId || index} 
                    className={`w-full flex pt-4 pb-6 pl-4 gap-2 ${
                      isUnread && !isResolved ? 'bg-blue-50 border-l-4 border-l-blue-500' : 
                      index % 2 === 1 ? 'bg-gray-50' : 'bg-white'
                    } ${index > 0 ? 'border-t border-gray-300' : ''}`}
                  >
                    <div className='flex rounded border-0 outline-0'>
                      <MessageSquare className={`w-11 h-11 p-3 rounded ${
                        isResolved ? 'bg-green-200 text-green-600' :
                        isUnread ? 'bg-red-200 text-red-600' : 
                        'bg-yellow-200 text-yellow-600'
                      }`} />
                    </div>

                    <div className='flex flex-col gap-1 flex-1'>
                      <div className='flex gap-2 items-center flex-wrap'>
                        <h3 className='pl-2 font-medium'>
                          {issue.tenant_name || 'Unknown'} 
                          ({issue.tenant_id || 'N/A'}, {issue.shop_number || 'N/A'})
                        </h3>
                        
                        {isResolved ? (
                          <span className='bg-green-500 h-fit pb-0.5 w-fit px-3 text-white text-center rounded-sm text-sm'>
                            Resolved
                          </span>
                        ) : isUnread ? (
                          <span className='bg-red-500 h-fit pb-0.5 w-fit px-3 text-white text-center rounded-sm text-sm'>
                            New
                          </span>
                        ) : (
                          <span className='bg-yellow-500 h-fit pb-0.5 w-fit px-3 text-white text-center rounded-sm text-sm'>
                            Pending
                          </span>
                        )}
                      </div>

                      <div className='flex items-center pl-2 gap-2'>
                        <Clock className='h-4 w-4 text-gray-500' />
                        <p className='text-gray-600'>{formatTimeAgo(issue.created_at)}</p>
                      </div>
                      
                      <p className='text-md pl-2 text-gray-800 mt-1'>
                        {issue.issue_description || issue.description || 'No description provided'}
                      </p>
                      
                      {!isResolved && (
                        <div className='flex gap-2 pt-3'>
                          <button 
                            onClick={() => resolveIssue(issueId)}
                            disabled={isResolving}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm transition-all ${
                              isResolving 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 cursor-pointer'
                            }`}
                          >
                            {isResolving ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Resolving...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                Mark as Resolved
                              </>
                            )}
                          </button>
                          
                          <button 
                            onClick={() => contactTenant(issue.phone_number || issue.phone)}
                            className="flex items-center gap-2 bg-green-500 text-white px-4 py-1.5 rounded-lg hover:bg-green-600 active:scale-95 cursor-pointer transition-all text-sm"
                            title="Contact via WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                            WhatsApp
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    {/* Charts Row */}
        <div className=' mt-2 grid grid-cols-1 md:grid-cols-2 gap-6'>
          <RentTrends/>
          <PaymentStatus/>

        </div>

        <div className='border mt-2 border-gray-300 rounded bg-white'>
          {/* Recent Activity part */}
          <div className="flex items-center p-3 border-b border-gray-300 gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <h3 className="text-gray-900">Recent Activity</h3>
          </div>

          <div id='custom-scrollbar' className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    activity.type === 'payment' ? 'bg-green-500' :
                    activity.type === 'alert' ? 'bg-red-500' :
                    activity.type === 'notification' ? 'bg-blue-500' :
                    'bg-gray-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900">{activity.action}</p>
                    <p className="text-gray-500 text-sm mt-1">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>



    </div>

  )
}

export default TenantIssues
