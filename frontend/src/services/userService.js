import api from "./api";

const userService = {
  getFaculty: (department) => api.get("/users/faculty", { params: { department } }).then((r) => r.data),
};

export default userService;
