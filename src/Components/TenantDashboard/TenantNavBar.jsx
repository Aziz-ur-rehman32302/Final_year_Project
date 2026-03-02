import { ReactNode, useState } from 'react';
import { 
  LayoutDashboard, 
  Bell, 
  LogOut, 
  Menu, 
  X,
  Building2 
} from 'lucide-react';

const TenantNavBar = ({sidebarOpen,setSidebarOpen}) => {
  return (
    <div className='border-b z-100  bg-gray-50'>
        {/* Top Navigation */}
      <nav className=" bg-gray-100 border-b border-gray-200 ">
        <div className="px-4 py-3 flex items-center justify-between">
            <div className='flex '>
                 <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {!sidebarOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-gray-900 text-lg font-medium">Plaza Management</span>
            </div>
            </div>
            <div className="flex items-center gap-4">
            <span className="text-black text-lg  relative 
             cursor-pointer after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:h-[2px] after:w-0  after:bg-black after:transition-all after:duration-500 hover:after:left-0  hover:after:w-full font-medium hidden sm:inline">Tenant Portal</span>
            <button
            //   onClick={onLogout}
              className="flex items-center font-semibold bg-blue-400 cursor-pointer gap-2 px-4 py-2 text-black  active:scale-95 hover:bg-blue-600 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

      </nav>  
       
      
    </div>
  )
}

export default TenantNavBar
