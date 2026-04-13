// pages/requests/RequestsList.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Eye, 
  ClipboardList, 
  Search,
  ArrowUpDown,
  Calendar,
  Users,
  FileText,
  Package,
  Clock,
  PlayCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { requestService } from '../../services/requestService';
import { formatDate } from '../../lib/utils';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

// Etiquetas legibles para los estados
const statusLabels = {
  OPEN: 'Abierta',
  IN_PROGRESS: 'En Progreso',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada'
};

// Iconos para cada estado
const statusIcons = {
  OPEN: Clock,
  IN_PROGRESS: PlayCircle,
  COMPLETED: CheckCircle,
  CANCELLED: XCircle
};

export default function RequestsList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const response = await requestService.getAll();
      setRequests(response.data);
    } catch (error) {
      console.error('Error cargando solicitudes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests
    .filter(request => {
      const matchesSearch = 
        request.requestNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.quoteNumber?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'ALL' || request.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (sortField === 'createdAt') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }
      const direction = sortDirection === 'asc' ? 1 : -1;
      return (aVal > bVal ? 1 : -1) * direction;
    });

  const totalRequests = requests.length;
  const totalInProgress = requests.filter(r => r.status === 'IN_PROGRESS').length;
  const totalCompleted = requests.filter(r => r.status === 'COMPLETED').length;
  const totalSamples = requests.reduce((acc, r) => acc + (r.samples?.length || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: '#009933', borderTopColor: '#FFCC33' }}></div>
          <p className="text-sm" style={{ color: '#666666', fontFamily: "'Montserrat', sans-serif" }}>Cargando solicitudes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header con título */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E8F5E9' }}>
            <ClipboardList className="w-5 h-5" style={{ color: '#009933' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#009933', fontFamily: "'Trajan Pro Bold', serif" }}>Solicitudes</h1>
            <p className="text-sm" style={{ color: '#666666', fontFamily: "'Montserrat', sans-serif" }}>Gestiona las solicitudes de análisis</p>
          </div>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-4 shadow-sm" style={{ borderColor: '#E5E5E5' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E8F5E9' }}>
              <ClipboardList className="w-5 h-5" style={{ color: '#009933' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: '#666666' }}>Total</p>
              <p className="text-xl font-bold" style={{ color: '#009933' }}>{totalRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4 shadow-sm" style={{ borderColor: '#E5E5E5' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E8F5E9' }}>
              <PlayCircle className="w-5 h-5" style={{ color: '#009933' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: '#666666' }}>En Progreso</p>
              <p className="text-xl font-bold" style={{ color: '#009933' }}>{totalInProgress}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4 shadow-sm" style={{ borderColor: '#E5E5E5' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E8F5E9' }}>
              <CheckCircle className="w-5 h-5" style={{ color: '#009933' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: '#666666' }}>Completadas</p>
              <p className="text-xl font-bold" style={{ color: '#009933' }}>{totalCompleted}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4 shadow-sm" style={{ borderColor: '#E5E5E5' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FFF9E8' }}>
              <Package className="w-5 h-5" style={{ color: '#FFCC33' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: '#666666' }}>Muestras</p>
              <p className="text-xl font-bold" style={{ color: '#FFCC33' }}>{totalSamples}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-xl border p-4 shadow-sm" style={{ borderColor: '#E5E5E5' }}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#666666' }} />
            <Input
              placeholder="Buscar por número, cliente o cotización..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-offset-0"
              style={{ borderColor: '#E5E5E5', color: '#333333', fontFamily: "'Montserrat', sans-serif" }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#009933'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#E5E5E5'}
            >
              <option value="ALL">Todos los estados</option>
              <option value="OPEN">Abierta</option>
              <option value="IN_PROGRESS">En Progreso</option>
              <option value="COMPLETED">Completada</option>
              <option value="CANCELLED">Cancelada</option>
            </select>

            <Button
              variant="secondary"
              onClick={() => {
                setSortField('createdAt');
                setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
              }}
              className="px-3"
              title="Ordenar por fecha"
            >
              <ArrowUpDown className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {searchTerm && (
          <p className="text-sm mt-3" style={{ color: '#666666' }}>
            {filteredRequests.length} resultado(s) para "{searchTerm}"
          </p>
        )}
      </div>

      {/* Tabla de solicitudes */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center shadow-sm" style={{ borderColor: '#E5E5E5' }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#F5F5F5' }}>
            <ClipboardList className="w-10 h-10" style={{ color: '#CCCCCC' }} />
          </div>
          <h3 className="text-lg font-medium mb-2" style={{ color: '#333333' }}>
            No hay solicitudes
          </h3>
          <p className="text-sm mb-4" style={{ color: '#666666' }}>
            {searchTerm || filterStatus !== 'ALL'
              ? 'No se encontraron resultados para tu búsqueda'
              : 'Las solicitudes aparecerán cuando conviertas una cotización'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden" style={{ borderColor: '#E5E5E5' }}>
          {/* Vista de tabla para desktop */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="border-b" style={{ backgroundColor: '#F9F9F9', borderColor: '#E5E5E5' }}>
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#666666' }}>N° Solicitud</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#666666' }}>Cliente</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#666666' }}>Fecha</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#666666' }}>Cotización</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#666666' }}>Muestras</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#666666' }}>Estado</th>
                  <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider" style={{ color: '#666666' }}>Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: '#E5E5E5' }}>
                {filteredRequests.map((request) => {
                  const StatusIcon = statusIcons[request.status] || ClipboardList;
                  
                  return (
                    <tr key={request.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-sm font-medium" style={{ color: '#009933' }}>{request.requestNumber}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" style={{ color: '#666666' }} />
                          <span className="text-sm" style={{ color: '#666666' }}>{request.client}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" style={{ color: '#666666' }} />
                          <span className="text-sm" style={{ color: '#666666' }}>{formatDate(request.createdAt)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" style={{ color: '#666666' }} />
                          <span className="text-sm font-mono" style={{ color: '#666666' }}>{request.quoteNumber || '—'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Package className="w-4 h-4" style={{ color: '#666666' }} />
                          <span className="text-sm" style={{ color: '#666666' }}>{request.samples?.length || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={
                          request.status === 'OPEN' ? 'utm_green' :
                          request.status === 'IN_PROGRESS' ? 'utm_gold' :
                          request.status === 'COMPLETED' ? 'utm_gray' :
                          'utm_gray'
                        }>
                          <StatusIcon className="w-3 h-3 mr-1 inline" />
                          {statusLabels[request.status] || request.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Link
                          to={`/requests/${request.id}`}
                          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors"
                          style={{ color: '#666666' }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E8F5E9'; e.currentTarget.style.color = '#009933'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#666666'; }}
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Vista de tarjetas para móvil/tablet */}
          <div className="lg:hidden divide-y" style={{ borderColor: '#E5E5E5' }}>
            {filteredRequests.map((request) => {
              const StatusIcon = statusIcons[request.status] || ClipboardList;
              
              return (
                <div key={request.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="font-mono font-medium" style={{ color: '#009933' }}>{request.requestNumber}</span>
                      <div className="flex items-center gap-1 mt-1">
                        <Users className="w-3 h-3" style={{ color: '#666666' }} />
                        <span className="text-sm" style={{ color: '#666666' }}>{request.client}</span>
                      </div>
                    </div>
                    <Badge variant={
                      request.status === 'OPEN' ? 'utm_green' :
                      request.status === 'IN_PROGRESS' ? 'utm_gold' :
                      request.status === 'COMPLETED' ? 'utm_gray' :
                      'utm_gray'
                    }>
                      <StatusIcon className="w-3 h-3 mr-1 inline" />
                      {statusLabels[request.status] || request.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                    <div className="flex items-center gap-1" style={{ color: '#666666' }}>
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(request.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1" style={{ color: '#666666' }}>
                      <FileText className="w-3 h-3" />
                      <span className="font-mono">{request.quoteNumber || '—'}</span>
                    </div>
                    <div className="flex items-center gap-1" style={{ color: '#666666' }}>
                      <Package className="w-3 h-3" />
                      <span>{request.samples?.length || 0} muestras</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end mt-3 pt-2 border-t" style={{ borderColor: '#E5E5E5' }}>
                    <Link
                      to={`/requests/${request.id}`}
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors"
                      style={{ color: '#666666' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E8F5E9'; e.currentTarget.style.color = '#009933'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#666666'; }}
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer con totales */}
          <div className="border-t px-6 py-3 flex justify-between items-center text-sm" style={{ backgroundColor: '#F9F9F9', borderColor: '#E5E5E5' }}>
            <span style={{ color: '#666666' }}>Mostrando {filteredRequests.length} de {requests.length} solicitudes</span>
            <span className="font-medium" style={{ color: '#009933' }}>
              Total muestras: {filteredRequests.reduce((acc, r) => acc + (r.samples?.length || 0), 0)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}