import api from "./api";

const notificationService = {
  getAll: () => api.get("/notifications").then((r) => r.data),
  markAsRead: (id) => api.put(`/notifications/${id}/read`).then((r) => r.data),
  markAllAsRead: () => api.put("/notifications/read-all").then((r) => r.data),
};

export default notificationService;
