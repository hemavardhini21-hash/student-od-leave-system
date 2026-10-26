import api from "./api";

const adminService = {
  getUsers: (params) => api.get("/admin/users", { params }).then((r) => r.data),
  createUser: (data) => api.post("/admin/users", data).then((r) => r.data),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data).then((r) => r.data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`).then((r) => r.data),
  getDepartments: () => api.get("/admin/departments").then((r) => r.data),
  getAnalytics: () => api.get("/admin/analytics").then((r) => r.data),
};

export default adminService;
