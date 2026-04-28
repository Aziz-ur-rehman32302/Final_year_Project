import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { API_BASE_URL as BASE_URL } from '../../config';

const API_BASE_URL = BASE_URL + '/api/security';

export default function IncidentReporting() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [guards, setGuards] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState({
    title: '', description: '', location: '', reported_by: ''
  });

  const fetchIncidents = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/incidents/list.php`);
      const data = await res.json();
      if (data && data.success) {
        setIncidents(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch incidents', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGuards = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/guards/list.php`);
      const data = await res.json();
      if (data && Array.isArray(data)) {
        setGuards(data);
      } else if (data && data.data && Array.isArray(data.data)) {
        setGuards(data.data);
      } else {
        setGuards([]);
      }
    } catch (err) {
      console.error('Failed to fetch guards', err);
    }
  };

  useEffect(() => {
    fetchIncidents();
    fetchGuards();
  }, []);

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { 
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        reported_by: parseInt(formData.reported_by, 10) 
      };

      if (!payload.title || !payload.description || !payload.location || !payload.reported_by) {
        alert("All fields are required. Please check your inputs.");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/incidents/report.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        alert("Incident reported successfully");
        setFormData({ title: '', description: '', location: '', reported_by: '' });
        fetchIncidents();
        window.dispatchEvent(new Event('refresh-security-stats'));
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("System error: Failed to connect to server");
    }
  };

  const handleResolve = async (incidentId: number | string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/incidents/resolve.php`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incident_id: incidentId })
      });
      const data = await res.json();
      if (data.success) {
        alert("Incident resolved successfully!");
        fetchIncidents();
        window.dispatchEvent(new Event('refresh-security-stats'));
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("System error: Failed to connect to server");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <AlertTriangle className="text-orange-600" />
          Incident Reporting
        </h1>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 w-full">
          <h2 className="text-lg font-semibold mb-4 text-orange-700">Report New Incident</h2>
          <form onSubmit={handleReport} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Title / Severity</label>
              <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 border rounded-md" placeholder="e.g. Broken Glass Door" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Location</label>
              <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full p-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Description</label>
              <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 border rounded-md h-24"></textarea>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Reported By Guard</label>
              {guards.length === 0 ? (
                <div className="w-full p-2 border border-red-200 bg-red-50 text-red-600 rounded-md text-sm">
                  No guards available. Please add guards first.
                </div>
              ) : (
                <select required value={formData.reported_by} onChange={e => setFormData({...formData, reported_by: e.target.value})} className="w-full p-2 border rounded-md bg-white">
                  <option value="">Select Guard</option>
                  {(Array.isArray(guards) ? guards : []).map(g => (
                    <option key={g.id} value={g.id}>{g?.name} — {g?.duty_location}</option>
                  ))}
                </select>
              )}
            </div>
            <button disabled={guards.length === 0} type="submit" className={`w-full py-2 rounded-md transition font-semibold ${guards.length === 0 ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-orange-600 text-white hover:bg-orange-700'}`}>Report Incident</button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 w-full space-y-4">
          <h2 className="text-lg font-semibold mb-4">Incident Logs</h2>
          {(Array.isArray(incidents) ? incidents : []).map(incident => (
            <div key={incident.id} className={`p-4 rounded-lg border ${incident?.status === 'open' ? 'border-orange-200 bg-orange-50' : 'border-gray-200 bg-gray-50'}`}>
               <div className="flex justify-between items-start mb-2">
                 <h3 className="font-bold text-gray-900">{incident?.title}</h3>
                 <span className={`text-xs px-2 py-1 rounded-full font-bold ${incident?.status === 'open' ? 'bg-orange-200 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                   {incident?.status?.toUpperCase()}
                 </span>
               </div>
               <p className="text-sm text-gray-700 mb-2">{incident?.description}</p>
               <div className="text-xs text-gray-500 mb-3">
                 Location: {incident?.location} | Reported by Guard: {incident?.guard_name || incident?.reported_by} | Time: {incident?.incident_time ? new Date(incident.incident_time).toLocaleString() : ''}
               </div>
               {incident?.status === 'open' && (
                 <button onClick={() => handleResolve(incident.id)} className="text-green-700 hover:text-green-900 flex items-center gap-1 text-sm font-medium bg-green-100 hover:bg-green-200 px-3 py-1 rounded-md transition border border-green-300">
                   <CheckCircle className="w-4 h-4" /> Resolve Incident
                 </button>
               )}
            </div>
          ))}
          {incidents.length === 0 && !loading && (
             <div className="p-6 text-center text-gray-500">No incident logs found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
