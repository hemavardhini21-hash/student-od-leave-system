import api from "./api";

const odService = {
  create: (formData) =>
    api
      .post("/od", formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then((r) => r.data),
  getAll: (params) => api.get("/od", { params }).then((r) => r.data),
  getById: (id) => api.get(`/od/${id}`).then((r) => r.data),
  approve: (id, remarks) => api.put(`/od/${id}/approve`, { remarks }).then((r) => r.data),
  reject: (id, remarks) => api.put(`/od/${id}/reject`, { remarks }).then((r) => r.data),
};

export default odService;
