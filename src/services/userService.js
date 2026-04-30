import api from "../lib/axios";

export const userService = {
  create: async (data) => {
    try {
      const response = await api.post("/users", data);
      return response.data || response;
    } catch (error) {
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.put(`/users/${id}`, data);
      return response.data || response;
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async (id, password) => {
    try {
      const response = await api.patch(`/users/${id}/reset-password`, {
        password,
      });
      return response.data || response;
    } catch (error) {
      throw error;
    }
  },

  getAnalistas: async () => {
    try {
      const response = await api.get("/users/analistas");
      return { data: response.data || response };
    } catch (error) {
      throw error;
    }
  },

  getAll: async () => {
    try {
      const response = await api.get("/users");
      return { data: response.data || response };
    } catch (error) {
      throw error;
    }
  },
};
