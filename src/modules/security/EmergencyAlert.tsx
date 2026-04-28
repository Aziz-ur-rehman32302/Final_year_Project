import React, { useState } from 'react';
import { Radio } from 'lucide-react';
import { API_BASE_URL as BASE_URL } from '../../config';

const API_BASE_URL = BASE_URL + '/api/security';

export default function EmergencyAlert() {
  const [formData, setFormData] = useState({ title: '', message: '', alert_type: 'general', target_audience: 'all_tenants' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSendAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      const res = await fetch(`${API_BASE_URL}/alerts/create.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data && data.success) {
        setSuccess(true);
        setFormData({ title: '', message: '', alert_type: 'general', target_audience: 'all_tenants' });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        alert("Error: " + (data?.message || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-red-700 flex items-center gap-2">
          <Radio className="text-red-700 w-8 h-8" />
          Global Emergency Broadcast
        </h1>
        <p className="text-gray-600 mt-2">Send instant alerts to all tenants, security dashboards and personnel.</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-red-200 max-w-2xl">
         {success && (
           <div className="mb-4 bg-green-100 text-green-700 p-3 rounded-lg border border-green-200 font-medium">
             Emergency broadcast sent successfully to all tenants and security personnel.
           </div>
         )}
        <form onSubmit={handleSendAlert} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Alert Title</label>
            <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 border-2 border-red-100 focus:border-red-500 rounded-md outline-none" placeholder="e.g. Lift Breakdown in Block C" />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-800 mb-1">Alert Type</label>
              <select required value={formData.alert_type} onChange={e => setFormData({...formData, alert_type: e.target.value})} className="w-full p-3 border-2 border-red-100 focus:border-red-500 rounded-md outline-none bg-white">
                <option value="general">General Alert</option>
                <option value="fire_emergency">Fire Emergency</option>
                <option value="utility_issue">Utility Issue (Electricity/Water)</option>
                <option value="security_threat">Security Threat</option>
                <option value="maintenance">Urgent Maintenance (Lift/Cleaning)</option>
              </select>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-800 mb-1">Target Audience</label>
              <select required value={formData.target_audience} onChange={e => setFormData({...formData, target_audience: e.target.value})} className="w-full p-3 border-2 border-red-100 focus:border-red-500 rounded-md outline-none bg-white">
                <option value="all_tenants">All Tenants Worldwide</option>
                <option value="security_only">Security Team Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Emergency Message & Instructions</label>
            <textarea required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full p-3 border-2 border-red-100 focus:border-red-500 rounded-md h-32 outline-none" placeholder="Provide clear instructions for tenants and security personnel..."></textarea>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition font-bold text-lg flex justify-center items-center gap-2">
             <Radio className="w-5 h-5"/> {loading ? 'Broadcasting...' : 'BROADCAST ALERT NOW'}
          </button>
        </form>
      </div>
    </div>
  );
}
