// pages/samples/SampleDetail.jsx
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  QrCode,
  Printer,
  Package,
  Calendar,
  User,
  CheckCircle,
  Clock,
  FlaskConical,
  Download,
  X,
} from "lucide-react";
import { sampleService } from "../../services/sampleService";
import SampleAnalysesTable from "../../components/samples/SampleAnalysesTable";
import ResultFormModal from "../../components/samples/ResultFormModal";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { formatDate } from "../../lib/utils";
import { QRCodeSVG } from "qrcode.react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { settingsService } from "../../services/settingsService";
import SampleReportPDF from "../../components/samples/SampleReportPDF";
import QRCode from "qrcode";
import Swal from "sweetalert2";
import { useAuthStore } from "../../store/authStore";
import { generateSampleDocx } from "../../components/samples/SampleReportDOCX";
import utmLogo from "../../assets/logos/utm.png";
import cabaLogo from "../../assets/logos/logocaba.png";

const statusLabels = {
  EN_COLA: "En Cola",
  EN_PROCESO: "En Proceso",
  LISTO_PARA_INFORME: "Listo para Informe",
  TERMINADO: "Terminado",
};

const statusIcons = {
  EN_COLA: Clock,
  EN_PROCESO: FlaskConical,
  LISTO_PARA_INFORME: FileText,
  TERMINADO: CheckCircle,
};

