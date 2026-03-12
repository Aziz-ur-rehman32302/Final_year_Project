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

const rentHistory = [
  {
    id: 1,
    month: "November 2025",
    amount: 2500,
    status: "Paid",
    datePaid: "2025-11-05",
    statusColor: "green",
  },
  {
    id: 2,
    month: "October 2025",
    amount: 2500,
    status: "Paid",
    datePaid: "2025-10-08",
    statusColor: "green",
  },
  {
    id: 3,
    month: "September 2025",
    amount: 2500,
    status: "Paid",
    datePaid: "2025-09-03",
    statusColor: "green",
  },
  {
    id: 4,
    month: "August 2025",
    amount: 2500,
    status: "Paid",
    datePaid: "2025-08-07",
    statusColor: "green",
  },
  {
    id: 5,
    month: "July 2025",
    amount: 2500,
    status: "Paid",
    datePaid: "2025-07-05",
    statusColor: "green",
  },
  {
    id: 6,
    month: "June 2025",
    amount: 2500,
    status: "Paid",
    datePaid: "2025-06-10",
    statusColor: "green",
  },
];

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
  const [validating, setvalidating] = useState("");
  const stopValidating =( e )=> {
    e.preventDefault();
    setvalidating("");
    SubmitIssue();
  };
  const [IssueSubmit, setIssueSubmit] = useState(false);
  const SubmitIssue = () => {
    setIssueSubmit(true);
    setTimeout(() => {
      setIssueSubmit(false);
    }, 3000);
  };
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
      {IssueSubmit && (
        <div
          className="fixed top-18 right-4 z-5 bg-green-600 text-white
            px-6 py-3 rounded-lg shadow-lg  flex items-center gap-3  transform transition-all duration-400  translate-x-0 opacity-100
            animate-bounce"
        >
          <CheckCircle className="w-5 h-5" />
          <span>Issue reported successfully! Admin will be notified.</span>
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

        <form onSubmit={stopValidating}>
          <div className="flex  flex-col  mt-3">
            <label className="mb-2 text-lg" htmlFor="issue">
              Issue Description *
            </label>
            <textarea
              value={validating}
              onChange={(e) => {
                setvalidating(e.target.value);
              }}
              placeholder="Describe your Issue in Detail..."
              required
              id="issue"
              name="issueDescription"
              rows={5}
              className="border resize-none  border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded p-2 w-full"
            ></textarea>
            <p className="text-sm mt-3">
              Your issue will be sent to the admin and displayed on their
              dashboard
            </p>
          </div>
          <div className="flex justify-center items-center">
            <button className="flex gap-3 text-lg font-semibold py-2 px-13 mt-3 bg-blue-500 cursor-pointer hover:bg-blue-600  hover:shadow-xl  ease-in-out transition-all duration-450  active:scale-95 p-3 rounded-lg ">
              {" "}
              <MessageSquare className="w-5 h-5 mt-1" /> Submit Issue{" "}
            </button>
          </div>
        </form>
      </div>
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 mt-6">
        <div className="p-5 border text-white border-gray-400 rounded-xl bg-blue-600 hover:shadow-xl hover:-translate-y-1 cursor-pointer  transition-all  duration-300 ease-in-out">
          <div className="bg-blue-600 py-1 rounded-md w-fit">
            <Calendar className=" text-white" />
          </div>
          <div className="mt-1">
            <h1 className="text-lg font-semibold">5th</h1>
            <p>Due Date (Monthly)</p>
          </div>
        </div>

        <div className="p-5 border  border-gray-400 rounded-xl bg-white hover:shadow-xl hover:-translate-y-1 cursor-pointer  transition-all  duration-300 ease-in-out">
          <div className="bg-green-200 p-2 rounded-md w-fit">
            <CheckCircle className=" text-green-700" />
          </div>
          <div className="mt-1">
            <h1 className="text-lg font-semibold">6</h1>
            <p>Payments Made</p>
          </div>
        </div>

        <div className="p-5 border  border-gray-400 rounded-xl bg-white hover:shadow-xl hover:-translate-y-1 cursor-pointer  transition-all  duration-300 ease-in-out">
          <div className="bg-blue-200 p-2 rounded-md w-fit">
            <DollarSign className=" text-blue-700" />
          </div>
          <div className="mt-1">
            <h1 className="text-lg font-semibold">$15,000</h1>
            <p>Total Paid</p>
          </div>
        </div>

        <div className="p-5 border  border-gray-400 rounded-xl bg-white hover:shadow-xl hover:-translate-y-1 cursor-pointer  transition-all  duration-300 ease-in-out">
          <div className="bg-yellow-200 p-2 rounded-md w-fit">
            <FileText className=" text-yellow-700" />
          </div>
          <div className="mt-1">
            <h1 className="text-lg font-semibold">Dec 31, 2026</h1>
            <p>Agreement End</p>
          </div>
        </div>
      </div>
      {/* ---------------------------------------------------- */}
      <div className="border border-gray-200 p-3 mt-6 rounded-lg bg-gray-100">
        <h1 className="flex gap-3 text-lg font-semibold ">
          <span className=" w-5 h-5">
            <FileText />
          </span>
          Rent History
        </h1>
        <div
          id="custom-scrollbar"
          className="w-full  bg-white mt-4 border border-gray-400 rounded-t-2xl rounded-b-lg overflow-x-scroll lg:overflow-x-hidden  relative"
        >
          <table className="lg:w-full min-w-[1000px] text-left border-collapse">
            {/* Table Head */}
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="py-3 px-4">Month</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date Paid</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y">
              {rentHistory.map((e, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors ">
                  <td className="py-2 px-4">{e.month}</td>
                  <td className="py-2 px-4">{e.amount}</td>
                  <td className="py-2 px-4 flex gap-1 text-green-600 bg-green-200  rounded-2xl h-6 w-16 justify-center text-sm mt-2 ml-2   items-center"><span ><CheckCircle className="w-3 h-3 mt-0.5"/></span>{e.status}</td>
                  <td className="py-2 px-4">{e.datePaid || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Extra content outside table */}
          <div className=" pt-2 bg-gray-50  text-center">
            {/* This is outside the table */}
          </div>
        </div>
      </div>
        </div>
      )}
    </div>
  );
};

export default DashBoard;
