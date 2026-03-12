// pages/requests/RequestDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, FlaskConical } from 'lucide-react';
import { requestService } from '../../services/requestService';
import { formatDate } from '../../lib/utils';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const statusColors = {
  OPEN: 'bg-green-100 text-green-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-gray-100 text-gray-800',
  CANCELLED: 'bg-red-100 text-red-800'
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
        requestService.getSamples(id)
      ]);
      setRequest(requestRes.data);
      setSamples(samplesRes.data);
    } catch (error) {
      console.error('Error cargando solicitud:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Cargando...</div>;
  }

  if (!request) {
    return <div>Solicitud no encontrada</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/requests')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Volver a solicitudes
        </button>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Solicitud {request.requestNumber}
            </h1>
            <p className="text-gray-600 mt-1">
              Creada el {formatDate(request.createdAt)}
            </p>
          </div>

          <Badge className={statusColors[request.status]}>
            {request.status.replace('_', ' ')}
          </Badge>
        </div>
      </div>

      {/* Info Cliente */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Información del Cliente</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Cliente</p>
            <p className="font-medium">{request.client}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Cotización origen</p>
            <p className="font-medium">{request.quoteNumber || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Muestras */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Muestras Registradas</h2>
        
        {samples.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No hay muestras registradas para esta solicitud</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {samples.map((sample) => (
              <div
                key={sample.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/samples/${sample.id}`)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-900">{sample.sampleCode}</p>
                    <p className="text-sm text-gray-600">{sample.sampleName}</p>
                  </div>
                  <FlaskConical className="w-5 h-5 text-blue-500" />
                </div>
                
                {sample.description && (
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {sample.description}
                  </p>
                )}
                
                <div className="mt-3 flex justify-between items-center">
                  <Badge className={
                    sample.status === 'EN_COLA' ? 'bg-gray-100 text-gray-800' :
                    sample.status === 'EN_PROCESO' ? 'bg-blue-100 text-blue-800' :
                    sample.status === 'LISTO_PARA_INFORME' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }>
                    {sample.status.replace('_', ' ')}
                  </Badge>
                  
                  <span className="text-xs text-gray-400">
                    {new Date(sample.receivedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Resumen */}
        <div className="mt-6 pt-4 border-t">
          <p className="text-sm text-gray-600">
            Total de muestras: <span className="font-bold">{samples.length}</span>
          </p>
        </div>
      </div>
    </div>
  );
}