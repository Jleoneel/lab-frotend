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

      const [clientsRes, servicesRes] = await Promise.all([
        clientService.getAll(),
        serviceService.getActive(),
      ]);

      const clientsData = clientsRes.data || [];
      const servicesData = servicesRes.data || [];

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
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Error al crear la cotización";
      setError(message);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: '#009933', borderTopColor: '#FFCC33' }}></div>
          <p className="text-sm" style={{ color: '#666666', fontFamily: "'Montserrat', sans-serif" }}>
            Cargando datos para nueva cotización...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">

      {/* Mensaje de error */}
      {error && (
        <div className="mb-6 p-4 border rounded-xl flex items-start gap-3 animate-shake" style={{ backgroundColor: '#FEF2F2', borderColor: '#FEE2E2' }}>
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#DC2626' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <p className="font-medium" style={{ color: '#991B1B' }}>Error al crear la cotización</p>
            <p className="text-sm mt-1" style={{ color: '#DC2626' }}>{error}</p>
            <button
              onClick={loadInitialData}
              className="mt-3 text-sm px-3 py-1 rounded-lg transition-colors"
              style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FECACA'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FEE2E2'; }}
            >
              Reintentar
            </button>
          </div>
        </div>
      )}

      {/* Formulario */}
      {!error && (
        <QuoteForm
          clients={clients}
          services={services}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/quotes")}
        />
      )}

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}