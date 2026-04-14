import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Bell, 
  ChevronDown, 
  ChevronRight, 
  ShieldAlert,
  Shield,
  Video,
  AlertTriangle,
  Radio,
  DoorOpen
} from 'lucide-react';
import AdminboardHeader from './AdminboardHeader';
import Admin_Cards from './Admin_Cards';
import TenantIssues from './TenantIssues';
import { useState } from 'react';
import TenantRegistration from './TenantRegistration'
import RentRecord from './RentRecord'
import NotificationsAdmin  from "./NotificationsAdmin";

import SecurityDashboard from '../../modules/security/SecurityDashboard';
import GuardsManagement from '../../modules/security/GuardsManagement';
import VisitorGateEntry from '../../modules/security/VisitorGateEntry';
import CamerasManagement from '../../modules/security/CamerasManagement';
import IncidentReporting from '../../modules/security/IncidentReporting';
import EmergencyAlert from '../../modules/security/EmergencyAlert';

const AdminSidebar = ({isVisible,toggledashboardButton}) => {

  const resetAll = () => {
    setopenTenantRegistration(false)
    setshowDashBoard(false)
    setshowRentRecord(false)
    setshowNotificationsAdmin(false)
    setShowSecurityDashboard(false)
    setShowGuardsManagement(false)
    setShowVisitorGateEntry(false)
    setShowCamerasManagement(false)
    setShowIncidentReporting(false)
    setShowEmergencyAlert(false)
  }

  // show [ Tenant Registration ] Page on Add Tenant button click 
  const [openTenantRegistration, setopenTenantRegistration] = useState(false)
  const show_Tenant_Registration_Page=()=>{
    resetAll()
    setopenTenantRegistration(true)
  }

  // show and hide DashBoard functionality in this Section 
  const [showDashBoard, setshowDashBoard] = useState(true)
  const show_Admin_DashBoard_Page=()=>{
    resetAll()
    setshowDashBoard(true)
  }

   //Add open Rent Record page  functionality in this Section 
  const [showRentRecord, setshowRentRecord] = useState(false)
  const Trigger_Rent_Record = ()=>{
    resetAll()
    setshowRentRecord(true)
  }

   //Add open Notifications Admin page  functionality in this Section 
  const [shownotificationsAdmin, setshowNotificationsAdmin] = useState(false)
  const Trigger_Notifications_Admin = ()=>{
    resetAll()
    setshowNotificationsAdmin(true)
  }
  
  // Security Module States
  const [isSecurityMenuOpen, setIsSecurityMenuOpen] = useState(false);
  const [showSecurityDashboard, setShowSecurityDashboard] = useState(false);
  const [showGuardsManagement, setShowGuardsManagement] = useState(false);
  const [showVisitorGateEntry, setShowVisitorGateEntry] = useState(false);
  const [showCamerasManagement, setShowCamerasManagement] = useState(false);
  const [showIncidentReporting, setShowIncidentReporting] = useState(false);
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);

  const triggerSecurityComponent = (setter) => {
    resetAll()
    setter(true)
    toggledashboardButton()
  }

  return (
      <div className='flex w-[100%]'>
        <div className={`${isVisible ? 'block' : 'hidden'} border-r min-h-[calc(100vh-64px)] lg:min-h-screen bg-white lg:block w-3/4 sm:w-1/3 lg:w-[250px] xl:w-[280px] flex-shrink-0 z-40 absolute lg:static`}> 
        
              <div className='flex flex-col gap-2 py-5 pr-2 pl-4 overflow-y-auto h-full'>
                  <h1 onClick={()=>{show_Admin_DashBoard_Page();toggledashboardButton()}} className={`flex gap-3 cursor-pointer font-semibold py-2 px-3 rounded-xl active:scale-95 hover:bg-gray-100 ${showDashBoard ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}>
                    <LayoutDashboard className='h-5 w-5 mt-0.5'/>
                    <span className='items-center text-center'>Dashboard</span>
                  </h1>
                  
                  <h1 onClick={()=>{show_Tenant_Registration_Page();toggledashboardButton()}} className={`flex gap-3 cursor-pointer font-semibold py-2 px-3 rounded-xl active:scale-95 hover:bg-gray-100 ${openTenantRegistration ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}>
                    <Users className='h-5 w-5 mt-0.5'/>
                    <span className='items-center text-center'>Add Tenant</span>
                  </h1>
                  
                  <h1 onClick={()=>{Trigger_Rent_Record();toggledashboardButton()}} className={`flex gap-3 cursor-pointer font-semibold py-2 px-3 rounded-xl active:scale-95 hover:bg-gray-100 ${showRentRecord ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}>
                    <FileText className='h-5 w-5 mt-0.5'/>
                    <span className='items-center text-center'>Rent Records</span>
                  </h1>
                  
                  <h1 onClick={()=>{Trigger_Notifications_Admin();toggledashboardButton()}} className={`flex gap-3 cursor-pointer font-semibold py-2 px-3 rounded-xl active:scale-95 hover:bg-gray-100 ${shownotificationsAdmin ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}>
                    <Bell className='h-5 w-5 mt-0.5'/>
                    <span className='items-center text-center'>Notifications</span>
                  </h1>

                  {/* Security Management Menu */}
                  <div className='mt-2'>
                    <div 
                      onClick={() => setIsSecurityMenuOpen(!isSecurityMenuOpen)}
                      className={`flex gap-3 justify-between items-center cursor-pointer font-semibold py-2 px-3 rounded-xl active:scale-95 hover:bg-gray-100 text-gray-700`}
                    >
                      <div className="flex gap-3">
                         <ShieldAlert className='h-5 w-5 mt-0.5 text-gray-700'/>
                         <span>Security Hub</span>
                      </div>
                      {isSecurityMenuOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </div>

                    {isSecurityMenuOpen && (
                      <div className="pl-6 pr-2 mt-1 flex flex-col gap-1">
                         <div onClick={() => triggerSecurityComponent(setShowSecurityDashboard)} className={`flex gap-2 cursor-pointer text-sm font-medium py-2 px-3 rounded-lg hover:bg-gray-100 ${showSecurityDashboard ? 'bg-blue-50 text-blue-700' : 'text-gray-600'}`}>
                           <LayoutDashboard className="h-4 w-4" /> Security Dashboard
                         </div>
                         <div onClick={() => triggerSecurityComponent(setShowGuardsManagement)} className={`flex gap-2 cursor-pointer text-sm font-medium py-2 px-3 rounded-lg hover:bg-gray-100 ${showGuardsManagement ? 'bg-blue-50 text-blue-700' : 'text-gray-600'}`}>
                           <Shield className="h-4 w-4" /> Guards Management
                         </div>
                         <div onClick={() => triggerSecurityComponent(setShowVisitorGateEntry)} className={`flex gap-2 cursor-pointer text-sm font-medium py-2 px-3 rounded-lg hover:bg-gray-100 ${showVisitorGateEntry ? 'bg-blue-50 text-blue-700' : 'text-gray-600'}`}>
                           <DoorOpen className="h-4 w-4" /> Visitor Gate Entry
                         </div>
                         <div onClick={() => triggerSecurityComponent(setShowCamerasManagement)} className={`flex gap-2 cursor-pointer text-sm font-medium py-2 px-3 rounded-lg hover:bg-gray-100 ${showCamerasManagement ? 'bg-blue-50 text-blue-700' : 'text-gray-600'}`}>
                           <Video className="h-4 w-4" /> Cameras Management
                         </div>
                         <div onClick={() => triggerSecurityComponent(setShowIncidentReporting)} className={`flex gap-2 cursor-pointer text-sm font-medium py-2 px-3 rounded-lg hover:bg-gray-100 ${showIncidentReporting ? 'bg-blue-50 text-blue-700' : 'text-gray-600'}`}>
                           <AlertTriangle className="h-4 w-4" /> Incident Reporting
                         </div>
                         <div onClick={() => triggerSecurityComponent(setShowEmergencyAlert)} className={`flex gap-2 cursor-pointer text-sm font-medium py-2 px-3 rounded-lg hover:bg-gray-100 ${showEmergencyAlert ? 'bg-red-50 text-red-700 cursor-pointer font-bold' : 'text-red-600 cursor-pointer'}`}>
                           <Radio className="h-4 w-4" /> Emergency Alerts
                         </div>
                      </div>
                    )}
                  </div>

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

         {/* Security Views rendering */}
         {showSecurityDashboard && <div className={`flex-1 w-full overflow-hidden ${isVisible ? 'hidden' : 'block'}`}><SecurityDashboard /></div>}
         {showGuardsManagement && <div className={`flex-1 w-full overflow-hidden ${isVisible ? 'hidden' : 'block'}`}><GuardsManagement /></div>}
         {showVisitorGateEntry && <div className={`flex-1 w-full overflow-hidden ${isVisible ? 'hidden' : 'block'}`}><VisitorGateEntry /></div>}
         {showCamerasManagement && <div className={`flex-1 w-full overflow-hidden ${isVisible ? 'hidden' : 'block'}`}><CamerasManagement /></div>}
         {showIncidentReporting && <div className={`flex-1 w-full overflow-hidden ${isVisible ? 'hidden' : 'block'}`}><IncidentReporting /></div>}
         {showEmergencyAlert && <div className={`flex-1 w-full overflow-hidden ${isVisible ? 'hidden' : 'block'}`}><EmergencyAlert /></div>}

      </div>   
  )
}

export default AdminSidebar
