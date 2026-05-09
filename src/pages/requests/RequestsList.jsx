import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Eye, ClipboardList, Search, ArrowUpDown, Calendar,
  Users, FileText, Package, Clock, PlayCircle, CheckCircle, XCircle,
} from 'lucide-react';
import { requestService } from '../../services/requestService';
import { formatDate } from '../../lib/utils';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import EmptyState from '../../components/common/EmptyState';
import IconButton from '../../components/common/IconButton';

const statusLabels = {
  OPEN:        'Abierta',
  IN_PROGRESS: 'En Progreso',
  COMPLETED:   'Completada',
  CANCELLED:   'Cancelada',
};

const statusIcons = {
  OPEN:        Clock,
  IN_PROGRESS: PlayCircle,
  COMPLETED:   CheckCircle,
  CANCELLED:   XCircle,
};

const statusVariant = {
  OPEN:        'utm_green',
  IN_PROGRESS: 'utm_gold',
  COMPLETED:   'utm_gray',
  CANCELLED:   'utm_gray',
};

export default function RequestsList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [sortDirection, setSortDirection] = useState('desc');

  useEffect(() => { loadRequests(); }, []);

  const loadRequests = async () => {
    try {
      const response = await requestService.getAll();
      setRequests(response.data);
    } catch {
      // silently handled
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests
    .filter((r) => {
      const matchesSearch =
        r.requestNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.quoteNumber?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch && (filterStatus === 'ALL' || r.status === filterStatus);
    })
    .sort((a, b) => {
      const aVal = new Date(a.createdAt).getTime();
      const bVal = new Date(b.createdAt).getTime();
      return (aVal > bVal ? 1 : -1) * (sortDirection === 'asc' ? 1 : -1);
    });

  if (loading) return <LoadingSpinner message="Cargando solicitudes..." />;

  const totalSamples = requests.reduce((acc, r) => acc + (r.samples?.length || 0), 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader icon={ClipboardList} title="Solicitudes" subtitle="Gestiona las solicitudes de análisis" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ClipboardList} label="Total"       value={requests.length}                                        variant="green" />
        <StatCard icon={PlayCircle}    label="En Progreso" value={requests.filter(r => r.status === 'IN_PROGRESS').length} variant="green" />
        <StatCard icon={CheckCircle}   label="Completadas" value={requests.filter(r => r.status === 'COMPLETED').length}   variant="green" />
        <StatCard icon={Package}       label="Muestras"    value={totalSamples}                                            variant="gold"  />
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border p-4 shadow-sm" style={{ borderColor: '#E5E5E5' }}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#666666' }} />
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
              className="px-3 py-2 border rounded-lg bg-white text-sm focus:outline-none"
              style={{ borderColor: '#E5E5E5', color: '#333333' }}
              onFocus={(e) => (e.target.style.borderColor = '#009933')}
              onBlur={(e) => (e.target.style.borderColor = '#E5E5E5')}
            >
              <option value="ALL">Todos los estados</option>
              <option value="OPEN">Abierta</option>
              <option value="IN_PROGRESS">En Progreso</option>
              <option value="COMPLETED">Completada</option>
              <option value="CANCELLED">Cancelada</option>
            </select>
            <Button
              variant="secondary"
              onClick={() => setSortDirection(d => d === 'asc' ? 'desc' : 'asc')}
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

      {filteredRequests.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No hay solicitudes"
          description={
            searchTerm || filterStatus !== 'ALL'
              ? 'No se encontraron resultados para tu búsqueda'
              : 'Las solicitudes aparecerán cuando conviertas una cotización'
          }
        />
      ) : (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden" style={{ borderColor: '#E5E5E5' }}>
          {/* Desktop */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="border-b" style={{ backgroundColor: '#F9F9F9', borderColor: '#E5E5E5' }}>
                <tr>
                  {['N° Solicitud', 'Cliente', 'Fecha', 'Cotización', 'Muestras', 'Estado', 'Acciones'].map((h, i) => (
                    <th
                      key={h}
                      className={`px-6 py-4 text-xs font-medium uppercase tracking-wider ${i === 6 ? 'text-right' : 'text-left'}`}
                      style={{ color: '#666666' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: '#E5E5E5' }}>
                {filteredRequests.map((request) => {
                  const StatusIcon = statusIcons[request.status] ?? ClipboardList;
                  return (
                    <tr key={request.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-sm font-medium" style={{ color: '#009933' }}>
                          {request.requestNumber}
                        </span>
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
                          <span className="text-sm font-mono" style={{ color: '#666666' }}>
                            {request.quoteNumber ?? '—'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Package className="w-4 h-4" style={{ color: '#666666' }} />
                          <span className="text-sm" style={{ color: '#666666' }}>
                            {request.samples?.length ?? 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={statusVariant[request.status] ?? 'utm_gray'}>
                          <StatusIcon className="w-3 h-3 mr-1 inline" />
                          {statusLabels[request.status] ?? request.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Link to={`/requests/${request.id}`}>
                          <IconButton icon={Eye} title="Ver detalles" variant="green" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="lg:hidden divide-y" style={{ borderColor: '#E5E5E5' }}>
            {filteredRequests.map((request) => {
              const StatusIcon = statusIcons[request.status] ?? ClipboardList;
              return (
                <div key={request.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="font-mono font-medium" style={{ color: '#009933' }}>
                        {request.requestNumber}
                      </span>
                      <div className="flex items-center gap-1 mt-1">
                        <Users className="w-3 h-3" style={{ color: '#666666' }} />
                        <span className="text-sm" style={{ color: '#666666' }}>{request.client}</span>
                      </div>
                    </div>
                    <Badge variant={statusVariant[request.status] ?? 'utm_gray'}>
                      <StatusIcon className="w-3 h-3 mr-1 inline" />
                      {statusLabels[request.status] ?? request.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                    <div className="flex items-center gap-1" style={{ color: '#666666' }}>
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(request.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1" style={{ color: '#666666' }}>
                      <FileText className="w-3 h-3" />
                      <span className="font-mono">{request.quoteNumber ?? '—'}</span>
                    </div>
                    <div className="flex items-center gap-1" style={{ color: '#666666' }}>
                      <Package className="w-3 h-3" />
                      <span>{request.samples?.length ?? 0} muestras</span>
                    </div>
                  </div>
                  <div className="flex justify-end mt-3 pt-2 border-t" style={{ borderColor: '#E5E5E5' }}>
                    <Link to={`/requests/${request.id}`}>
                      <IconButton icon={Eye} title="Ver" variant="green" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t px-6 py-3 flex justify-between items-center text-sm" style={{ backgroundColor: '#F9F9F9', borderColor: '#E5E5E5' }}>
            <span style={{ color: '#666666' }}>
              Mostrando {filteredRequests.length} de {requests.length} solicitudes
            </span>
            <span className="font-medium" style={{ color: '#009933' }}>
              Total muestras:{' '}
              {filteredRequests.reduce((acc, r) => acc + (r.samples?.length ?? 0), 0)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
