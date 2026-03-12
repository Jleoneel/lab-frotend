// pages/quotes/NewQuote.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { quoteService } from "../../services/quoteService";
import { clientService } from "../../services/clientService";
import { serviceService } from "../../services/serviceService";
import QuoteForm from "../quotes/QuoteForm";

export default function NewQuote() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("Cargando datos para nueva cotización...");

      // Cargar clientes y servicios
      const [clientsRes, servicesRes] = await Promise.all([
        clientService.getAll(),
        serviceService.getActive(), // Este ahora funciona filtrando en frontend
      ]);

      console.log("Clientes response:", clientsRes);
      console.log("Servicios response:", servicesRes);

      // Extraer datos
      const clientsData = clientsRes.data || [];
      const servicesData = servicesRes.data || [];

      console.log("Clientes procesados:", clientsData);
      console.log("Servicios procesados:", servicesData);

      setClients(clientsData);
      setServices(servicesData);

      if (clientsData.length === 0) {
        console.warn("No hay clientes disponibles");
      }

      if (servicesData.length === 0) {
        console.warn("No hay servicios activos disponibles");
      }
    } catch (error) {
      console.error("Error detallado:", error);
      setError(error.message || "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setError("");
      const response = await quoteService.create(formData);
      const newQuoteId = response.data?.id || response.id;
      if (newQuoteId) {
        navigate(`/quotes/${newQuoteId}`);
      } else {
        throw new Error("No se recibió el ID de la cotización");
      }
    } catch (error) {
      // Captura el mensaje del backend
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Error al crear la cotización";
      setError(message);
      // Scroll arriba para que vean el error
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Cargando datos...</p>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          <p className="font-medium mb-2">Error:</p>
          <p>{error}</p>
          <button
            onClick={loadInitialData}
            className="mt-3 text-sm bg-red-100 hover:bg-red-200 px-3 py-1 rounded"
          >
            Reintentar
          </button>
        </div>
      )}

      {!error && (
        <QuoteForm
          clients={clients}
          services={services}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/quotes")}
        />
      )}
    </div>
  );
}
