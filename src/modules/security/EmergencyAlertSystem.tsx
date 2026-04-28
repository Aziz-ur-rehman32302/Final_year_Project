import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, AlertOctagon, Zap, ShieldAlert, Wrench, Siren, X } from 'lucide-react';
import { getUser } from '../../utils/auth';
import { API_BASE_URL as BASE_URL } from '../../config';

const API_BASE_URL = BASE_URL + '/api/security';

export default function EmergencyAlertSystem() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [dismissed, setDismissed] = useState<Set<number>>(() => {
    try {
      const stored = localStorage.getItem('dismissed_alert_ids');
      return stored ? new Set<number>(JSON.parse(stored)) : new Set<number>();
    } catch {
      return new Set<number>();
    }
  });
  const previousAlertsCount = useRef(0);

  const fetchAlerts = async () => {
    try {
      const user = getUser();
      const role = user?.role === 'guard' ? 'guard' : 'tenant';

      const res = await fetch(`${API_BASE_URL}/alerts/latest.php?role=${role}`);
      const data = await res.json();
      
      if (data && data.success && data.data) {
        setAlerts(data.data || []);

        if (data.data.length > previousAlertsCount.current) {
          playAlarmSound();
        }
        previousAlertsCount.current = data.data.length;
      }
    } catch (err) {
      console.error('Failed to fetch emergency alerts', err);
    }
  };

  const playAlarmSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const audioCtx = new AudioContext();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.5);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.5);
      }
    } catch (e) {
      console.warn('Audio Context blocked or unsupported');
    }
  };

  const handleDismiss = (id: number) => {
    setDismissed(prev => {
      const updated = new Set([...prev, id]);
      try {
        localStorage.setItem('dismissed_alert_ids', JSON.stringify([...updated]));
      } catch {
        // ignore storage errors
      }
      return updated;
    });
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  const visibleAlerts = (Array.isArray(alerts) ? alerts : []).filter((a: any) => !dismissed.has(a.id));

  if (!visibleAlerts || visibleAlerts.length === 0) return null;

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'fire_emergency': return <AlertOctagon className="w-8 h-8 animate-pulse text-white" />;
      case 'utility_issue': return <Zap className="w-8 h-8 animate-pulse text-white" />;
      case 'security_threat': return <ShieldAlert className="w-8 h-8 animate-pulse text-white" />;
      case 'maintenance': return <Wrench className="w-8 h-8 animate-pulse text-white" />;
      default: return <Siren className="w-8 h-8 animate-pulse text-white" />;
    }
  };

  return (
    /* Fixed overlay — sits on top of page, does NOT push content down */
    <div className="fixed top-0 left-0 right-0 z-[9999] flex flex-col pointer-events-none">
      {(Array.isArray(visibleAlerts) ? visibleAlerts : []).map((alert: any) => (
        <div
          key={alert.id}
          className="w-full bg-red-600 text-white shadow-2xl border-b-2 border-red-800 pointer-events-auto"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
            
            {/* Icon */}
            <div className="bg-red-800/50 p-2 rounded-full flex-shrink-0 border border-red-500">
              {getAlertIcon(alert.alert_type)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <AlertTriangle className="w-4 h-4 text-yellow-300 animate-pulse flex-shrink-0" />
                <span className="uppercase text-xs font-black tracking-widest bg-red-900/50 px-2 py-0.5 rounded text-red-100 border border-red-500">
                  {alert.alert_type ? alert.alert_type.replace('_', ' ') : 'GLOBAL EMERGENCY'}
                </span>
                <span className="text-xs font-bold text-red-200">
                  {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <h2 className="text-lg font-black leading-tight text-white truncate">{alert.title}</h2>
              <p className="text-red-100 text-sm font-medium truncate">{alert.message}</p>
            </div>

            {/* Dismiss button */}
            <button
              onClick={() => handleDismiss(alert.id)}
              className="flex-shrink-0 ml-2 bg-red-800 hover:bg-red-900 text-white rounded-full p-1.5 border border-red-500 transition-colors"
              title="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </button>

          </div>
        </div>
      ))}
    </div>
  );
}
