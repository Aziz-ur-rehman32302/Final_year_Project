import {
  Bell,
  CheckCircle,
  XCircle,
  Send,
  Mail,
  MessageSquare,
  Smartphone,
} from "lucide-react";

import { useState } from "react";

interface Notification {
  id: string;
  type: "reminder" | "overdue" | "payment";
  recipient: string;
  message: string;
  channel: "SMS" | "Email" | "Push";
  status: "Sent" | "Failed" | "Pending";
  sentDate: string;
}

const notificationHistory: Notification[] = [
  {
    id: "1",
    type: "reminder",
    recipient: "John Smith (T-101)",
    message: "Rent due reminder for December",
    channel: "Email",
    status: "Sent",
    sentDate: "2025-12-01 09:00 AM",
  },
  {
    id: "2",
    type: "reminder",
    recipient: "Sarah Johnson (T-102)",
    message: "Rent due reminder for December",
    channel: "SMS",
    status: "Sent",
    sentDate: "2025-12-01 09:00 AM",
  },
  {
    id: "3",
    type: "overdue",
    recipient: "Michael Brown (T-103)",
    message: "Overdue payment alert",
    channel: "Email",
    status: "Sent",
    sentDate: "2025-12-06 10:00 AM",
  },
  {
    id: "4",
    type: "payment",
    recipient: "Emily Davis (T-104)",
    message: "Payment received confirmation",
    channel: "SMS",
    status: "Sent",
    sentDate: "2025-12-04 02:30 PM",
  },
  {
    id: "5",
    type: "reminder",
    recipient: "David Wilson (T-105)",
    message: "Rent due in 3 days",
    channel: "Push",
    status: "Sent",
    sentDate: "2025-12-02 08:00 AM",
  },
  {
    id: "6",
    type: "overdue",
    recipient: "James Garcia (T-107)",
    message: "Overdue payment alert",
    channel: "Email",
    status: "Failed",
    sentDate: "2025-12-06 10:00 AM",
  },
];



