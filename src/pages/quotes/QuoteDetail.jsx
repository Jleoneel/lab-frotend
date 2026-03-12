// pages/quotes/QuoteDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  CheckCircle, 
  Printer, 
  ThumbsUp, 
  Pencil,
  Calendar,
  User,
  DollarSign,
  FileText,
  Package
} from "lucide-react";
import { quoteService } from "../../services/quoteService";
import ConvertToRequestModal from "../../components/quotes/ConvertToRequestModal";
import EditQuoteModal from "../../components/quotes/EditQuoteModal";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { formatDate } from "../../lib/utils";

const statusColors = {
  DRAFT: "bg-gray-100 text-gray-800 border-gray-200",
  SENT: "bg-blue-100 text-blue-800 border-blue-200",
  APPROVED: "bg-green-100 text-green-800 border-green-200",
  CONVERTIDA: "bg-purple-100 text-purple-800 border-purple-200",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
};

const statusLabels = {
  DRAFT: "Borrador",
  SENT: "Enviada",
  APPROVED: "Aprobada",
  CONVERTIDA: "Convertida",
  CANCELLED: "Cancelada",
};

export default function QuoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [converting, setConverting] = useState(false);
  const [approving, setApproving] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadQuote();
  }, [id]);

  const loadQuote = async () => {
    try {
      const response = await quoteService.getById(id);
      setQuote(response.data);
    } catch (error) {
      console.error("Error cargando cotización:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!confirm("¿Estás seguro de aprobar esta cotización?")) return;
    setApproving(true);
    try {
      await quoteService.updateStatus(quote.id, "APPROVED");
      await loadQuote();
    } catch (error) {
      console.error("Error aprobando cotización:", error);
      alert("Error al aprobar la cotización");
    } finally {
      setApproving(false);
    }
  };

  const handleConvert = async (samplesData) => {
    setConverting(true);
    try {
      console.log("Convirtiendo con muestras:", samplesData);
      const response = await quoteService.convert(id, samplesData);
      console.log("Conversión exitosa:", response);

      const requestId = response.data?.requestId || response.data?.request?.id;

      if (requestId) {
        navigate(`/requests/${requestId}`);
      } else {
        alert(
          "Conversión exitosa pero no se pudo obtener el ID de la solicitud",
        );
      }
    } catch (error) {
      console.error("Error convirtiendo:", error);
      alert(
        "Error al convertir: " +
          (error.response?.data?.message || error.message),
      );
    } finally {
      setConverting(false);
      setShowConvertModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando cotización...</p>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Cotización no encontrada</h3>
        <p className="text-gray-500 mt-2">La cotización que buscas no existe o ha sido eliminada.</p>
        <Button onClick={() => navigate("/quotes")} className="mt-4">
          Volver a cotizaciones
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header con navegación */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/quotes")}
          className="flex items-center text-gray-500 hover:text-gray-700 mb-4 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Volver a cotizaciones
        </button>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Cotización {quote.quoteNumber}
              </h1>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Creada el {formatDate(quote.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Botón Aprobar - solo si está en DRAFT */}
            {quote.status === "DRAFT" && (
              <Button
                onClick={handleApprove}
                disabled={approving}
                variant="success"
                className="shadow-sm"
              >
                <ThumbsUp className="w-4 h-4 mr-2" />
                {approving ? "Aprobando..." : "Aprobar Cotización"}
              </Button>
            )}

            {/* Botón Editar - solo si está en DRAFT */}
            {quote.status === "DRAFT" && (
              <Button
                variant="secondary"
                onClick={() => setShowEditModal(true)}
                className="shadow-sm"
              >
                <Pencil className="w-4 h-4 mr-2" />
                Editar
              </Button>
            )}

            {/* Botón Convertir - solo si está APPROVED */}
            {quote.status === "APPROVED" && (
              <Button 
                onClick={() => setShowConvertModal(true)} 
                className="shadow-sm"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Convertir a Solicitud
              </Button>
            )}

            <Button variant="secondary" className="shadow-sm">
              <Printer className="w-4 h-4 mr-2" />
              Imprimir
            </Button>
          </div>
        </div>
      </div>

      {/* Tarjeta de información del cliente */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-800">Información del Cliente</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Cliente</p>
            <p className="font-medium text-gray-800">{quote.client}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Lista de Precios</p>
            <p className="font-medium text-gray-800">
              {quote.priceList === "ESTUDIANTE" ? (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded-lg text-sm">
                  <User className="w-3 h-3" />
                  Estudiante
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm">
                  <DollarSign className="w-3 h-3" />
                  Externo
                </span>
              )}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Estado</p>
            <Badge className={statusColors[quote.status] || "bg-gray-100"}>
              {statusLabels[quote.status] || quote.status}
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Válido hasta</p>
            <p className="font-medium text-gray-800">
              {quote.validUntil
                ? formatDate(quote.validUntil)
                : "No especificado"}
            </p>
          </div>
        </div>
      </div>

      {/* Tarjeta de análisis cotizados */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-800">Análisis Cotizados</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-4 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Análisis</th>
                <th className="text-right py-4 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Cantidad</th>
                <th className="text-right py-4 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Precio Unit.</th>
                <th className="text-right py-4 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {quote.items?.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-800">{item.serviceName}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{item.serviceCode}</div>
                  </td>
                  <td className="text-right py-4 px-4 font-mono text-gray-700">{item.quantity}</td>
                  <td className="text-right py-4 px-4 font-mono text-gray-700">
                    ${item.unitPriceApplied?.toLocaleString("es-CL")}
                  </td>
                  <td className="text-right py-4 px-4 font-mono font-medium text-gray-900">
                    ${item.lineSubtotal?.toLocaleString("es-CL")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totales */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex justify-end">
            <div className="w-full max-w-sm bg-gray-50/80 rounded-xl p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-gray-800 font-mono">
                  ${quote.subtotal?.toLocaleString("es-CL")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">IVA ({quote.ivaPercent || 19}%)</span>
                <span className="font-medium text-gray-800 font-mono">
                  ${quote.ivaAmount?.toLocaleString("es-CL")}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold">
                <span className="text-gray-700">Total</span>
                <span className="text-blue-600 font-mono">
                  ${quote.total?.toLocaleString("es-CL")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
      <EditQuoteModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        quote={quote}
        onSaved={loadQuote}
      />
      
      <ConvertToRequestModal
        isOpen={showConvertModal}
        onClose={() => setShowConvertModal(false)}
        onConfirm={handleConvert}
        loading={converting}
        quoteItems={quote.items ?? []}
      />
    </div>
  );
}