export default function SampleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sample, setSample] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [labInfo, setLabInfo] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const { user } = useAuthStore();

  const loadSampleData = useCallback(async () => {
    try {
      const [sampleRes, analysesRes] = await Promise.all([
        sampleService.getById(id),
        sampleService.getAnalyses(id),
      ]);
      setSample(sampleRes.data);

      const allAnalyses = analysesRes.data;
      if (user?.role === "ANALYST") {
        setAnalyses(allAnalyses.filter((a) => a.assignedToId === user.id));
      } else {
        setAnalyses(allAnalyses);
      }

      try {
        const labInfoRes = await settingsService.getLabInfo();
        setLabInfo(labInfoRes);
      } catch {
        // No se pudo cargar lab info
      }

      const url = `${window.location.origin}/seguimiento/${sampleRes.data.sampleCode}`;
      const dataUrl = await QRCode.toDataURL(url, { width: 150, margin: 1 });
      setQrDataUrl(dataUrl);
    } catch {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cargar la muestra.",
      });
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    loadSampleData();
    const interval = setInterval(loadSampleData, 30000);
    return () => clearInterval(interval);
  }, [loadSampleData]);

  const handleStatusChange = async (analysisId, newStatus) => {
    try {
      await sampleService.updateAnalysisStatus(analysisId, newStatus);

      await Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        icon: "success",
        text: "El estado del análisis ha sido actualizado correctamente.",
        timer: 1500,
        timerProgressBar: true,
      });

      loadSampleData();
    } catch {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar el estado del análisis.",
      });
    }
  };

  const handleRegisterResult = async (analysisId, resultData) => {
    try {
      await sampleService.registerResult(analysisId, resultData);
      setShowResultModal(false);
      setSelectedAnalysis(null);
      loadSampleData();
    } catch {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo registrar el resultado.",
      });
    }
  };

  const handleEmitReport = async () => {
    const result = await Swal.fire({
      title: "¿Emitir informe final?",
      text: "La muestra quedará en estado TERMINADO y no podrá modificarse.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#009933",
      cancelButtonColor: "#666666",
      confirmButtonText: "Sí, emitir informe",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await sampleService.emitReport(id);

      await Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "¡Informe generado!",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      loadSampleData();
    } catch {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo emitir el informe.",
      });
    }
  };

  const handleDownloadDocx = async () => {
    await generateSampleDocx({
      sample,
      analyses,
      labInfo,
      utmLogoUrl: utmLogo,
      cabaLogoUrl: cabaLogo,
    });
  };

  const handlePrintQR = () => {
    const qrCodeElement = document.getElementById("qr-code-svg");
    const qrCodeHTML = qrCodeElement ? qrCodeElement.innerHTML : "";

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
    <html>
      <head>
        <title>Etiqueta QR - ${sample?.sampleCode}</title>
        <style>
          body { font-family: 'Montserrat', Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
          .qr-container { text-align: center; padding: 20px; border: 2px dashed #E5E5E5; border-radius: 12px; max-width: 300px; }
          .lab-name { font-size: 12px; color: #666666; margin-bottom: 4px; }
          .sample-code { font-size: 24px; font-weight: bold; margin: 8px 0; color: #009933; }
          .sample-name { font-size: 14px; color: #333333; margin-bottom: 16px; }
          .qr-code { margin: 16px 0; }
          .date { font-size: 10px; color: #999999; margin-top: 16px; }
        </style>
      </head>
      <body>
        <div class="qr-container">
          <div class="lab-name">CABA UTM</div>
          <div class="sample-code">${sample?.sampleCode}</div>
          <div class="sample-name">${sample?.sampleName || ""}</div>
          <div class="qr-code">${qrCodeHTML}</div>
          <div class="date">${formatDate(sample?.receivedAt)}</div>
        </div>
      </body>
    </html>
  `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div
            className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: "#009933", borderTopColor: "#FFCC33" }}
          ></div>
          <p
            className="text-sm"
            style={{ color: "#666666", fontFamily: "'Montserrat', sans-serif" }}
          >
            Cargando muestra...
          </p>
        </div>
      </div>
    );
  }

  if (!sample) {
    return (
      <div className="text-center py-12">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: "#F5F5F5" }}
        >
          <Package className="w-10 h-10" style={{ color: "#CCCCCC" }} />
        </div>
        <h3
          className="text-lg font-medium mb-2"
          style={{ color: "#333333", fontFamily: "'Montserrat', sans-serif" }}
        >
          Muestra no encontrada
        </h3>
        <p className="text-sm mt-2" style={{ color: "#666666" }}>
          La muestra que buscas no existe o ha sido eliminada.
        </p>
        <Button
          onClick={() => navigate("/production")}
          className="mt-4"
          style={{ backgroundColor: "#009933" }}
        >
          Volver a producción
        </Button>
      </div>
    );
  }

  const StatusIcon = statusIcons[sample.status] || Package;
  const sampleUrl = `${window.location.origin}/seguimiento/${sample.sampleCode}`;
  const allAnalysesDone = analyses.every((a) => a.status === "DONE");
  const canEmitReport =
    sample.status === "LISTO_PARA_INFORME" && allAnalysesDone;
  const todosConConsumo = analyses
    .filter((a) => a.status === "DONE")
    .every((a) => (a.movimientosReactivos?.length || 0) > 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header con navegación */}
      <div>
        <button
          onClick={() => navigate("/production")}
          className="flex items-center mb-4 transition-colors group"
          style={{ color: "#666666" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#009933")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#666666")}
        >
          <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Volver a producción
        </button>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "#E8F5E9" }}
            >
              <Package className="w-7 h-7" style={{ color: "#009933" }} />
            </div>
            <div>
              <h1
                className="text-2xl font-bold"
                style={{
                  color: "#009933",
                  fontFamily: "'Trajan Pro Bold', serif",
                }}
              >
                Muestra {sample.sampleCode}
              </h1>
              <div
                className="flex items-center gap-2 mt-1 text-sm"
                style={{ color: "#666666" }}
              >
                <Calendar className="w-4 h-4" />
                <span>Recibida el {formatDate(sample.receivedAt)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge
              variant={
                sample.status === "EN_COLA"
                  ? "utm_gray"
                  : sample.status === "EN_PROCESO"
                    ? "utm_gold"
                    : sample.status === "LISTO_PARA_INFORME"
                      ? "utm_green"
                      : sample.status === "TERMINADO"
                        ? "utm_green"
                        : "utm_gray"
              }
              className="px-4 py-2 text-sm"
            >
              <StatusIcon className="w-4 h-4 mr-2 inline" />
              {statusLabels[sample.status] ||
                sample.status?.replace(/_/g, " ") ||
                "Sin estado"}
            </Badge>

            <Button
              variant="secondary"
              onClick={() => setShowQR(true)}
              className="shadow-sm"
            >
              <QrCode className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Ver QR</span>
            </Button>

            {canEmitReport && user.role === "ADMIN" && (
              <div className="flex flex-col items-end gap-1">
                <Button
                  onClick={handleEmitReport}
                  disabled={!todosConConsumo}
                  className="shadow-sm"
                  style={{
                    backgroundColor: todosConConsumo ? "#009933" : "#CCCCCC",
                  }}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Emitir Informe
                </Button>
                {!todosConConsumo && (
                  <p className="text-xs" style={{ color: "#DC2626" }}>
                    ⚠ Registra el consumo de reactivos primero
                  </p>
                )}
              </div>
            )}
            {sample.status === "TERMINADO" && labInfo && (
              <Button
                variant="secondary"
                onClick={handleDownloadDocx}
                className="shadow-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar Word
              </Button>
            )}
            {sample.status === "TERMINADO" && labInfo && qrDataUrl && (
              <PDFDownloadLink
                document={
                  <SampleReportPDF
                    sample={sample}
                    analyses={analyses}
                    labInfo={labInfo}
                    qrDataUrl={qrDataUrl}
                  />
                }
                fileName={`informe-${sample.sampleCode}.pdf`}
              >
                {({ loading: pdfLoading }) => (
                  <Button
                    variant="secondary"
                    disabled={pdfLoading}
                    className="shadow-sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {pdfLoading ? "Generando..." : "Descargar PDF"}
                  </Button>
                )}
              </PDFDownloadLink>
            )}
          </div>
        </div>
      </div>

      {/* Grid de información */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tarjeta de información de la muestra */}
        <div
          className="bg-white rounded-2xl border p-6 shadow-sm"
          style={{ borderColor: "#E5E5E5" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5" style={{ color: "#666666" }} />
            <h2
              className="text-lg font-semibold"
              style={{
                color: "#009933",
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              Información de la Muestra
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <p
                className="text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: "#666666" }}
              >
                Objetivo del Análisis
              </p>
              <p className="text-sm" style={{ color: "#333333" }}>
                {sample.objetivoAnalisis || (
                  <span className="italic" style={{ color: "#999999" }}>
                    Sin objetivo
                  </span>
                )}
              </p>
            </div>

            <div>
              <p
                className="text-xs font-medium uppercase tracking-wider mb-1"
                style={{ color: "#666666" }}
              >
                Cantidad Recibida
              </p>
              <p className="text-sm" style={{ color: "#333333" }}>
                {sample.cantidadRecibida || (
                  <span className="italic" style={{ color: "#999999" }}>
                    No especificada
                  </span>
                )}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p
                  className="text-xs font-medium uppercase tracking-wider mb-1"
                  style={{ color: "#666666" }}
                >
                  Solicitud
                </p>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" style={{ color: "#666666" }} />
                  <span
                    className="font-mono text-sm"
                    style={{ color: "#009933" }}
                  >
                    {sample.requestNumber || "N/A"}
                  </span>
                </div>
              </div>

              <div>
                <p
                  className="text-xs font-medium uppercase tracking-wider mb-1"
                  style={{ color: "#666666" }}
                >
                  Cliente
                </p>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" style={{ color: "#666666" }} />
                  <span className="text-sm" style={{ color: "#333333" }}>
                    {sample.clientName || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tarjeta de progreso */}
        <div
          className="bg-white rounded-2xl border p-6 shadow-sm"
          style={{ borderColor: "#E5E5E5" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5" style={{ color: "#666666" }} />
            <h2
              className="text-lg font-semibold"
              style={{
                color: "#009933",
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              Progreso de Análisis
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div
              className="rounded-xl p-4 text-center"
              style={{ backgroundColor: "#F9F9F9" }}
            >
              <p className="text-3xl font-bold" style={{ color: "#009933" }}>
                {analyses.length}
              </p>
              <p className="text-sm mt-1" style={{ color: "#666666" }}>
                Total análisis
              </p>
            </div>

            <div
              className="rounded-xl p-4 text-center"
              style={{ backgroundColor: "#F9F9F9" }}
            >
              <p className="text-3xl font-bold" style={{ color: "#009933" }}>
                {analyses.filter((a) => a.status === "DONE").length}
              </p>
              <p className="text-sm mt-1" style={{ color: "#666666" }}>
                Completados
              </p>
            </div>

            <div
              className="rounded-xl p-4 text-center"
              style={{ backgroundColor: "#FFF9E8" }}
            >
              <p className="text-3xl font-bold" style={{ color: "#FFCC33" }}>
                {analyses.filter((a) => a.status === "PENDING").length}
              </p>
              <p className="text-sm mt-1" style={{ color: "#666666" }}>
                Pendientes
              </p>
            </div>

            <div
              className="rounded-xl p-4 text-center"
              style={{ backgroundColor: "#FFF9E8" }}
            >
              <p className="text-3xl font-bold" style={{ color: "#FFCC33" }}>
                {analyses.filter((a) => a.status === "RUNNING").length}
              </p>
              <p className="text-sm mt-1" style={{ color: "#666666" }}>
                En proceso
              </p>
            </div>
          </div>

          {/* Barra de progreso */}
          {analyses.length > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span style={{ color: "#666666" }}>Progreso general</span>
                <span style={{ color: "#009933" }}>
                  {Math.round(
                    (analyses.filter((a) => a.status === "DONE").length /
                      analyses.length) *
                      100,
                  )}
                  %
                </span>
              </div>
              <div
                className="w-full rounded-full h-2"
                style={{ backgroundColor: "#E5E5E5" }}
              >
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(analyses.filter((a) => a.status === "DONE").length / analyses.length) * 100}%`,
                    backgroundColor: "#009933",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Análisis asignados */}
      <div
        className="bg-white rounded-2xl border p-6 shadow-sm"
        style={{ borderColor: "#E5E5E5" }}
      >
        <div className="flex items-center gap-2 mb-6">
          <FlaskConical className="w-5 h-5" style={{ color: "#666666" }} />
          <h2
            className="text-lg font-semibold"
            style={{ color: "#009933", fontFamily: "'Montserrat', sans-serif" }}
          >
            Análisis Asignados
          </h2>
          <Badge variant="utm_green" className="ml-auto">
            {analyses.length} {analyses.length === 1 ? "análisis" : "análisis"}
          </Badge>
        </div>

        <SampleAnalysesTable
          analyses={analyses}
          onStatusChange={handleStatusChange}
          onRegisterResult={(analysis) => {
            setSelectedAnalysis(analysis);
            setShowResultModal(true);
          }}
          readOnly={sample.status === "TERMINADO"}
          onReload={loadSampleData}
        />
      </div>

      {/* Modal de resultado */}
      {selectedAnalysis && (
        <ResultFormModal
          isOpen={showResultModal}
          onClose={() => {
            setShowResultModal(false);
            setSelectedAnalysis(null);
          }}
          analysis={selectedAnalysis}
          onSave={handleRegisterResult}
        />
      )}

      {/* Modal QR */}
      {showQR && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto overflow-hidden">
            {/* Header del modal */}
            <div
              className="px-6 py-4 flex justify-between items-center"
              style={{ backgroundColor: "#009933" }}
            >
              <div className="flex items-center gap-3">
                <div className="bg-white/20 rounded-lg p-2">
                  <QrCode className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2
                    className="text-lg font-semibold text-white"
                    style={{ fontFamily: "'Trajan Pro Bold', serif" }}
                  >
                    Etiqueta de Muestra
                  </h2>
                  <p className="text-xs text-white/80">
                    Escanear para ver detalles
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowQR(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6">
              <div
                className="border-2 border-dashed rounded-xl p-6 text-center"
                style={{ borderColor: "#E5E5E5", backgroundColor: "#F9F9F9" }}
              >
                <div className="mb-4">
                  <p
                    className="text-xs font-medium uppercase tracking-wider"
                    style={{ color: "#666666" }}
                  >
                    CABA UTM
                  </p>
                  <p
                    className="text-2xl font-bold mt-1 font-mono"
                    style={{ color: "#009933" }}
                  >
                    {sample.sampleCode}
                  </p>
                  <p className="text-sm mt-1" style={{ color: "#666666" }}>
                    {sample.sampleName || "Muestra sin nombre"}
                  </p>
                </div>

                <div className="flex justify-center mb-4" id="qr-code-svg">
                  <div className="bg-white p-3 rounded-xl shadow-sm">
                    <QRCodeSVG
                      value={sampleUrl}
                      size={200}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                </div>

                <div
                  className="flex items-center justify-center gap-2 text-xs"
                  style={{ color: "#666666" }}
                >
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(sample.receivedAt)}</span>
                </div>

                {/* Información adicional */}
                <div
                  className="mt-4 pt-4 border-t grid grid-cols-2 gap-2 text-xs"
                  style={{ borderColor: "#E5E5E5" }}
                >
                  <div>
                    <p className="text-gray-500">Solicitud</p>
                    <p
                      className="font-medium font-mono"
                      style={{ color: "#009933" }}
                    >
                      {sample.requestNumber || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Cliente</p>
                    <p
                      className="font-medium truncate"
                      style={{ color: "#333333" }}
                    >
                      {sample.clientName || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3 mt-6">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setShowQR(false)}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1"
                  onClick={handlePrintQR}
                  style={{ backgroundColor: "#009933" }}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimir
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
