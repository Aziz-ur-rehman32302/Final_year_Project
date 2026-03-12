import {
  DollarSign,
  AlertCircle,
  CheckCircle,
  Calendar,
  FileText,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { getToken } from "../../utils/auth";

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
  
  // Fetch tenant issues
  useEffect(() => {
    const fetchTenantIssues = async () => {
      try {
        const token = getToken();
        if (!token) {
          setIssuesError('No authentication token found');
          setLoadingIssues(false);
          return;
        }

        const response = await fetch('http://localhost/plaza_management_system_backend/fetch_tenant_issues.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
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
          setTenantIssues(result.data || []);
          console.log('Tenant Issues:', result.data);
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

    fetchTenantIssues();
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
        
        // Refresh issues list after successful submission
        setTimeout(() => {
          window.location.reload(); // Refresh to show new issue
        }, 2000);
        
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
  //  --------------------------------------------------------
  // Issue reporting states
  const [issueDescription, setIssueDescription] = useState("");
  const [isSubmittingIssue, setIsSubmittingIssue] = useState(false);
  const [issueError, setIssueError] = useState('');
  const [issueSuccess, setIssueSuccess] = useState(false);
  
  // Tenant issues states
  const [tenantIssues, setTenantIssues] = useState([]);
  const [loadingIssues, setLoadingIssues] = useState(true);
  const [issuesError, setIssuesError] = useState('');
  
  // Financial summary states
  const [financialData, setFinancialData] = useState(null);
  const [loadingFinancial, setLoadingFinancial] = useState(true);
  const [financialError, setFinancialError] = useState('');
  
  // Rent history states
  const [rentHistory, setRentHistory] = useState([]);
  const [loadingRentHistory, setLoadingRentHistory] = useState(true);
  const [rentHistoryError, setRentHistoryError] = useState('');
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
        
        {/* Loading Issues */}
        {loadingIssues && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3 text-blue-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading your issues...</span>
            </div>
          </div>
        )}
        
        {/* Issues Error */}
        {issuesError && !loadingIssues && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{issuesError}</span>
          </div>
        )}
        
        {/* Issues List */}
        {!loadingIssues && !issuesError && (
          <div className="space-y-4">
            {tenantIssues.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-lg">No issues reported yet</p>
                <p className="text-sm">Use the form above to report any problems</p>
              </div>
            ) : (
              tenantIssues.map((issue, index) => (
                <div key={index} className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                  {/* Issue Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-gray-800">Issue #{issue.id || index + 1}</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      issue.issue_status === 'resolved' || issue.status === 'resolved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {issue.issue_status === 'resolved' || issue.status === 'resolved' ? 'Resolved' : 'Pending'}
                    </div>
                  </div>
                  
                  {/* Issue Description */}
                  <div className="mb-3">
                    <h4 className="font-medium text-gray-700 mb-2">Issue Description:</h4>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded border">
                      {issue.issue_description || issue.description}
                    </p>
                  </div>
                  
                  {/* Issue Date */}
                  {issue.created_at && (
                    <div className="mb-3">
                      <span className="text-sm text-gray-500">
                        Reported on: {new Date(issue.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  
                  {/* Resolved Issue Highlight */}
                  {(issue.issue_status === 'resolved' || issue.status === 'resolved') && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-3">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-800">
                          Your issue has been resolved by the admin.
                        </span>
                      </div>
                      
                      {/* Admin Response */}
                      {(issue.admin_response || issue.response) && (
                        <div className="mt-3">
                          <h5 className="font-medium text-green-700 mb-2">Admin Response:</h5>
                          <p className="text-green-700 bg-green-100 p-3 rounded border border-green-200">
                            {issue.admin_response || issue.response}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
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
