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

// Mapeo de colores para los estados con paleta UTM
const statusColors = {
  OPEN: "bg-green-100 text-green-700 border-green-200",
  IN_PROGRESS: "bg-blue-100 text-blue-700 border-blue-200",
  COMPLETED: "bg-gray-100 text-gray-700 border-gray-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
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

// Mapeo de colores para estados de muestras con paleta UTM
const sampleStatusColors = {
  EN_COLA: "bg-gray-100 text-gray-700 border-gray-200",
  EN_PROCESO: "bg-blue-100 text-blue-700 border-blue-200",
  LISTO_PARA_INFORME: "bg-yellow-100 text-yellow-700 border-yellow-200",
  TERMINADO: "bg-green-100 text-green-700 border-green-200",
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
          <div className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: '#009933', borderTopColor: '#FFCC33' }}></div>
          <p className="text-sm" style={{ color: '#666666', fontFamily: "'Montserrat', sans-serif" }}>Cargando solicitud...</p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#F5F5F5' }}>
          <AlertCircle className="w-10 h-10" style={{ color: '#CCCCCC' }} />
        </div>
        <h3 className="text-lg font-medium mb-2" style={{ color: '#333333', fontFamily: "'Montserrat', sans-serif" }}>
          Solicitud no encontrada
        </h3>
        <p className="text-sm mt-2" style={{ color: '#666666' }}>
          La solicitud que buscas no existe o ha sido eliminada.
        </p>
        <Button onClick={() => navigate("/requests")} className="mt-4" style={{ backgroundColor: '#009933' }}>
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
          className="flex items-center mb-4 transition-colors group"
          style={{ color: '#666666' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#009933'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#666666'}
        >
          <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Volver a solicitudes
        </button>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E8F5E9' }}>
              <Package className="w-7 h-7" style={{ color: '#009933' }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: '#009933', fontFamily: "'Trajan Pro Bold', serif" }}>
                Solicitud {request.requestNumber}
              </h1>
              <div className="flex items-center gap-2 mt-1 text-sm" style={{ color: '#666666' }}>
                <Calendar className="w-4 h-4" />
                <span>Creada el {formatDate(request.createdAt)}</span>
              </div>
            </div>
          </div>

          <Badge variant={
            request.status === 'OPEN' ? 'utm_green' :
            request.status === 'IN_PROGRESS' ? 'utm_gold' :
            request.status === 'COMPLETED' ? 'utm_gray' :
            'utm_gray'
          } className="px-4 py-2 text-sm">
            <StatusIcon className="w-4 h-4 mr-2 inline" />
            {statusLabels[request.status] || request.status}
          </Badge>
        </div>
      </div>

      {/* Grid de información */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tarjeta de información del cliente */}
        <div className="bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: '#E5E5E5' }}>
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5" style={{ color: '#666666' }} />
            <h2 className="text-lg font-semibold" style={{ color: '#009933', fontFamily: "'Montserrat', sans-serif" }}>
              Información del Cliente
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: '#666666' }}>Cliente</p>
              <p className="font-medium" style={{ color: '#333333' }}>{request.client || "Cliente"}</p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: '#666666' }}>Cotización Origen</p>
              {request.quoteNumber ? (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#E8F5E9', color: '#009933' }}>
                  <FileText className="w-4 h-4" />
                  <span className="font-mono">{request.quoteNumber}</span>
                </div>
              ) : (
                <p className="italic" style={{ color: '#666666' }}>Sin cotización asociada</p>
              )}
            </div>
          </div>
        </div>

        {/* Tarjeta de resumen de muestras */}
        <div className="bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: '#E5E5E5' }}>
          <div className="flex items-center gap-2 mb-4">
            <FlaskConical className="w-5 h-5" style={{ color: '#666666' }} />
            <h2 className="text-lg font-semibold" style={{ color: '#009933', fontFamily: "'Montserrat', sans-serif" }}>
              Resumen de Muestras
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl p-4 text-center" style={{ backgroundColor: '#F9F9F9' }}>
              <p className="text-3xl font-bold" style={{ color: '#009933' }}>{samples.length}</p>
              <p className="text-sm mt-1" style={{ color: '#666666' }}>Total muestras</p>
            </div>

            <div className="rounded-xl p-4 text-center" style={{ backgroundColor: '#F9F9F9' }}>
              <p className="text-3xl font-bold" style={{ color: '#009933' }}>{samples.filter((s) => s.status === "EN_PROCESO").length}</p>
              <p className="text-sm mt-1" style={{ color: '#666666' }}>En proceso</p>
            </div>

            <div className="rounded-xl p-4 text-center" style={{ backgroundColor: '#F9F9F9' }}>
              <p className="text-3xl font-bold" style={{ color: '#009933' }}>{samples.filter((s) => s.status === "TERMINADO").length}</p>
              <p className="text-sm mt-1" style={{ color: '#666666' }}>Terminadas</p>
            </div>

            <div className="rounded-xl p-4 text-center" style={{ backgroundColor: '#FFF9E8' }}>
              <p className="text-3xl font-bold" style={{ color: '#FFCC33' }}>{samples.filter((s) => s.status === "LISTO_PARA_INFORME").length}</p>
              <p className="text-sm mt-1" style={{ color: '#666666' }}>Listas para informe</p>
            </div>
          </div>
        </div>
      </div>

      {/* Muestras Registradas */}
      <div className="bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: '#E5E5E5' }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5" style={{ color: '#666666' }} />
            <h2 className="text-lg font-semibold" style={{ color: '#009933', fontFamily: "'Montserrat', sans-serif" }}>
              Muestras Registradas
            </h2>
          </div>

          <Badge variant="utm_green">
            {samples.length} {samples.length === 1 ? "muestra" : "muestras"}
          </Badge>
        </div>

        {samples.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#F5F5F5' }}>
              <Package className="w-10 h-10" style={{ color: '#CCCCCC' }} />
            </div>
            <p className="text-sm" style={{ color: '#666666' }}>No hay muestras registradas para esta solicitud</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {samples.map((sample) => (
              <div
                key={sample.id}
                onClick={() => navigate(`/samples/${sample.id}`)}
                className="group relative bg-white border rounded-xl p-5 hover:shadow-lg transition-all duration-200 cursor-pointer"
                style={{ borderColor: '#E5E5E5' }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#009933'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#E5E5E5'}
              >
                {/* Decoración de hover */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ background: 'linear-gradient(135deg, #E8F5E9 0%, #FFF9E8 100%)' }} />

                <div className="relative">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <FlaskConical className="w-5 h-5 flex-shrink-0" style={{ color: '#009933' }} />
                        <p className="font-mono font-medium truncate" style={{ color: '#009933' }}>{sample.sampleCode}</p>
                      </div>
                      <p className="text-sm mt-1 truncate" style={{ color: '#666666' }}>{sample.sampleName || "Sin nombre"}</p>
                    </div>
                  </div>

                  {sample.description && (
                    <p className="text-sm mb-3 line-clamp-2 p-2 rounded-lg" style={{ color: '#666666', backgroundColor: '#F9F9F9' }}>
                      {sample.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-4">
                    <Badge variant={
                      sample.status === 'EN_COLA' ? 'utm_gray' :
                      sample.status === 'EN_PROCESO' ? 'utm_gold' :
                      sample.status === 'LISTO_PARA_INFORME' ? 'utm_green' :
                      sample.status === 'TERMINADO' ? 'utm_green' :
                      'utm_gray'
                    }>
                      {sampleStatusLabels[sample.status] || sample.status.replace("_", " ")}
                    </Badge>

                    <div className="flex items-center gap-1 text-xs" style={{ color: '#666666' }}>
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(sample.receivedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Timeline o historial */}
      <div className="bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: '#E5E5E5' }}>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5" style={{ color: '#666666' }} />
          <h2 className="text-lg font-semibold" style={{ color: '#009933', fontFamily: "'Montserrat', sans-serif" }}>
            Historial de la Solicitud
          </h2>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: '#E8F5E9' }}>
              <CheckCircle className="w-3 h-3" style={{ color: '#009933' }} />
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: '#333333' }}>Solicitud creada</p>
              <p className="text-xs" style={{ color: '#666666' }}>{formatDate(request.createdAt)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: '#FFF9E8' }}>
              <Package className="w-3 h-3" style={{ color: '#FFCC33' }} />
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: '#333333' }}>
                {samples.length} muestras registradas
              </p>
              <p className="text-xs" style={{ color: '#666666' }}>Al momento de la conversión</p>
            </div>
          </div>
        </div>
      </div>

      {/* Botón para acciones adicionales */}
      <div className="flex justify-end gap-3">
        <Button 
          variant="secondary" 
          onClick={() => navigate("/production")}
          className="transition-colors"
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#009933'; e.currentTarget.style.color = '#009933'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.color = '#666666'; }}
        >
          <FlaskConical className="w-4 h-4 mr-2" />
          Ir a Producción
        </Button>
      </div>
    </div>
  );
}