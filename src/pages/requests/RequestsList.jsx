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

// Mapeo de colores para los estados
const statusColors = {
  OPEN: 'bg-green-100 text-green-800 border-green-200',
  IN_PROGRESS: 'bg-blue-100 text-blue-800 border-blue-200',
  COMPLETED: 'bg-gray-100 text-gray-800 border-gray-200',
  CANCELLED: 'bg-red-100 text-red-800 border-red-200'
};

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

  // Filtrar y ordenar solicitudes
  const filteredRequests = requests
    .filter(request => {
      // Filtro por búsqueda
      const matchesSearch = 
        request.requestNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.quoteNumber?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtro por estado
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

  // Estadísticas
  const totalRequests = requests.length;
  const totalInProgress = requests.filter(r => r.status === 'IN_PROGRESS').length;
  const totalCompleted = requests.filter(r => r.status === 'COMPLETED').length;
  const totalSamples = requests.reduce((acc, r) => acc + (r.samples?.length || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando solicitudes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header con título */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Solicitudes</h1>
            <p className="text-sm text-gray-500">Gestiona las solicitudes de análisis</p>
          </div>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-xl font-bold text-gray-800">{totalRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <PlayCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">En Progreso</p>
              <p className="text-xl font-bold text-gray-800">{totalInProgress}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completadas</p>
              <p className="text-xl font-bold text-gray-800">{totalCompleted}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Muestras</p>
              <p className="text-xl font-bold text-gray-800">{totalSamples}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
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
              className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        {/* Resultados de búsqueda */}
        {searchTerm && (
          <p className="text-sm text-gray-500 mt-3">
            {filteredRequests.length} resultado(s) para "{searchTerm}"
          </p>
        )}
      </div>

      {/* Tabla de solicitudes */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay solicitudes
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || filterStatus !== 'ALL'
              ? 'No se encontraron resultados para tu búsqueda'
              : 'Las solicitudes aparecerán cuando conviertas una cotización'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Vista de tabla para desktop */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    N° Solicitud
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cotización
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Muestras
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRequests.map((request) => {
                  const StatusIcon = statusIcons[request.status] || ClipboardList;
                  
                  return (
                    <tr key={request.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-sm font-medium text-gray-900">
                          {request.requestNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{request.client}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">{formatDate(request.createdAt)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500 font-mono">
                            {request.quoteNumber || '—'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Package className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {request.samples?.length || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={statusColors[request.status]}>
                          <StatusIcon className="w-3 h-3 mr-1 inline" />
                          {statusLabels[request.status] || request.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Link
                          to={`/requests/${request.id}`}
                          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="hidden sm:inline"></span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Vista de tarjetas para móvil/tablet */}
          <div className="lg:hidden divide-y divide-gray-100">
            {filteredRequests.map((request) => {
              const StatusIcon = statusIcons[request.status] || ClipboardList;
              
              return (
                <div key={request.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="font-mono font-medium text-gray-900">
                        {request.requestNumber}
                      </span>
                      <div className="flex items-center gap-1 mt-1">
                        <Users className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-600">{request.client}</span>
                      </div>
                    </div>
                    <Badge className={statusColors[request.status]}>
                      <StatusIcon className="w-3 h-3 mr-1 inline" />
                      {statusLabels[request.status] || request.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                    <div className="flex items-center gap-1 text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(request.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <FileText className="w-3 h-3" />
                      <span className="font-mono">{request.quoteNumber || '—'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Package className="w-3 h-3" />
                      <span>{request.samples?.length || 0} muestras</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end mt-3 pt-2 border-t border-gray-100">
                    <Link
                      to={`/requests/${request.id}`}
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer con totales */}
          <div className="bg-gray-50/50 border-t border-gray-100 px-6 py-3 flex justify-between items-center text-sm">
            <span className="text-gray-500">
              Mostrando {filteredRequests.length} de {requests.length} solicitudes
            </span>
            <span className="text-gray-700 font-medium">
              Total muestras: {filteredRequests.reduce((acc, r) => acc + (r.samples?.length || 0), 0)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}