import api from "../lib/axios";

export const settingsService = {
  getLabInfo: async () => {
    const response = await api.get("/settings/lab-info");
    return response.data || response;
  },

  getIva: async () => {
    const response = await api.get("/settings/iva");
    return response.data || response;
  },

  updateIva: async (iva) => {
    const response = await api.put("/settings/iva", { iva });
    return response.data || response;
  },

  getRazones: async () => {
    const response = await api.get("/razones");
    return response.data || response;
  },

  createRazon: async (nombre) => {
    const response = await api.post("/razones", { nombre });
    return response.data || response;
  },

  updateRazon: async (id, data) => {
    const response = await api.put(`/razones/${id}`, data);
    return response.data || response;
  },

  deleteRazon: async (id) => {
    const response = await api.delete(`/razones/${id}`);
    return response.data || response;
  },
};
