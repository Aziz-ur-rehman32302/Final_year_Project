import { useEffect, useState } from "react";
import TenantNavBar from "./TenantNavBar";
import TenantSideBar from "./TenantSideBar";
import DashBoard from "./DashBoard";
import TenantNotification from "./TenantNotification";

const TenantDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [TenantDashBoard, setTenantDashBoard] = useState(false);
  const [DashBoard_Tenant, setDashBoard_Tenant] = useState(true);

  const triggerTenantDastBoard = () => {
    setTenantDashBoard(true);
    setshowTenantNotification(false);
    setSidebarOpen(true);
    setDashBoard_Tenant(false);
  };
  // ----------------------------------------------------------
  const [showTenantNotification, setshowTenantNotification] = useState(false);
  const triggerTenantNotification = () => {
    setshowTenantNotification(true);
    setTenantDashBoard(false);
    setSidebarOpen(true);
    setDashBoard_Tenant(false);
  };

  return (
    <div className="w-full h-screen overflow-x-hidden flex flex-col">
      {/* ---------------- Navbar ---------------- */}
      <div className="w-full shrink-0">
        <TenantNavBar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </div>

      {/* ---------------- Main Body ---------------- */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* ------------ Sidebar ------------ */}
        <div
          className={`shrink-0 border-r border-gray-600
        w-[260px] sm:w-[300px] lg:block
        ${sidebarOpen ? "hidden" : "block"}
      `}
        >
          <TenantSideBar
            sidebarOpen={sidebarOpen}
            triggerTenantDastBoard={triggerTenantDastBoard}
            triggerTenantNotification={triggerTenantNotification}
          />
        </div>

        {/* ------------ Main Content ------------ */}
        <div id="custom-scrollbar" className="flex-1 min-w-0 overflow-y-auto bg-gray-100 p-4">
          {DashBoard_Tenant && <DashBoard />}

          {sidebarOpen && (
            <>
              {TenantDashBoard && <DashBoard />}
              {showTenantNotification && <TenantNotification />}
            </>
          )}
        </div>
      </div>
    </div>

    // <div className={"min-w-full min-h-screen "}>

    //    <div className="w-full ">
    //   <TenantNavBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
    //   </div>

    //   <div className="w-full min-h-screen   flex">
    //    {/* ----------------------------------------------- */}
    //     <div className={`w-[25%] sm:w-[40%] lg:block    border-r border-gray-600 ${ sidebarOpen ? "hidden" : "block" }`}
    //     >
    //       <TenantSideBar
    //         sidebarOpen={sidebarOpen}
    //         triggerTenantDastBoard={triggerTenantDastBoard}
    //         triggerTenantNotification={triggerTenantNotification}
    //       />
    //     </div>
    //     {/* ----------------------------------------------------- */}

    //      <div className="w-full p-2 bg-gray-100">
    //        {DashBoard_Tenant && <DashBoard />}
    //       {sidebarOpen && (
    //         <div className="w-full">
    //           {TenantDashBoard && <DashBoard />}
    //           {showTenantNotification && <TenantNotification />}
    //         </div>
    //       )}
    //      </div>

    //   </div>
    //   </div>

    // {/* <div className="w-full min-h-screen flex">
    //   <div
    //     className={`sm:w-1/3 lg:w-[20%]  lg:block h-full   border-r border-gray-600 ${
    //       sidebarOpen ? "hidden" : "block"
    //     }`}
    //   >
    //     <TenantSideBar
    //       sidebarOpen={sidebarOpen}
    //       triggerTenantDastBoard={triggerTenantDastBoard}
    //       triggerTenantNotification={triggerTenantNotification}
    //     />
    //   </div>*/}

    //</div>
    // </div>
  );
};

export default TenantDashboard;
