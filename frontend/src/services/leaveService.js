import api from "./api";

const leaveService = {
  create: (formData) =>
    api
      .post("/leave", formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then((r) => r.data),
  getAll: (params) => api.get("/leave", { params }).then((r) => r.data),
  getById: (id) => api.get(`/leave/${id}`).then((r) => r.data),
  approve: (id, remarks) => api.put(`/leave/${id}/approve`, { remarks }).then((r) => r.data),
  reject: (id, remarks) => api.put(`/leave/${id}/reject`, { remarks }).then((r) => r.data),
};

export default leaveService;
