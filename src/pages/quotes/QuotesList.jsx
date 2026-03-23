// pages/quotes/QuotesList.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  FileText, 
  Eye, 
  CheckCircle, 
  Search,
  ArrowUpDown,
  Calendar,
  DollarSign,
  Users,
  XCircle,
  Clock,
  Send,
  ThumbsUp,
  RefreshCw
} from 'lucide-react';
import { quoteService } from '../../services/quoteService';
import { formatDate, formatCurrency } from '../../lib/utils';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

// Mapeo de colores para los estados con paleta UTM
const statusColors = {
  DRAFT: 'bg-gray-100 text-gray-700 border-gray-200',
  SENT: 'bg-blue-100 text-blue-700 border-blue-200',
  APPROVED: 'bg-green-100 text-green-700 border-green-200',
  CONVERTED: 'bg-amber-100 text-amber-700 border-amber-200',
  CANCELLED: 'bg-red-100 text-red-700 border-red-200'
};

// Etiquetas legibles para los estados
const statusLabels = {
  DRAFT: 'Borrador',
  SENT: 'Enviada',
  APPROVED: 'Aprobada',
  CONVERTED: 'Convertida',
  CANCELLED: 'Cancelada'
};

// Iconos para cada estado
const statusIcons = {
  DRAFT: Clock,
  SENT: Send,
  APPROVED: ThumbsUp,
  CONVERTED: RefreshCw,
  CANCELLED: XCircle
};

