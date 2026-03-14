// pages/samples/SampleDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  QrCode,
  Printer,
  Package,
  Calendar,
  User,
  AlertCircle,
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

const statusColors = {
  EN_COLA: "bg-gray-100 text-gray-800 border-gray-200",
  EN_PROCESO: "bg-blue-100 text-blue-800 border-blue-200",
  LISTO_PARA_INFORME: "bg-yellow-100 text-yellow-800 border-yellow-200",
  TERMINADO: "bg-green-100 text-green-800 border-green-200",
};

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

  useEffect(() => {
    loadSampleData();
  }, [id]);

  const loadSampleData = async () => {
    try {
      const [sampleRes, analysesRes] = await Promise.all([
        sampleService.getById(id),
        sampleService.getAnalyses(id),
      ]);
      setSample(sampleRes.data);
      setAnalyses(analysesRes.data);
    } catch (error) {
      console.error("Error cargando muestra:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (analysisId, newStatus) => {
    try {
      await sampleService.updateAnalysisStatus(analysisId, newStatus);
      loadSampleData();
    } catch (error) {
      console.error("Error actualizando estado:", error);
    }
  };

  const handleRegisterResult = async (analysisId, resultData) => {
    try {
      await sampleService.registerResult(analysisId, resultData);
      setShowResultModal(false);
      setSelectedAnalysis(null);
      loadSampleData();
    } catch (error) {
      console.error("Error registrando resultado:", error);
    }
  };

  const handleEmitReport = async () => {
    if (
      !confirm("¿Emitir informe final? La muestra quedará en estado TERMINADO.")
    ) {
      return;
    }

    try {
      await sampleService.emitReport(id);
      loadSampleData();
    } catch (error) {
      console.error("Error emitiendo informe:", error);
    }
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
          body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
          .qr-container { text-align: center; padding: 20px; border: 2px dashed #ccc; border-radius: 12px; max-width: 300px; }
          .lab-name { font-size: 12px; color: #666; margin-bottom: 4px; }
          .sample-code { font-size: 24px; font-weight: bold; margin: 8px 0; }
          .sample-name { font-size: 14px; color: #333; margin-bottom: 16px; }
          .qr-code { margin: 16px 0; }
          .date { font-size: 10px; color: #999; margin-top: 16px; }
        </style>
      </head>
      <body>
        <div class="qr-container">
          <div class="lab-name">LAB UTM FCZ</div>
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
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando muestra...</p>
        </div>
      </div>
    );
  }

  if (!sample) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-10 h-10 text-gray-300" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">
          Muestra no encontrada
        </h3>
        <p className="text-gray-500 mt-2">
          La muestra que buscas no existe o ha sido eliminada.
        </p>
        <Button onClick={() => navigate("/production")} className="mt-4">
          Volver a producción
        </Button>
      </div>
    );
  }

  const StatusIcon = statusIcons[sample.status] || Package;
  const sampleUrl = `${window.location.origin}/samples/${sample.id}`;
  const allAnalysesDone = analyses.every((a) => a.status === "DONE");
  const canEmitReport =
    sample.status === "LISTO_PARA_INFORME" && allAnalysesDone;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header con navegación */}
      <div>
        <button
          onClick={() => navigate("/production")}
          className="flex items-center text-gray-500 hover:text-gray-700 mb-4 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Volver a producción
        </button>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center">
              <Package className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Muestra {sample.sampleCode}
              </h1>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Recibida el {formatDate(sample.receivedAt)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Badge
              className={`${statusColors[sample.status]} px-4 py-2 text-sm`}
            >
              <StatusIcon className="w-4 h-4 mr-2 inline" />
              {statusLabels[sample.status] || sample.status.replace("_", " ")}
            </Badge>

            <Button
              variant="secondary"
              onClick={() => setShowQR(true)}
              className="shadow-sm"
            >
              <QrCode className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Ver QR</span>
            </Button>

            {canEmitReport && (
              <Button onClick={handleEmitReport} className="shadow-sm">
                <FileText className="w-4 h-4 mr-2" />
                Emitir Informe
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Grid de información */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tarjeta de información de la muestra */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-800">
              Información de la Muestra
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                Descripción
              </p>
              <p className="text-gray-800">
                {sample.description || (
                  <span className="text-gray-400 italic">Sin descripción</span>
                )}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                  Solicitud
                </p>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="font-mono text-sm">
                    {sample.requestNumber || "N/A"}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                  Cliente
                </p>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{sample.clientName || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tarjeta de progreso */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-800">
              Progreso de Análisis
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-blue-600">
                {analyses.length}
              </p>
              <p className="text-sm text-gray-500 mt-1">Total análisis</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-green-600">
                {analyses.filter((a) => a.status === "DONE").length}
              </p>
              <p className="text-sm text-gray-500 mt-1">Completados</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-yellow-600">
                {analyses.filter((a) => a.status === "PENDING").length}
              </p>
              <p className="text-sm text-gray-500 mt-1">Pendientes</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-purple-600">
                {analyses.filter((a) => a.status === "RUNNING").length}
              </p>
              <p className="text-sm text-gray-500 mt-1">En proceso</p>
            </div>
          </div>

          {/* Barra de progreso */}
          {analyses.length > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progreso general</span>
                <span>
                  {Math.round(
                    (analyses.filter((a) => a.status === "DONE").length /
                      analyses.length) *
                      100,
                  )}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(analyses.filter((a) => a.status === "DONE").length / analyses.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Análisis asignados */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <FlaskConical className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-800">
            Análisis Asignados
          </h2>
          <Badge className="bg-blue-50 text-blue-700 border-blue-200 ml-auto">
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

      {/* Modal QR profesional */}
      {showQR && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto overflow-hidden">
            {/* Header del modal */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 rounded-lg p-2">
                  <QrCode className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">
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
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center bg-gray-50/50">
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    LAB UTM FCZ
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1 font-mono">
                    {sample.sampleCode}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
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

                <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(sample.receivedAt)}</span>
                </div>

                {/* Información adicional */}
                <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-gray-500">Solicitud</p>
                    <p className="font-medium text-gray-800 font-mono">
                      {sample.requestNumber || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Cliente</p>
                    <p className="font-medium text-gray-800 truncate">
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
                <Button className="flex-1" onClick={handlePrintQR}>
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
