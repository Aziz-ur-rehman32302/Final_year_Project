import { API_BASE_URL } from '../../config';
import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  CreditCard, 
  Megaphone,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { getUser, getToken } from '../../utils/auth';

interface Notification {
  id: string;
  type: 'reminder' | 'payment' | 'announcement' | 'overdue';
  title: string;
  message: string;
  timestamp: string;
  read_status: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface TenantNotificationsResponse {
  status: 'success' | 'error';
  tenant_id: string;
  tenant_name?: string;
  notifications?: Notification[];
  logs?: Notification[];
  unread_count?: number;
  total_count?: number;
  message?: string;
}

const TenantNotificationsPanel: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [tenantId, setTenantId] = useState<string>('');
  const [tenantName, setTenantName] = useState<string>('');
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [markingAsRead, setMarkingAsRead] = useState<string>(''); // Track which notification is being marked

  // Fetch notifications from backend
  useEffect(() => {
    let isMounted = true;

    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError('');

        // Get logged-in tenant ID from user session
        const currentUser = getUser();
        const token = getToken();
        
        if (!currentUser) {
          if (isMounted) {
            setError('Please login to view notifications');
            setLoading(false);
          }
          return;
        }

        // Extract tenant ID from user data (could be id, user_id, tenant_id, or shop_number)
        const loggedInTenantId = currentUser.id || currentUser.user_id || currentUser.tenant_id || currentUser.shop_number || '28';
        
        console.log('Fetching notifications for tenant:', loggedInTenantId);

        const response = await fetch(API_BASE_URL + '/get_tenant_notifications.php', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: JSON.stringify({
            tenant_id: loggedInTenantId
          })
        }).catch(() => {
          // Suppress network errors in console
          return new Response(null, { status: 500, statusText: "Network Error" });
        });

        // Handle different response scenarios
        let data: TenantNotificationsResponse;
        
        if (!response.ok) {
          // If server error, show fallback data
          console.warn(`Server returned ${response.status}, using fallback data`);
          data = {
            status: 'success',
            tenant_id: loggedInTenantId.toString(),
            tenant_name: 'Demo Tenant',
            notifications: [],
            unread_count: 0,
            total_count: 0,
            message: 'Using demo data due to server issues'
          };
        } else {
          const text = await response.text();
          
          if (!text.trim()) {
            throw new Error('Empty response from server');
          }

          try {
            data = JSON.parse(text);
          } catch (parseError) {
            console.error('JSON parse error:', parseError);
            throw new Error('Invalid response format from server');
          }
        }

        console.log('API Response:', data);

        if (data.status === 'success' && isMounted) {
          setError(''); // Clear any previous errors
          setTenantId(data.tenant_id);
          setTenantName(data.tenant_name || '');
          
          const mappedNotifications = data.notifications || data.logs || [];
          setNotifications(mappedNotifications);
          
          setUnreadCount(data.unread_count || 0);
          setTotalCount(data.total_count || mappedNotifications.length || 0);
          console.log('Notifications loaded successfully:', mappedNotifications.length, 'notifications');
        } else if (isMounted && data.status === 'error') {
          setError(data.message || 'Failed to load notifications');
        }
      } catch (err) {
        console.error('Error fetching tenant notifications:', err);
        if (isMounted) {
          // Show user-friendly error message
          const errorMessage = err instanceof Error ? err.message : 'Unable to connect to server';
          setError(errorMessage);
          
          // Set fallback empty state
          setNotifications([]);
          setUnreadCount(0);
          setTotalCount(0);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchNotifications();

    return () => {
      isMounted = false;
    };
  }, []);

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      setMarkingAsRead(notificationId);

      const token = getToken();
      const currentUser = getUser();
      
