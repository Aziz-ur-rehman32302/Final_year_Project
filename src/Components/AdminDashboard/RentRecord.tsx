import { FileText, Search, Filter, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useState } from 'react';

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

const initialRentRecords: TenantRent[] = [
  { id: '1', tenantId: 'T-101', tenantName: 'John Smith', shopNumber: 'S-101', rentMonth: 'December 2025', dueAmount: 2500, paymentStatus: 'Paid', dueDate: '2025-12-05', paidDate: '2025-12-03' },
  { id: '2', tenantId: 'T-102', tenantName: 'Sarah Johnson', shopNumber: 'S-102', rentMonth: 'December 2025', dueAmount: 3000, paymentStatus: 'Unpaid', dueDate: '2025-12-05' },
  { id: '3', tenantId: 'T-103', tenantName: 'Michael Brown', shopNumber: 'S-201', rentMonth: 'December 2025', dueAmount: 2800, paymentStatus: 'Overdue', dueDate: '2025-12-05' },
  { id: '4', tenantId: 'T-104', tenantName: 'Emily Davis', shopNumber: 'S-202', rentMonth: 'December 2025', dueAmount: 2500, paymentStatus: 'Paid', dueDate: '2025-12-05', paidDate: '2025-12-04' },
  { id: '5', tenantId: 'T-105', tenantName: 'David Wilson', shopNumber: 'S-203', rentMonth: 'December 2025', dueAmount: 3200, paymentStatus: 'Unpaid', dueDate: '2025-12-05' },
  { id: '6', tenantId: 'T-106', tenantName: 'Lisa Martinez', shopNumber: 'S-301', rentMonth: 'December 2025', dueAmount: 2700, paymentStatus: 'Paid', dueDate: '2025-12-05', paidDate: '2025-12-02' },
  { id: '7', tenantId: 'T-107', tenantName: 'James Garcia', shopNumber: 'S-302', rentMonth: 'November 2025', dueAmount: 2900, paymentStatus: 'Overdue', dueDate: '2025-12-05' },
  { id: '8', tenantId: 'T-108', tenantName: 'Jennifer Taylor', shopNumber: 'S-303', rentMonth: 'December 2025', dueAmount: 2600, paymentStatus: 'Unpaid', dueDate: '2025-12-05' },
];
// -------------------------------------------------------------------
 const [rentRecords] = useState<TenantRent[]>(initialRentRecords);
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

  const filterRentRecords=rentRecords.filter((dets)=>{
    
    

    const term = searchvalue.toLowerCase().trim();
    const month = selectedMonth.toLowerCase().trim();
    const status = selectedStatus.toLowerCase().trim();

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

    //03 status filter
    const matchedStatus=
    status === '' || 
    // status === 'all status'||
    dets.paymentStatus.toLowerCase() === status

    // 04 Combined logic
     return matchesSearch && matchesMonth && matchedStatus;
    
   })

 // =====================================================================
  //  calculate Total Amount of Rent 

  const TotalAmount =filterRentRecords
  .filter((record) => record.paymentStatus === 'Paid'||record.paymentStatus === 'Unpaid'||record.paymentStatus === 'Overdue')
  .reduce((sum, e) => sum + e.dueAmount, 0);

  // if (rentRecords.paymentStatus === 'paid') {
    
  const totalPaidAmount = filterRentRecords
  .filter((record) => record.paymentStatus === 'Paid')
  .reduce((sum, e) => sum + e.dueAmount, 0);

  // if (rentRecords.paymentStatus === 'paid') {

  const total_UnPaidAmount = filterRentRecords
  .filter((record) => record.paymentStatus === 'Unpaid'||record.paymentStatus === 'Overdue')
  .reduce((sum, e) => sum + e.dueAmount, 0);

  
// ========================================================================
  
  
  
    
    



  return (
    <div className='w-full  p-6  bg-gray-50' >
       {/* Header */}
        <div className=' w-full'>

            <div className="flex items-center gap-1 ">
                <FileText className="w-6 h-6 text-blue-600" />
                <h1 className="text-gray-900 text-lg">Rent Records</h1>
            </div>
            <p className="text-gray-600 text-medium">View and manage rent payment records for all tenants.</p>
              
        </div>
        {/* Summary Cards */}
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2'>
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
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border mt-4 border-gray-200 p-4">
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                    <div className="relative">

                        <Search className='absolute top-1/2 -translate-y-1/2 left-3 w-5 h-5 text-gray-400 '/>
                        <input type="text"
                          value={searchvalue}
                          onChange={(e)=>{
                            setsearchvalue(e.target.value)
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
                      
                    }}  
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    >   
                        <option value="">All Months</option>
                        <option value="December 2025">December 2025</option>
                        <option value="November 2025">November 2025</option>
                        <option value="October 2025">October 2025</option>
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
                          console.log(e.target.value);
                          
                        }}  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none">
                          <option value=" ">All Status</option>
                          <option value="Paid">Paid</option>
                          <option value="Unpaid">Unpaid</option>
                          <option value="Overdue">Overdue</option>
                        </select>
                   </div>
                </div> 
              </div>
        </div>

        {/* Data Table */}
                <div className="bg-white rounded-lg border mt-6 border-gray-200 overflow-hidden">
                  <div id='custom-scrollbar' className="overflow-x-auto">

                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                    
                        <tr>
                          <th className="px-6 py-3 text-left text-gray-700">Tenant ID</th>
                          <th className="px-6 py-3 text-left text-gray-700">Tenant Name</th>
                          <th className="px-6 py-3 text-left text-gray-700">Shop</th>
                          <th className="px-6 py-3 text-left text-gray-700">Rent Month</th>
                          <th className="px-6 py-3 text-left text-gray-700">Due Amount</th>
                          <th className="px-6 py-3 text-left text-gray-700">Due Date</th>
                          <th className="px-6 py-3 text-left text-gray-700">Status</th>
                          <th className="px-6 py-3 text-left text-gray-700">Paid Date</th>
                        </tr>
                      </thead>
                       <tbody className='divide-gray-400 divide-y'>
                          {filterRentRecords.length > 0 ? (
                            filterRentRecords.map((record, index) => (
                              
                              <tr key={record.id} className='hover:bg-gray-100 transition-colors'>
                                <td className='px-7 py-4 text-gray-900'>{record.tenantId}</td>
                               
                                <td className='px-7 py-2 text-gray-900'>{record.tenantName}</td>
                                <td className='px-7 py-2 text-gray-900'>{record.shopNumber}</td>
                                <td className='px-7 py-2 text-gray-900'>{record.rentMonth}</td>
                                <td className='px-7 py-2 text-gray-900'>{record.dueAmount}</td>
                                <td className='px-7 py-2 text-gray-900'>{record.dueDate}</td>
                               
                                <td className={`${assignStatusColor(record.paymentStatus).color} ${assignStatusColor(record.paymentStatus).bg} rounded-2xl flex gap-1 w-fit mt-4 items-center px-4 py-1 ml-1 text-sm text-gray-900`}>
                                  <span>{assignStatusColor(record.paymentStatus).icon}</span>
                                  <span>{record.paymentStatus}</span>
                                </td>

                                <td className='px-7 py-2 text-gray-900'>{record.paidDate}</td>
                              </tr>
                                ))
                                ) : (
                            <tr>
                            <td colSpan="8" className='text-center py-4 text-gray-500'>
                              No tenants found
                            </td>
                          </tr>
                        )}
                      </tbody> 

                       
                    </table>

                  </div>
                </div>

      
    </div>
  )
}

export default RentRecord
