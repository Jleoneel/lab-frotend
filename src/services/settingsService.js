import api from "../lib/axios";

export const settingsService = {
  getLabInfo: async () => {
    try {
      const response = await api.get("/settings/lab-info");
      return response.data || response;
    } catch (error) {
      throw error;
    }
  },

  getIva: async () => {
    try {
      const response = await api.get("/settings/iva");
      return response.data || response;
    } catch (error) {
      throw error;
    }
  },

  updateIva: async (iva) => {
    try {
      const response = await api.put("/settings/iva", { iva });
      return response.data || response;
    } catch (error) {
      throw error;
    }
  },

  getRazones: async () => {
    try {
      const response = await api.get("/razones");
      return response.data || response;
    } catch (error) {
      throw error;
    }
  },

  createRazon: async (nombre) => {
    try {
      const response = await api.post("/razones", { nombre });
      return response.data || response;
    } catch (error) {
      throw error;
    }
  },

  updateRazon: async (id, data) => {
    try {
      const response = await api.put(`/razones/${id}`, data);
      return response.data || response;
    } catch (error) {
      throw error;
    }
  },

  deleteRazon: async (id) => {
    try {
      const response = await api.delete(`/razones/${id}`);
      return response.data || response;
    } catch (error) {
      throw error;
    }
  },
};
