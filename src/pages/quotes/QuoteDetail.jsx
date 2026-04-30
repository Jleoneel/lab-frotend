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
  Package,
} from "lucide-react";
import Swal from "sweetalert2";
import { quoteService } from "../../services/quoteService";
import ConvertToRequestModal from "../../components/quotes/ConvertToRequestModal";
import EditQuoteModal from "../../components/quotes/EditQuoteModal";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { formatDate } from "../../lib/utils";

const statusColors = {
  DRAFT: "bg-gray-100 text-gray-700 border-gray-200",
  SENT: "bg-blue-100 text-blue-700 border-blue-200",
  APPROVED: "bg-green-100 text-green-700 border-green-200",
  CONVERTIDA: "bg-amber-100 text-amber-700 border-amber-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
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
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cargar la cotización",
        confirmButtonColor: "#009933",
        timer: 3000,
        timerProgressBar: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    const result = await Swal.fire({
      title: "¿Aprobar cotización?",
      text: `¿Estás seguro de aprobar la cotización ${quote.quoteNumber}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#009933",
      cancelButtonColor: "#666666",
      confirmButtonText: "Sí, aprobar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    setApproving(true);
    try {
      await quoteService.updateStatus(quote.id, "APPROVED");
      await loadQuote();

      Swal.fire({
        icon: "success",
        title: "¡Aprobada!",
        text: "La cotización ha sido aprobada correctamente",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo aprobar la cotización",
        confirmButtonColor: "#009933",
      });
    } finally {
      setApproving(false);
    }
  };

  const handleConvert = async (samplesData) => {
    setConverting(true);
    try {
      const response = await quoteService.convert(id, samplesData);

      const requestId = response.data?.requestId || response.data?.request?.id;

      if (requestId) {
        await Swal.fire({
          icon: "success",
          title: "¡Conversión exitosa!",
          text: "La cotización se ha convertido en solicitud correctamente",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
        navigate(`/requests/${requestId}`);
      } else {
        Swal.fire({
          icon: "warning",
          title: "Atención",
          text: "Conversión exitosa pero no se pudo obtener el ID de la solicitud",
          confirmButtonColor: "#009933",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al convertir",
        text: error.response?.data?.message || error.message,
        confirmButtonColor: "#009933",
      });
    } finally {
      setConverting(false);
      setShowConvertModal(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
    <html>
      <head>
        <title>Cotización ${quote.quoteNumber}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Montserrat', Arial, sans-serif; padding: 40px; color: #333333; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; border-bottom: 2px solid #009933; padding-bottom: 20px; }
          .lab-name { font-size: 22px; font-weight: bold; color: #009933; font-family: 'Trajan Pro Bold', serif; }
          .lab-sub { font-size: 12px; color: #666666; margin-top: 4px; }
          .quote-number { text-align: right; }
          .quote-number h2 { font-size: 18px; font-weight: bold; color: #009933; }
          .quote-number p { font-size: 12px; color: #666666; margin-top: 4px; }
          .section { margin-bottom: 24px; }
          .section-title { font-size: 13px; font-weight: bold; color: #666666; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; }
          .info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; background: #F9F9F9; padding: 16px; border-radius: 8px; }
          .info-item label { font-size: 11px; color: #666666; display: block; margin-bottom: 4px; }
          .info-item p { font-size: 14px; font-weight: 500; color: #333333; }
          table { width: 100%; border-collapse: collapse; }
          thead { background: #F5F5F5; }
          th { padding: 10px 12px; text-align: left; font-size: 12px; color: #666666; text-transform: uppercase; font-weight: 600; }
          th:last-child, td:last-child { text-align: right; }
          th:nth-child(2), td:nth-child(2), th:nth-child(3), td:nth-child(3) { text-align: right; }
          td { padding: 12px; font-size: 13px; border-bottom: 1px solid #E5E5E5; color: #333333; }
          .service-code { font-size: 11px; color: #666666; }
          .totals { margin-top: 16px; display: flex; justify-content: flex-end; }
          .totals-box { width: 280px; }
          .totals-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; color: #333333; }
          .totals-row.total { border-top: 2px solid #009933; margin-top: 8px; padding-top: 12px; font-weight: bold; font-size: 16px; color: #009933; }
          .footer { margin-top: 48px; text-align: center; font-size: 11px; color: #666666; border-top: 1px solid #E5E5E5; padding-top: 16px; }
          .status-badge { display: inline-block; padding: 2px 10px; border-radius: 9999px; font-size: 12px; font-weight: 500; background: #E8F5E9; color: #009933; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="lab-name">CABA UTM</div>
            <div class="lab-sub">Centro de Análisis Biológico y Agroalimentario</div>
            <div class="lab-sub">Universidad Técnica de Manabí - Facultad de Ciencias Zootécnicas</div>
          </div>
          <div class="quote-number">
            <h2>${quote.quoteNumber}</h2>
            <p>Creada el ${formatDate(quote.createdAt)}</p>
            <p style="margin-top:8px"><span class="status-badge">${statusLabels[quote.status] || quote.status}</span></p>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Información del Cliente</div>
          <div class="info-grid">
            <div class="info-item">
              <label>Cliente</label>
              <p>${quote.client}</p>
            </div>
            <div class="info-item">
              <label>Lista de Precios</label>
              <p>${quote.priceList === "ESTUDIANTE" ? "Estudiante" : "Externo"}</p>
            </div>
            <div class="info-item">
              <label>Válido hasta</label>
              <p>${quote.validUntil ? formatDate(quote.validUntil) : "No especificado"}</p>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Análisis Cotizados</div>
          <table>
            <thead>
              <tr>
                <th>Análisis</th>
                <th>Cantidad</th>
                <th>Precio Unit.</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${quote.items
                ?.map(
                  (item) => `
                <tr>
                  <td>
                    <div>${item.serviceName}</div>
                    <div class="service-code">${item.serviceCode || ""}</div>
                  </td>
                  <td style="text-align:right">${item.quantity}</td>
                  <td style="text-align:right">$${item.unitPriceApplied?.toLocaleString("es-CL")}</td>
                  <td style="text-align:right">$${item.lineSubtotal?.toLocaleString("es-CL")}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>

          <div class="totals">
            <div class="totals-box">
              <div class="totals-row">
                <span>Subtotal</span>
                <span>$${quote.subtotal?.toLocaleString("es-CL")}</span>
              </div>
              <div class="totals-row">
                <span>IVA (${quote.ivaPercent || 19}%)</span>
                <span>$${quote.ivaAmount?.toLocaleString("es-CL")}</span>
              </div>
              <div class="totals-row total">
                <span>Total</span>
                <span>$${quote.total?.toLocaleString("es-CL")}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="footer">
          <p>Este documento es una cotización oficial del Centro de Análisis Biológico y Agroalimentario (CABA UTM)</p>
          <p style="margin-top:4px">Sistema de Trazabilidad de Análisis de Laboratorio © 2026</p>
        </div>
      </body>
    </html>
  `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    setTimeout(() => printWindow.close(), 500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: '#009933', borderTopColor: '#FFCC33' }}></div>
          <p className="text-sm" style={{ color: '#666666', fontFamily: "'Montserrat', sans-serif" }}>Cargando cotización...</p>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 mx-auto mb-4" style={{ color: '#CCCCCC' }} />
        <h3 className="text-lg font-medium mb-2" style={{ color: '#333333', fontFamily: "'Montserrat', sans-serif" }}>
          Cotización no encontrada
        </h3>
        <p className="text-sm mt-2" style={{ color: '#666666' }}>
          La cotización que buscas no existe o ha sido eliminada.
        </p>
        <Button onClick={() => navigate("/quotes")} className="mt-4" style={{ backgroundColor: '#009933' }}>
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
          className="flex items-center mb-4 transition-colors group"
          style={{ color: '#666666' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#009933'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#666666'}
        >
          <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Volver a cotizaciones
        </button>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E8F5E9' }}>
              <FileText className="w-6 h-6" style={{ color: '#009933' }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: '#009933', fontFamily: "'Trajan Pro Bold', serif" }}>
                Cotización {quote.quoteNumber}
              </h1>
              <div className="flex items-center gap-2 mt-1 text-sm" style={{ color: '#666666' }}>
                <Calendar className="w-4 h-4" />
                <span>Creada el {formatDate(quote.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {quote.status === "DRAFT" && (
              <Button
                onClick={handleApprove}
                disabled={approving}
                variant="success"
                className="shadow-sm"
                style={{ backgroundColor: '#009933' }}
              >
                <ThumbsUp className="w-4 h-4 mr-2" />
                {approving ? "Aprobando..." : "Aprobar Cotización"}
              </Button>
            )}

            {quote.status === "DRAFT" && (
              <Button
                variant="secondary"
                onClick={() => setShowEditModal(true)}
                className="shadow-sm"
                style={{ borderColor: '#E5E5E5', color: '#666666' }}
              >
                <Pencil className="w-4 h-4 mr-2" />
                Editar
              </Button>
            )}

            {quote.status === "APPROVED" && (
              <Button
                onClick={() => setShowConvertModal(true)}
                className="shadow-sm"
                style={{ backgroundColor: '#FFCC33', color: '#333333' }}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Convertir a Solicitud
              </Button>
            )}

            <Button
              variant="secondary"
              onClick={handlePrint}
              className="shadow-sm"
              style={{ borderColor: '#E5E5E5', color: '#666666' }}
            >
              <Printer className="w-4 h-4 mr-2" />
              Imprimir
            </Button>
          </div>
        </div>
      </div>

      {/* Tarjeta de información del cliente */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6" style={{ borderColor: '#E5E5E5' }}>
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5" style={{ color: '#666666' }} />
          <h2 className="text-lg font-semibold" style={{ color: '#009933', fontFamily: "'Montserrat', sans-serif" }}>
            Información del Cliente
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#666666' }}>Cliente</p>
            <p className="font-medium" style={{ color: '#333333' }}>{quote.client}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#666666' }}>Lista de Precios</p>
            <p className="font-medium" style={{ color: '#333333' }}>
              {quote.priceList === "ESTUDIANTE" ? (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-sm" style={{ backgroundColor: '#E8F5E9', color: '#009933' }}>
                  <User className="w-3 h-3" />
                  Estudiante
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-sm" style={{ backgroundColor: '#FFF9E8', color: '#FFCC33' }}>
                  <DollarSign className="w-3 h-3" />
                  Externo
                </span>
              )}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#666666' }}>Estado</p>
            <Badge className={statusColors[quote.status] || "bg-gray-100"}>
              {statusLabels[quote.status] || quote.status}
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#666666' }}>Válido hasta</p>
            <p className="font-medium" style={{ color: '#333333' }}>
              {quote.validUntil ? formatDate(quote.validUntil) : "No especificado"}
            </p>
          </div>
        </div>
      </div>

      {/* Tarjeta de análisis cotizados */}
      <div className="bg-white rounded-2xl shadow-sm border p-6" style={{ borderColor: '#E5E5E5' }}>
        <div className="flex items-center gap-2 mb-6">
          <FileText className="w-5 h-5" style={{ color: '#666666' }} />
          <h2 className="text-lg font-semibold" style={{ color: '#009933', fontFamily: "'Montserrat', sans-serif" }}>
            Análisis Cotizados
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: '#E5E5E5' }}>
                <th className="text-left py-4 px-4 text-xs font-medium uppercase tracking-wider" style={{ color: '#666666' }}>Análisis</th>
                <th className="text-right py-4 px-4 text-xs font-medium uppercase tracking-wider" style={{ color: '#666666' }}>Cantidad</th>
                <th className="text-right py-4 px-4 text-xs font-medium uppercase tracking-wider" style={{ color: '#666666' }}>Precio Unit.</th>
                <th className="text-right py-4 px-4 text-xs font-medium uppercase tracking-wider" style={{ color: '#666666' }}>Subtotal</th>
               </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: '#E5E5E5' }}>
              {quote.items?.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="font-medium" style={{ color: '#333333' }}>{item.serviceName}</div>
                    <div className="text-xs mt-0.5" style={{ color: '#666666' }}>{item.serviceCode}</div>
                  </td>
                  <td className="text-right py-4 px-4 font-mono" style={{ color: '#666666' }}>{item.quantity}</td>
                  <td className="text-right py-4 px-4 font-mono" style={{ color: '#666666' }}>${item.unitPriceApplied?.toLocaleString("es-CL")}</td>
                  <td className="text-right py-4 px-4 font-mono font-medium" style={{ color: '#009933' }}>${item.lineSubtotal?.toLocaleString("es-CL")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totales */}
        <div className="mt-6 pt-6 border-t" style={{ borderColor: '#E5E5E5' }}>
          <div className="flex justify-end">
            <div className="w-full max-w-sm rounded-xl p-5 space-y-3" style={{ backgroundColor: '#F9F9F9' }}>
              <div className="flex justify-between text-sm">
                <span style={{ color: '#666666' }}>Subtotal</span>
                <span className="font-medium font-mono" style={{ color: '#333333' }}>${quote.subtotal?.toLocaleString("es-CL")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: '#666666' }}>IVA ({quote.ivaPercent || 19}%)</span>
                <span className="font-medium font-mono" style={{ color: '#333333' }}>${quote.ivaAmount?.toLocaleString("es-CL")}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold" style={{ borderColor: '#E5E5E5' }}>
                <span style={{ color: '#666666' }}>Total</span>
                <span className="font-mono" style={{ color: '#009933' }}>${quote.total?.toLocaleString("es-CL")}</span>
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