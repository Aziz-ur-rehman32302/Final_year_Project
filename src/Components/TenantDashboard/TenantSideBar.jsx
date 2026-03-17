import { Bell } from 'lucide-react'

const TenantSideBar = ({ sidebarOpen, activeSection, triggerTenantNotification, triggerTenantDastBoard }) => {
  return (
    <aside className="bg-white p-4 lg:p-6 h-full w-full">
      <nav className="space-y-3">
        <button
          type="button"
          onClick={triggerTenantDastBoard}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-sm md:text-base transition-all duration-200 ${
            activeSection === 'dashboard'
              ? 'bg-blue-100 text-blue-700 font-semibold'
              : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
          }`}
        >
          <span className="text-base md:text-lg">Dashboard</span>
        </button>

        <button
          type="button"
          onClick={triggerTenantNotification}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-sm md:text-base transition-all duration-200 ${
            activeSection === 'notifications'
              ? 'bg-blue-100 text-blue-700 font-semibold'
              : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
          }`}
        >
          <span className="mt-0.5">
            <Bell className="w-4 h-4 md:w-5 md:h-5" />
          </span>
          <span>Notifications</span>
        </button>
      </nav>
    </aside>
  )
}

export default TenantSideBar
