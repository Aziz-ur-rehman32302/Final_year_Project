import React from 'react'
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Bell, 
  LogOut, 
  AlertCircle, 
  X,
  TrendingUp,
  DollarSign,
  Calendar,
  Activity ,MessageSquare, Clock 
} from 'lucide-react';
import RentTrends from './RentTrends';
import { PaymentStatus } from './PaymentStatus';



const TenantIssues = () => {

  const recentActivities = [
  { id: 1, action: 'Tenant T-101 paid rent for December', time: '2 hours ago', type: 'payment' },
  { id: 2, action: 'New tenant registered: Shop S-205', time: '5 hours ago', type: 'registration' },
  { id: 3, action: 'Rent reminder sent to 5 tenants', time: '1 day ago', type: 'notification' },
  { id: 4, action: 'Tenant T-089 payment overdue', time: '2 days ago', type: 'alert' },
  { id: 5, action: 'Monthly report generated', time: '3 days ago', type: 'report' },
  { id: 6, action: 'Tenant T-043 updated contact info', time: '4 days ago', type: 'update' },
];



  return (
    <div className='flex flex-col w-full pl-6 '>
    <div className='w-full  py-4 border rounded border-gray-300'>
      {/* NEW: Tenant Issues Section */}
      <div className='flex  justify-between w-full border-b pb-4 border-gray-300 bg-white'>

        <div className='flex pl-4 gap-2 items-center'>
            <MessageSquare className="w-5 h-5   text-blue-600" />
            <h3 className="text-gray-900   mb-1">Tenant Issues</h3>
        </div>
        <div  className="bg-red-600 mr-4 w-fit px-3 text-white text-center py-1 rounded text-sm"><span className='pr-1'>2</span>New</div>
      </div>
      {/* first issue of Tenant */}
      <div className='w-full flex pt-4 pb-6 pl-4 gap-2'>
        <div className='flex rounded border-0 outline-0'>
          <MessageSquare className="w-11 h-11 p-3 rounded bg-red-200   text-red-600" />
        </div>

        <div className='flex flex-col gap-1'>

          <div  className='flex gap-2'>
          <h3 className='pl-2'>John Smith (T-101, S-205)</h3>
          <h2 className='bg-red-500 h-fit pb-0.5  w-fit  px-3 text-white text-center  rounded-sm '>New</h2>
          </div>

          <div className='flex items-center pl-2 gap-2'>
            <span><Clock className='h-4 w-4' /></span>
            <p>1 hour ago</p>
          </div>
          <p className='text-md pl-2'>Air conditioning not working in my shop. Please send someone to fix it urgently.</p>
          <div className='flex gap-2 pt-3'>
            <button className="bg-blue-600 active:scale-95 cursor-pointer text-white px-4 py-1.5       rounded-lg hover:bg-blue-700 transition-colors text-sm">
             Mark as Resolved
            </button>
            <button className="bg-gray-200 active:scale-95 cursor-pointer text-gray-700 px-4
             py-1.5 rounded-lg hover:bg-gray-300 transition-colors text-sm">
              Contact Tenant
            </button>
          </div>

        </div>

      </div>

      <div className='w-full bg-gray-100 flex pt-6 pb-6 border-t border-gray-300 pl-4  gap-2'>
        <div className='flex rounded border-0 outline-0'>
          <MessageSquare className="w-11 h-11 p-3 rounded bg-red-200   text-red-600" />
        </div>

        <div className='flex flex-col gap-1'>

          <div  className='flex gap-2'>
          <h3 className='pl-2'>Sarah Johnson (T-102, S-102)</h3>
          <h2 className='bg-red-500 h-fit pb-0.5  w-fit  px-3 text-white text-center  rounded-sm '>New</h2>
          </div>

          <div className='flex items-center pl-2 gap-2'>
            <span><Clock className='h-4 w-4' /></span>
            <p>3 hour ago</p>
          </div>
          <p className='text-md pl-2'>Water leakage in the ceiling. It started yesterday after the rain.</p>
          <div className='flex gap-2 pt-3'>
            <button className="bg-blue-600 active:scale-95 cursor-pointer text-white px-4 py-1.5       rounded-lg hover:bg-blue-700 transition-colors text-sm">
             Mark as Resolved
            </button>
            <button className="bg-gray-200 active:scale-95 cursor-pointer text-gray-700 px-4
             py-1.5 rounded-lg hover:bg-gray-300 transition-colors text-sm">
              Contact Tenant
            </button>
          </div>

        </div>

      </div>

      <div className='w-full flex pt-6 border-t border-gray-300 pl-4  gap-2'>
        <div className='flex rounded border-0 outline-0'>
          <MessageSquare className="w-11 h-11 p-3 rounded bg-yellow-200   text-yellow-600" />
        </div>

        <div className='flex flex-col gap-1'>

          <div  className='flex gap-2'>
          <h3 className='pl-2'>Sarah Johnson (T-102, S-102)</h3>
          </div>

          <div className='flex items-center pl-2 gap-2'>
            <span><Clock className='h-4 w-4' /></span>
            <p>5 hour ago</p>
          </div>
          <p className='text-md pl-2'>Main entrance door lock is broken. Security concern.</p>
          <div className='flex gap-2 pt-3'>
            <button className="bg-blue-600 active:scale-95 cursor-pointer text-white px-4 py-1.5       rounded-lg hover:bg-blue-700 transition-colors text-sm">
             Mark as Resolved
            </button>
            <button className="bg-gray-200 active:scale-95 cursor-pointer text-gray-700 px-4
             py-1.5 rounded-lg hover:bg-gray-300 transition-colors text-sm">
              Contact Tenant
            </button>
          </div>

        </div>

      </div>

      

    </div>
    {/* Charts Row */}
        <div className=' mt-2 grid grid-cols-1 md:grid-cols-2 gap-6'>
          <RentTrends/>
          <PaymentStatus/>

        </div>

        <div className='border mt-2 border-gray-300 rounded bg-white'>
          {/* Recent Activity part */}
          <div className="flex items-center p-3 border-b border-gray-300 gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <h3 className="text-gray-900">Recent Activity</h3>
          </div>

          <div id='custom-scrollbar' className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    activity.type === 'payment' ? 'bg-green-500' :
                    activity.type === 'alert' ? 'bg-red-500' :
                    activity.type === 'notification' ? 'bg-blue-500' :
                    'bg-gray-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900">{activity.action}</p>
                    <p className="text-gray-500 text-sm mt-1">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>



    </div>

  )
}

export default TenantIssues
