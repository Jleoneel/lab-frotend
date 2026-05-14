import api from "../lib/axios";

export const userService = {
  create: async (data) => {
    const response = await api.post("/users", data);
    return response.data || response;
  },

  update: async (id, data) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data || response;
  },

  resetPassword: async (id, password) => {
    const response = await api.patch(`/users/${id}/reset-password`, {
      password,
    });
    return response.data || response;
  },

  getAnalistas: async () => {
    const response = await api.get("/users/analistas");
    return { data: response.data || response };
  },

  getAll: async () => {
    const response = await api.get("/users");
    return { data: response.data || response };
  },
};
