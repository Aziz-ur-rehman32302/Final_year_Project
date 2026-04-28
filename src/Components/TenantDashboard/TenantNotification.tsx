import { API_BASE_URL } from '../../config';
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
import { getUser } from '../../utils/auth';

// TypeScript interfaces
interface TenantNotification {
  id: string;
  type: 'reminder' | 'overdue' | 'payment';
  title: string;
  message: string;
  channel: 'Email' | 'SMS' | 'Push';
  status: 'new' | 'read' | 'resolved';
  sentDate: string;
  timestamp?: string;
}

interface ApiResponse {
  status: 'success' | 'error';
  notifications?: TenantNotification[];
  logs?: TenantNotification[];
  message?: string;
}

interface MarkReadResponse {
  status: 'success' | 'error';
  message?: string;
}

const TenantNotification: React.FC = () => {
  // Get logged-in tenant ID from localStorage or context
  const getLoggedInTenantId = (): string => {
    // Try to get tenant ID from the authenticated user first
    try {
      const currentUser = getUser();
      if (currentUser) {
        return currentUser.id?.toString() || currentUser.user_id?.toString() || currentUser.tenant_id?.toString() || currentUser.shop_number?.toString() || 'T-001';
      }
    } catch (e) {
      console.warn('Failed to parse user', e);
    }
    
    // Fallback: try to get from localStorage
    const tenantId = localStorage.getItem('tenantId') || localStorage.getItem('tenant_id');
    if (tenantId) return tenantId;
    
    return 'T-001'; // Default tenant ID
  };

  // State management
  const [tenantNotifications, setTenantNotifications] = useState<TenantNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [markingRead, setMarkingRead] = useState<string>(''); // ID of notification being marked as read
  const [loggedInTenantId] = useState<string>(getLoggedInTenantId());
  
  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string>('');
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [activeNotificationId, setActiveNotificationId] = useState<string | null>(null);

  // Preference State
  const [preferences, setPreferences] = useState({ email: true, sms: true, push: false });
  const [isUpdatingPreferences, setIsUpdatingPreferences] = useState(false);
  const [preferenceSuccess, setPreferenceSuccess] = useState(false);

  // Fetch tenant-specific notifications from API
  const fetchNotifications = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      setError('');
      
      const response = await fetch(
        `${API_BASE_URL}/get_tenant_notifications.php?tenant_id=${loggedInTenantId}`,
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
      
      console.log('API Response:', data); // Debugging response structure
      
      if (data.status === 'success') {
        const notifications = data.notifications || [];
        
        // Sort notifications by date (newest first)
        const sortedNotifications = notifications.sort((a, b) => {
          const dateB = b.sentDate || b.timestamp || '';
          const dateA = a.sentDate || a.timestamp || '';
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        });
        
        // Ensure proper mapping to TenantNotification
        const normalizedNotifications: TenantNotification[] = sortedNotifications.map((n: any) => ({
          ...n,
          status: n.status || 'new',
          sentDate: n.sentDate || n.timestamp || new Date().toISOString()
        }));
        
        setTenantNotifications(normalizedNotifications);
        
        // Calculate unread count (notifications that are 'new')
        const unread = normalizedNotifications.filter(notification => notification.status === 'new').length;
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
    if (!notification || notification.status === 'read' || notification.status === 'resolved') return;
    
    try {
      setMarkingRead(notificationId);
      
      const response = await fetch(API_BASE_URL + '/mark_notification_read.php', {
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
              ? { ...notification, status: 'read' as const }
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
    fetchPreferences();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => fetchNotifications(false), 30000);
    
    return () => clearInterval(interval);
  }, [fetchNotifications]);
  
  // Fetch Preferences
  const fetchPreferences = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/get_tenant_notification_preferences.php?tenant_id=${loggedInTenantId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success' && data.data?.preferences) {
          setPreferences(data.data.preferences);
        }
      }
    } catch (e) {
      console.error('Failed to load preferences', e);
    }
  };

  // Update Preferences
  const updatePreferences = async () => {
    setIsUpdatingPreferences(true);
    setPreferenceSuccess(false);
    try {
      const response = await fetch(API_BASE_URL + '/update_tenant_notification_preferences.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tenant_id: loggedInTenantId,
          enable_email: preferences.email,
          enable_sms: preferences.sms,
          enable_push: preferences.push
        })
      });
      if (response.ok) {
        setPreferenceSuccess(true);
        setTimeout(() => setPreferenceSuccess(false), 3000);
      }
    } catch (e) {
      console.error('Failed to update preferences', e);
    } finally {
      setIsUpdatingPreferences(false);
    }
  };
  
  const togglePreference = (key: 'email' | 'sms' | 'push') => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Payment UI Handlers
  const handleResolveClick = (notificationId: string) => {
    setActiveNotificationId(notificationId);
    setShowPaymentModal(true);
    setPaymentError('');
    setSelectedPaymentMethod('');
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setActiveNotificationId(null);
  };

  const processPayment = async () => {
    if (!selectedPaymentMethod) {
      setPaymentError('Please select a payment method');
      return;
    }
    
    setIsProcessingPayment(true);
    setPaymentError('');
    
    try {
      // Simulate network request for payment
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (activeNotificationId) {
        const resolveResponse = await fetch(API_BASE_URL + '/resolve_notification.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notification_id: activeNotificationId })
        });
        
        if (resolveResponse.ok) {
           setTenantNotifications(prev => 
             prev.map(n => n.id === activeNotificationId ? { ...n, status: 'resolved' as const } : n)
           );
           // Calculate proper unread drop locally if changing from 'new' -> 'resolved'
           const targetNotification = tenantNotifications.find(n => n.id === activeNotificationId);
           if (targetNotification && targetNotification.status === 'new') {
              setUnreadCount(prev => Math.max(0, prev - 1));
           }
        }
      }
      
      setPaymentSuccess(true);
      
      setTimeout(() => {
        setPaymentSuccess(false);
        closePaymentModal();
      }, 2000);
      
    } catch (err) {
      setPaymentError('Payment failed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

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

  const isUnread = (notification: any) => notification.status === 'new';

  // Calculate read count
  const readCount = tenantNotifications.length - unreadCount;

  return (
    <div className="p-4 sm:p-6 w-full overflow-x-hidden bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
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
        <p className="text-gray-600 text-base sm:text-lg">
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
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <Settings className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">Notification Preferences</h3>
                  <p className="text-blue-700 mt-1">
                    Select the channels you wish to receive rent-related notifications on.
                  </p>
                  {preferenceSuccess && (
                     <p className="text-green-600 font-medium mt-2 text-sm">Preferences updated successfully!</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-3 min-w-[200px]">
                <div className="flex flex-wrap gap-2">
                  <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="hidden" checked={preferences.email} onChange={() => togglePreference('email')} />
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${preferences.email ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'}`}>
                      <Mail className="w-3 h-3" /> Email
                    </span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="hidden" checked={preferences.sms} onChange={() => togglePreference('sms')} />
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${preferences.sms ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'}`}>
                      <MessageSquare className="w-3 h-3" /> SMS
                    </span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="hidden" checked={preferences.push} onChange={() => togglePreference('push')} />
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${preferences.push ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'}`}>
                      <Smartphone className="w-3 h-3" /> Dashboard
                    </span>
                  </label>
                </div>
                <button
                  onClick={updatePreferences}
                  disabled={isUpdatingPreferences}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white text-sm font-semibold rounded-lg disabled:opacity-50"
                >
                  {isUpdatingPreferences ? 'Saving...' : 'Update preferences'}
                </button>
              </div>
            </div>
          </div>

          {/* Payment Modal Overlay */}
          {showPaymentModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] px-4 animate-fade-in backdrop-blur-sm">
              <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-slide-up transform transition-all">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 border-b pb-2 w-full">Resolve Overdue Rent</h3>
                  <button 
                    onClick={closePaymentModal}
                    className="absolute top-6 right-6 p-2 bg-gray-100 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                  </button>
                </div>
                
                {paymentSuccess ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                      <CheckCircle className="w-10 h-10" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h4>
                    <p className="text-gray-500 text-center">Your rent has been paid. The notification will now be marked as read.</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-6">
                      <p className="text-gray-600 mb-4 text-sm font-medium">Please select a digital payment method to settle your overdue balance.</p>
                      
                      {/* Payment Method Selection */}
                      <div className="space-y-3">
                        <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${selectedPaymentMethod === 'JazzCash' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'}`}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="JazzCash"
                            checked={selectedPaymentMethod === 'JazzCash'}
                            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                            className="hidden"
                          />
                          <div className="flex items-center w-full">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4 shadow-sm">
                              <span className="text-purple-700 font-bold text-lg">J</span>
                            </div>
                            <span className="font-semibold text-gray-800 text-lg">JazzCash</span>
                            <div className="ml-auto">
                               {selectedPaymentMethod === 'JazzCash' && <CheckCircle className="w-6 h-6 text-purple-600" />}
                            </div>
                          </div>
                        </label>
                        
                        <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${selectedPaymentMethod === 'EasyPaisa' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'}`}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="EasyPaisa"
                            checked={selectedPaymentMethod === 'EasyPaisa'}
                            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                            className="hidden"
                          />
                          <div className="flex items-center w-full">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4 shadow-sm">
                              <span className="text-green-700 font-bold text-lg">E</span>
                            </div>
                            <span className="font-semibold text-gray-800 text-lg">EasyPaisa</span>
                            <div className="ml-auto">
                               {selectedPaymentMethod === 'EasyPaisa' && <CheckCircle className="w-6 h-6 text-green-600" />}
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                    
                    {/* Error Message */}
                    {paymentError && (
                      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 flex items-start shadow-sm">
                        <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                        <p className="text-sm font-medium">{paymentError}</p>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-8">
                      <button
                        onClick={closePaymentModal}
                        className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={processPayment}
                        disabled={isProcessingPayment || !selectedPaymentMethod}
                        className={`flex-1 px-4 py-3 font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
                          isProcessingPayment || !selectedPaymentMethod
                            ? 'bg-blue-300 text-blue-50 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg active:scale-95'
                        }`}
                      >
                        {isProcessingPayment ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Processing...
                          </>
                        ) : (
                          'Pay Now'
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

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
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className={`text-base sm:text-lg font-semibold ${isUnread(notification) ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h3>
                          {isUnread(notification) && (
                            <span className="inline-flex items-center px-2 py-1 bg-blue-600 text-white rounded-full text-xs font-semibold animate-pulse">
                              New
                            </span>
                          )}
                          <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium border capitalize ${getTypeColor(notification.type)}`}>
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
                        <span className={`px-2 py-1 rounded text-xs font-medium text-white ${
                          notification.status === 'resolved' ? 'bg-green-500' : 
                          notification.status === 'read' ? 'bg-blue-500' : 
                          'bg-orange-500'
                        }`}>
                          {notification.status === 'new' ? 'Pending Action' : notification.status === 'read' ? 'Read' : 'Paid / Completed'}
                        </span>
                      </div>
                      
                      {isUnread(notification) && (
                        <div className="mt-4 flex gap-3">
                          {notification.type === 'overdue' ? (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleResolveClick(notification.id); }}
                              className="px-5 py-2 flex-grow sm:flex-grow-0 items-center justify-center bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors active:scale-95 shadow-sm"
                            >
                              Resolve
                            </button>
                          ) : (
                            <button
                               onClick={(e) => { e.stopPropagation(); markAsRead(notification.id); }}
                               className="px-5 py-2 flex-grow sm:flex-grow-0 items-center justify-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors active:scale-95 shadow-sm"
                            >
                               Mark as Read
                            </button>
                          )}
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