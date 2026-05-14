import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  FileText,
  Eye,
  Search,
  ArrowUpDown,
  Calendar,
  DollarSign,
  Users,
  XCircle,
  Clock,
  Send,
  ThumbsUp,
  RefreshCw,
} from "lucide-react";
import { quoteService } from "../../services/quoteService";
import { formatDate, formatCurrency } from "../../lib/utils";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import EmptyState from "../../components/common/EmptyState";
import IconButton from "../../components/common/IconButton";
import { useNavigate } from "react-router-dom";

const statusColors = {
  DRAFT: "bg-gray-100 text-gray-700 border-gray-200",
  SENT: "bg-blue-100 text-blue-700 border-blue-200",
  APPROVED: "bg-green-100 text-green-700 border-green-200",
  CONVERTED: "bg-amber-100 text-amber-700 border-amber-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
};

const statusLabels = {
  DRAFT: "Borrador",
  SENT: "Enviada",
  APPROVED: "Aprobada",
  CONVERTED: "Convertida",
  CANCELLED: "Cancelada",
};

const statusIcons = {
  DRAFT: Clock,
  SENT: Send,
  APPROVED: ThumbsUp,
  CONVERTED: RefreshCw,
  CANCELLED: XCircle,
};

export default function QuotesList() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [sortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const navigate = useNavigate();

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    try {
      const response = await quoteService.getAll();
      setQuotes(response.data);
    } catch {
      // silently handled
    } finally {
      setLoading(false);
    }
  };

  const handleConvert = (quoteId) => {
    navigate(`/quotes/${quoteId}`);
  };

  const filteredQuotes = quotes
    .filter((quote) => {
      const matchesSearch =
        quote.quoteNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.client?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "ALL" || quote.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (sortField === "total") {
        aVal = parseFloat(aVal) || 0;
        bVal = parseFloat(bVal) || 0;
      } else if (sortField === "createdAt") {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }
      return (aVal > bVal ? 1 : -1) * (sortDirection === "asc" ? 1 : -1);
    });

  const totalMonto = quotes.reduce(
    (acc, q) => acc + (parseFloat(q.total) || 0),
    0,
  );

  if (loading) return <LoadingSpinner message="Cargando cotizaciones..." />;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader
        icon={FileText}
        title="Cotizaciones"
        subtitle="Gestiona todas tus cotizaciones"
      >
        <Link to="/quotes/new">
          <Button className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Cotización
          </Button>
        </Link>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FileText}
          label="Total"
          value={quotes.length}
          variant="green"
        />
        <StatCard
          icon={ThumbsUp}
          label="Aprobadas"
          value={quotes.filter((q) => q.status === "APPROVED").length}
          variant="green"
        />
        <StatCard
          icon={RefreshCw}
          label="Convertidas"
          value={quotes.filter((q) => q.status === "CONVERTED").length}
          variant="gold"
        />
        <StatCard
          icon={DollarSign}
          label="Monto total"
          value={formatCurrency(totalMonto)}
          variant="gray"
        />
      </div>

      {/* Filtros */}
      <div
        className="bg-white rounded-xl border p-4 shadow-sm"
        style={{ borderColor: "#E5E5E5" }}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "#666666" }}
            />
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
              className="px-3 py-2 border rounded-lg bg-white text-sm focus:outline-none"
              style={{ borderColor: "#E5E5E5", color: "#333333" }}
              onFocus={(e) => (e.target.style.borderColor = "#009933")}
              onBlur={(e) => (e.target.style.borderColor = "#E5E5E5")}
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
              onClick={() =>
                setSortDirection((d) => (d === "asc" ? "desc" : "asc"))
              }
              className="px-3"
              title="Ordenar por fecha"
            >
              <ArrowUpDown className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {searchTerm && (
          <p className="text-sm mt-3" style={{ color: "#666666" }}>
            {filteredQuotes.length} resultado(s) para "{searchTerm}"
          </p>
        )}
      </div>

      {filteredQuotes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No hay cotizaciones"
          description={
            searchTerm || filterStatus !== "ALL"
              ? "No se encontraron resultados para tu búsqueda"
              : "Comienza creando tu primera cotización"
          }
          action={
            !searchTerm &&
            filterStatus === "ALL" && (
              <Link to="/quotes/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Cotización
                </Button>
              </Link>
            )
          }
        />
      ) : (
        <div
          className="bg-white rounded-xl border shadow-sm overflow-hidden"
          style={{ borderColor: "#E5E5E5" }}
        >
          {/* Desktop */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead
                className="border-b"
                style={{ backgroundColor: "#F9F9F9", borderColor: "#E5E5E5" }}
              >
                <tr>
                  {[
                    "N° Cotización",
                    "Cliente",
                    "Fecha",
                    "Total",
                    "Estado",
                    "Acciones",
                  ].map((h, i) => (
                    <th
                      key={h}
                      className={`px-6 py-4 text-xs font-medium uppercase tracking-wider ${i === 5 ? "text-right" : "text-left"}`}
                      style={{ color: "#666666" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "#E5E5E5" }}>
                {filteredQuotes.map((quote) => {
                  const StatusIcon = statusIcons[quote.status] ?? FileText;
                  return (
                    <tr
                      key={quote.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className="font-mono text-sm font-medium"
                          style={{ color: "#333333" }}
                        >
                          {quote.quoteNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Users
                            className="w-4 h-4"
                            style={{ color: "#666666" }}
                          />
                          <span
                            className="text-sm"
                            style={{ color: "#666666" }}
                          >
                            {quote.client}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar
                            className="w-4 h-4"
                            style={{ color: "#666666" }}
                          />
                          <span
                            className="text-sm"
                            style={{ color: "#666666" }}
                          >
                            {formatDate(quote.createdAt)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className="font-mono font-medium"
                          style={{ color: "#009933" }}
                        >
                          {formatCurrency(quote.total)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={statusColors[quote.status]}>
                          <StatusIcon className="w-3 h-3 mr-1 inline" />
                          {statusLabels[quote.status] ?? quote.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/quotes/${quote.id}`}>
                            <IconButton
                              icon={Eye}
                              title="Ver detalles"
                              variant="green"
                            />
                          </Link>
                          {quote.status === "APPROVED" && (
                            <IconButton
                              icon={RefreshCw}
                              title="Convertir a Solicitud"
                              variant="gold"
                              onClick={() => handleConvert(quote.id)}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div
            className="lg:hidden divide-y"
            style={{ borderColor: "#E5E5E5" }}
          >
            {filteredQuotes.map((quote) => {
              const StatusIcon = statusIcons[quote.status] ?? FileText;
              return (
                <div
                  key={quote.id}
                  className="p-4 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span
                        className="font-mono font-medium"
                        style={{ color: "#009933" }}
                      >
                        {quote.quoteNumber}
                      </span>
                      <div className="flex items-center gap-1 mt-1">
                        <Users
                          className="w-3 h-3"
                          style={{ color: "#666666" }}
                        />
                        <span className="text-sm" style={{ color: "#666666" }}>
                          {quote.client}
                        </span>
                      </div>
                    </div>
                    <Badge className={statusColors[quote.status]}>
                      <StatusIcon className="w-3 h-3 mr-1 inline" />
                      {statusLabels[quote.status] ?? quote.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                    <div
                      className="flex items-center gap-1"
                      style={{ color: "#666666" }}
                    >
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(quote.createdAt)}</span>
                    </div>
                    <div
                      className="flex items-center gap-1"
                      style={{ color: "#009933" }}
                    >
                      <DollarSign className="w-3 h-3" />
                      <span className="font-mono font-medium">
                        {formatCurrency(quote.total)}
                      </span>
                    </div>
                  </div>
                  <div
                    className="flex items-center justify-end gap-2 mt-3 pt-2 border-t"
                    style={{ borderColor: "#E5E5E5" }}
                  >
                    <Link to={`/quotes/${quote.id}`}>
                      <IconButton icon={Eye} title="Ver" variant="green" />
                    </Link>
                    {quote.status === "APPROVED" && (
                      <IconButton
                        icon={RefreshCw}
                        title="Convertir"
                        variant="gold"
                        onClick={() => handleConvert(quote.id)}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className="border-t px-6 py-3 flex justify-between items-center text-sm"
            style={{ backgroundColor: "#F9F9F9", borderColor: "#E5E5E5" }}
          >
            <span style={{ color: "#666666" }}>
              Mostrando {filteredQuotes.length} de {quotes.length} cotizaciones
            </span>
            <span className="font-medium" style={{ color: "#009933" }}>
              Total:{" "}
              {formatCurrency(
                filteredQuotes.reduce(
                  (acc, q) => acc + (parseFloat(q.total) || 0),
                  0,
                ),
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
