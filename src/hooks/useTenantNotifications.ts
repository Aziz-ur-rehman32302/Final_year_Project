import { useState, useEffect } from 'react';

interface TenantNotification {
  id: string;
  type: "reminder" | "overdue" | "payment";
  title: string;
  message: string;
  channel: "SMS" | "Email" | "Push";
  status: "Sent" | "Failed" | "Pending";
  sentDate: string;
  read: boolean;
}

export const useTenantNotifications = (tenantId: string) => {
  const [notifications, setNotifications] = useState<TenantNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!tenantId) return;

    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await fetch(`http://localhost/plaza_management_system_backend/get_tenant_notifications.php?tenant_id=${tenantId}`, {
          method: 'GET',
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }
        
        const data = await response.json();
        
        if (data.status === 'success') {
          setNotifications(data.notifications);
        } else {
          throw new Error(data.message || 'Failed to load notifications');
        }
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [tenantId]);

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch('http://localhost/plaza_management_system_backend/mark_notification_read.php', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notification_id: notificationId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      const data = await response.json();
      
      if (data.status === 'success') {
        // Update local state
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

  return {
    notifications,
    loading,
    error,
    markAsRead
  };
};