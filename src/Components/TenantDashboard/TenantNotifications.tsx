import { API_BASE_URL } from '../../config';
import React, { useState, useEffect } from 'react';
import { Bell, AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { getUser } from '../../utils/auth';

interface Notification {
  id: string;
  type: 'reminder' | 'overdue' | 'payment' | 'maintenance' | 'general';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface TenantNotificationsResponse {
  status: 'success' | 'error';
  tenant_id: string;
  tenant_name?: string;
  notifications?: Notification[];
  logs?: Notification[];
  message?: string;
}

const TenantNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [tenantId, setTenantId] = useState<string>('');
  const [tenantName, setTenantName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    const fetchTenantNotifications = async () => {
      try {
        setLoading(true);
        setError('');

        const currentUser = getUser();
        const loggedInTenantId = currentUser?.id?.toString() || currentUser?.user_id?.toString() || currentUser?.tenant_id?.toString() || currentUser?.shop_number?.toString() || 'T-001';

        // Fetch notifications for the logged-in tenant
        const response = await fetch(`${API_BASE_URL}/get_tenant_notifications.php?tenant_id=${loggedInTenantId}`, {
          method: 'GET',
          credentials: 'include', // Include session cookies for authentication
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to fetch notifications`);
        }

        const text = await response.text();
        
        if (!text) {
          throw new Error('Empty response from server');
        }

        const data: TenantNotificationsResponse = JSON.parse(text);

        if (data.status === 'success' && isMounted) {
          setTenantId(data.tenant_id);
          setTenantName(data.tenant_name || '');
          
          const mappedNotifications = data.notifications || data.logs || [];
          setNotifications(mappedNotifications);
        } else {
          throw new Error(data.message || 'Failed to load notifications');
        }
      } catch (err) {
        console.error('Error fetching tenant notifications:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Server connection failed');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTenantNotifications();

    return () => {
      isMounted = false;
    };
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reminder':
        return <Bell className="w-5 h-5 text-blue-600" />;
      case 'overdue':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'payment':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'maintenance':
        return <Clock className="w-5 h-5 text-orange-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationBorderColor = (type: string, priority: string) => {
    if (priority === 'high') return 'border-l-red-500';
    if (priority === 'medium') return 'border-l-yellow-500';
    
    switch (type) {
      case 'overdue':
        return 'border-l-red-500';
      case 'payment':
        return 'border-l-green-500';
      case 'reminder':
        return 'border-l-blue-500';
      case 'maintenance':
        return 'border-l-orange-500';
      default:
        return 'border-l-gray-300';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return timestamp; // Return original if parsing fails
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(API_BASE_URL + '/mark_notification_read.php', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notification_id: notificationId
        })
      });

      if (response.ok) {
        // Update local state optimistically
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, read: true }
              : notification
          )
        );
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">My Notifications</h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading notifications...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">My Notifications</h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <XCircle className="w-8 h-8 text-red-500 mr-3" />
          <div className="text-center">
            <p className="text-red-600 font-medium">Failed to load notifications</p>
            <p className="text-gray-500 text-sm mt-1">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
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

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No notifications found</p>
            <p className="text-gray-400 text-sm">You're all caught up!</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`border-l-4 ${getNotificationBorderColor(notification.type, notification.priority)} bg-gray-50 p-4 rounded-r-lg hover:bg-gray-100 transition-colors cursor-pointer ${
                !notification.read ? 'bg-blue-50 border-l-blue-500' : ''
              }`}
              onClick={() => !notification.read && markAsRead(notification.id)}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900 truncate">
                      {notification.title}
                    </h3>
                    {!notification.read && (
                      <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                    )}
                    {notification.priority === 'high' && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        High Priority
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 text-sm mb-2 leading-relaxed">
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimestamp(notification.timestamp)}</span>
                    <span className="capitalize px-2 py-1 bg-gray-200 rounded-full">
                      {notification.type}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      {notifications.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Total: {notifications.length} notifications</span>
            <span>
              Unread: {notifications.filter(n => !n.read).length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantNotifications;