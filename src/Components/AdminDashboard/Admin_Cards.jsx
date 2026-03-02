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
  Building2 
} from 'lucide-react';

const Admin_Cards = () => {
  return (
    <div className='flex pb-4  flex-wrap justify-evenly  pl-2 mt-2 w-full  '>
      <div className='flex flex-col lg:w-[23%]  sm:w-[48%] w-full gap-5 px-6 py-5 pb-9 rounded-xl bg-blue-600  mt-7 hover:shadow-2xl hover:-translate-y-2 cursor-pointer  transition-all  duration-300 ease-in-out'>
        <div className='flex justify-between'>
          <Users className='h-7 w-7 text-white'/>
          <TrendingUp className="w-7 h-7 bg-blue-700 p-1 rounded text-white" />
        </div>
        <div>
            <h1 className='text-2xl text-white font-medium'>156</h1>
            <h1 className='text-lg text-white'>Total Tenants</h1>
        </div>
      </div>

    <div className='flex flex-col gap-5 lg:w-[23%] sm:w-[48%] w-full   border px-6 py-5 pb-9 rounded-xl  mt-7 hover:shadow-2xl hover:-translate-y-2 cursor-pointer  transition-all  duration-300 ease-in-out'>
        <div className='flex justify-between'>
         <DollarSign className="w-7 h-7 text-green-400 rounded p-1 bg-green-900" />
        </div>
        <div>
            <h1 className='text-2xl  font-medium'>$98,000</h1>
            <h1 className='text-lg '>Total Paid Rent</h1>
        </div>
    </div>

    <div className='flex flex-col gap-5 lg:w-[23%] sm:w-[48%] w-full   border px-6 py-5 pb-9 rounded-xl mt-7 hover:shadow-2xl hover:-translate-y-2 cursor-pointer  transition-all  duration-300 ease-in-out'>
        <div className='flex justify-between'>
         <AlertCircle className="w-7 h-7 text-red-400 rounded p-1 bg-red-900" />
        </div>
        <div>
            <h1 className='text-2xl  font-medium'>$15,500</h1>
            <h1 className='text-lg '>Total Unpaid Rent</h1>
        </div>
    </div>

    <div className='flex flex-col gap-5 lg:w-[23%] sm:w-[48%] w-full   border sm:px-6 pl-6 py-5 pb-9 rounded-xl mt-7 hover:shadow-2xl hover:-translate-y-2 cursor-pointer  transition-all  duration-300 ease-in-out'>
        <div className='flex justify-between'>
         <Calendar className="w-7 h-7 text-red-400 rounded p-1 bg-yellow-200" />
        </div>
        <div>
            <h1 className='text-2xl  font-medium'>12</h1>
            <h1 className='text-lg '>Upcoming Due Dates</h1>
        </div>
     </div>
    <div/>
    </div>
  )
}

export default Admin_Cards
