// pages/requests/RequestDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  FlaskConical,
  Calendar,
  Users,
  FileText,
  Clock,
  PlayCircle,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { requestService } from "../../services/requestService";
import { formatDate } from "../../lib/utils";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

const statusColors = {
  OPEN: "bg-green-100 text-green-800 border-green-200",
  IN_PROGRESS: "bg-blue-100 text-blue-800 border-blue-200",
  COMPLETED: "bg-gray-100 text-gray-800 border-gray-200",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
};

const statusLabels = {
  OPEN: "Abierta",
  IN_PROGRESS: "En Progreso",
  COMPLETED: "Completada",
  CANCELLED: "Cancelada",
};

const statusIcons = {
  OPEN: Clock,
  IN_PROGRESS: PlayCircle,
  COMPLETED: CheckCircle,
  CANCELLED: XCircle,
};

// Mapeo de colores para estados de muestras
const sampleStatusColors = {
  EN_COLA: "bg-gray-100 text-gray-800 border-gray-200",
  EN_PROCESO: "bg-blue-100 text-blue-800 border-blue-200",
  LISTO_PARA_INFORME: "bg-yellow-100 text-yellow-800 border-yellow-200",
  TERMINADO: "bg-green-100 text-green-800 border-green-200",
};

const sampleStatusLabels = {
  EN_COLA: "En Cola",
  EN_PROCESO: "En Proceso",
  LISTO_PARA_INFORME: "Listo para Informe",
  TERMINADO: "Terminado",
};

export default function RequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequestData();
  }, [id]);

  const loadRequestData = async () => {
    try {
      const [requestRes, samplesRes] = await Promise.all([
        requestService.getById(id),
        requestService.getSamples(id),
      ]);
      setRequest(requestRes.data);
      setSamples(samplesRes.data);
    } catch (error) {
      console.error("Error cargando solicitud:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando solicitud...</p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-10 h-10 text-gray-300" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">
          Solicitud no encontrada
        </h3>
        <p className="text-gray-500 mt-2">
          La solicitud que buscas no existe o ha sido eliminada.
        </p>
        <Button onClick={() => navigate("/requests")} className="mt-4">
          Volver a solicitudes
        </Button>
      </div>
    );
  }

  const StatusIcon = statusIcons[request.status] || Package;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header con navegación */}
      <div>
        <button
          onClick={() => navigate("/requests")}
          className="flex items-center text-gray-500 hover:text-gray-700 mb-4 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Volver a solicitudes
        </button>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center">
              <Package className="w-7 h-7 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Solicitud {request.requestNumber}
              </h1>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Creada el {formatDate(request.createdAt)}</span>
              </div>
            </div>
          </div>

          <Badge
            className={`${statusColors[request.status]} px-4 py-2 text-sm`}
          >
            <StatusIcon className="w-4 h-4 mr-2 inline" />
            {statusLabels[request.status] || request.status}
          </Badge>
        </div>
      </div>

      {/* Grid de información */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tarjeta de información del cliente */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-800">
              Información del Cliente
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                Cliente
              </p>
              <p className="font-medium text-gray-800">
                {request.client || "Cliente"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                Cotización Origen
              </p>
              {request.quoteNumber ? (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg">
                  <FileText className="w-4 h-4" />
                  <span className="font-mono">{request.quoteNumber}</span>
                </div>
              ) : (
                <p className="text-gray-500 italic">Sin cotización asociada</p>
              )}
            </div>
          </div>
        </div>

        {/* Tarjeta de resumen de muestras */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <FlaskConical className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-800">
              Resumen de Muestras
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-purple-600">
                {samples.length}
              </p>
              <p className="text-sm text-gray-500 mt-1">Total muestras</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-blue-600">
                {samples.filter((s) => s.status === "EN_PROCESO").length}
              </p>
              <p className="text-sm text-gray-500 mt-1">En proceso</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-green-600">
                {samples.filter((s) => s.status === "TERMINADO").length}
              </p>
              <p className="text-sm text-gray-500 mt-1">Terminadas</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-yellow-600">
                {
                  samples.filter((s) => s.status === "LISTO_PARA_INFORME")
                    .length
                }
              </p>
              <p className="text-sm text-gray-500 mt-1">Listas para informe</p>
            </div>
          </div>
        </div>
      </div>

      {/* Muestras Registradas */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-800">
              Muestras Registradas
            </h2>
          </div>

          <Badge className="bg-purple-50 text-purple-700 border-purple-200">
            {samples.length} {samples.length === 1 ? "muestra" : "muestras"}
          </Badge>
        </div>

        {samples.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-gray-500">
              No hay muestras registradas para esta solicitud
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {samples.map((sample) => (
              <div
                key={sample.id}
                onClick={() => navigate(`/samples/${sample.id}`)}
                className="group relative bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-purple-200"
              >
                {/* Decoración de hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div className="relative">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <FlaskConical className="w-5 h-5 text-purple-500 flex-shrink-0" />
                        <p className="font-mono font-medium text-gray-900 truncate">
                          {sample.sampleCode}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 truncate">
                        {sample.sampleName || "Sin nombre"}
                      </p>
                    </div>
                  </div>

                  {sample.description && (
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2 bg-gray-50 p-2 rounded-lg">
                      {sample.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-4">
                    <Badge
                      className={
                        sampleStatusColors[sample.status] || "bg-gray-100"
                      }
                    >
                      {sampleStatusLabels[sample.status] ||
                        sample.status.replace("_", " ")}
                    </Badge>

                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(sample.receivedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Timeline o acciones adicionales (opcional) */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-800">
            Historial de la Solicitud
          </h2>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <CheckCircle className="w-3 h-3 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-800">
                <span className="font-medium">Solicitud creada</span>
              </p>
              <p className="text-xs text-gray-400">
                {formatDate(request.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Package className="w-3 h-3 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-800">
                <span className="font-medium">
                  {samples.length} muestras registradas
                </span>
              </p>
              <p className="text-xs text-gray-400">
                Al momento de la conversión
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Botón para acciones adicionales (opcional) */}
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={() => navigate("/production")}>
          <FlaskConical className="w-4 h-4 mr-2" />
          Ir a Producción
        </Button>
      </div>
    </div>
  );
}
