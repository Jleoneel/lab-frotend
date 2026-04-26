// pages/inventario/EquiposList.jsx
import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Wrench,
  Edit,
  Calendar,
  MapPin,
  Tag,
  AlertTriangle,
  Filter,
  ChevronDown,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import {
  equipoService,
  ESTADOS_EQUIPO,
  ESTADOS_COLORS,
} from "../../services/equipoService";
import NuevoEquipoModal from "../../components/inventario/NuevoEquipoModal";
import EditEquipoModal from "../../components/inventario/EditEquipoModal";

const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("es-EC", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function EquiposList() {
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [showNuevoModal, setShowNuevoModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);

  useEffect(() => {
    loadEquipos();
  }, []);

  const loadEquipos = async () => {
    try {
      const response = await equipoService.getAll();
      setEquipos(response.data);
    } catch (error) {
      console.error("Error cargando equipos:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEquipos = equipos
    .filter((e) => (estadoFiltro ? e.estado === estadoFiltro : true))
    .filter(
      (e) =>
        e.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.codigoInventario.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.marca?.toLowerCase().includes(searchTerm.toLowerCase()),
    );

  const activos = equipos.filter((e) => e.estado === "ACTIVO").length;
  const mantenimiento = equipos.filter(
    (e) => e.estado === "EN_MANTENIMIENTO",
  ).length;
  const fueraServicio = equipos.filter(
    (e) => e.estado === "FUERA_DE_SERVICIO",
  ).length;
  
  const hoy = new Date();
  const equiposAlerta = equipos.filter((e) => {
    if (!e.fechaCalibracion) return false;
    const fecha = new Date(e.fechaCalibracion);
    const diasRestantes = Math.ceil((fecha - hoy) / (1000 * 60 * 60 * 24));
    return diasRestantes <= 15 && diasRestantes >= 0;
  });

  const equiposVencidos = equipos.filter((e) => {
    if (!e.fechaCalibracion) return false;
    return new Date(e.fechaCalibracion) < hoy;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div
            className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: "#009933", borderTopColor: "#FFCC33" }}
          ></div>
          <p className="text-sm" style={{ color: "#666666", fontFamily: "'Montserrat', sans-serif" }}>
            Cargando equipos...
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
            style={{ backgroundColor: "#E8F5E9" }}
          >
            <Wrench className="w-7 h-7" style={{ color: "#009933" }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#009933", fontFamily: "'Trajan Pro Bold', serif" }}>
              Equipos de Laboratorio
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "#666666", fontFamily: "'Montserrat', sans-serif" }}>
              Control y seguimiento de equipos
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowNuevoModal(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:shadow-md"
          style={{ backgroundColor: "#009933" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#00802b")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#009933")}
        >
          <Plus className="w-4 h-4" />
          Nuevo Equipo
        </button>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-all duration-200"
          style={{ borderColor: "#E5E5E5" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#E8F5E9" }}>
              <Wrench className="w-5 h-5" style={{ color: "#009933" }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: "#666666" }}>Total</p>
              <p className="text-2xl font-bold" style={{ color: "#009933" }}>{equipos.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-all duration-200"
          style={{ borderColor: "#E5E5E5" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#E8F5E9" }}>
              <CheckCircle className="w-5 h-5" style={{ color: "#009933" }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: "#666666" }}>Activos</p>
              <p className="text-2xl font-bold" style={{ color: "#009933" }}>{activos}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-all duration-200"
          style={{ borderColor: "#E5E5E5" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#FFF9E8" }}>
              <Clock className="w-5 h-5" style={{ color: "#FFCC33" }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: "#666666" }}>Mantenimiento</p>
              <p className="text-2xl font-bold" style={{ color: "#FFCC33" }}>{mantenimiento}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-all duration-200"
          style={{ borderColor: "#E5E5E5" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#FEF2F2" }}>
              <XCircle className="w-5 h-5" style={{ color: "#DC2626" }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: "#666666" }}>Fuera servicio</p>
              <p className="text-2xl font-bold" style={{ color: "#DC2626" }}>{fueraServicio}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alertas de calibración */}
      {equiposVencidos.length > 0 && (
        <div className="rounded-xl p-4 border flex items-start gap-3 animate-in fade-in slide-in-from-top-2"
          style={{ backgroundColor: "#FEF2F2", borderColor: "#FEE2E2" }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#DC262620" }}>
            <AlertTriangle className="w-4 h-4" style={{ color: "#DC2626" }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold" style={{ color: "#DC2626" }}>
              {equiposVencidos.length} equipo(s) con calibración VENCIDA
            </p>
            <p className="text-sm mt-1" style={{ color: "#666666" }}>
              {equiposVencidos
                .map(
                  (e) =>
                    `${e.nombre} (venció ${formatDate(e.fechaCalibracion)})`,
                )
                .join(" · ")}
            </p>
          </div>
        </div>
      )}

      {equiposAlerta.length > 0 && (
        <div className="rounded-xl p-4 border flex items-start gap-3 animate-in fade-in slide-in-from-top-2"
          style={{ backgroundColor: "#FFF9E8", borderColor: "#FFCC33" }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#FFCC3320" }}>
            <AlertTriangle className="w-4 h-4" style={{ color: "#FFCC33" }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold" style={{ color: "#996600" }}>
              {equiposAlerta.length} equipo(s) con calibración próxima (≤15 días)
            </p>
            <p className="text-sm mt-1" style={{ color: "#666666" }}>
              {equiposAlerta
                .map((e) => {
                  const dias = Math.ceil(
                    (new Date(e.fechaCalibracion) - hoy) /
                      (1000 * 60 * 60 * 24),
                  );
                  return `${e.nombre} (${dias} día${dias === 1 ? "" : "s"})`;
                })
                .join(" · ")}
            </p>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white rounded-xl border p-4 shadow-sm"
        style={{ borderColor: "#E5E5E5" }}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "#666666" }}
            />
            <input
              placeholder="Buscar por nombre, código o marca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border rounded-xl focus:outline-none text-sm transition-all"
              style={{ borderColor: "#E5E5E5", color: "#333333", fontFamily: "'Montserrat', sans-serif" }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#009933";
                e.currentTarget.style.boxShadow = "0 0 0 2px #00993320";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#E5E5E5";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#666666" }} />
            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
              className="pl-9 pr-8 py-2.5 border rounded-xl text-sm focus:outline-none appearance-none cursor-pointer transition-all"
              style={{ borderColor: "#E5E5E5", color: "#333333", fontFamily: "'Montserrat', sans-serif" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#009933")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E5E5")}
            >
              <option value="">Todos los estados</option>
              {Object.entries(ESTADOS_EQUIPO).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "#666666" }} />
          </div>
        </div>
      </div>

      {/* Lista de equipos */}
      {filteredEquipos.length === 0 ? (
        <div className="bg-white rounded-2xl border p-12 text-center shadow-sm"
          style={{ borderColor: "#E5E5E5" }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "#F5F5F5" }}>
            <Wrench className="w-10 h-10" style={{ color: "#CCCCCC" }} />
          </div>
          <h3 className="text-lg font-medium mb-2" style={{ color: "#333333", fontFamily: "'Montserrat', sans-serif" }}>
            {searchTerm || estadoFiltro
              ? "No se encontraron equipos"
              : "No hay equipos registrados"}
          </h3>
          <p className="text-sm" style={{ color: "#666666" }}>
            {searchTerm || estadoFiltro
              ? "Intenta con otros términos o filtros"
              : "Comienza agregando el primer equipo"}
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEquipos.map((equipo) => {
            const estadoStyle = ESTADOS_COLORS[equipo.estado];
            return (
              <div
                key={equipo.id}
                className="group bg-white rounded-2xl border p-5 shadow-sm hover:shadow-lg transition-all duration-200"
                style={{ borderColor: "#E5E5E5" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#009933")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#E5E5E5")}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: "#E8F5E9" }}>
                        <Wrench className="w-4 h-4" style={{ color: "#009933" }} />
                      </div>
                      <h3 className="font-semibold truncate" style={{ color: "#009933", fontFamily: "'Montserrat', sans-serif" }}>
                        {equipo.nombre}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Tag className="w-3.5 h-3.5" style={{ color: "#666666" }} />
                      <p className="text-xs font-mono" style={{ color: "#666666" }}>
                        {equipo.codigoInventario}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{
                        backgroundColor: estadoStyle.bg,
                        color: estadoStyle.color,
                      }}
                    >
                      {ESTADOS_EQUIPO[equipo.estado]}
                    </span>
                    <button
                      onClick={() => {
                        setEquipoSeleccionado(equipo);
                        setShowEditModal(true);
                      }}
                      className="p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      style={{ color: "#666666" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#E8F5E9";
                        e.currentTarget.style.color = "#009933";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#666666";
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Detalles */}
                <div className="space-y-2 text-sm mb-4">
                  {equipo.marca && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs" style={{ color: "#666666" }}>Marca / Modelo</span>
                      <span className="text-xs font-medium" style={{ color: "#333333" }}>
                        {equipo.marca}
                        {equipo.modelo ? ` / ${equipo.modelo}` : ""}
                      </span>
                    </div>
                  )}
                  {equipo.serie && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs" style={{ color: "#666666" }}>Serie</span>
                      <span className="text-xs font-mono" style={{ color: "#333333" }}>
                        {equipo.serie}
                      </span>
                    </div>
                  )}
                  {equipo.ubicacion && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 flex-shrink-0" style={{ color: "#666666" }} />
                      <span className="text-xs truncate" style={{ color: "#666666" }}>
                        {equipo.ubicacion}
                      </span>
                    </div>
                  )}
                </div>

                {/* Fechas */}
                <div className="pt-4 border-t space-y-2" style={{ borderColor: "#E5E5E5" }}>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <CalendarIcon className="w-3 h-3" style={{ color: "#009933" }} />
                      <span style={{ color: "#666666" }}>Adquisición</span>
                    </div>
                    <span className="font-medium" style={{ color: "#333333" }}>
                      {formatDate(equipo.fechaAdquisicion)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" style={{ color: "#FFCC33" }} />
                      <span style={{ color: "#666666" }}>Mantenimiento</span>
                    </div>
                    <span className="font-medium" style={{ color: "#333333" }}>
                      {formatDate(equipo.fechaMantenimiento)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" style={{ color: "#DC2626" }} />
                      <span style={{ color: "#666666" }}>Calibración</span>
                    </div>
                    <span className="font-medium" style={{ color: "#333333" }}>
                      {formatDate(equipo.fechaCalibracion)}
                    </span>
                  </div>
                </div>

                {/* Indicador de estado de calibración */}
                {equipo.fechaCalibracion && (
                  <div className="mt-3 pt-2">
                    {new Date(equipo.fechaCalibracion) < hoy ? (
                      <div className="flex items-center gap-1.5 text-xs" style={{ color: "#DC2626" }}>
                        <AlertTriangle className="w-3 h-3" />
                        <span>Calibración vencida</span>
                      </div>
                    ) : new Date(equipo.fechaCalibracion) - hoy <= 15 * 24 * 60 * 60 * 1000 ? (
                      <div className="flex items-center gap-1.5 text-xs" style={{ color: "#FFCC33" }}>
                        <AlertTriangle className="w-3 h-3" />
                        <span>Próxima a vencer</span>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <NuevoEquipoModal
        isOpen={showNuevoModal}
        onClose={() => setShowNuevoModal(false)}
        onSaved={loadEquipos}
      />
      <EditEquipoModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        equipo={equipoSeleccionado}
        onSaved={loadEquipos}
      />
    </div>
  );
}