export default function QuotesList() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    try {
      const response = await quoteService.getAll();
      setQuotes(response.data);
    } catch (error) {
      console.error('Error cargando cotizaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConvert = (quoteId) => {
    console.log('Convertir cotización:', quoteId);
  };

  const filteredQuotes = quotes
    .filter(quote => {
      const matchesSearch = 
        quote.quoteNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.client?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'ALL' || quote.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (sortField === 'total') {
        aVal = parseFloat(aVal) || 0;
        bVal = parseFloat(bVal) || 0;
      } else if (sortField === 'createdAt') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }
      
      const direction = sortDirection === 'asc' ? 1 : -1;
      return (aVal > bVal ? 1 : -1) * direction;
    });

  const totalQuotes = quotes.length;
  const totalApproved = quotes.filter(q => q.status === 'APPROVED').length;
  const totalConverted = quotes.filter(q => q.status === 'CONVERTED').length;
  const totalMonto = quotes.reduce((acc, q) => acc + (parseFloat(q.total) || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: '#009933', borderTopColor: '#FFCC33' }}></div>
          <p className="text-sm" style={{ color: '#666666', fontFamily: "'Montserrat', sans-serif" }}>Cargando cotizaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header con título y botón nueva cotización */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E8F5E9' }}>
            <FileText className="w-5 h-5" style={{ color: '#009933' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#009933', fontFamily: "'Trajan Pro Bold', serif" }}>
              Cotizaciones
            </h1>
            <p className="text-sm" style={{ color: '#666666', fontFamily: "'Montserrat', sans-serif" }}>
              Gestiona todas tus cotizaciones
            </p>
          </div>
        </div>
        
        <Link to="/quotes/new">
          <Button className="w-full sm:w-auto" style={{ backgroundColor: '#009933' }}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Cotización
          </Button>
        </Link>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-4 shadow-sm" style={{ borderColor: '#E5E5E5' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E8F5E9' }}>
              <FileText className="w-5 h-5" style={{ color: '#009933' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: '#666666', fontFamily: "'Montserrat', sans-serif" }}>Total</p>
              <p className="text-xl font-bold" style={{ color: '#009933', fontFamily: "'Montserrat', sans-serif" }}>{totalQuotes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4 shadow-sm" style={{ borderColor: '#E5E5E5' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E8F5E9' }}>
              <ThumbsUp className="w-5 h-5" style={{ color: '#009933' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: '#666666', fontFamily: "'Montserrat', sans-serif" }}>Aprobadas</p>
              <p className="text-xl font-bold" style={{ color: '#009933', fontFamily: "'Montserrat', sans-serif" }}>{totalApproved}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4 shadow-sm" style={{ borderColor: '#E5E5E5' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FFF9E8' }}>
              <RefreshCw className="w-5 h-5" style={{ color: '#FFCC33' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: '#666666', fontFamily: "'Montserrat', sans-serif" }}>Convertidas</p>
              <p className="text-xl font-bold" style={{ color: '#FFCC33', fontFamily: "'Montserrat', sans-serif" }}>{totalConverted}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4 shadow-sm" style={{ borderColor: '#E5E5E5' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F5F5F5' }}>
              <DollarSign className="w-5 h-5" style={{ color: '#666666' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: '#666666', fontFamily: "'Montserrat', sans-serif" }}>Monto total</p>
              <p className="text-xl font-bold" style={{ color: '#009933', fontFamily: "'Montserrat', sans-serif" }}>{formatCurrency(totalMonto)}</p>
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
              placeholder="Buscar por número o cliente..."
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
              onFocus={(e) => e.target.style.borderColor = '#009933'}
              onBlur={(e) => e.target.style.borderColor = '#E5E5E5'}
            >
              <option value="ALL">Todos los estados</option>
              <option value="DRAFT">Borrador</option>
              <option value="SENT">Enviada</option>
              <option value="APPROVED">Aprobada</option>
              <option value="CONVERTED">Convertida</option>
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
          <p className="text-sm mt-3" style={{ color: '#666666', fontFamily: "'Montserrat', sans-serif" }}>
            {filteredQuotes.length} resultado(s) para "{searchTerm}"
          </p>
        )}
      </div>

      {/* Tabla de cotizaciones */}
      {filteredQuotes.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center shadow-sm" style={{ borderColor: '#E5E5E5' }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#F5F5F5' }}>
            <FileText className="w-10 h-10" style={{ color: '#CCCCCC' }} />
          </div>
          <h3 className="text-lg font-medium mb-2" style={{ color: '#333333', fontFamily: "'Montserrat', sans-serif" }}>
            No hay cotizaciones
          </h3>
          <p className="text-sm mb-4" style={{ color: '#666666', fontFamily: "'Montserrat', sans-serif" }}>
            {searchTerm || filterStatus !== 'ALL'
              ? 'No se encontraron resultados para tu búsqueda' 
              : 'Comienza creando tu primera cotización'}
          </p>
          {!searchTerm && filterStatus === 'ALL' && (
            <Link to="/quotes/new">
              <Button style={{ backgroundColor: '#009933' }}>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Cotización
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden" style={{ borderColor: '#E5E5E5' }}>
          {/* Vista de tabla para desktop */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="border-b" style={{ backgroundColor: '#F9F9F9', borderColor: '#E5E5E5' }}>
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#666666', fontFamily: "'Montserrat', sans-serif" }}>N° Cotización</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#666666', fontFamily: "'Montserrat', sans-serif" }}>Cliente</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#666666', fontFamily: "'Montserrat', sans-serif" }}>Fecha</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#666666', fontFamily: "'Montserrat', sans-serif" }}>Total</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#666666', fontFamily: "'Montserrat', sans-serif" }}>Estado</th>
                  <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider" style={{ color: '#666666', fontFamily: "'Montserrat', sans-serif" }}>Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: '#E5E5E5' }}>
                {filteredQuotes.map((quote) => {
                  const StatusIcon = statusIcons[quote.status] || FileText;
                  
                  return (
                    <tr key={quote.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-sm font-medium" style={{ color: '#333333', fontFamily: "'Montserrat', sans-serif" }}>
                          {quote.quoteNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" style={{ color: '#666666' }} />
                          <span className="text-sm" style={{ color: '#666666', fontFamily: "'Montserrat', sans-serif" }}>{quote.client}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" style={{ color: '#666666' }} />
                          <span className="text-sm" style={{ color: '#666666', fontFamily: "'Montserrat', sans-serif" }}>{formatDate(quote.createdAt)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono font-medium" style={{ color: '#009933', fontFamily: "'Montserrat', sans-serif" }}>
                          {formatCurrency(quote.total)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={statusColors[quote.status]}>
                          <StatusIcon className="w-3 h-3 mr-1 inline" />
                          {statusLabels[quote.status] || quote.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/quotes/${quote.id}`}
                            className="p-2 rounded-lg transition-colors"
                            style={{ color: '#666666' }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E8F5E9'; e.currentTarget.style.color = '#009933'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#666666'; }}
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          {quote.status === 'APPROVED' && (
                            <button
                              onClick={() => handleConvert(quote.id)}
                              className="p-2 rounded-lg transition-colors"
                              style={{ color: '#666666' }}
                              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FFF9E8'; e.currentTarget.style.color = '#FFCC33'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#666666'; }}
                              title="Convertir a Solicitud"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Vista de tarjetas para móvil/tablet */}
          <div className="lg:hidden divide-y" style={{ borderColor: '#E5E5E5' }}>
            {filteredQuotes.map((quote) => {
              const StatusIcon = statusIcons[quote.status] || FileText;
              
              return (
                <div key={quote.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="font-mono font-medium" style={{ color: '#009933', fontFamily: "'Montserrat', sans-serif" }}>
                        {quote.quoteNumber}
                      </span>
                      <div className="flex items-center gap-1 mt-1">
                        <Users className="w-3 h-3" style={{ color: '#666666' }} />
                        <span className="text-sm" style={{ color: '#666666', fontFamily: "'Montserrat', sans-serif" }}>{quote.client}</span>
                      </div>
                    </div>
                    <Badge className={statusColors[quote.status]}>
                      <StatusIcon className="w-3 h-3 mr-1 inline" />
                      {statusLabels[quote.status] || quote.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                    <div className="flex items-center gap-1" style={{ color: '#666666' }}>
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(quote.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1" style={{ color: '#009933' }}>
                      <DollarSign className="w-3 h-3" />
                      <span className="font-mono font-medium">{formatCurrency(quote.total)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t" style={{ borderColor: '#E5E5E5' }}>
                    <Link
                      to={`/quotes/${quote.id}`}
                      className="p-2 rounded-lg transition-colors flex items-center gap-1 text-sm"
                      style={{ color: '#666666' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E8F5E9'; e.currentTarget.style.color = '#009933'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#666666'; }}
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden sm:inline">Ver</span>
                    </Link>
                    {quote.status === 'APPROVED' && (
                      <button
                        onClick={() => handleConvert(quote.id)}
                        className="p-2 rounded-lg transition-colors flex items-center gap-1 text-sm"
                        style={{ color: '#666666' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FFF9E8'; e.currentTarget.style.color = '#FFCC33'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#666666'; }}
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span className="hidden sm:inline">Convertir</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer con totales */}
          <div className="border-t px-6 py-3 flex justify-between items-center text-sm" style={{ backgroundColor: '#F9F9F9', borderColor: '#E5E5E5' }}>
            <span style={{ color: '#666666', fontFamily: "'Montserrat', sans-serif" }}>
              Mostrando {filteredQuotes.length} de {quotes.length} cotizaciones
            </span>
            <span className="font-medium" style={{ color: '#009933', fontFamily: "'Montserrat', sans-serif" }}>
              Total: {formatCurrency(filteredQuotes.reduce((acc, q) => acc + (parseFloat(q.total) || 0), 0))}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}