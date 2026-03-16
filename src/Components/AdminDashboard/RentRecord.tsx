import { FileText, Search, Filter, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

const RentRecord = () => {
// =======================================================================
//                    This is a Type_Checking Format 
  interface TenantRent {
  id: string;                // unique id
  tenantId: string;          // tenant ka code
  tenantName: string;        // tenant ka naam
  shopNumber: string;        // shop number
  rentMonth: string;         // kis month ka rent
  dueAmount: number;         // kitna rent dena hai
  paymentStatus: 'Paid' | 'Unpaid' | 'Overdue'; // status sirf in 3 mein se
  dueDate: string;           // last date
  paidDate?: string;         // payment date (optional)
}

// =======================================================================

const initialRentRecords: TenantRent[] = [];

// =======================================================================

 const [rentRecords, setRentRecords] = useState<TenantRent[]>(initialRentRecords);
 const [isLoadingRecords, setIsLoadingRecords] = useState<boolean>(true);
 const [recordsError, setRecordsError] = useState<string>('');

 // Fetch rent records from API
 useEffect(() => {
   const fetchRentRecords = async () => {
     try {
       setIsLoadingRecords(true);
       setRecordsError('');
       
       const response = await fetch('http://localhost/plaza_management_system_backend/rent_records.php', {
         credentials: 'include'
       });
       
       if (!response.ok) {
         throw new Error('Failed to fetch rent records');
       }
       
       const data = await response.json();
       
       if (data.status === 'success' && Array.isArray(data.records)) {
         setRentRecords(data.records);
       } else {
         throw new Error('Invalid API response format');
       }
     } catch (err) {
       console.error('Error fetching rent records:', err);
       setRecordsError('Failed to load rent records. Please try again.');
     } finally {
       setIsLoadingRecords(false);
     }
   };

   fetchRentRecords();
 }, []);
// ----------------------------------------------------------------------


 
 
  
// =======================================================================
// This Code Part Assign the different color to payment status according to its state

  const assignStatusColor =(status: 'Paid' | 'Unpaid' | 'Overdue')=>{
    switch (status) {
      case 'Paid':

         return { color: 'text-green-900',bg: 'bg-green-100', icon: <CheckCircle className="w-4 h-4" /> };
         
      case 'Unpaid':
        return { color: 'text-yellow-900',bg: 'bg-yellow-100', icon: <Clock className="w-4 h-4" /> };
      
      case 'Overdue':

         return { color: 'text-red-900',bg: 'bg-red-100', icon: <XCircle className="w-4 h-4" /> };

      default:
         return { color: '', bg: '', icon: null };
    }

  }
//  ======================================================================
//  this part of code filter the data when admin search specifice data 
  const [searchvalue, setsearchvalue] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');//month dropdown ke liye
  const [selectedStatus, setSelectedStatus] = useState(''); // status dropdown ke liye
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  const filterRentRecords=rentRecords.filter((dets)=>{
    
    const term = searchvalue.toLowerCase().trim();
    const month = selectedMonth.toLowerCase().trim();

    // 01 Search box filter
    const matchesSearch =
    term === '' || // agar search empty hai to ignore
    dets.tenantId.toLowerCase().includes(term) ||
    dets.tenantName.toLowerCase().includes(term) ||
    dets.shopNumber.toLowerCase().includes(term);

    // 02 Month filter
    const matchesMonth =
    month === '' || // agar month empty hai to ignore
    dets.rentMonth.toLowerCase() === month;

    //03 status filter - exact match without toLowerCase
    const matchedStatus =
    selectedStatus === '' ||
    dets.paymentStatus === selectedStatus;

    // 04 Combined logic
     return matchesSearch && matchesMonth && matchedStatus;
    
   })

 // Pagination logic
 const totalRecords = filterRentRecords.length;
 const totalPages = Math.ceil(totalRecords / recordsPerPage);
 const startIndex = (currentPage - 1) * recordsPerPage;
 const endIndex = startIndex + recordsPerPage;
 const currentRecords = filterRentRecords.slice(startIndex, endIndex);

 // Debug info (remove after testing)
 console.log('Debug Info:', {
   totalRecords,
   totalPages,
   currentPage,
   recordsPerPage,
   currentRecordsLength: currentRecords.length,
   allRecordsLength: rentRecords.length
 });

 // Reset to first page when filters change
 const resetPagination = () => {
   setCurrentPage(1);
 };

 // Handle page change
 const handlePageChange = (page: number) => {
   setCurrentPage(page);
 };

 // Generate page numbers for pagination
 const getPageNumbers = () => {
   const pages = [];
   const maxVisiblePages = 5;
   
   if (totalPages <= maxVisiblePages) {
     for (let i = 1; i <= totalPages; i++) {
       pages.push(i);
     }
   } else {
     if (currentPage <= 3) {
       for (let i = 1; i <= 4; i++) pages.push(i);
       pages.push('...');
       pages.push(totalPages);
     } else if (currentPage >= totalPages - 2) {
       pages.push(1);
       pages.push('...');
       for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
     } else {
       pages.push(1);
       pages.push('...');
       for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
       pages.push('...');
       pages.push(totalPages);
     }
   }
   return pages;
 };

 // =====================================================================
  // API State Management
  const [TotalAmount, setTotalAmount] = useState<number>(0);
  const [totalPaidAmount, setTotalPaidAmount] = useState<number>(0);
  const [total_UnPaidAmount, setTotal_UnPaidAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Fetch rent summary data from API
  useEffect(() => {
    const fetchRentSummary = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        const response = await fetch('http://localhost/plaza_management_system_backend/rent_summary.php', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const data = await response.json();
        
        if (data.status === 'success') {
          setTotalAmount(data.TotalAmount || 0);
          setTotalPaidAmount(data.totalPaidAmount || 0);
          setTotal_UnPaidAmount(data.totalUnPaidAmount || 0);
        } else {
          throw new Error('API returned error status');
        }
      } catch (err) {
        console.error('Error fetching rent summary:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRentSummary();
  }, []);

  
// ========================================================================
  
  
  
    
    



  return (
    <div className='w-[95%] pl-4 bg-gray-50' >
       {/* Header */}
        <div className='w-full px-6 pt-6'>

            <div className="flex items-center gap-1 ">
                <FileText className="w-6 h-6 text-blue-600" />
                <h1 className="text-gray-900 text-lg">Rent Records</h1>
            </div>
            <p className="text-gray-600 text-medium">View and manage rent payment records for all tenants.</p>
              
        </div>
        {/* Summary Cards */}
        <div className='w-[102%]  grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2 mb-5 pt-2 pl-6'>
            {isLoading ? (
              <div className="col-span-3 text-center py-8 text-gray-600">Loading...</div>
            ) : error ? (
              <div className="col-span-3 text-center py-8 text-red-600">{error}</div>
            ) : (
              <>
                {/* 1st Card  */}
                <div className="bg-blue-600 rounded-lg p-4 text-white hover:shadow-xl hover:-translate-y-1 cursor-pointer  transition-all  duration-200 ease-in-out">
                <div className="text-sm text-blue-100 mb-1">Total Due</div>
                <div className="text-2xl font-medium">${TotalAmount.toLocaleString()}</div>
              </div>
              {/* 2nd Card  */}
              <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-xl hover:-translate-y-1 cursor-pointer  transition-all  duration-200 ease-in-out">
                <div className="text-sm text-gray-600 mb-1">Total Paid</div>
                <div className="text-2xl font-medium text-green-600">${totalPaidAmount.toLocaleString()}</div>
              </div>
              {/* 3rd Card  */}
              <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-xl hover:-translate-y-1 cursor-pointer  transition-all  duration-200 ease-in-out">
                <div className="text-sm text-gray-600 mb-1">Total Unpaid</div>
                <div className="text-2xl font-medium text-red-600">${total_UnPaidAmount.toLocaleString()}</div>
              </div>
              </>
            )}
        </div>

        {/* Filters */}
        <div className="bg-white w-2/2 rounded-lg border mt-4 border-gray-200 p-4 mx-6">
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                    <div className="relative">

                        <Search className='absolute top-1/2 -translate-y-1/2 left-3 w-5 h-5 text-gray-400 '/>
                        <input type="text"
                          value={searchvalue}
                          onChange={(e)=>{
                            setsearchvalue(e.target.value)
                            resetPagination();
                          }}
                          placeholder="Search by tenant name, ID, or shop..."
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />

                    </div>
                </div>
                {/* Month Filter */}
                <div className="w-full lg:w-48">
                    <select 
                    value={selectedMonth}
                    onChange={(e)=>{
                      setSelectedMonth(e.target.value)
                      resetPagination();
                    }}  
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    >   
                        <option value="">All Months</option>
                        {(() => {
                          const months = [
                            'January', 'February', 'March', 'April', 'May', 'June',
                            'July', 'August', 'September', 'October', 'November', 'December'
                          ];
                          const currentYear = new Date().getFullYear();
                          const years = [currentYear - 1, currentYear, currentYear + 1]; // Previous, current, and next year
                          
                          return years.flatMap(year => 
                            months.map(month => (
                              <option key={`${month}-${year}`} value={`${month} ${year}`}>
                                {month} {year}
                              </option>
                            ))
                          );
                        })()}
                    </select>
                </div>

                {/* Status Filter */}
                <div className="w-full lg:w-48">
                    <div className="relative">
                     <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select 
                        value={selectedStatus}
                        onChange={(e)=>{
                          setSelectedStatus(e.target.value)
                          resetPagination();
                        }}  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none">
                          <option value="">All Status</option>
                          <option value="Paid">Paid</option>
                          <option value="Unpaid">Unpaid</option>
                          <option value="Overdue">Overdue</option>
                        </select>
                   </div>
                </div> 
              </div>
        </div>

        {/* Data Table */}
                <div className="bg-white w-full rounded-lg border mt-6 border-gray-200 overflow-hidden  mx-6">
                  <div id='custom-scrollbar' className="overflow-x-auto">

                    <table className="w-full ">
                      <thead className="bg-gray-50 border-b border-gray-200">
                    
                        <tr>
                          <th className="px-3 py-2 text-left text-sm font-bold text-gray-800 uppercase tracking-wider whitespace-nowrap">Tenant ID</th>
                          <th className="px-3 py-2 text-left text-sm font-bold text-gray-800 uppercase tracking-wider whitespace-nowrap">Tenant Name</th>
                          <th className="px-3 py-2 text-left text-sm font-bold text-gray-800 uppercase tracking-wider whitespace-nowrap">Shop</th>
                          <th className="px-3 py-2 text-left text-sm font-bold text-gray-800 uppercase tracking-wider whitespace-nowrap">Rent Month</th>
                          <th className="px-3 py-2 text-left text-sm font-bold text-gray-800 uppercase tracking-wider whitespace-nowrap">Due Amount</th>
                          <th className="px-3 py-2 text-left text-sm font-bold text-gray-800 uppercase tracking-wider whitespace-nowrap">Due Date</th>
                          <th className="px-3 py-2 text-left text-sm font-bold text-gray-800 uppercase tracking-wider whitespace-nowrap">Status</th>
                          <th className="px-3 py-2 text-left text-sm font-bold text-gray-800 uppercase tracking-wider whitespace-nowrap">Paid Date</th>
                        </tr>
                      </thead>
                       <tbody className='divide-y divide-gray-200'>
                          {isLoadingRecords ? (
                            <tr>
                              <td colSpan={8} className='text-center py-12 text-lg text-gray-600'>
                                Loading...
                              </td>
                            </tr>
                          ) : recordsError ? (
                            <tr>
                              <td colSpan={8} className='text-center py-12 text-lg text-red-600'>
                                {recordsError}
                              </td>
                            </tr>
                          ) : currentRecords.length > 0 ? (
                            currentRecords.map((record, index) => (
                              
                              <tr key={record.id} className='hover:bg-gray-50 transition-colors'>
                                <td className='px-3 py-2 text-base text-gray-900 whitespace-nowrap'>{record.tenantId}</td>
                               
                                <td className='px-3 py-2 text-base text-gray-900 whitespace-nowrap'>{record.tenantName}</td>
                                <td className='px-3 py-2 text-base text-gray-900 whitespace-nowrap'>{record.shopNumber}</td>
                                <td className='px-3 py-2 text-base text-gray-900 whitespace-nowrap'>{record.rentMonth}</td>
                                <td className='px-3 py-2 text-base text-gray-900 whitespace-nowrap'>${record.dueAmount.toLocaleString()}</td>
                                <td className='px-3 py-2 text-base text-gray-900 whitespace-nowrap'>{record.dueDate}</td>
                               
                                <td className='px-3 py-2 whitespace-nowrap'>
                                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${assignStatusColor(record.paymentStatus).color} ${assignStatusColor(record.paymentStatus).bg}`}>
                                    {assignStatusColor(record.paymentStatus).icon}
                                    {record.paymentStatus}
                                  </span>
                                </td>

                                <td className='px-3 py-2 text-base text-gray-900 whitespace-nowrap'>{record.paidDate || '-'}</td>
                              </tr>
                                ))
                                ) : (
                            <tr>
                            <td colSpan={8} className='text-center py-12 text-lg text-gray-500'>
                              No tenants found
                            </td>
                          </tr>
                        )}
                      </tbody> 

                       
                    </table>

                  </div>
                  
                  {/* Pagination */}
                  {!isLoadingRecords && !recordsError && totalRecords > 0 && (
                    <div className="px-4 sm:px-8 py-6 border-t border-gray-200 bg-gray-50">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        {/* Records info */}
                        <div className="text-base font-medium text-gray-700 text-center sm:text-left">
                          Showing <span className="font-bold text-blue-600">{startIndex + 1}</span> to <span className="font-bold text-blue-600">{Math.min(endIndex, totalRecords)}</span> of <span className="font-bold text-blue-600">{totalRecords}</span> results
                          <span className="text-sm text-gray-500 ml-2">(Page {currentPage} of {totalPages})</span>
                        </div>
                        
                        {/* Pagination controls */}
                        <div className="flex items-center space-x-2 flex-wrap justify-center">
                          {/* Previous button */}
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                              currentPage === 1
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 shadow-sm'
                            }`}
                          >
                            Previous
                          </button>
                          
                          {/* Page numbers */}
                          {getPageNumbers().map((page, index) => (
                            <button
                              key={index}
                              onClick={() => typeof page === 'number' && handlePageChange(page)}
                              disabled={page === '...'}
                              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                page === currentPage
                                  ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                                  : page === '...'
                                  ? 'bg-transparent text-gray-400 cursor-default'
                                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 shadow-sm'
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                          
                          {/* Next button */}
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                              currentPage === totalPages
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 shadow-sm'
                            }`}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

      <div className="pb-6"></div>
    </div>
  )
}

export default RentRecord
