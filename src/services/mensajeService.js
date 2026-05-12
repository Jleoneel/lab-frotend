import api from "../lib/axios";

export const mensajeService = {
  getAll: async () => {
    const response = await api.get("/mensajes");
    return response.data || response;
  },

  send: async (toId, contenido) => {
    const response = await api.post("/mensajes", { toId, contenido });
    return response.data || response;
  },

  marcarLeido: async (id) => {
    const response = await api.patch(`/mensajes/${id}/leer`);
    return response.data || response;
  },

  marcarTodosLeidos: async () => {
    const response = await api.patch("/mensajes/leer-todos");
    return response.data || response;
  },
  
  getConversacion: async (otroUserId) => {
    const response = await api.get(`/mensajes/conversacion/${otroUserId}`);
    return response.data || response;
  },
  
  getConversaciones: async () => {
  const response = await api.get('/mensajes/conversaciones');
  return response.data || response;
},
};
