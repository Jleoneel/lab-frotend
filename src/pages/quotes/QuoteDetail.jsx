// pages/quotes/QuoteDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Printer, ThumbsUp } from "lucide-react"; // Importamos ThumbsUp para el botón aprobar
import { quoteService } from "../../services/quoteService";
import ConvertToRequestModal from "../../components/quotes/ConvertToRequestModal";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { formatDate, formatCurrency } from "../../lib/utils";

const statusColors = {
  DRAFT: "bg-gray-100 text-gray-800",
  SENT: "bg-blue-100 text-blue-800",
  APPROVED: "bg-green-100 text-green-800",
  CONVERTIDA: "bg-purple-100 text-purple-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function QuoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [converting, setConverting] = useState(false);
  const [approving, setApproving] = useState(false);

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
    return <div className="flex justify-center p-8">Cargando...</div>;
  }

  if (!quote) {
    return <div>Cotización no encontrada</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/quotes")}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Volver a cotizaciones
        </button>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Cotización {quote.quoteNumber}
            </h1>
            <p className="text-gray-600 mt-1">
              Creada el {formatDate(quote.createdAt)}
            </p>
          </div>

          <div className="flex gap-2">
            {/* Botón Aprobar - solo si está en DRAFT */}
            {quote.status === "DRAFT" && (
              <Button
                onClick={handleApprove}
                disabled={approving}
                variant="success"
              >
                <ThumbsUp className="w-4 h-4 mr-2" />
                {approving ? "Aprobando..." : "Aprobar Cotización"}
              </Button>
            )}

            {/* Botón Convertir - solo si está APPROVED */}
            {quote.status === "APPROVED" && (
              <Button onClick={() => setShowConvertModal(true)}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Convertir a Solicitud
              </Button>
            )}

            <Button variant="secondary">
              <Printer className="w-4 h-4 mr-2" />
              Imprimir
            </Button>
          </div>
        </div>
      </div>

      {/* Info Cliente (igual) */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Información del Cliente</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Cliente</p>
            <p className="font-medium">{quote.client}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Lista de Precios</p>
            <p className="font-medium">
              {quote.priceList === "ESTUDIANTE" ? "Estudiante" : "Externo"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Estado</p>
            <Badge className={statusColors[quote.status] || "bg-gray-100"}>
              {quote.status}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-gray-500">Válido hasta</p>
            <p className="font-medium">
              {quote.validUntil
                ? formatDate(quote.validUntil)
                : "No especificado"}
            </p>
          </div>
        </div>
      </div>

      {/* Items (igual) */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Análisis Cotizados</h2>

        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4">Análisis</th>
              <th className="text-right py-3 px-4">Cantidad</th>
              <th className="text-right py-3 px-4">Precio Unit.</th>
              <th className="text-right py-3 px-4">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {quote.items?.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="py-3 px-4">
                  <div>{item.serviceName}</div>
                  <div className="text-xs text-gray-500">
                    {item.serviceCode}
                  </div>
                </td>
                <td className="text-right py-3 px-4">{item.quantity}</td>
                <td className="text-right py-3 px-4">
                  ${item.unitPriceApplied?.toLocaleString("es-CL")}
                </td>
                <td className="text-right py-3 px-4 font-medium">
                  ${item.lineSubtotal?.toLocaleString("es-CL")}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t-2">
            <tr>
              <td colSpan="3" className="text-right py-3 px-4 font-medium">
                Subtotal:
              </td>
              <td className="text-right py-3 px-4">
                ${quote.subtotal?.toLocaleString("es-CL")}
              </td>
            </tr>
            <tr>
              <td colSpan="3" className="text-right py-3 px-4 font-medium">
                IVA ({quote.ivaPercent || 19}%):
              </td>
              <td className="text-right py-3 px-4">
                ${quote.ivaAmount?.toLocaleString("es-CL")}
              </td>
            </tr>
            <tr className="text-lg">
              <td colSpan="3" className="text-right py-3 px-4 font-bold">
                Total:
              </td>
              <td className="text-right py-3 px-4 font-bold">
                ${quote.total?.toLocaleString("es-CL")}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Modal de Conversión */}
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
