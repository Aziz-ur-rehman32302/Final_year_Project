import React, { useState, useEffect } from 'react';
import { Shield, UserPlus, CheckCircle, Clock, MapPin, Loader2, AlertCircle, Users, Activity, Coffee, Trash2 } from 'lucide-react';
import StatCard from '../../Components/StatCard';

const API_BASE_URL = 'http://localhost/plaza_management_system_backend/api/security';

export default function GuardsManagement() {
  const [guards, setGuards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeAttendanceId, setActiveAttendanceId] = useState(null);
  
  // Stats State
  const [stats, setStats] = useState({ total: 0, on_duty: 0, off_duty: 0, inactive: 0 });

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    cnic: '',
    address: '',
    joining_date: new Date().toISOString().split('T')[0],
    status: 'active',
    duty_location: '',
    shift_start: '',
    shift_end: ''
  });
  
  // Validation + Toast
  const [errorText, setErrorText] = useState('');
  const [successText, setSuccessText] = useState('');

  const fetchGuards = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/guards/list.php?t=${new Date().getTime()}`);
      const data = await res.json();
      if (data.success && data.data) {
        setGuards(data.data);
      } else if (Array.isArray(data)) {
        // Fallback in case raw array is sent
        setGuards(data);
      }
    } catch (err) {
      console.error('Failed to fetch guards list', err);
    } finally {
      if(loading) setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/guards/stats.php`);
      const data = await res.json();
      if (data.success) {
         setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  };

  useEffect(() => {
    fetchGuards();
    fetchStats();
    const interval = setInterval(() => {
      fetchGuards();
      fetchStats();
    }, 20000); // Poll every 20s

    const handleRefresh = () => {
      fetchGuards();
      fetchStats();
    };
    window.addEventListener('refresh-security-stats', handleRefresh);

    return () => {
      clearInterval(interval);
      window.removeEventListener('refresh-security-stats', handleRefresh);
    };
  }, []);

  const handleAddGuard = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorText('');
    setSuccessText('');
    
    if(!formData.name || !formData.phone || !formData.cnic || !formData.address || !formData.joining_date) {
        setErrorText("All fields are strictly required.");
        setIsSubmitting(false);
        return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/guards/create.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if(data.success) {
        setSuccessText("Guard added successfully");
        setFormData({ name: '', phone: '', cnic: '', address: '', joining_date: new Date().toISOString().split('T')[0], status: 'active', duty_location: '', shift_start: '', shift_end: '' });
        await fetchGuards(); 
        await fetchStats();
        setTimeout(() => setSuccessText(''), 4000);
      } else {
        setErrorText(data.message);
      }
    } catch (err) {
      console.error(err);
      setErrorText("Error connecting to server");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAttendance = async (guardId, isCheckingIn) => {
    setActiveAttendanceId(guardId);
    setSuccessText('');
    
    try {
      const res = await fetch(`${API_BASE_URL}/guards/attendance.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guard_id: guardId, action: isCheckingIn ? 'checkin' : 'checkout' })
      });
      const data = await res.json();
      
      if(data.success) {
        setSuccessText(`Guard successfully checked ${isCheckingIn ? 'in' : 'out' }`);
        fetchGuards(); 
        fetchStats();
        window.dispatchEvent(new Event('refresh-security-stats'));
        setTimeout(() => setSuccessText(''), 3000);
      } else {
        alert("Action Failed: " + data.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActiveAttendanceId(null);
    }
  };

  const handleDeleteGuard = async (guardId) => {
    if(!window.confirm("Are you sure you want to delete this guard? All attendance and shift records will be permanently erased.")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/guards/delete.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guard_id: guardId })
      });
      const data = await res.json();
      if(data.success) {
        setSuccessText("Guard deleted successfully");
        fetchGuards();
        fetchStats();
      } else {
        alert("Failed to delete guard: " + data.message);
      }
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
       {/* Title */}
       <div className="text-left w-full border-b pb-4">
         <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="text-blue-600 w-8 h-8" />
            Guards Workforce Management
         </h1>
         <p className="text-gray-500 mt-2 font-medium">Manage personnel onboarding, active rosters, and real-time attendance syncing.</p>
       </div>

       {/* Global Warning / Success Toasts */}
       {successText && (
         <div className="bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2 shadow-sm font-bold">
           <CheckCircle className="w-5 h-5"/> {successText}
         </div>
       )}
       {errorText && (
         <div className="bg-red-100 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2 shadow-sm font-bold">
           <AlertCircle className="w-5 h-5"/> {errorText}
         </div>
       )}

       {/* 0. Guard Overview Stats (Live) */}
       <div className="w-full">
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 w-full">
            <StatCard title="Total Guards" value={stats.total} icon={<Users className="w-6 h-6" />} color="blue" />
            <StatCard title="On Duty" value={stats.on_duty} icon={<Activity className="w-6 h-6 animate-pulse" />} color="green" />
            <StatCard title="Off Duty" value={stats.off_duty} icon={<Clock className="w-6 h-6" />} color="yellow" />
            <StatCard title="Inactive" value={stats.inactive} icon={<Coffee className="w-6 h-6" />} color="red" />
         </div>
       </div>

       {/* 1. Add Guard Form (TOP Layout explicitly enforced) */}
       <div className="w-full bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 text-left">
           <h2 className="text-lg font-bold mb-6 flex items-center gap-2 border-l-4 border-blue-600 pl-3">
               <UserPlus className="text-blue-600 w-5 h-5"/> Onboard New Security Personnel
           </h2>
           
           <form onSubmit={handleAddGuard} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <div className="w-full">
               <label className="block text-sm font-bold text-gray-700 mb-1">Full Name *</label>
               <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500" placeholder="e.g. Tariq Mehmood" />
             </div>
             
             <div className="w-full">
               <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number (Unique) *</label>
               <input required type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500" placeholder="e.g. 03001234567" />
             </div>

             <div className="w-full">
               <label className="block text-sm font-bold text-gray-700 mb-1">CNIC (Unique) *</label>
               <input required type="text" value={formData.cnic} onChange={e => setFormData({...formData, cnic: e.target.value})} className="w-full p-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500" placeholder="e.g. 35202-1234567-8" />
             </div>

             <div className="w-full md:col-span-2 lg:col-span-1">
               <label className="block text-sm font-bold text-gray-700 mb-1">Home Address *</label>
               <input required type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500" placeholder="e.g. Unit 4, Block B" />
             </div>

             <div className="w-full">
               <label className="block text-sm font-bold text-gray-700 mb-1">Joining Date *</label>
               <input required type="date" value={formData.joining_date} onChange={e => setFormData({...formData, joining_date: e.target.value})} className="w-full p-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white" />
             </div>

             <div className="w-full">
               <label className="block text-sm font-bold text-gray-700 mb-1">Duty Location *</label>
               <input required type="text" value={formData.duty_location} onChange={e => setFormData({...formData, duty_location: e.target.value})} className="w-full p-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500" placeholder="e.g. Main Gate" />
             </div>

             <div className="w-full">
               <label className="block text-sm font-bold text-gray-700 mb-1">Shift Start *</label>
               <input required type="time" value={formData.shift_start} onChange={e => setFormData({...formData, shift_start: e.target.value})} className="w-full p-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white" />
             </div>

             <div className="w-full">
               <label className="block text-sm font-bold text-gray-700 mb-1">Shift End *</label>
               <input required type="time" value={formData.shift_end} onChange={e => setFormData({...formData, shift_end: e.target.value})} className="w-full p-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white" />
             </div>

             <div className="w-full lg:col-span-3">
               <label className="block text-sm font-bold text-gray-700 mb-1">Initial Status *</label>
               <select required value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full p-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white cursor-pointer font-semibold">
                 <option value="active">Active</option>
                 <option value="on_leave">On Leave</option>
                 <option value="terminated">Terminated</option>
                 <option value="inactive">Inactive</option>
               </select>
             </div>

             <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end mt-2">
               <button disabled={isSubmitting} type="submit" className="w-full md:w-auto px-8 bg-blue-600 text-white font-bold py-3 rounded-lg shadow hover:bg-blue-700 transition flex items-center justify-center gap-2">
                 {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin"/> Processing...</> : 'Deploy Guard'}
               </button>
             </div>
           </form>
       </div>

       {/* 2. Guards Roster Table (BOTTOM Layout) */}
       <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-2">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
             <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 border-l-4 border-gray-800 pl-3">
               Live Duty Board
             </h2>
          </div>
          
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="bg-gray-100 border-y border-gray-200 text-gray-700 uppercase text-xs tracking-wider font-extrabold text-left">
                      <th className="p-4 pl-6">Guard Personnel</th>
                      <th className="p-4">Contact</th>
                      <th className="p-4">Duty Schedule</th>
                      <th className="p-4 text-center">Status Badge</th>
                      <th className="p-4 text-center pr-6">Attendance Action</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                   {guards.map(guard => {
                      const calcStatus = guard.duty_status;
                      
                      return (
                      <tr key={guard.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100">
                         <td className="p-3 pl-4">
                            <h3 className="font-medium text-gray-900 text-sm">{guard.name}</h3>
                            <p className="text-xs text-gray-500">{guard.cnic}</p>
                         </td>
                         
                         <td className="p-3 text-gray-500 text-sm">
                            {guard.phone}
                         </td>
                         
                         <td className="p-3 align-middle">
                            <div className="flex flex-col gap-0.5">
                               <p className="text-sm font-medium text-gray-800 flex items-center gap-1.5">{guard.duty_location || 'No Shift Assigned'}</p>
                               <span className="text-xs text-gray-500 flex items-center gap-1.5">
                                 {guard.shift_start && guard.shift_end ? `${new Date(guard.shift_start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} → ${new Date(guard.shift_end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : 'No Shift Assigned'}
                               </span>
                            </div>
                         </td>
                         
                         <td className="p-3 align-middle text-center">
                            {calcStatus === 'inactive' ? (
                               <span style={{backgroundColor: '#fee2e2', color: '#991b1b'}} className="px-2.5 py-1 rounded-full text-xs font-semibold">
                                 Inactive
                               </span>
                            ) : calcStatus === 'on_duty' ? (
                               <span style={{backgroundColor: '#dcfce7', color: '#166534'}} className="px-2.5 py-1 rounded-full text-xs font-semibold">
                                 On Duty
                               </span>
                            ) : (
                               <span style={{backgroundColor: '#fef3c7', color: '#92400e'}} className="px-2.5 py-1 rounded-full text-xs font-semibold">
                                 Off Duty
                               </span>
                            )}
                         </td>
                         
                         <td className="p-3 align-middle pr-4">
                            <div className="flex justify-center items-center gap-2">
                               <button 
                                 onClick={() => handleAttendance(guard.id, calcStatus !== 'on_duty')}
                                 disabled={activeAttendanceId === guard.id || calcStatus === 'inactive'}
                                 className={`w-28 py-2 rounded shadow-sm text-sm font-black tracking-wide transition-all border flex justify-center items-center gap-2
                                   ${activeAttendanceId === guard.id ? 'opacity-70 cursor-not-allowed bg-gray-100 text-gray-500 border-gray-300' 
                                   : calcStatus === 'inactive' ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200'
                                   : calcStatus === 'on_duty' ? 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100' 
                                   : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'}`}
                               >
                                 {activeAttendanceId === guard.id ? <Loader2 className="w-4 h-4 animate-spin"/> 
                                 : calcStatus === 'on_duty' ? 'Check-Out' : 'Check-In'}
                               </button>
                               <button 
                                 onClick={() => handleDeleteGuard(guard.id)}
                                 className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded border border-red-100 hover:border-red-300 transition-colors shadow-sm"
                                 title="Delete Guard"
                               >
                                 <Trash2 className="w-4 h-4"/>
                               </button>
                            </div>
                         </td>
                      </tr>
                   )})}
                   
                   {stats.total === 0 && !loading && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-gray-500 font-semibold bg-gray-50/30">
                          No personnel registered in the security roster yet.
                        </td>
                      </tr>
                   )}
                </tbody>
             </table>
          </div>
       </div>

    </div>
  );
}