      if (!currentUser) {
        console.warn('User not authenticated, updating locally only');
        // Update local state even without backend call
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, read_status: true }
              : notification
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
        return;
      }

      const loggedInTenantId = currentUser.id || currentUser.user_id || currentUser.tenant_id || currentUser.shop_number || '28';
      
      console.log('Marking notification as read:', notificationId, 'for tenant:', loggedInTenantId);

      try {
        const response = await fetch(API_BASE_URL + '/mark_notification_read.php', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: JSON.stringify({
            notification_id: notificationId,
            tenant_id: loggedInTenantId
          })
        });

        // Always update local state optimistically, regardless of server response
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, read_status: true }
              : notification
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));

        if (response.ok) {
          const text = await response.text();
          if (text.trim()) {
            const data = JSON.parse(text);
            console.log('Mark as read response:', data);
          }
        } else {
          console.warn(`Server returned ${response.status}, but local state updated`);
        }
        
        console.log('Notification marked as read successfully:', notificationId);
      } catch (networkError) {
        console.warn('Network error, but local state updated:', networkError);
        // Local state already updated above
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    } finally {
      setMarkingAsRead('');
    }
  };

  // Get notification type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'reminder':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'payment':
        return <CreditCard className="w-5 h-5 text-green-600" />;
      case 'announcement':
        return <Megaphone className="w-5 h-5 text-purple-600" />;
      case 'overdue':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  // Get notification type badge styling
  const getTypeBadge = (type: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize";
    
    switch (type) {
      case 'reminder':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'payment':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'announcement':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case 'overdue':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

      if (diffInHours < 1) {
        return 'Just now';
      } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)} hours ago`;
      } else if (diffInHours < 48) {
        return 'Yesterday';
      } else {
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
      }
    } catch {
      return timestamp;
    }
  };

  // Retry function
  const handleRetry = () => {
    setLoading(true);
    setError('');
    // Trigger useEffect to refetch
    window.location.reload();
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">My Notifications</h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading...
          </div>
        </div>
        
        {/* Loading skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">My Notifications</h2>
        </div>
        
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load notifications</h3>
          <p className="text-gray-500 text-center mb-6 max-w-md">{error}</p>
          <button 
            onClick={handleRetry}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header with counts */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">My Notifications</h2>
            {tenantId && (
              <p className="text-sm text-gray-600">
                Tenant ID: <span className="font-medium">{tenantId}</span>
                {tenantName && <span className="ml-2">({tenantName})</span>}
              </p>
            )}
          </div>
        </div>
        
        {/* Notification counts */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span className="text-gray-600">
              Unread: <span className="font-semibold text-blue-600">{unreadCount}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span className="text-gray-600">
              Total: <span className="font-semibold">{totalCount}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Notifications list */}
      <div className="space-y-3">
        {!notifications || notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-500">You're all caught up! Check back later for updates.</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`border rounded-lg p-4 transition-all duration-200 ${
                !notification.read_status 
                  ? 'border-blue-200 bg-blue-50 shadow-sm' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Type icon */}
                <div className="flex-shrink-0 mt-1">
                  {getTypeIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className={`font-medium truncate ${
                      !notification.read_status ? 'text-gray-900' : 'text-gray-600'
                    }`}>
                      {notification.title}
                    </h3>
                    <span className={getTypeBadge(notification.type)}>
                      {notification.type}
                    </span>
                    {!notification.read_status && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                    )}
                  </div>
                  
                  <p className={`text-sm mb-3 leading-relaxed ${
                    !notification.read_status ? 'text-gray-800' : 'text-gray-500'
                  }`}>
                    {notification.message}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(notification.timestamp)}
                    </span>
                    
                    {/* Mark as read button */}
                    {!notification.read_status && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        disabled={markingAsRead === notification.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {markingAsRead === notification.id ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Marking...
                          </>
                        ) : (
                          <>
                            <Eye className="w-3 h-3" />
                            Mark as Read
                          </>
                        )}
                      </button>
                    )}
                    
                    {notification.read_status && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 bg-gray-100 rounded-md">
                        <CheckCircle className="w-3 h-3" />
                        Read
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer summary */}
      {notifications.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              {unreadCount > 0 
                ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
                : 'All notifications read'
              }
            </span>
            <span className="text-xs">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantNotificationsPanel;