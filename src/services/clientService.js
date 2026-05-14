// services/clientService.js
import api from "../lib/axios";

const adaptClientFromBackend = (backendClient) => {
  return {
    id: backendClient.id,
    name: backendClient.name,
    address: backendClient.address || "",
    city: backendClient.city || "",
    phone: backendClient.phone || "",
    email: backendClient.email || "",
    createdAt: backendClient.createdAt,
    updatedAt: backendClient.updatedAt,
    _count: backendClient._count || { quotes: 0, requests: 0 },
  };
};

export const clientService = {
  getAll: async (searchTerm = "") => {
    const url = searchTerm
      ? `/clients?q=${encodeURIComponent(searchTerm)}`
      : "/clients";
    const response = await api.get(url);

    const data = response.data || response;
    const clients = Array.isArray(data) ? data : [];

    return { data: clients.map(adaptClientFromBackend) };
  },

  getById: async (id) => {
    const response = await api.get(`/clients/${id}`);
    const data = response.data || response;
    return { data: adaptClientFromBackend(data) };
  },

  create: async (data) => {
    const cleanData = {
      name: data.name,
      address: data.address || undefined,
      city: data.city || undefined,
      phone: data.phone || undefined,
      email: data.email || undefined,
    };

    return await api.post("/clients", cleanData);
  },

  update: async (id, data) => {
    const cleanData = {
      name: data.name,
      address: data.address || undefined,
      city: data.city || undefined,
      phone: data.phone || undefined,
      email: data.email || undefined,
    };

    return await api.put(`/clients/${id}`, cleanData);
  },

  delete: async (id) => {
    return await api.delete(`/clients/${id}`);
  },

  search: async (query) => {
    return clientService.getAll(query);
  },
};
