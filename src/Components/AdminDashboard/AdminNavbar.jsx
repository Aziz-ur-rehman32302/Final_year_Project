import { API_BASE_URL } from '../../config';
import { 
  LogOut, 
  Menu, 
  X,
  Building2,
  Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../utils/auth';
import { useState, useEffect } from 'react';
import { getToken } from '../../utils/auth';

const AdminNavbar = ({toggleNavButton,isVisible}) => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread issues count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const token = getToken();
        if (!token) return;

        const response = await fetch(API_BASE_URL + '/unread_issues_count.php', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }).catch(() => ({ ok: false }));

        if (response.ok) {
          const result = await response.json();
          if (result.status === 'success') {
            setUnreadCount(result.count || 0);
          }
        }
      } catch (err) {
        console.error('Unread count fetch error:', err);
      }
    };

    fetchUnreadCount();
    // Refresh count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <div className='sm:w-full border-b py-6 px-4  pb-4 flex justify-between items-center'>
      <div className='flex gap-2'>
         <button
          className="text-black pr-1 cursor-pointer lg:hidden "
          onClick={toggleNavButton}>
            {isVisible ? <X className="w-7 h-7" />:<Menu className="w-7 h-7" />}
            
        </button>
        <Building2 className="w-7.5 h-7.5 rounded-lg p-0.5 text-white bg-blue-600" />
        <h1 className=' text-xl font-medium'>Plaza Management</h1>
      </div>
      <div className='flex justify-center items-center gap-6'>
        {/* Notification Bell with Counter */}
        <div className='relative'>
          <Bell className="w-6 h-6 text-gray-600" />
          {unreadCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </div>
          )}
        </div>
        <h2 className='text-lg sm:block hidden font-semibold'>Admin</h2>
        <button onClick={handleLogout} className='flex justify-center items-center gap-1 pb-1 pt-0.5 px-2 rounded bg-blue-600 outline-0 cursor-pointer active:scale-95 hover:bg-blue-700 transition-colors text-white'> <LogOut className="w-4 h-4 mt-0.5" /><span className='text-lg sm:block hidden text-center'> Logout</span></button>
      </div>
    </div>
  )
}

export default AdminNavbar
