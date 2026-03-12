// services/sampleService.js
import api from "../lib/axios";

const adaptSampleFromBackend = (backendSample) => {
  return {
    id: backendSample.id,
    sampleCode: backendSample.sampleCode,
    sampleName: backendSample.sampleName,
    description: backendSample.description,
    status: backendSample.status,
    receivedAt: backendSample.receivedAt,
    requestId: backendSample.requestId,

    clientName:
      typeof backendSample.clientName === "string"
        ? backendSample.clientName
        : typeof backendSample.request?.client === "string"
        ? backendSample.request.client
        : backendSample.request?.client?.name || "N/A",

    requestNumber:
      backendSample.requestNumber ||
      backendSample.request?.requestNumber ||
      "N/A",

    quoteNumber:
      backendSample.quoteNumber ||
      backendSample.request?.quote?.quoteNumber ||
      "N/A",
  };
};

const adaptSampleAnalysisFromBackend = (backendAnalysis) => {
  return {
    id: backendAnalysis.id,
    serviceId: backendAnalysis.serviceId,
    serviceName:
      backendAnalysis.serviceName ||
      backendAnalysis.service?.name ||
      "Servicio",
    serviceCode:
      backendAnalysis.serviceCode ||
      backendAnalysis.service?.code ||
      "N/A",
    status: backendAnalysis.status,
    result: backendAnalysis.result || null,
    startedAt: backendAnalysis.startedAt || null,
    completedAt: backendAnalysis.completedAt || null,
  };
};

export const sampleService = {
  getKanban: async () => {
  try {
    const response = await api.get("/samples/kanban");
    const data = response.data || response;

    const adapted = Object.fromEntries(
      Object.entries(data).map(([status, samples]) => [
        status,
        Array.isArray(samples) ? samples.map(adaptSampleFromBackend) : []
      ])
    );

    return { data: adapted };
  } catch (error) {
    console.error("Error en sampleService.getKanban:", error);
    throw error;
  }
},
  getById: async (id) => {
    try {
      const response = await api.get(`/samples/${id}`);
      const data = response.data || response;
      return { data: adaptSampleFromBackend(data) };
    } catch (error) {
      console.error("Error en sampleService.getById:", error);
      throw error;
    }
  },

  getAnalyses: async (sampleId) => {
    try {
      const response = await api.get(`/samples/${sampleId}/services`);
      const data = response.data || response;
      const analyses = Array.isArray(data) ? data : [];
      return { data: analyses.map(adaptSampleAnalysisFromBackend) };
    } catch (error) {
      console.error("Error en sampleService.getAnalyses:", error);
      throw error;
    }
  },

  updateAnalysisStatus: async (sampleServiceId, status) => {
    try {
      return await api.patch(
        `/samples/sample-services/${sampleServiceId}/status`,
        { status }
      );
    } catch (error) {
      console.error("Error en sampleService.updateAnalysisStatus:", error);
      throw error;
    }
  },

  registerResult: async (sampleServiceId, resultData) => {
    try {
      return await api.post(
        `/samples/sample-services/${sampleServiceId}/result`,
        resultData
      );
    } catch (error) {
      console.error("Error en sampleService.registerResult:", error);
      throw error;
    }
  },

  updateSampleStatus: async (sampleId, status) => {
    try {
      return await api.patch(`/samples/${sampleId}/status`, { status });
    } catch (error) {
      console.error("Error en sampleService.updateSampleStatus:", error);
      throw error;
    }
  },

  emitReport: async (sampleId) => {
    try {
      return await api.post(`/samples/${sampleId}/emit-report`);
    } catch (error) {
      console.error("Error en sampleService.emitReport:", error);
      throw error;
    }
  },
};