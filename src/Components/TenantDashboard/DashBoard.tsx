import {
  DollarSign,
  AlertCircle,
  CheckCircle,
  Calendar,
  FileText,
  MessageSquare,
  Loader2,
  Bell,
  Clock,
  Eye,
  Mail,
  Smartphone,
} from "lucide-react";
import { useState, useEffect } from "react";
import { getToken } from "../../utils/auth";
import TenantIssues from "./TenantIssues";

const DashBoard = () => {
  // API Data State
  const [tenantData, setTenantData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Payment modal states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  // Legacy states for compatibility
  const [payPayment, setPayPayment] = useState(false);
  const [payPaymentSuccessFully, setPayPaymentSuccessFully] = useState(false);
  
  // Fetch tenant data on component mount
  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        const token = getToken();
        if (!token) {
          setError('No authentication token found');
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost/plaza_management_system_backend/payment_status.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const responseText = await response.text();
        
        if (!responseText) {
          throw new Error('Empty response from server');
        }

        let result;
        try {
          result = JSON.parse(responseText);
        } catch (parseError) {
          throw new Error('Invalid response format');
        }

        if (result.status === 'success' && result.data) {
          console.log('API Response:', result);
          console.log('Tenant Data Structure:', result.data);
          
          // Extract data from the nested structure
          const tenantInfo = result.data.tenant_info || {};
          const paymentSummary = result.data.payment_summary || {};
          
          // Create a flattened data structure for easier access
          const currentTenantData = {
            // From tenant_info
            shop_number: tenantInfo.shop_number,
            tenant_name: tenantInfo.username,
            email: tenantInfo.email,
            phone: tenantInfo.phone,
            rent_amount: tenantInfo.rent_amount, // This is in tenant_info, not payment_summary!
            
            // From payment_summary
            payment_status: tenantInfo.current_status === 'paid' ? 'Paid' : 'Unpaid', // Use tenant_info.current_status
            current_month_paid: paymentSummary.current_month_paid,
            due_date: paymentSummary.due_date,
            last_payment_date: paymentSummary.last_payment_date,
            total_amount_paid: paymentSummary.total_amount_paid,
            total_payments: paymentSummary.total_payments,
            
            // Keep original nested data for reference
            tenant_info: tenantInfo,
            payment_summary: paymentSummary,
            payment_history: result.data.payment_history || []
          };
          
          console.log('Tenant Info:', tenantInfo);
          console.log('Payment Summary:', paymentSummary);
          console.log('Processed Tenant Data:', currentTenantData);
          setTenantData(currentTenantData);
          // Set payment status based on API data
          setPayPayment(tenantInfo.current_status === 'paid');
        } else {
          console.log('API Error Response:', result);
          setError(result.message || 'Failed to fetch tenant data');
        }
      } catch (err) {
        console.error('API Error:', err);
        setError('Failed to load tenant data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTenantData();
  }, []);
  

  
  // Fetch financial summary
  useEffect(() => {
    const fetchFinancialSummary = async () => {
      try {
        const token = getToken();
        if (!token) {
          setFinancialError('No authentication token found');
          setLoadingFinancial(false);
          return;
        }

        const response = await fetch('http://localhost/plaza_management_system_backend/tenant_financial_summary.php', {
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

        if (result.status === 'success' && result.data) {
          setFinancialData(result.data);
          console.log('Financial Summary:', result.data);
        } else {
          setFinancialError(result.message || 'Failed to fetch financial data');
        }
      } catch (err) {
        console.error('Financial data fetch error:', err);
        setFinancialError('Failed to load financial data. Please try again.');
      } finally {
        setLoadingFinancial(false);
      }
    };

    fetchFinancialSummary();
  }, []);
  
  // Fetch rent history
  useEffect(() => {
    const fetchRentHistory = async () => {
      try {
        const token = getToken();
        if (!token) {
          setRentHistoryError('No authentication token found');
          setLoadingRentHistory(false);
          return;
        }

        const response = await fetch('http://localhost/plaza_management_system_backend/fetch_rent_history.php', {
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
          // Sort records with latest month first
          const sortedHistory = (result.data || []).sort((a, b) => {
            const dateA = new Date(a.month);
            const dateB = new Date(b.month);
            return dateB - dateA; // Latest first
          });
          
          setRentHistory(sortedHistory);
          console.log('Rent History:', sortedHistory);
        } else {
          setRentHistoryError(result.message || 'Failed to fetch rent history');
        }
      } catch (err) {
        console.error('Rent history fetch error:', err);
        setRentHistoryError('Failed to load rent history. Please try again.');
      } finally {
        setLoadingRentHistory(false);
      }
    };

    fetchRentHistory();
  }, []);
  
  // Fetch notifications for logged-in tenant
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setNotificationsLoading(true);
        setNotificationsError('');
        
        const token = getToken();
        if (!token) {
          setNotificationsError('No authentication token found');
          setNotificationsLoading(false);
          return;
        }

        const response = await fetch('http://localhost/plaza_management_system_backend/get_notifications.php', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to fetch notifications`);
        }

        const responseText = await response.text();
        
        if (!responseText) {
          throw new Error('Empty response from server');
        }

        let result;
        try {
          result = JSON.parse(responseText);
        } catch (parseError) {
          throw new Error('Invalid response format');
        }

        if (result.status === 'success' || result.tenant_id) {
          // Handle both response formats
          const tenantIdFromResponse = result.tenant_id;
          const notificationData = result.notifications || [];
          const counts = result.counts || {
            total: notificationData.length,
            unread: notificationData.filter(n => n.status === 'unread').length,
            read: notificationData.filter(n => n.status === 'read').length
          };
          
          setTenantId(tenantIdFromResponse);
          setNotifications(notificationData);
          setNotificationCounts(counts);
          
          console.log('Notifications loaded for tenant:', tenantIdFromResponse);
          console.log('Notifications:', notificationData);
          console.log('Counts:', counts);
        } else {
          setNotificationsError(result.message || 'Failed to fetch notifications');
        }
      } catch (err) {
        console.error('Notifications fetch error:', err);
        setNotificationsError('Failed to load notifications. Please try again.');
      } finally {
        setNotificationsLoading(false);
      }
    };

    fetchNotifications();
  }, []);
  
  // Payment processing function
  const processPayment = async () => {
    if (!selectedPaymentMethod) {
      setPaymentError('Please select a payment method');
      return;
    }
    
    setIsProcessingPayment(true);
    setPaymentError('');
    
    try {
      const token = getToken();
      if (!token) {
        setPaymentError('Authentication required. Please login again.');
        setIsProcessingPayment(false);
        return;
      }
      
      // Get current user info for tenant ID
      const storedUser = localStorage.getItem('user');
      const currentUser = storedUser ? JSON.parse(storedUser) : null;
      
      const paymentData = {
        tenant_id: tenantData?.tenant_info?.id || currentUser?.id || currentUser?.user_id || currentUser?.tenant_id,
        payment_method: selectedPaymentMethod,
        payment_amount: tenantData?.rent_amount || tenantData?.tenant_info?.rent_amount
      };
      
      console.log('Sending payment request to:', 'http://localhost/plaza_management_system_backend/process_payment.php');
      console.log('Payment data:', paymentData);
      console.log('Authorization token:', token ? 'Present' : 'Missing');
      
      const response = await fetch('http://localhost/plaza_management_system_backend/process_payment.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers.get('content-type'));
      
      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      if (!responseText || responseText.trim() === '') {
        throw new Error('Empty response from server. Please verify the API endpoint exists.');
      }
      
      let result;
      try {
        result = JSON.parse(responseText);
        console.log('Parsed result:', result);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Response was:', responseText);
        throw new Error('Server returned invalid JSON response.');
      }
      
      if (result.status === 'success') {
        // Call update_payment_status.php to update backend
        await updatePaymentStatus(tenantData?.tenant_info?.id || currentUser?.id || currentUser?.user_id || currentUser?.tenant_id);
        
        // Update local state immediately for real-time UI update
        setTenantData(prev => ({
          ...prev,
          payment_status: 'Paid'
        }));
        
        // Close modal and reset all form fields
        setShowPaymentModal(false);
        setSelectedPaymentMethod('');
        setPaymentError('');
        
        // Show engaging success animation
        setPayPaymentSuccessFully(true);
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setPayPaymentSuccessFully(false);
        }, 5000);
        
        console.log('✅ Payment successful via', selectedPaymentMethod);
      } else {
        // Handle API error response
        const errorMessage = result.message || result.error || 'Payment processing failed. Please try again.';
        setPaymentError(errorMessage);
        console.error('❌ Payment failed:', errorMessage);
      }
    } catch (err) {
      console.error('💥 Payment processing error:', err);
      
      // Handle different types of errors with user-friendly messages
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setPaymentError('❌ Network Error: Unable to connect to payment server. Please check your internet connection.');
      } else if (err.message.includes('HTTP 404')) {
        setPaymentError('❌ API Error: Payment endpoint not found. Please contact support.');
      } else if (err.message.includes('HTTP 500')) {
        setPaymentError('❌ Server Error: Payment service is temporarily unavailable. Please try again later.');
      } else if (err.message.includes('Empty response')) {
        setPaymentError('❌ Server Error: No response from payment service. Please verify the API is running.');
      } else if (err.message.includes('invalid JSON')) {
        setPaymentError('❌ Server Error: Invalid response format. Please contact technical support.');
      } else {
        setPaymentError('❌ Unexpected Error: Something went wrong. Please try again or contact support.');
      }
    } finally {
      setIsProcessingPayment(false);
    }
  };
  
  // Update payment status in backend
  const updatePaymentStatus = async (tenantId) => {
    try {
      const token = getToken();
      const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
      
      const response = await fetch('http://localhost/plaza_management_system_backend/update_payment_status.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          tenant_id: tenantId,
          payment_status: 'paid',
          last_payment_date: currentDateTime
        })
      });
      
      const result = await response.json();
      console.log('Payment status updated:', result);
    } catch (err) {
      console.error('Failed to update payment status:', err);
    }
  };
  
  // Mark notification as read
  const markNotificationAsRead = async (notificationId) => {
    try {
      setMarkingAsRead(notificationId.toString());
      
      const token = getToken();
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await fetch('http://localhost/plaza_management_system_backend/mark_notification_read.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          notification_id: notificationId
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to mark notification as read`);
      }

      const responseText = await response.text();
      
      if (!responseText) {
        throw new Error('Empty response from server');
      }

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error('Invalid response format');
      }

      if (result.status === 'success') {
        // Update local state optimistically
        setNotifications(prev => 
          prev.map(notification => 
            notification.notification_id === notificationId 
              ? { ...notification, status: 'read' }
              : notification
          )
        );
        
        // Update counts dynamically
        setNotificationCounts(prev => ({
          ...prev,
          unread: Math.max(0, prev.unread - 1),
          read: prev.read + 1
        }));
        
        console.log('Notification marked as read:', notificationId);
      } else {
        console.error('Failed to mark notification as read:', result.message);
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    } finally {
      setMarkingAsRead('');
    }
  };
  
  // Report Issue function
  const reportIssue = async (e) => {
    e.preventDefault();
    
    // Validate issue description
    if (!issueDescription.trim()) {
      setIssueError('Please describe your issue before submitting.');
      return;
    }
    
    setIsSubmittingIssue(true);
    setIssueError('');
    
    try {
      const token = getToken();
      if (!token) {
        setIssueError('Authentication required. Please login again.');
        setIsSubmittingIssue(false);
        return;
      }
      
      // Get tenant ID from current data
      const tenantId = tenantData?.tenant_info?.id;
      if (!tenantId) {
        setIssueError('Unable to identify tenant. Please refresh and try again.');
        setIsSubmittingIssue(false);
        return;
      }
      
      const issueData = {
        tenant_id: tenantId,
        issue_description: issueDescription.trim()
      };
      
      console.log('Submitting issue:', issueData);
      
      const response = await fetch('http://localhost/plaza_management_system_backend/report_issue.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(issueData)
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
        throw new Error('Invalid response format from server');
      }
      
      if (result.status === 'success') {
        // Clear form and show success
        setIssueDescription('');
        setIssueSuccess(true);
        
        // Trigger issues refresh after successful submission
        setTimeout(() => {
          setIssuesRefreshTrigger(prev => prev + 1);
        }, 1000);
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          setIssueSuccess(false);
        }, 5000);
        
        console.log('✅ Issue reported successfully');
      } else {
        // Handle API error response
        const errorMessage = result.message || result.error || 'Failed to submit issue. Please try again.';
        setIssueError(errorMessage);
        console.error('❌ Issue submission failed:', errorMessage);
      }
    } catch (err) {
      console.error('💥 Issue submission error:', err);
      
      // Handle different types of errors
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setIssueError('❌ Network Error: Unable to connect to server. Please check your internet connection.');
      } else if (err.message.includes('HTTP 404')) {
        setIssueError('❌ Service Error: Issue reporting service not found. Please contact support.');
      } else if (err.message.includes('HTTP 500')) {
        setIssueError('❌ Server Error: Issue reporting service is temporarily unavailable. Please try again later.');
      } else if (err.message.includes('Empty response')) {
        setIssueError('❌ Server Error: No response from issue reporting service.');
      } else if (err.message.includes('Invalid response')) {
        setIssueError('❌ Server Error: Invalid response format. Please contact technical support.');
      } else {
        setIssueError('❌ Unexpected Error: Something went wrong. Please try again or contact support.');
      }
    } finally {
      setIsSubmittingIssue(false);
    }
  };
  
  // Open payment modal
  const handlePayNowClick = () => {
    setShowPaymentModal(true);
    setPaymentError('');
    setSelectedPaymentMethod('');
  };
  
  // Close payment modal
  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setPaymentError('');
    setSelectedPaymentMethod('');
  };
  const showPaymentMessage = () => {
    handlePayNowClick();
  };
  
  // Get notification type icon
  const getNotificationIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'reminder':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'payment':
        return <DollarSign className="w-5 h-5 text-green-600" />;
      case 'overdue':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'announcement':
        return <Bell className="w-5 h-5 text-purple-600" />;
      case 'new':
        return <Bell className="w-5 h-5 text-blue-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };
  
  // Get notification type badge styling
  const getNotificationBadge = (type) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize";
    
    switch (type?.toLowerCase()) {
      case 'reminder':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'payment':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'overdue':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'announcement':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case 'new':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };
  
  // Get delivery method icon
  const getDeliveryIcon = (method) => {
    switch (method?.toLowerCase()) {
      case 'email':
        return <Mail className="w-4 h-4 text-gray-600" />;
      case 'sms':
        return <Smartphone className="w-4 h-4 text-gray-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };
  
  // Format timestamp for notifications
  const formatNotificationTime = (timestamp) => {
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
  //  --------------------------------------------------------
  // Issue reporting states
  const [issueDescription, setIssueDescription] = useState("");
  const [isSubmittingIssue, setIsSubmittingIssue] = useState(false);
  const [issueError, setIssueError] = useState('');
  const [issueSuccess, setIssueSuccess] = useState(false);
  
  // Tenant issues refresh trigger
  const [issuesRefreshTrigger, setIssuesRefreshTrigger] = useState(0);
  
  // Financial summary states
  const [financialData, setFinancialData] = useState(null);
  const [loadingFinancial, setLoadingFinancial] = useState(true);
  const [financialError, setFinancialError] = useState('');
  
  // Rent history states
  const [rentHistory, setRentHistory] = useState([]);
  const [loadingRentHistory, setLoadingRentHistory] = useState(true);
  const [rentHistoryError, setRentHistoryError] = useState('');
  
  // Notification states
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [notificationsError, setNotificationsError] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [notificationCounts, setNotificationCounts] = useState({
    total: 0,
    unread: 0,
    read: 0
  });
  const [markingAsRead, setMarkingAsRead] = useState('');
  return (
    <div className="p-5 w-full">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-gray-900 font-semibold text-xl mb-2">
          Tenant Dashboard
        </h1>
        <p className="text-gray-600 text-lg">
          Welcome back! Manage your rent and view payment history.
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-blue-600">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-lg">Loading your dashboard...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mt-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
          <button 
            onClick={() => window.location.reload()}
            className="ml-auto bg-red-100 hover:bg-red-200 px-3 py-1 rounded text-sm transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Content - Only show when data is loaded */}
      {!loading && !error && tenantData && (
        <div className="animate-slide-up">

      {/* --------------------------------------------- */}
      <div className="border border-gray-300 p-4 mt-6 w-full bg-gray-50 rounded-xl">
        <p className="flex text-lg">
          <span className="mt-0.5 text-blue-700">
            <DollarSign />
          </span>{" "}
          Current Rent Status
        </p>

        {/* ----------------------------------------------- */}
          {/* Enhanced Success Toast with Engaging Animation */}
        {payPaymentSuccessFully && (
          <div className="fixed top-4 right-4 bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 transform transition-all duration-700 ease-out animate-slide-in">
            <div className="flex-shrink-0">
              <div className="relative">
                <CheckCircle className="w-8 h-8 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
              </div>
            </div>
            <div className="flex-grow">
              <p className="font-bold text-lg flex items-center gap-2">
                Payment Successful! 
                <span className="text-xl animate-bounce">🎉</span>
              </p>
              <p className="text-sm opacity-90 font-medium">
                ✅ Paid via {selectedPaymentMethod || 'selected method'}
              </p>
              <p className="text-xs opacity-75 mt-1">
                Your payment status has been updated
              </p>
            </div>
            <div className="flex-shrink-0">
              <button 
                onClick={() => setPayPaymentSuccessFully(false)}
                className="text-white hover:text-gray-200 transition-colors p-1 hover:bg-white hover:bg-opacity-20 rounded-full"
              >
                ✕
              </button>
            </div>
          </div>
        )}
        {/* ---------------------------------------------- */}
        {/* cards section  */}
        <div className="relative">
          <div className="grid md:grid-cols-3 w-full grid-cols-1 gap-8 mt-3">
            <div className="p-5 border border-gray-400 rounded-xl bg-blue-400 hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all duration-300 ease-in-out animate-card-appear">
              <p className="text-lg text-white">Shop Number</p>
              <h1 className="font-semibold text-2xl text-white">{tenantData.shop_number || 'N/A'}</h1>
            </div>

            <div className="p-5 border border-gray-400 rounded-xl hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all duration-300 ease-in-out animate-card-appear" style={{animationDelay: '0.1s'}}>
              <p className="text-lg">Monthly Rent</p>
              <h1 className="font-semibold text-2xl">${tenantData.rent_amount || 'N/A'}</h1>
            </div>

            <div className="p-5 border border-gray-400 rounded-xl hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all duration-300 ease-in-out animate-card-appear" style={{animationDelay: '0.2s'}}>
              {tenantData.payment_status === 'Paid' ? (
                <div>
                  <p className="text-lg">Payment Status</p>
                  <h1 className="font-semibold gap-1 text-green-400 flex text-xl">
                    <CheckCircle className="w-5 h-5 mt-1 text-green-400" />
                    Paid
                  </h1>
                </div>
              ) : (
                <div>
                  <p className="text-lg">Payment Status</p>
                  <h1 className="font-semibold gap-1 text-red-400 flex text-xl">
                    <AlertCircle className="w-5 h-5 mt-1 text-red-400" />
                    {tenantData.payment_status || 'Unpaid'}
                  </h1>
                </div>
              )}
            </div>
            {/* card section end  */}
          </div>
          {/* Dynamic Payment Status Message */}
          {tenantData.payment_status === 'Paid' ? (
            <div className="bg-gradient-to-r from-green-50 to-green-100 grid grid-cols-1 mt-4 gap-2 border border-green-300 rounded-lg p-4 shadow-sm">
              <div className="flex gap-2">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-lg font-semibold text-green-800">Payment Confirmed ✅</p>
                  <p className="text-sm text-green-700 mt-1">
                    Your rent payment of <span className="font-semibold">${tenantData.rent_amount}</span> has been received. 
                    Thank you for your prompt payment!
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-red-50 to-orange-50 grid grid-cols-1 mt-4 gap-2 border border-red-300 rounded-lg p-4 shadow-sm">
              <div className="flex gap-2">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-lg font-semibold text-red-800">Payment Due ⚠️</p>
                  <p className="text-sm text-red-700 mt-1">
                    Your rent of <span className="font-semibold">${tenantData.rent_amount}</span> is currently due. 
                    Please make payment to avoid late fees.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Payment Modal */}
          {showPaymentModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 animate-slide-up">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Select Payment Method</h3>
                  <button 
                    onClick={closePaymentModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-600 mb-4">Amount to pay: <span className="font-semibold">${tenantData.rent_amount}</span></p>
                  
                  {/* Payment Method Selection */}
                  <div className="space-y-3">
                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="JazzCash"
                        checked={selectedPaymentMethod === 'JazzCash'}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-purple-600 font-bold text-sm">J</span>
                        </div>
                        <span className="font-medium">JazzCash</span>
                      </div>
                    </label>
                    
                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="EasyPaisa"
                        checked={selectedPaymentMethod === 'EasyPaisa'}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-green-600 font-bold text-sm">E</span>
                        </div>
                        <span className="font-medium">EasyPaisa</span>
                      </div>
                    </label>
                  </div>
                </div>
                
                {/* Error Message */}
                {paymentError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg mb-4 text-sm">
                    {paymentError}
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={closePaymentModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={processPayment}
                    disabled={isProcessingPayment || !selectedPaymentMethod}
                    className={`flex-1 px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                      isProcessingPayment || !selectedPaymentMethod
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                    }`}
                  >
                    {isProcessingPayment ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      'Pay Now'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Pay Now Button - Only show if payment is not made */}
          {tenantData.payment_status !== 'Paid' && (
            <div className="flex justify-center items-center w-full">
              <button
                onClick={handlePayNowClick}
                className="text-lg font-semibold py-3 px-8 mt-3 bg-blue-500 text-white cursor-pointer hover:bg-blue-600 hover:shadow-xl ease-in-out transition-all duration-300 active:scale-95 rounded-lg"
              >
                Pay Now
              </button>
            </div>
          )}
        </div>
      </div>
      {/* ========================================================== */}

      {/* Issue Success Toast */}
      {issueSuccess && (
        <div className="fixed top-4 right-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 transform transition-all duration-700 ease-out animate-slide-in">
          <div className="flex-shrink-0">
            <div className="relative">
              <CheckCircle className="w-8 h-8 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
            </div>
          </div>
          <div className="flex-grow">
            <p className="font-bold text-lg flex items-center gap-2">
              Issue Reported! 
              <span className="text-xl animate-bounce">📧</span>
            </p>
            <p className="text-sm opacity-90 font-medium">
              Your issue has been sent to the admin. Please wait for a response.
            </p>
          </div>
          <div className="flex-shrink-0">
            <button 
              onClick={() => setIssueSuccess(false)}
              className="text-white hover:text-gray-200 transition-colors p-1 hover:bg-white hover:bg-opacity-20 rounded-full"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="w-full border border-gray-400 rounded-xl mt-5 p-4">
        <h1 className="flex gap-2 font-semibold">
          <span>
            <MessageSquare className="w-5 h-5 mt-1" />
          </span>
          Report an Issue
        </h1>
        <p className="text-sm pt-3">
          Having a problem? Let us know and we'll get back to you as soon as
          possible.
        </p>

        <form onSubmit={reportIssue}>
          <div className="flex flex-col mt-3">
            <label className="mb-2 text-lg" htmlFor="issue">
              Issue Description *
            </label>
            <textarea
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              placeholder="Describe your issue in detail..."
              required
              id="issue"
              name="issueDescription"
              rows={5}
              className="border resize-none border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded p-2 w-full"
              disabled={isSubmittingIssue}
            ></textarea>
            
            {/* Error Message */}
            {issueError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg mt-2 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{issueError}</span>
                <button 
                  type="button"
                  onClick={() => setIssueError('')}
                  className="ml-auto text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            )}
            
            <p className="text-sm mt-3 text-gray-600">
              Your issue will be sent to the admin and displayed on their dashboard
            </p>
          </div>
          
          <div className="flex justify-center items-center">
            <button 
              type="submit"
              disabled={isSubmittingIssue || !issueDescription.trim()}
              className={`flex gap-3 text-lg font-semibold py-2 px-6 mt-3 rounded-lg transition-all duration-300 ${
                isSubmittingIssue || !issueDescription.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-xl active:scale-95'
              }`}
            >
              {isSubmittingIssue ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mt-0.5"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <MessageSquare className="w-5 h-5 mt-1" />
                  Submit Issue
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      {/* Tenant Issues Section */}
      <div className="border border-gray-200 p-4 mt-6 rounded-lg bg-gray-100">
        <h1 className="flex gap-3 text-lg font-semibold mb-4">
          <span className="w-5 h-5">
            <MessageSquare />
          </span>
          My Issues
        </h1>
        
        <TenantIssues refreshTrigger={issuesRefreshTrigger} />
      </div>
      
      {/* My Notifications Panel */}
      <div className="border border-gray-200 p-4 mt-6 rounded-lg bg-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h1 className="flex gap-3 text-lg font-semibold">
            <Bell className="w-5 h-5 mt-0.5" />
            My Notifications
          </h1>
          {/* New Notifications Count */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Tenant ID: <span className="font-medium">{tenantId || 'Loading...'}</span></span>
            {notificationCounts.unread > 0 && (
              <div className="flex items-center gap-1 bg-red-100 text-red-800 px-2 py-1 rounded-full">
                <Bell className="w-3 h-3" />
                <span className="font-medium">{notificationCounts.unread} New</span>
              </div>
            )}
            <div className="text-xs text-gray-500">
              Total: {notificationCounts.total} | Read: {notificationCounts.read}
            </div>
          </div>
        </div>
        
        {/* Loading Notifications */}
        {notificationsLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3 text-blue-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading notifications...</span>
            </div>
          </div>
        )}
        
        {/* Notifications Error */}
        {notificationsError && !notificationsLoading && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{notificationsError}</span>
            <button 
              onClick={() => window.location.reload()}
              className="ml-auto bg-red-100 hover:bg-red-200 px-3 py-1 rounded text-sm transition-colors"
            >
              Retry
            </button>
          </div>
        )}
        
        {/* Notifications List */}
        {!notificationsLoading && !notificationsError && (
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-lg font-medium">No notifications available.</p>
                <p className="text-sm">You're all caught up!</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.notification_id}
                  className={`border rounded-lg p-4 transition-all duration-200 ${
                    notification.status === 'unread' 
                      ? 'border-blue-200 bg-blue-50 shadow-sm' 
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Type icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className={`font-medium truncate ${
                          notification.status === 'unread' ? 'text-gray-900' : 'text-gray-600'
                        }`}>
                          {notification.message?.substring(0, 50)}{notification.message?.length > 50 ? '...' : ''}
                        </h3>
                        <span className={getNotificationBadge(notification.type)}>
                          {notification.type}
                        </span>
                        {notification.status === 'unread' && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                      
                      <p className={`text-sm mb-3 leading-relaxed ${
                        notification.status === 'unread' ? 'text-gray-800' : 'text-gray-500'
                      }`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{formatNotificationTime(notification.timestamp)}</span>
                        </div>
                        
                        {/* Mark as read button */}
                        {notification.status === 'unread' && (
                          <button
                            onClick={() => markNotificationAsRead(notification.notification_id)}
                            disabled={markingAsRead === notification.notification_id.toString()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {markingAsRead === notification.notification_id.toString() ? (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Marking...
                              </>
                            ) : (
                              <>
                                <Eye className="w-3 h-3" />
                                Click to mark as read
                              </>
                            )}
                          </button>
                        )}
                        
                        {notification.status === 'read' && (
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
        )}
      </div>
      {/* ============================================================ */}
      {/* Financial Summary Cards */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-blue-600" />
          Financial Summary
        </h2>
        
        {/* Loading Financial Data */}
        {loadingFinancial && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-5 border border-gray-400 rounded-xl bg-white animate-pulse">
                <div className="bg-gray-200 p-2 rounded-md w-fit mb-3">
                  <div className="w-6 h-6 bg-gray-300 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Financial Data Error */}
        {financialError && !loadingFinancial && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{financialError}</span>
            <button 
              onClick={() => window.location.reload()}
              className="ml-auto bg-red-100 hover:bg-red-200 px-3 py-1 rounded text-sm transition-colors"
            >
              Retry
            </button>
          </div>
        )}
        
        {/* Financial Summary Cards */}
        {!loadingFinancial && !financialError && financialData && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 animate-slide-up">
            {/* Due Date Card */}
            <div className="p-5 border text-white border-gray-400 rounded-xl bg-blue-600 hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all duration-300 ease-in-out animate-card-appear">
              <div className="bg-blue-600 py-1 rounded-md w-fit">
                <Calendar className="text-white" />
              </div>
              <div className="mt-1">
                <h1 className="text-lg font-semibold">{financialData.rent_due_date}th</h1>
                <p>Due Date (Monthly)</p>
              </div>
            </div>

            {/* Payments Made Card */}
            <div className="p-5 border border-gray-400 rounded-xl bg-white hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all duration-300 ease-in-out animate-card-appear" style={{animationDelay: '0.1s'}}>
              <div className="bg-green-200 p-2 rounded-md w-fit">
                <CheckCircle className="text-green-700" />
              </div>
              <div className="mt-1">
                <h1 className="text-lg font-semibold">{financialData.payments_made}</h1>
                <p>Payments Made</p>
              </div>
            </div>

            {/* Total Paid Card */}
            <div className="p-5 border border-gray-400 rounded-xl bg-white hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all duration-300 ease-in-out animate-card-appear" style={{animationDelay: '0.2s'}}>
              <div className="bg-blue-200 p-2 rounded-md w-fit">
                <DollarSign className="text-blue-700" />
              </div>
              <div className="mt-1">
                <h1 className="text-lg font-semibold">${financialData.total_paid?.toLocaleString() || '0'}</h1>
                <p>Total Paid</p>
              </div>
            </div>

            {/* Agreement End Card */}
            <div className="p-5 border border-gray-400 rounded-xl bg-white hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all duration-300 ease-in-out animate-card-appear" style={{animationDelay: '0.3s'}}>
              <div className="bg-yellow-200 p-2 rounded-md w-fit">
                <FileText className="text-yellow-700" />
              </div>
              <div className="mt-1">
                <h1 className="text-lg font-semibold">
                  {financialData.agreement_end_date ? 
                    new Date(financialData.agreement_end_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) : 'N/A'
                  }
                </h1>
                <p>Agreement End</p>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* ---------------------------------------------------- */}
      {/* Rent History Section */}
      <div className="border border-gray-200 p-3 mt-6 rounded-lg bg-gray-100">
        <h1 className="flex gap-3 text-lg font-semibold mb-4">
          <span className="w-5 h-5">
            <FileText />
          </span>
          Rent History
        </h1>
        
        {/* Loading Rent History */}
        {loadingRentHistory && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3 text-blue-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading rent history...</span>
            </div>
          </div>
        )}
        
        {/* Rent History Error */}
        {rentHistoryError && !loadingRentHistory && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{rentHistoryError}</span>
            <button 
              onClick={() => window.location.reload()}
              className="ml-auto bg-red-100 hover:bg-red-200 px-3 py-1 rounded text-sm transition-colors"
            >
              Retry
            </button>
          </div>
        )}
        
        {/* Rent History Table */}
        {!loadingRentHistory && !rentHistoryError && (
          <div className="w-full bg-white mt-4 border border-gray-400 rounded-t-2xl rounded-b-lg overflow-x-scroll lg:overflow-x-hidden relative animate-slide-up">
            {rentHistory.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-lg font-medium">No payment history available.</p>
                <p className="text-sm">Your payment records will appear here once you make payments.</p>
              </div>
            ) : (
              <table className="lg:w-full min-w-[1000px] text-left border-collapse">
                {/* Table Head */}
                <thead className="bg-gray-100 text-gray-700 font-semibold">
                  <tr>
                    <th className="py-3 px-4 text-left">Month</th>
                    <th className="py-3 px-4 text-left">Amount</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Date Paid</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y">
                  {rentHistory.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {record.month}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        ${record.amount?.toLocaleString() || '0'}
                      </td>
                      <td className="py-3 px-4">
                        {record.status === 'Paid' ? (
                          <div className="flex items-center gap-1 text-green-600 bg-green-100 rounded-full px-3 py-1 w-fit">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">Paid</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-red-600 bg-red-100 rounded-full px-3 py-1 w-fit">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">{record.status || 'Unpaid'}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {record.date_paid ? 
                          new Date(record.date_paid).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) : '-'
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            
            {/* Table Footer */}
            {rentHistory.length > 0 && (
              <div className="pt-2 pb-2 bg-gray-50 text-center border-t">
                <p className="text-sm text-gray-500">
                  Showing {rentHistory.length} payment record{rentHistory.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
        </div>
      )}
    </div>
  );
};

export default DashBoard;
