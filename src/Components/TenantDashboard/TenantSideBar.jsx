import { Bell,  } from 'lucide-react'

const TenantSideBar = ({sidebarOpen ,triggerTenantNotification,triggerTenantDastBoard }) => {
  
  return (
      <aside 
      className={`bg-white p-6  lg:block  ${
          !sidebarOpen ? 'block' : 'hidden '
        }`}
      >
        <div className='flex gap-2  text-blue-600 bg-blue-50 cursor-pointer hover:bg-blue-100  hover:scale-[1.02] transition-all duration-450  active:scale-95 p-3 rounded-xl'>
          

          <span onClick={()=>{triggerTenantDastBoard() }} className='text-lg '>DashBoard</span>

        </div>
        <div className='flex gap-2 mt-3  bg-blue-50 cursor-pointer hover:bg-blue-100  hover:scale-[1.02] transition-all duration-450  active:scale-95 p-3 rounded-xl'>
          <div className='mt-0.5'>
          <Bell/>

          </div>
          <span onClick={()=>{triggerTenantNotification()
          }}
          className='text-lg '>Notification</span>
        </div>
      </aside>
    // </div>
  )
}

export default TenantSideBar
