import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import Loader from "../components/Loader";
import notificationService from "../services/notificationService";

const TYPE_ICON = { OD: "📝", Leave: "📋", Attendance: "✅", General: "🔔" };

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    notificationService
      .getAll()
      .then((res) => setNotifications(res.notifications))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleMarkRead = async (id) => {
    await notificationService.markAsRead(id);
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
  };

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-ink-800 mb-1">Notifications</h1>
          <p className="text-sm text-slate-500">{unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}</p>
        </div>
        {unreadCount > 0 && (
          <button className="btn-secondary" onClick={handleMarkAllRead}>
            Mark all as read
          </button>
        )}
      </div>

      <div className="card">
        {loading ? (
          <Loader />
        ) : notifications.length === 0 ? (
          <p className="text-sm text-slate-500 py-8 text-center">No notifications yet</p>
        ) : (
          <div className="divide-y divide-parchment-200">
            {notifications.map((n) => (
              <div
                key={n._id}
                className={`flex items-start gap-3 py-3 cursor-pointer ${!n.isRead ? "bg-primary-50/50" : ""}`}
                onClick={() => !n.isRead && handleMarkRead(n._id)}
              >
                <span className="text-xl">{TYPE_ICON[n.type] || "🔔"}</span>
                <div className="flex-1">
                  <p className={`text-sm ${!n.isRead ? "font-semibold text-ink-800" : "text-ink-600"}`}>{n.message}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
                {!n.isRead && <span className="w-2 h-2 rounded-full bg-primary-600 mt-1.5" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
