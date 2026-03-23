// components/samples/SampleCard.jsx
import { useNavigate } from "react-router-dom";
import { Calendar, User } from "lucide-react";
import Badge from "../ui/Badge";

export default function SampleCard({ sample }) {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    const colors = {
      EN_COLA: "bg-gray-100 text-gray-700 border-gray-200",
      EN_PROCESO: "bg-blue-100 text-blue-700 border-blue-200",
      LISTO_PARA_INFORME: "bg-yellow-100 text-yellow-700 border-yellow-200",
      TERMINADO: "bg-green-100 text-green-700 border-green-200",
    };
    return colors[status] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getStatusLabel = (status) => {
    const labels = {
      EN_COLA: "En Cola",
      EN_PROCESO: "En Proceso",
      LISTO_PARA_INFORME: "Listo para Informe",
      TERMINADO: "Terminado",
    };
    return labels[status] || status?.replace(/_/g, " ") || "Sin estado";
  };

  const getStatusVariant = (status) => {
    const variants = {
      EN_COLA: "utm_gray",
      EN_PROCESO: "utm_gold",
      LISTO_PARA_INFORME: "utm_green",
      TERMINADO: "utm_green",
    };
    return variants[status] || "utm_gray";
  };

  return (
    <div
      onClick={() => navigate(`/samples/${sample.id}`)}
      className="group bg-white rounded-xl p-4 hover:shadow-lg transition-all duration-200 cursor-pointer border"
      style={{ borderColor: '#E5E5E5' }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = '#009933'}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = '#E5E5E5'}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 min-w-0">
          <p className="font-mono font-medium truncate" style={{ color: '#009933' }}>
            {sample.sampleCode}
          </p>
          <p className="text-sm truncate mt-0.5" style={{ color: '#666666' }}>
            {sample.sampleName || "Sin nombre"}
          </p>
        </div>
        <Badge variant={getStatusVariant(sample.status)} className="ml-2 flex-shrink-0">
          {getStatusLabel(sample.status)}
        </Badge>
      </div>

      {sample.objetivoAnalisis && (
        <p className="text-xs mb-3 line-clamp-2 p-2 rounded-lg" style={{ color: '#666666', backgroundColor: '#F9F9F9' }}>
          {sample.objetivoAnalisis}
        </p>
      )}

      <div className="flex items-center text-xs gap-3 mt-2" style={{ color: '#666666' }}>
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>{new Date(sample.receivedAt).toLocaleDateString()}</span>
        </div>

        {sample.clientName && (
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span className="truncate">{sample.clientName}</span>
          </div>
        )}
      </div>

      {/* Mini indicador de progreso de análisis */}
      {sample.analysesProgress && (
        <div className="mt-3">
          <div className="flex justify-between text-xs mb-1">
            <span style={{ color: '#666666' }}>Progreso</span>
            <span style={{ color: '#009933' }}>
              {sample.analysesProgress.completed}/{sample.analysesProgress.total}
            </span>
          </div>
          <div className="w-full rounded-full h-1.5" style={{ backgroundColor: '#E5E5E5' }}>
            <div
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: `${(sample.analysesProgress.completed / sample.analysesProgress.total) * 100}%`,
                backgroundColor: '#009933'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}