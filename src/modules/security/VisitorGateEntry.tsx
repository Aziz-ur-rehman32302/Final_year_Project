import React, { useState, useEffect } from 'react';
import { Users, LogOut } from 'lucide-react';

const API_BASE_URL = 'http://localhost/plaza_management_system_backend/api/security';

export default function VisitorGateEntry() {
  const [currentVisitors, setCurrentVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '', phone: '', purpose: '', shop_id: ''
  });

  const fetchCurrentVisitors = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/visitors/current.php`);
      const data = await res.json();
      if (data.success) {
        setCurrentVisitors(data.visitors); // Data format changed to data.visitors matching API
      }
    } catch (err) {
      console.error('Failed to fetch visitors', err);
    } finally {
      if(loading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentVisitors();
    const interval = setInterval(fetchCurrentVisitors, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleEntry = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/visitors/entry.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setFormData({ name: '', phone: '', purpose: '', shop_id: '' });
        fetchCurrentVisitors(); // Instantly refresh list
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error reaching server");
    }
  };

  const handleExit = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/visitors/exit.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitor_id: id })
      });
      // Removing the return validation as instructed to assume successful fast removal
      fetchCurrentVisitors(); // Sync immediately locally
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6">
         <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="text-blue-600" />
            Visitor Gate Entry
         </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Entry Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4">New Visitor Entry</h2>
          <form onSubmit={handleEntry} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Full Name</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Phone Number</label>
              <input required type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Purpose of Visit</label>
              <input required type="text" value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})} className="w-full p-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Target Shop ID</label>
              <input required type="number" value={formData.shop_id} onChange={e => setFormData({...formData, shop_id: e.target.value})} className="w-full p-2 border rounded-md" />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-bold mt-2">Log Visitor Entry</button>
          </form>
        </div>

        {/* Current Visitors */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Visitors Currently Inside Plaza</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-3">Name</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Destination</th>
                  <th className="p-3">Entry Time</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentVisitors.map(visitor => (
                  <tr key={visitor.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-900">{visitor.name}</td>
                    <td className="p-3 text-gray-600">{visitor.phone}</td>
                    <td className="p-3 font-semibold text-blue-800">Shop ID: {visitor.shop_id} <span className="font-normal text-gray-600">({visitor.purpose})</span></td>
                    <td className="p-3 text-gray-600">
                      {new Date(visitor.entry_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}
                    </td>
                    <td className="p-3 text-center">
                      <button onClick={() => handleExit(visitor.id)} className="text-orange-600 hover:text-orange-800 flex items-center justify-center gap-1 mx-auto text-sm font-medium border border-orange-200 bg-orange-50 hover:bg-orange-100 px-3 py-1 rounded transition-colors">
                        <LogOut className="w-4 h-4" /> Check Out
                      </button>
                    </td>
                  </tr>
                ))}
                {currentVisitors.length === 0 && !loading && (
                   <tr>
                    <td colSpan={5} className="p-6 text-center text-gray-500 font-medium">No visitors are currently inside the plaza.</td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
