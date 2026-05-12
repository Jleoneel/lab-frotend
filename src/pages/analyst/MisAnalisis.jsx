// pages/analyst/MisAnalisis.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FlaskConical, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Play,
  Filter,
  ChevronDown,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  Search,
  Eye
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/axios';
import Badge from '../../components/ui/Badge';

const statusColors = {
  PENDING: 'bg-[#FFF9E8] text-[#996600] border border-[#FFCC33]',
  RUNNING: 'bg-[#EFF6FF] text-[#3B82F6] border border-[#93C5FD]',
  DONE: 'bg-[#E8F5E9] text-[#009933] border border-[#A5D6A7]'
};

const statusLabels = {
  PENDING: 'Pendiente',
  RUNNING: 'En Proceso',
  DONE: 'Completado'
};

const statusIcons = {
  PENDING: Clock,
  RUNNING: Play,
  DONE: CheckCircle
};

export default function MisAnalisis() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadMisAnalisis();
  }, []);

  const loadMisAnalisis = async () => {
    try {
      const response = await api.get('/samples/my-analyses');
      const data = response.data || [];
      setAnalyses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error cargando análisis:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = analyses.filter(a => {
    const matchEstado = filtroEstado ? a.status === filtroEstado : true;
    const matchSearch = searchTerm === '' || 
      a.service?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.service?.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.sample?.sampleCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.sample?.sampleName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchEstado && matchSearch;
  });

  const pendientes = analyses.filter(a => a.status === 'PENDING').length;
  const enProceso = analyses.filter(a => a.status === 'RUNNING').length;
  const completados = analyses.filter(a => a.status === 'DONE').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div
            className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: '#009933', borderTopColor: '#FFCC33' }}
          ></div>
          <p className="text-sm" style={{ color: '#666666', fontFamily: "'Montserrat', sans-serif" }}>
            Cargando tus análisis...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"
            style={{ backgroundColor: '#E8F5E9' }}
          >
            <FlaskConical className="w-7 h-7" style={{ color: '#009933' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#009933', fontFamily: "'Trajan Pro Bold', serif" }}>
              Mis Análisis
            </h1>
            <p className="text-sm mt-0.5" style={{ color: '#666666', fontFamily: "'Montserrat', sans-serif" }}>
              Bienvenido, {user?.fullName}
            </p>
          </div>
        </div>
        
        {/* Resumen rápido */}
        {analyses.length > 0 && (
          <div className="flex gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border" style={{ borderColor: '#E5E5E5', backgroundColor: '#F9F9F9' }}>
              <span className="text-xs" style={{ color: '#666666' }}>Total:</span>
              <span className="text-sm font-semibold" style={{ color: '#009933' }}>{analyses.length}</span>
            </div>
          </div>
        )}
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-all duration-200"
          style={{ borderColor: '#E5E5E5' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E8F5E9' }}>
              <FlaskConical className="w-5 h-5" style={{ color: '#009933' }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: '#666666' }}>Total análisis</p>
              <p className="text-2xl font-bold" style={{ color: '#009933' }}>{analyses.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-all duration-200"
          style={{ borderColor: '#E5E5E5' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FFF9E8' }}>
              <Clock className="w-5 h-5" style={{ color: '#FFCC33' }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: '#666666' }}>Pendientes</p>
              <p className="text-2xl font-bold" style={{ color: '#FFCC33' }}>{pendientes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-all duration-200"
          style={{ borderColor: '#E5E5E5' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#EFF6FF' }}>
              <Play className="w-5 h-5" style={{ color: '#3B82F6' }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: '#666666' }}>En proceso</p>
              <p className="text-2xl font-bold" style={{ color: '#3B82F6' }}>{enProceso}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-all duration-200"
          style={{ borderColor: '#E5E5E5' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E8F5E9' }}>
              <CheckCircle className="w-5 h-5" style={{ color: '#009933' }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: '#666666' }}>Completados</p>
              <p className="text-2xl font-bold" style={{ color: '#009933' }}>{completados}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-xl border p-4 shadow-sm" style={{ borderColor: '#E5E5E5' }}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#666666' }} />
            <input
              placeholder="Buscar por análisis, código o muestra..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border rounded-xl focus:outline-none transition-all text-sm"
              style={{ borderColor: '#E5E5E5', color: '#333333', fontFamily: "'Montserrat', sans-serif" }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#009933';
                e.currentTarget.style.boxShadow = '0 0 0 2px #00993320';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#E5E5E5';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
          <div className="relative sm:w-64">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#666666' }} />
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 border rounded-xl text-sm focus:outline-none appearance-none cursor-pointer transition-all"
              style={{ borderColor: '#E5E5E5', color: '#333333', fontFamily: "'Montserrat', sans-serif" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#009933')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#E5E5E5')}
            >
              <option value="">Todos los estados</option>
              <option value="PENDING">Pendientes</option>
              <option value="RUNNING">En proceso</option>
              <option value="DONE">Completados</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#666666' }} />
          </div>
        </div>
        {(searchTerm || filtroEstado) && (
          <p className="text-xs mt-3" style={{ color: '#666666' }}>
            Mostrando {filtered.length} de {analyses.length} análisis
          </p>
        )}
      </div>

      {/* Lista de análisis */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border p-12 text-center shadow-sm" style={{ borderColor: '#E5E5E5' }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#F5F5F5' }}>
            <FlaskConical className="w-10 h-10" style={{ color: '#CCCCCC' }} />
          </div>
          <h3 className="text-lg font-medium mb-2" style={{ color: '#333333', fontFamily: "'Montserrat', sans-serif" }}>
            {searchTerm || filtroEstado ? 'No hay análisis con esos filtros' : 'No tienes análisis asignados'}
          </h3>
          <p className="text-sm" style={{ color: '#666666' }}>
            {searchTerm || filtroEstado
              ? 'Intenta con otros términos o elimina los filtros'
              : 'Los análisis aparecerán aquí cuando te sean asignados'}
          </p>
        </div>
      ) : (
        <>
          {/* Vista Desktop: Tabla */}
          <div className="hidden lg:block bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: '#E5E5E5' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b" style={{ backgroundColor: '#F9F9F9', borderColor: '#E5E5E5' }}>
                  <tr>
                    <th className="px-6 py-4 text-left font-medium" style={{ color: '#666666' }}>Análisis</th>
                    <th className="px-6 py-4 text-left font-medium" style={{ color: '#666666' }}>Muestra</th>
                    <th className="px-6 py-4 text-left font-medium" style={{ color: '#666666' }}>Cliente</th>
                    <th className="px-6 py-4 text-center font-medium" style={{ color: '#666666' }}>Estado</th>
                    <th className="px-6 py-4 text-center font-medium" style={{ color: '#666666' }}>Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: '#E5E5E5' }}>
                  {filtered.map((analysis) => {
                    const StatusIcon = statusIcons[analysis.status] || Clock;
                    return (
                      <tr key={analysis.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="font-medium" style={{ color: '#009933' }}>
                            {analysis.service?.name}
                          </div>
                          <div className="text-xs font-mono" style={{ color: '#666666' }}>
                            {analysis.service?.code}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium" style={{ color: '#333333' }}>
                            {analysis.sample?.sampleCode}
                          </div>
                          <div className="text-xs" style={{ color: '#666666' }}>
                            {analysis.sample?.sampleName}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5" style={{ color: '#666666' }} />
                            <span className="text-sm" style={{ color: '#666666' }}>
                              {analysis.sample?.request?.client?.name || 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium ${statusColors[analysis.status]}`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusLabels[analysis.status]}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => navigate(`/samples/${analysis.sample?.id}`)}
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium text-white transition-all hover:shadow-md"
                            style={{ backgroundColor: '#009933' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00802b'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#009933'}
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Ver muestra
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* Footer con totales */}
            <div className="border-t px-6 py-3 flex justify-between items-center text-sm" style={{ backgroundColor: '#F9F9F9', borderColor: '#E5E5E5' }}>
              <span style={{ color: '#666666' }}>Mostrando {filtered.length} de {analyses.length} análisis</span>
              <span className="font-medium" style={{ color: '#009933' }}>
                Completados: {completados} / {analyses.length}
              </span>
            </div>
          </div>

          {/* Vista Móvil/Tablet: Tarjetas */}
          <div className="lg:hidden space-y-3">
            {filtered.map((analysis) => {
              const StatusIcon = statusIcons[analysis.status] || Clock;
              return (
                <div
                  key={analysis.id}
                  className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-all duration-200"
                  style={{ borderColor: '#E5E5E5' }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: analysis.status === 'DONE' ? '#009933' : analysis.status === 'RUNNING' ? '#3B82F6' : '#FFCC33' }} />
                        <h3 className="font-semibold" style={{ color: '#009933' }}>{analysis.service?.name}</h3>
                      </div>
                      <p className="text-xs font-mono mt-0.5" style={{ color: '#666666' }}>{analysis.service?.code}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${statusColors[analysis.status]}`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusLabels[analysis.status]}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: '#666666' }}>Muestra</span>
                      <span className="font-medium" style={{ color: '#333333' }}>
                        {analysis.sample?.sampleCode}
                      </span>
                    </div>
                    {analysis.sample?.sampleName && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs" style={{ color: '#666666' }}>Nombre muestra</span>
                        <span className="text-sm truncate max-w-[180px]" style={{ color: '#666666' }}>
                          {analysis.sample?.sampleName}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: '#666666' }}>Cliente</span>
                      <span className="flex items-center gap-1 text-sm" style={{ color: '#666666' }}>
                        <Users className="w-3 h-3" />
                        {analysis.sample?.request?.client?.name || 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end pt-3 border-t" style={{ borderColor: '#E5E5E5' }}>
                    <button
                      onClick={() => navigate(`/samples/${analysis.sample?.id}`)}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium text-white transition-all"
                      style={{ backgroundColor: '#009933' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00802b'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#009933'}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Ver muestra
                    </button>
                  </div>
                </div>
              );
            })}
            {/* Footer móvil */}
            <div className="flex justify-between items-center px-4 py-3 border-t" style={{ borderColor: '#E5E5E5' }}>
              <span className="text-xs" style={{ color: '#666666' }}>Total: {analyses.length}</span>
              <span className="text-xs font-medium" style={{ color: '#009933' }}>Completados: {completados}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}