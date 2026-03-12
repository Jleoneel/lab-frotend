// pages/samples/SampleDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, QrCode, Printer } from "lucide-react";
import { sampleService } from "../../services/sampleService";
import SampleAnalysesTable from "../../components/samples/SampleAnalysesTable";
import ResultFormModal from "../../components/samples/ResultFormModal";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { formatDate } from "../../lib/utils";
import { QRCodeSVG } from "qrcode.react";

const statusColors = {
  EN_COLA: "bg-gray-100 text-gray-800",
  EN_PROCESO: "bg-blue-100 text-blue-800",
  LISTO_PARA_INFORME: "bg-yellow-100 text-yellow-800",
  TERMINADO: "bg-green-100 text-green-800",
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
      loadSampleData(); // Recargar para obtener estados actualizados
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

  if (loading) {
    return <div className="flex justify-center p-8">Cargando...</div>;
  }

  if (!sample) {
    return <div>Muestra no encontrada</div>;
  }

  const sampleUrl = `${window.location.origin}/samples/${sample.id}`;
  const allAnalysesDone = analyses.every((a) => a.status === "DONE");
  const canEmitReport =
    sample.status === "LISTO_PARA_INFORME" && allAnalysesDone;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/production")}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Volver a producción
        </button>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Muestra {sample.sampleCode}
            </h1>
            <p className="text-gray-600 mt-1">{sample.sampleName}</p>
          </div>

          <div className="flex items-center gap-3">
            <Badge className={statusColors[sample.status]}>
              {sample.status.replace("_", " ")}
            </Badge>

            {canEmitReport && (
              <Button onClick={handleEmitReport}>
                <FileText className="w-4 h-4 mr-2" />
                Emitir Informe
              </Button>
            )}
          </div>
        </div>
        <Button variant="secondary" onClick={() => setShowQR(true)}>
          <QrCode className="w-4 h-4 mr-2" />
          Ver QR
        </Button>
      </div>

      {/* Info de la muestra */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">
          Información de la Muestra
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Descripción</p>
            <p className="font-medium">
              {sample.description || "Sin descripción"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Fecha de recepción</p>
            <p className="font-medium">{formatDate(sample.receivedAt)}</p>
          </div>
        </div>
      </div>

      {/* Análisis asignados */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Análisis Asignados</h2>

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
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">
                Etiqueta de Muestra
              </h2>
              <p className="text-sm text-gray-500">Escanear para ver detalle</p>
            </div>

            {/* Contenido imprimible */}
            <div
              id="qr-print-area"
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
            >
              <p className="text-xs font-bold text-gray-500 mb-1">
                LAB UTM FCZ
              </p>
              <p className="text-xl font-bold text-gray-900 mb-1">
                {sample.sampleCode}
              </p>
              <p className="text-sm text-gray-700 mb-4">{sample.sampleName}</p>

              <div className="flex justify-center mb-4">
                <QRCodeSVG
                  value={sampleUrl}
                  size={180}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <p className="text-xs text-gray-400">
                {new Date(sample.receivedAt).toLocaleDateString("es-EC")}
              </p>
            </div>

            {/* Botones */}
            <div className="flex gap-2 mt-6">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setShowQR(false)}
              >
                Cerrar
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  const printArea = document.getElementById("qr-print-area");
                  const originalBody = document.body.innerHTML;
                  document.body.innerHTML = printArea.innerHTML;
                  window.print();
                  document.body.innerHTML = originalBody;
                  window.location.reload();
                }}
              >
                <Printer className="w-4 h-4 mr-2" />
                Imprimir
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
