import api from "./api";

const attendanceService = {
  getAll: (params) => api.get("/attendance", { params }).then((r) => r.data),
  create: (data) => api.post("/attendance", data).then((r) => r.data),
  update: (id, data) => api.put(`/attendance/${id}`, data).then((r) => r.data),
  getAuditLog: () => api.get("/attendance/audit-log").then((r) => r.data),
};

export default attendanceService;
