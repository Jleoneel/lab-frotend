// pages/quotes/QuotesList.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  FileText, 
  Eye, 
  CheckCircle, 
  Search,
  Filter,
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

// Mapeo de colores para los estados correctos
const statusColors = {
  DRAFT: 'bg-gray-100 text-gray-800 border-gray-200',
  SENT: 'bg-blue-100 text-blue-800 border-blue-200',
  APPROVED: 'bg-green-100 text-green-800 border-green-200',
  CONVERTED: 'bg-purple-100 text-purple-800 border-purple-200',
  CANCELLED: 'bg-red-100 text-red-800 border-red-200'
};

// Etiquetas legibles para los estados
const statusLabels = {
  DRAFT: 'Borrador',
  SENT: 'Enviada',
  APPROVED: 'Aprobada',
  CONVERTED: 'Convertida',
  CANCELLED: 'Cancelada'
};

// Iconos para cada estado (opcional para mejorar la UI)
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
    // Esta función debería abrir el modal de conversión
    console.log('Convertir cotización:', quoteId);
  };

  // Filtrar y ordenar cotizaciones
  const filteredQuotes = quotes
    .filter(quote => {
      // Filtro por búsqueda
      const matchesSearch = 
        quote.quoteNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.client?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtro por estado
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

  // Estadísticas
  const totalQuotes = quotes.length;
  const totalApproved = quotes.filter(q => q.status === 'APPROVED').length;
  const totalConverted = quotes.filter(q => q.status === 'CONVERTED').length;
  const totalMonto = quotes.reduce((acc, q) => acc + (parseFloat(q.total) || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando cotizaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header con título y botón nueva cotización */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Cotizaciones</h1>
            <p className="text-sm text-gray-500">Gestiona todas tus cotizaciones</p>
          </div>
        </div>
        
        <Link to="/quotes/new">
          <Button className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Cotización
          </Button>
        </Link>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-xl font-bold text-gray-800">{totalQuotes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <ThumbsUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Aprobadas</p>
              <p className="text-xl font-bold text-gray-800">{totalApproved}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Convertidas</p>
              <p className="text-xl font-bold text-gray-800">{totalConverted}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Monto total</p>
              <p className="text-xl font-bold text-gray-800">{formatCurrency(totalMonto)}</p>
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
              className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        {/* Resultados de búsqueda */}
        {searchTerm && (
          <p className="text-sm text-gray-500 mt-3">
            {filteredQuotes.length} resultado(s) para "{searchTerm}"
          </p>
        )}
      </div>

      {/* Tabla de cotizaciones */}
      {filteredQuotes.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay cotizaciones
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || filterStatus !== 'ALL'
              ? 'No se encontraron resultados para tu búsqueda' 
              : 'Comienza creando tu primera cotización'}
          </p>
          {!searchTerm && filterStatus === 'ALL' && (
            <Link to="/quotes/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Cotización
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Vista de tabla para desktop */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    N° Cotización
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
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
                {filteredQuotes.map((quote) => {
                  const StatusIcon = statusIcons[quote.status] || FileText;
                  
                  return (
                    <tr key={quote.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-sm font-medium text-gray-900">
                          {quote.quoteNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{quote.client}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">{formatDate(quote.createdAt)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono font-medium text-gray-900">
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
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          {quote.status === 'APPROVED' && (
                            <button
                              onClick={() => handleConvert(quote.id)}
                              className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
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
          <div className="lg:hidden divide-y divide-gray-100">
            {filteredQuotes.map((quote) => {
              const StatusIcon = statusIcons[quote.status] || FileText;
              
              return (
                <div key={quote.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="font-mono font-medium text-gray-900">
                        {quote.quoteNumber}
                      </span>
                      <div className="flex items-center gap-1 mt-1">
                        <Users className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-600">{quote.client}</span>
                      </div>
                    </div>
                    <Badge className={statusColors[quote.status]}>
                      <StatusIcon className="w-3 h-3 mr-1 inline" />
                      {statusLabels[quote.status] || quote.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                    <div className="flex items-center gap-1 text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(quote.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <DollarSign className="w-3 h-3" />
                      <span className="font-mono">{formatCurrency(quote.total)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-gray-100">
                    <Link
                      to={`/quotes/${quote.id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden sm:inline">Ver</span>
                    </Link>
                    {quote.status === 'APPROVED' && (
                      <button
                        onClick={() => handleConvert(quote.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors flex items-center gap-1 text-sm"
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
          <div className="bg-gray-50/50 border-t border-gray-100 px-6 py-3 flex justify-between items-center text-sm">
            <span className="text-gray-500">
              Mostrando {filteredQuotes.length} de {quotes.length} cotizaciones
            </span>
            <span className="text-gray-700 font-medium">
              Total: {formatCurrency(filteredQuotes.reduce((acc, q) => acc + (parseFloat(q.total) || 0), 0))}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}