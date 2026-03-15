import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Bell, 
} from 'lucide-react';
import AdminboardHeader from './AdminboardHeader';
import Admin_Cards from './Admin_Cards';
import TenantIssues from './TenantIssues';
import { useState } from 'react';
import TenantRegistration from './TenantRegistration'
import RentRecord from './RentRecord'
import NotificationsAdmin  from "./NotificationsAdmin";

const AdminSidebar = ({isVisible,toggledashboardButton}) => {
  

  // show [ Tenant Registration ] Page on Add Tenant button click 
  const [openTenantRegistration, setopenTenantRegistration] = useState(false)
    //  play on Add Tenant Button click 
    const show_Tenant_Registration_Page=()=>{
      setopenTenantRegistration(true)
      setshowDashBoard(false)
       setshowRentRecord(false)
       setshowNotificationsAdmin(false)
    }
// ========================================================================
    // show and hide DashBoard functionality in this Section 
    const [showDashBoard, setshowDashBoard] = useState(true)
    //  play on Add Admin_DashBoard Button click 
    const show_Admin_DashBoard_Page=()=>{
      setshowDashBoard(true)
      setopenTenantRegistration(false)
       setshowRentRecord(false)
       setshowNotificationsAdmin(false)
    }
//=====================================================================
     //Add open Rent Record page  functionality in this Section 
    const [showRentRecord, setshowRentRecord] = useState(false)
    const Trigger_Rent_Record = ()=>{
      setshowRentRecord(true)
      setshowDashBoard(false)
      setopenTenantRegistration(false)
      setshowNotificationsAdmin(false)
    }
//=====================================================================
     //Add open Notifications Admin page  functionality in this Section 
    const [shownotificationsAdmin, setshowNotificationsAdmin] = useState(false)
    const Trigger_Notifications_Admin = ()=>{
      setshowNotificationsAdmin(true)
      setshowRentRecord(false)
      setshowDashBoard(false)
      setopenTenantRegistration(false)
    }
    
    return (
        
        <div className='flex w-[89%]'>
          
            
          <div className={`${isVisible ? 'block' : 'hidden'} border-r min-h-screen lg:block w-1/4 sm:w-1/3 lg:w-[200px] xl:w-[250px] flex-shrink-0`}> 
          
                <div className='flex flex-col gap-4 py-5 pr-2 pl-4 '>
                    <h1 onClick={
                      ()=>{
                        show_Admin_DashBoard_Page()
                        toggledashboardButton()
                      }
                      
                    }
                     className='flex gap-3 cursor-pointer font-semibold py-2 px-3 rounded-xl active:scale-95 hover:bg-gray-200'><LayoutDashboard className='h-5 w-5 mt-0.5'/><span className=' items-center text-center'>Dashboard</span></h1>
                    <h1  onClick={
                      ()=>{
                        show_Tenant_Registration_Page()
                        toggledashboardButton()
                      }
                      }
                     className='flex gap-3 cursor-pointer font-semibold py-2 px-3 rounded-xl active:scale-95 hover:bg-gray-200'><Users className='h-5 w-5 mt-0.5'/><span className=' items-center text-center '>Add Tenant</span></h1>
                    <h1 onClick={
                      ()=>{
                        Trigger_Rent_Record()
                        toggledashboardButton()
                      }
                    } className='flex gap-3 cursor-pointer font-semibold py-2 px-3 rounded-xl active:scale-95 hover:bg-gray-200'><FileText className='h-5 w-5 mt-0.5'/><span className=' items-center text-center'>Rent Records</span></h1>
                    <h1 onClick={()=>{
                      Trigger_Notifications_Admin()
                      toggledashboardButton()
                    }} 
                     className='flex gap-3 cursor-pointer font-semibold py-2 px-3 rounded-xl active:scale-95 hover:bg-gray-200'><Bell className='h-5 w-5 mt-0.5'/><span className=' items-center text-center'>Notifications</span></h1>
                 </div>
          </div>
          
           {showDashBoard &&(
            <div className={`bg-gray-50 py-5 flex-1 w-full lg:block ${isVisible ? 'hidden' : 'block'}`}>
             
            <AdminboardHeader/>
            

            <div className='flex gap-5 w-full'>
              <Admin_Cards/>  
            </div>
            <div className='flex w-full'>
              <TenantIssues/>  
            </div>
          </div>
           )}  

           
           {openTenantRegistration && (
            <div className={`flex-1 w-full ${isVisible ? 'hidden' : 'block'}`}>
               <TenantRegistration />
            </div>
          )} 
           
           {showRentRecord && <div className={`flex-1 w-full ${isVisible ? 'hidden' : 'block'}`}>
              <RentRecord/>
           </div> }

           {shownotificationsAdmin && <div className={`flex-1 w-full ${isVisible ? 'hidden' : 'block'}`}>
              <NotificationsAdmin/>
           </div> }

        </div>   

            
    
  )
}

export default AdminSidebar
