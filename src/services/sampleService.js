// services/sampleService.js
import api from "../lib/axios";

export const sampleService = {
  // Obtener muestras para Kanban (agrupadas por estado)
  getKanban: () => api.get("/samples/kanban"),

  // Obtener detalle de muestra
  getById: (id) => api.get(`/samples/${id}`),

  // Obtener análisis de una muestra
  getAnalyses: (sampleId) => api.get(`/samples/${sampleId}/services`),

  // Cambiar estado de un análisis
  updateAnalysisStatus: (sampleServiceId, status) =>
    api.patch(`/samples/sample-services/${sampleServiceId}/status`, { status }),
  
  // Registrar resultado de un análisis
  registerResult: (sampleServiceId, resultData) =>
    api.post(`/samples/sample-services/${sampleServiceId}/result`, resultData),

  // Cambiar estado de muestra
  updateSampleStatus: (sampleId, status) =>
    api.patch(`/samples/${sampleId}/status`, { status }),

  // Emitir informe
  emitReport: (sampleId) => api.post(`/samples/${sampleId}/emit-report`),
};
