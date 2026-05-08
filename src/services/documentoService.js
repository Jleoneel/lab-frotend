import api from "../lib/axios";

export const documentoService = {
  getAll: async () => {
    const response = await api.get("/documentos");
    return response.data || response;
  },

  createCategoria: async (nombre) => {
    const response = await api.post("/documentos/categorias", { nombre });
    return response.data || response;
  },

  updateCategoria: async (id, data) => {
    const response = await api.put(`/documentos/categorias/${id}`, data);
    return response.data || response;
  },

  deleteCategoria: async (id) => {
    const response = await api.delete(`/documentos/categorias/${id}`);
    return response.data || response;
  },

  createEnlace: async (data) => {
    const response = await api.post("/documentos/enlaces", data);
    return response.data || response;
  },

  updateEnlace: async (id, data) => {
    const response = await api.put(`/documentos/enlaces/${id}`, data);
    return response.data || response;
  },

  deleteEnlace: async (id) => {
    const response = await api.delete(`/documentos/enlaces/${id}`);
    return response.data || response;
  },
};
