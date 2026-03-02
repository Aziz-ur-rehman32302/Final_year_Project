import {
  Bell,
  Mail,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
  CircleAlert,
} from "lucide-react";

const TenantNotification = () => {
  interface TenantNotification {
    id: string;
    type: "reminder" | "overdue" | "payment" | "general";
    title: string;
    message: string;
    date: string;
    read: boolean;
    channel: "Email" | "SMS" | "Push";
  }

  const tenantNotifications: TenantNotification[] = [
    {
      id: "1",
      type: "payment",
      title: "Payment Confirmed",
      message:
        "Your November rent payment of $2,500 has been received and confirmed.",
      date: "2025-11-05 02:30 PM",
      read: true,
      channel: "Email",
    },
    {
      id: "2",
      type: "reminder",
      title: "Rent Due Reminder",
      message:
        "Your December rent of $2,500 is due on December 5, 2025. Please ensure timely payment.",
      date: "2025-12-02 09:00 AM",
      read: false,
      channel: "SMS",
    },
    {
      id: "3",
      type: "general",
      title: "Maintenance Schedule",
      message:
        "Plaza maintenance will be conducted on December 15, 2025 from 9 AM to 12 PM.",
      date: "2025-12-01 10:00 AM",
      read: true,
      channel: "Push",
    },
    {
      id: "4",
      type: "payment",
      title: "Payment Received",
      message:
        "Your October rent payment of $2,500 has been successfully processed.",
      date: "2025-10-08 03:15 PM",
      read: true,
      channel: "Email",
    },
    {
      id: "5",
      type: "general",
      title: "New Policy Update",
      message:
        "Plaza operating hours have been updated. Please check the notice board for details.",
      date: "2025-09-28 11:00 AM",
      read: true,
      channel: "Email",
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "reminder":
        return <Clock className="w-5 h-5 text-blue-600" />;
      case "overdue":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case "payment":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "reminder":
        return "bg-blue-50 border-blue-200";
      case "overdue":
        return "bg-red-50 border-red-200";
      case "payment":
        return "bg-green-50 border-green-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "Email":
        return <Mail className="w-4 h-4" />;
      case "SMS":
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const unreadCount = tenantNotifications.filter((n) => !n.read).length;
  // console.log(checkUnRead);

  return (
    <div className="p-3 w-full bg-gray-100  ">
      {/* Header */}
      <div className="p-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-600" />
            <h1 className="text-gray-900 font-semibold">Notifications</h1>
          </div>
          {unreadCount > 0 && (
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm">
              {unreadCount} New
            </span>
          )}
        </div>
        <p className="text-gray-600">
          Stay updated with your rent and plaza announcements.
        </p>
      </div>
      {/* ================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 mt-5 gap-5 ">
        <div className="p-5 text-gray-50 border border-gray-400 rounded-xl bg-blue-400 hover:shadow-xl hover:-translate-y-1 cursor-pointer  transition-all  duration-300 ease-in-out">
          <p className="flex gap-2 font-semibold text-2xl ">
            <Bell className="mt-1 w-6 h-6" />
            {tenantNotifications.length}
          </p>
          <h1 className="font-medium">Total Notifications</h1>
        </div>

        <div className="p-5  border border-gray-400 rounded-xl  hover:shadow-xl hover:-translate-y-1 cursor-pointer  transition-all  duration-300 ease-in-out">
          <p className="flex gap-2 font-semibold text-2xl ">
            <span className="p-1.5 w-fit h-fit bg-red-200 rounded-lg ">
              <CircleAlert className=" text-red-700  w-5 h-5" />
            </span>
            {unreadCount}
          </p>
          <h1 className="font-medium">Unread</h1>
        </div>
        <div className="p-5  border border-gray-400 rounded-xl  hover:shadow-xl hover:-translate-y-1 cursor-pointer  transition-all  duration-300 ease-in-out">
          <p className="flex gap-2 font-semibold text-2xl ">
            <span className="p-1.5 w-fit h-fit bg-green-200 rounded-lg ">
              <CheckCircle className=" text-green-700  w-5 h-5" />
            </span>
            {tenantNotifications.length - unreadCount}
          </p>
          <h1 className="font-medium">Read</h1>
        </div>
      </div>
      {/* ========================================================== */}
      <div className="bg-blue-50 border border-gray-300 w-full rounded-xl p-4 mt-4">
        <p className="flex gap-2 font-semibold text-blue-500">
          <span>
            <Bell className=" mt-1 text-blue-400  w-5 h-5" />
          </span>
          Notification Preferences
        </p>
        <h1 className="text-blue-400">
          You are currently receiving notifications via Email and SMS. Contact
          admin to update your preferences.
        </h1>
      </div>
      {/* ======================================================== */}
      {/* Notifications List */}
      <div className="flex flex-col gap-4 mt-5">
        {tenantNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-white rounded-lg border p-6 transition-all ${
              notification.read
                ? "border-gray-200"
                : "border-blue-300 shadow-md"
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div
                className={`rounded-lg p-3 border ${getTypeColor(
                  notification.type
                )}`}
              >
                {getTypeIcon(notification.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3
                    className={`text-gray-900 ${!notification.read ? "" : ""}`}
                  >
                    {notification.title}
                    {!notification.read && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 bg-blue-600 text-white rounded text-xs">
                        New
                      </span>
                    )}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-500 text-sm flex-shrink-0">
                    {getChannelIcon(notification.channel)}
                    <span>{notification.channel}</span>
                  </div>
                </div>
                <p className="text-gray-700 mb-3">{notification.message}</p>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{notification.date}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State (shown when no notifications) */}
      {tenantNotifications.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <Bell className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-gray-900 mb-2">No Notifications</h3>
          <p className="text-gray-600">
            You're all caught up! Check back later for updates.
          </p>
        </div>
      )}
      {/* ===================================================== */}
    </div>
  );
};

export default TenantNotification;
