// components/samples/SampleCard.jsx
import { useNavigate } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';
import Badge from '../ui/Badge';

export default function SampleCard({ sample }) {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    const colors = {
      'EN_COLA': 'bg-gray-100 text-gray-800',
      'EN_PROCESO': 'bg-blue-100 text-blue-800',
      'LISTO_PARA_INFORME': 'bg-yellow-100 text-yellow-800',
      'TERMINADO': 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div
      onClick={() => navigate(`/samples/${sample.id}`)}
      className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-medium text-gray-900">{sample.sampleCode}</p>
          <p className="text-sm text-gray-600">{sample.sampleName}</p>
        </div>
        <Badge className={getStatusColor(sample.status)}>
          {sample.status.replace('_', ' ')}
        </Badge>
      </div>

      {sample.description && (
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">
          {sample.description}
        </p>
      )}

      <div className="flex items-center text-xs text-gray-400 mt-2">
        <Calendar className="w-3 h-3 mr-1" />
        {new Date(sample.receivedAt).toLocaleDateString()}
        
        {sample.clientName && (
          <>
            <User className="w-3 h-3 ml-3 mr-1" />
            {sample.clientName}
          </>
        )}
      </div>

      {/* Mini indicador de progreso de análisis */}
      {sample.analysesProgress && (
        <div className="mt-2">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progreso</span>
            <span>{sample.analysesProgress.completed}/{sample.analysesProgress.total}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-blue-600 h-1.5 rounded-full"
              style={{
                width: `${(sample.analysesProgress.completed / sample.analysesProgress.total) * 100}%`
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}