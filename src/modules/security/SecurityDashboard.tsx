import React, { useState, useEffect } from 'react';
import { Shield, Users, AlertTriangle, Video, CheckCircle, XCircle } from 'lucide-react';
import { API_BASE_URL as BASE_URL } from '../../config';

const API_BASE_URL = BASE_URL + '/api/security';

export default function SecurityDashboard() {
  const [stats, setStats] = useState<any>({
    guards_on_duty: 0,
    visitors_inside: 0,
    active_incidents: 0,
    offline_cameras: 0
  });
  const [loading, setLoading] = useState<boolean>(true);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/dashboard/dashboard_stats.php`);
      const data = await res.json();
      if (data && data.success) {
        setStats(data.data || {
          guards_on_duty: 0,
          visitors_inside: 0,
          active_incidents: 0,
          offline_cameras: 0
        });
      }
    } catch (err) {
      console.error('Failed to fetch stats', err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchStats();
    const interval = setInterval(() => {
      fetchStats();
    }, 20000);
    
    const handleRefresh = () => {
      fetchStats();
    };
    window.addEventListener('refresh-security-stats', handleRefresh);

    return () => {
      clearInterval(interval);
      window.removeEventListener('refresh-security-stats', handleRefresh);
    };
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Security Command Center</h1>
        </div>
        <p className="text-gray-600">Real-time overview of plaza security and operations.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 font-medium mb-1">Guards on Duty</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats.guards_on_duty}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 font-medium mb-1">Visitors Inside</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats.visitors_inside}</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 font-medium mb-1">Active Incidents</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats.active_incidents}</h3>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 font-medium mb-1">Cameras Offline</p>
              <h3 className={`text-3xl font-bold ${stats.offline_cameras > 0 ? 'text-red-600' : 'text-gray-900'}`}>{stats.offline_cameras}</h3>
            </div>
            <div className={`p-3 rounded-lg ${stats.offline_cameras > 0 ? 'bg-red-100' : 'bg-gray-100'}`}>
              <Video className={`w-6 h-6 ${stats.offline_cameras > 0 ? 'text-red-600' : 'text-gray-600'}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