const NotificationsAdmin = () => {
  {
    /* Success Toast */
  }
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const handleSaveSettings = () => {
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
    // ====================================================================
  };

  const getChannelIcon = (channel: string) => {
      switch (channel) {
        case 'Email':
          return <Mail className="w-4 h-4" />;
        case 'SMS':
          return <MessageSquare className="w-4 h-4" />;
        case 'Push':
          return <Smartphone className="w-4 h-4" />;
        default:
          return null;
      }
    };
  
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'Sent':
          return 'bg-green-100 text-green-700';
        case 'Failed':
          return 'bg-red-100 text-red-700';
        case 'Pending':
          return 'bg-yellow-100 text-yellow-700';
        default:
          return 'bg-gray-100 text-gray-700';
      }
    };
  
    const getTypeColor = (type: string) => {
      switch (type) {
        case 'reminder':
          return 'bg-blue-100 text-blue-700';
        case 'overdue':
          return 'bg-red-100 text-red-700';
        case 'payment':
          return 'bg-green-100 text-green-700';
        default:
          return 'bg-gray-100 text-gray-700';
      }
    };
    const [notifications] = useState<Notification[]>(notificationHistory);
    // Calculate Total Status 
    const totalCount = notifications.reduce((count, e) => {
        if (e.status === "Sent" || e.status === "Failed") {
            return count + 1;
        }
        return count;
        }, 0);

    const sentCount = notifications.filter((n) => n.status === 'Sent').length;
    
    const failedCount = notifications.filter((n) => n.status === 'Failed').length;

    // --------------------------------------------------------
    const [reminderDays, setReminderDays] = useState('3');
    const [overdueDays, setOverdueDays] = useState('1');
    const [enableEmail, setEnableEmail] = useState(true);
    const [enableSMS, setEnableSMS] = useState(true);
    const [enablePush, setEnablePush] = useState(false);
  



  return (
    <div className="p-6 bg-gray-100 h-full">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Bell className="w-6 h-6 text-blue-600" />
          <h1 className="text-gray-900 font-medium">
            Notifications Management
          </h1>
        </div>
        <p className="text-gray-600">
          Configure notification rules and view delivery status.
        </p>
      </div>
      {/* -------------------------------------------------------- */}
      {/* Success Toast */}
      {showSaveSuccess && (
        <div className="fixed top-20 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in z-50">
          <CheckCircle className="w-5 h-5" />
          <span>Settings saved successfully!</span>
        </div>
      )}
      {/* ------------------------------------------------------------ */}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        <div className="h-25 bg-white rounded-lg p-4  border hover:shadow-xl hover:-translate-y-1 cursor-pointer  transition-all  duration-200 ease-in-out border-gray-200">
          <div className="flex items-center gap-3 ">
            <div className="bg-blue-100 rounded-lg p-2">
              <Send className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-semibold text-gray-90font-semibold">{totalCount}</div>
          </div>
          <div className="text-gray-600 pt-1 font-medium">Total Sent</div>
        </div>

        <div className="bg-white rounded-lg p-4 h-25 border border-gray-200 hover:shadow-xl hover:-translate-y-1 cursor-pointer  transition-all  duration-200 ease-in-out">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-green-100 rounded-lg p-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl text-gray-900 font-semibold">{sentCount}</div>
          </div>
          <div className="text-gray-600 font-medium">Delivered</div>
        </div>

        <div className="bg-white rounded-lg p-4 h-25 border border-gray-200 hover:shadow-xl hover:-translate-y-1 cursor-pointer  transition-all  duration-200 ease-in-out">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-red-100 rounded-lg p-2">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-2xl text-gray-900 font-semibold">{failedCount}</div>
          </div>
          <div className="text-gray-600 font-medium">Failed</div>
        </div>
      </div>
      {/* ---------------------------------------------------------------- */}

      {/* Notification Settings */}
      <div className="bg-white rounded-lg mt-4 border border-gray-200 p-6">
        <h3 className="text-gray-900 text-xl mb-6 font-semibold">
          Notification Rules
        </h3>

        <div className="space-y-6">
          {/* Reminder Settings */}
          <div>
            <label className="block text-lg text-gray-700 font-medium mb-2">
              Send Rent Reminder (Days Before Due Date)
            </label>
            <input
              value={reminderDays}
              onChange={(e)=>{
                setReminderDays(e.target.value)
              }}
              type="number"
              className="w-full max-w-xs px-4 py-2.5 border font-semibold border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              min="1"
              max="30"
            />
            <p className="text-gray-500 text-lg mt-1">
              Tenants will receive a reminder {reminderDays} days before their rent is due
            </p>
          </div>

          {/* Overdue Settings */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Send Overdue Alert (Days After Due Date)
            </label>
            <input
              value={overdueDays}
              onChange={(e)=>{
                setOverdueDays(e.target.value)
              }}
              type="number"
              className="w-full max-w-xs px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              min="1"
              max="30"
            />
            <p className="text-gray-500 text-lg mt-1">
              Overdue alerts will be sent {overdueDays} days after the due date
            </p>
          </div>

          {/* Channel Settings */}
          <div>
            <label className="block font-semibold text-gray-700 mb-3">
              Notification Channels
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  checked={enableEmail}
                  onChange={(e)=>{
                    setEnableEmail(e.target.checked)
                  }}
                  type="checkbox"
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <Mail className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Email Notifications</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                    checked={enableSMS}
                    onChange={(e) => setEnableSMS(e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <MessageSquare className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">SMS Notifications</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                    checked={enablePush}
                    onChange={(e) => setEnablePush(e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <Smartphone className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Mobile Push Notifications</span>
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <button
              onClick={handleSaveSettings}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
      {/* ---------------------------------------------------------- */}
      {/* Notification History */}
       <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-gray-900 font-medium text-lg">Notification History</h3>
        </div>

        <div id="custom-scrollbar" className=" overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">Type</th>
                <th className="px-6 py-3 text-left text-gray-700">Recipient</th>
                <th className="px-6 py-3 text-left text-gray-700">Message</th>
                <th className="px-6 py-3 text-left text-gray-700">Channel</th>
                <th className="px-6 py-3 text-left text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-gray-700">Sent Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {notifications.map((dets) => (
                
              
                <tr
                  key={dets.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm capitalize ${getTypeColor(
                        dets.type
                      )}`}
                    >
                      {dets.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {dets.recipient}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {dets.message}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      {getChannelIcon(dets.channel)}
                      <span>{dets.channel}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${getStatusColor(
                        dets.status
                      )}`}
                    >
                      {dets.status === "Sent" && (
                        <CheckCircle className="w-3.5 h-3.5" />
                      )}
                      {dets.status === "Failed" && (
                        <XCircle className="w-3.5 h-3.5" />
                      )}
                      {dets.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {dets.sentDate}
                  </td>
                </tr>
             )
             )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NotificationsAdmin;
