import React, { useState, useEffect, useCallback } from 'react';
import {
  Bell,
  Mail,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
  CircleAlert,
  Smartphone,
  Settings,
  RefreshCw,
} from 'lucide-react';

// TypeScript interfaces
interface TenantNotification {
  id: string;
  type: 'reminder' | 'overdue' | 'payment';
  title: string;
  message: string;
  channel: 'Email' | 'SMS' | 'Push';
  status: 'Sent' | 'Failed' | 'Read';
  sentDate: string;
}

interface ApiResponse {
  status: 'success' | 'error';
  logs: TenantNotification[];
  message?: string;
}

interface MarkReadResponse {
  status: 'success' | 'error';
  message?: string;
}

const TenantNotification: React.FC = () => {
  // Get logged-in tenant ID from localStorage or context
  const getLoggedInTenantId = (): string => {
    // Try to get tenant ID from localStorage first
    const tenantId = localStorage.getItem('tenantId') || localStorage.getItem('tenant_id');
    if (tenantId) return tenantId;
    
    // Fallback: try to get from token or other storage
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.tenantId || payload.tenant_id || 'T-001';
      } catch {
        return 'T-001'; // Default fallback
      }
    }
    
    return 'T-001'; // Default tenant ID
  };

  // State management
  const [tenantNotifications, setTenantNotifications] = useState<TenantNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [markingRead, setMarkingRead] = useState<string>(''); // ID of notification being marked as read
  const [loggedInTenantId] = useState<string>(getLoggedInTenantId());

  // Fetch tenant-specific notifications from API
  const fetchNotifications = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      setError('');
      
      const response = await fetch(
        `http://localhost/plaza_management_system_backend/get_notification_logs.php?tenant_id=${loggedInTenantId}`,
        {
          method: 'GET',
          credentials: 'include', // CRITICAL: Include cookies/session
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data: ApiResponse = await response.json();
      
      if (data.status === 'success') {
        const notifications = data.logs || [];
        
        // Sort notifications by date (newest first)
        const sortedNotifications = notifications.sort((a, b) => 
          new Date(b.sentDate).getTime() - new Date(a.sentDate).getTime()
        );
        
        setTenantNotifications(sortedNotifications);
        
        // Calculate unread count (notifications that are not "Read")
        const unread = sortedNotifications.filter(notification => notification.status !== 'Read').length;
        setUnreadCount(unread);
      } else {
        throw new Error(data.message || 'Failed to load notifications');
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err instanceof Error ? err.message : 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, [loggedInTenantId]);

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    if (markingRead === notificationId) return; // Prevent double-clicking
    
    // Find the notification to check if it's already read
    const notification = tenantNotifications.find(n => n.id === notificationId);
    if (!notification || notification.status === 'Read') return;
    
    try {
      setMarkingRead(notificationId);
      
      const response = await fetch('http://localhost/plaza_management_system_backend/mark_notification_read.php', {
        method: 'POST',
        credentials: 'include', // CRITICAL: Include cookies/session
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({ 
          id: notificationId,
          tenant_id: loggedInTenantId // Include for extra security
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data: MarkReadResponse = await response.json();
      
      if (data.status === 'success') {
        // Update UI immediately - optimistic update
        setTenantNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, status: 'Read' as const }
              : notification
          )
        );
        
        // Decrease unread count by 1
        setUnreadCount(prev => Math.max(0, prev - 1));
      } else {
        throw new Error(data.message || 'Failed to mark as read');
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
      // Could show a toast notification here for better UX
    } finally {
      setMarkingRead('');
    }
  };

  // Initial fetch and polling setup
  useEffect(() => {
    fetchNotifications(true);
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => fetchNotifications(false), 30000);
    
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Helper functions for icons and colors
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'reminder':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'overdue':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'payment':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'reminder':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'payment':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'reminder':
        return 'bg-blue-50 border-blue-200';
      case 'overdue':
        return 'bg-red-50 border-red-200';
      case 'payment':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'Email':
        return <Mail className="w-4 h-4 text-gray-500" />;
      case 'SMS':
        return <MessageSquare className="w-4 h-4 text-gray-500" />;
      case 'Push':
        return <Smartphone className="w-4 h-4 text-gray-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const isUnread = (notification: TenantNotification) => notification.status !== 'Read';

  // Calculate read count
  const readCount = tenantNotifications.length - unreadCount;

  return (
    <div className="p-6 w-full bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Bell className="w-7 h-7 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Notifications</h1>
              <p className="text-sm text-gray-500">Tenant ID: {loggedInTenantId}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <span 
                className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg"
                aria-label={`${unreadCount} unread notifications`}
              >
                {unreadCount} New
              </span>
            )}
            <button
              onClick={() => fetchNotifications(true)}
              disabled={loading}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              aria-label="Refresh notifications"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
        <p className="text-gray-600 text-lg">
          Stay updated with your rent reminders, payment confirmations, and overdue alerts.
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 text-lg">Loading notifications...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
          <p className="text-red-700 font-medium">{error}</p>
          <button 
            onClick={() => fetchNotifications(true)}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Main Content */}
      {!loading && !error && (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            {/* Total Notifications */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Bell className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">{tenantNotifications.length}</p>
                  <p className="text-gray-600 font-medium">Total Notifications</p>
                </div>
              </div>
            </div>

            {/* Unread */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <CircleAlert className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">{unreadCount}</p>
                  <p className="text-gray-600 font-medium">Unread</p>
                </div>
              </div>
            </div>

            {/* Read */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">{readCount}</p>
                  <p className="text-gray-600 font-medium">Read</p>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Preferences Panel */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Settings className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">Notification Preferences</h3>
                  <p className="text-blue-700 mt-1">
                    You are receiving rent-related notifications via Email and SMS. 
                    <button className="ml-2 text-blue-600 hover:text-blue-800 underline font-medium">
                      Update preferences
                    </button>
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  <Mail className="w-3 h-3" /> Email
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  <MessageSquare className="w-3 h-3" /> SMS
                </span>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          {tenantNotifications.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">You're all caught up!</h3>
              <p className="text-gray-600">
                No notifications at the moment. We'll notify you about rent reminders, payments, and important updates.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {tenantNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => isUnread(notification) && markAsRead(notification.id)}
                  className={`bg-white rounded-xl border p-6 transition-all duration-200 ${
                    isUnread(notification)
                      ? 'border-blue-300 shadow-md cursor-pointer hover:shadow-lg hover:-translate-y-0.5 ring-1 ring-blue-100'
                      : 'border-gray-200 shadow-sm'
                  } ${markingRead === notification.id ? 'opacity-50 cursor-wait' : ''}`}
                  role={isUnread(notification) ? 'button' : 'article'}
                  tabIndex={isUnread(notification) ? 0 : -1}
                  aria-label={isUnread(notification) ? `Mark notification "${notification.title}" as read` : undefined}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && isUnread(notification)) {
                      e.preventDefault();
                      markAsRead(notification.id);
                    }
                  }}
                >
                  <div className="flex items-start gap-4">
                    {/* Type Icon */}
                    <div className={`rounded-lg p-3 border ${getTypeBadgeColor(notification.type)}`}>
                      {getTypeIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className={`text-lg font-semibold ${isUnread(notification) ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h3>
                          {isUnread(notification) && (
                            <span className="inline-flex items-center px-2 py-1 bg-blue-600 text-white rounded-full text-xs font-semibold animate-pulse">
                              New
                            </span>
                          )}
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border capitalize ${getTypeColor(notification.type)}`}>
                            {notification.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 text-sm flex-shrink-0">
                          {getChannelIcon(notification.channel)}
                          <span>{notification.channel}</span>
                        </div>
                      </div>
                      
                      <p className={`text-base mb-4 leading-relaxed ${isUnread(notification) ? 'text-gray-800' : 'text-gray-600'}`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>{notification.sentDate}</span>
                        <span className="mx-2">•</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          notification.status === 'Read' ? 'bg-green-100 text-green-700' : 
                          notification.status === 'Sent' ? 'bg-blue-100 text-blue-700' : 
                          'bg-red-100 text-red-700'
                        }`}>
                          {notification.status}
                        </span>
                      </div>
                      
                      {isUnread(notification) && (
                        <div className="mt-3 text-sm text-blue-600 font-medium">
                          Click to mark as read
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TenantNotification;