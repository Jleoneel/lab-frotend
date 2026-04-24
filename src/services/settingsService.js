import api from "../lib/axios";

export const settingsService = {
  getLabInfo: async () => {
    try {
      const response = await api.get("/settings/lab-info");
      return response.data || response;
    } catch (error) {
      console.error("Error en settingsService.getLabInfo:", error);
      throw error;
    }
  },

  getIva: async () => {
    try {
      const response = await api.get("/settings/iva");
      return response.data || response;
    } catch (error) {
      console.error("Error en settingsService.getIva:", error);
      throw error;
    }
  },

  updateIva: async (iva) => {
    try {
      const response = await api.put("/settings/iva", { iva });
      return response.data || response;
    } catch (error) {
      console.error("Error en settingsService.updateIva:", error);
      throw error;
    }
  },

  getRazones: async () => {
    try {
      const response = await api.get("/razones");
      return response.data || response;
    } catch (error) {
      console.error("Error en settingsService.getRazones:", error);
      throw error;
    }
  },

  createRazon: async (nombre) => {
    try {
      const response = await api.post("/razones", { nombre });
      return response.data || response;
    } catch (error) {
      console.error("Error en settingsService.createRazon:", error);
      throw error;
    }
  },

  updateRazon: async (id, data) => {
    try {
      const response = await api.put(`/razones/${id}`, data);
      return response.data || response;
    } catch (error) {
      console.error("Error en settingsService.updateRazon:", error);
      throw error;
    }
  },

  deleteRazon: async (id) => {
    try {
      const response = await api.delete(`/razones/${id}`);
      return response.data || response;
    } catch (error) {
      console.error("Error en settingsService.deleteRazon:", error);
      throw error;
    }
  },
};
