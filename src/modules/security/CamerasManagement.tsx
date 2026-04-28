import React, { useState, useEffect } from 'react';
import { Video, AlertTriangle, PlusCircle, CheckCircle, Clock, Trash2, X, Activity } from 'lucide-react';
import StatCard from '../../Components/StatCard';
import { API_BASE_URL as BASE_URL } from '../../config';

const API_BASE_URL = BASE_URL + '/api/security';

export default function CamerasManagement() {
  const [cameras, setCameras] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, working: 0, offline: 0, maintenance: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  
  // Add Camera Form State
  const [formData, setFormData] = useState({ camera_name: '', location: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Camera State
  const [cameraToDelete, setCameraToDelete] = useState<string | number | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const fetchCameras = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/cameras/list.php`);
      const data = await res.json();
      if (data && data.success) {
        setCameras(data.cameras || []);
      }
    } catch (err) {
      console.error('Failed to fetch cameras', err);
    } finally {
      if(loading) setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/cameras/network_stats.php`);
      const data = await res.json();
      if (data) {
        setStats(data || { total: 0, working: 0, offline: 0, maintenance: 0 });
      }
    } catch (err) {
      console.error('Failed to fetch network stats', err);
    }
  };

  useEffect(() => {
    fetchCameras();
    fetchStats();
    
    const interval = setInterval(() => {
      fetchCameras();
      fetchStats();
    }, 10000); // 10s auto refresh
    
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (cameraId: string | number, newStatus: string) => {
    try {
      await fetch(`${API_BASE_URL}/cameras/update_status.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ camera_id: cameraId, status: newStatus })
      });
      fetchCameras();
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCamera = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/cameras/create.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if(data.success) {
        setFormData({ camera_name: '', location: '' });
        fetchCameras();
        fetchStats();
      } else {
        alert("Failed to add: " + data.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCamera = async () => {
    if(!cameraToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/cameras/delete.php`, {
        method: 'POST', // Using POST mapped payload format
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ camera_id: cameraToDelete })
      });
      const data = await res.json();
      if(data.success) {
        // Optimistic UI Removal instantly
        setCameras(prev => prev.filter(c => c.id !== cameraToDelete));
        setCameraToDelete(null);
        fetchStats(); // Update dashboard instantly
      } else {
        alert("Delete failed: " + data.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const offlineCameras = (Array.isArray(cameras) ? cameras : []).filter(c => c?.status === 'OFFLINE');

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 relative">
      
      {/* DELETE CONFIRMATION MODAL */}
      {cameraToDelete && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full border border-gray-200">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Delete Camera</h3>
                <button onClick={() => setCameraToDelete(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
             </div>
             <p className="text-gray-600 mb-6 font-medium">Are you sure you want to remove this camera from the system? This action cannot be undone.</p>
             <div className="flex gap-3 justify-end">
                <button disabled={isDeleting} onClick={() => setCameraToDelete(null)} className="px-5 py-2 font-semibold text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button disabled={isDeleting} onClick={handleDeleteCamera} className="px-5 py-2 font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm flex items-center gap-2">
                   {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
             </div>
           </div>
        </div>
      )}

      {/* OFFLINE CAMERA ALERT BANNER */}
      {offlineCameras.length > 0 && (
         <div className="mb-8 w-full bg-red-600 text-white p-4 rounded-lg shadow-lg flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-pulse">
            <AlertTriangle className="w-8 h-8 flex-shrink-0" />
            <div className="text-left">
               <h2 className="text-xl font-bold uppercase text-left">⚠️ Some cameras are offline. Immediate attention required.</h2>
               <p className="font-medium text-red-100 text-left">Contact maintenance or dispatch security to verify network integrity for {offlineCameras.length} disconnected camera(s).</p>
            </div>
         </div>
      )}

      {/* Title block */}
      <div className="mb-8 text-left w-full">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
           <Video className="text-blue-600" />
           CCTV Camera Management System
        </h1>
        <p className="text-gray-500 mt-1">Monitor, manage, and configure plaza security camera health.</p>
      </div>

      {/* Network Health Stats */}
      <div className="w-full">
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 w-full">
            <StatCard title="Total Cameras" value={stats.total} icon={<Video className="w-6 h-6" />} color="blue" />
            <StatCard title="Working" value={stats.working} icon={<CheckCircle className="w-6 h-6" />} color="green" />
            <StatCard title="Offline" value={stats.offline} icon={<AlertTriangle className="w-6 h-6" />} color="red" />
            <StatCard title="Maintenance" value={stats.maintenance} icon={<Clock className="w-6 h-6" />} color="orange" />
         </div>
      </div>

      {/* Vertical Stacking Container */}
      <div className="flex flex-col gap-8 w-full">
        
        {/* 1. Add Camera Card */}
        <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col text-left">
           <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><PlusCircle className="text-blue-600 w-5 h-5"/> Add Camera</h2>
           <form onSubmit={handleAddCamera} className="flex flex-col gap-4 w-full">
             <div className="w-full">
               <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Camera Name</label>
               <input required type="text" value={formData.camera_name} onChange={e => setFormData({...formData, camera_name: e.target.value})} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Lobby Cam 1" />
             </div>
             <div className="w-full">
               <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Location / Zone</label>
               <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Ground Floor Lobby" />
             </div>
             <button disabled={isSubmitting} type="submit" className="w-full mt-2 bg-blue-600 text-white font-bold py-2 px-4 rounded shadow hover:bg-blue-700 transition">
               {isSubmitting ? 'Adding...' : 'Install Camera'}
             </button>
           </form>
        </div>

        {/* 2 & 3. Camera Network Status Title & Grid */}
        <div className="w-full text-left flex flex-col mt-4">
          <div className="w-full mb-6 text-left">
            <h2 className="text-2xl font-bold text-gray-900">Camera Network Status Map</h2>
          </div>
          
          {/* Strict 3-Per-Row Auto-Wrapping Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full">
            {(Array.isArray(cameras) ? cameras : []).map(cam => (
              <div key={cam.id} className={`p-5 rounded-xl border-2 transition-colors flex flex-col justify-between w-full min-w-0 bg-white ${cam?.status === 'OFFLINE' ? 'border-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : cam?.status === 'MAINTENANCE' ? 'border-orange-300' : 'border-gray-200'}`}>
                
                {/* Top Row: Icon/Name & Status */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <Video className={`w-5 h-5 flex-shrink-0 ${cam?.status === 'OFFLINE' ? 'text-red-500 animate-pulse' : cam?.status === 'MAINTENANCE' ? 'text-orange-500' : 'text-blue-500'}`} />
                    <h3 className="font-extrabold text-gray-900 truncate max-w-[140px] text-lg">{cam?.camera_name || 'Unnamed Camera'}</h3>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded font-black border uppercase ${
                    cam?.status === 'WORKING' ? 'bg-green-100 text-green-800 border-green-300' : 
                    cam?.status === 'OFFLINE' ? 'bg-red-100 text-red-800 border-red-300' : 'bg-orange-100 text-orange-800 border-orange-300'
                  }`}>
                    {cam?.status || 'UNKNOWN'}
                  </span>
                </div>
                
                {/* Middle Row: Details & Dropsown Status Control */}
                <div className="flex flex-col gap-3 mb-5 text-left border-t border-gray-100 pt-4 relative flex-1">
                   <div>
                     <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Location</p>
                     <p className="text-sm text-gray-800 font-semibold truncate">{cam?.location || 'Unknown location'}</p>
                   </div>
                   
                   <div>
                     <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Last Maintained</p>
                     <p className="text-sm text-gray-800 font-semibold">{cam?.last_maintenance_date ? new Date(cam.last_maintenance_date).toLocaleDateString() : 'Initial Setup'}</p>
                   </div>
                   
                   <div className="mt-2 text-left w-full relative z-10">
                     <select 
                       value={cam?.status || 'WORKING'} 
                       onChange={(e) => handleUpdateStatus(cam.id, e.target.value)}
                       className="text-sm font-bold border border-gray-300 p-2 rounded-md w-full bg-gray-50 outline-none focus:border-blue-500 focus:bg-white cursor-pointer transition-colors"
                     >
                       <option value="WORKING">Set WORKING</option>
                       <option value="OFFLINE">Set OFFLINE</option>
                       <option value="MAINTENANCE">Set MAINTENANCE</option>
                     </select>
                  </div>
                </div>
                
                {/* Bottom Row: Delete Action */}
                <div className="flex justify-end border-t border-gray-100 pt-4">
                  <button onClick={() => setCameraToDelete(cam.id)} className="text-red-500 hover:text-red-700 flex items-center gap-1.5 text-sm font-bold bg-white hover:bg-red-50 border border-transparent hover:border-red-200 px-3 py-1.5 rounded-lg transition-all focus:outline-none">
                     <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
              </div>
            ))}
            {!loading && cameras.length === 0 && (
               <div className="col-span-full p-8 text-center bg-gray-50 rounded border-2 border-dashed border-gray-300 text-gray-500 font-medium h-48 flex items-center justify-center">No cameras installed in the system. Install your first camera from the form above.</div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
