// pages/inventario/ReactivosList.jsx
import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  FlaskConical,
  AlertTriangle,
  Package,
  TrendingDown,
  TrendingUp,
  Edit,
  Filter,
  ChevronDown,
  CheckCircle,
  Box,
} from "lucide-react";
import {
  reactivoService,
  CATEGORIAS,
  UNIDADES,
} from "../../services/reactivoService";
import NuevoReactivoModal from "../../components/inventario/NuevoReactivoModal";
import EditReactivoModal from "../../components/inventario/EditReactivoModal";
import RegistrarIngresoModal from "../../components/inventario/RegistrarIngresoModal";
import RegistrarConsumoModal from "../../components/inventario/RegistrarConsumoModal";

export default function ReactivosList() {
  const [reactivos, setReactivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [showNuevoModal, setShowNuevoModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showIngresoModal, setShowIngresoModal] = useState(false);
  const [reactivoSeleccionado, setReactivoSeleccionado] = useState(null);
  const [showConsumoModal, setShowConsumoModal] = useState(false);

  useEffect(() => {
    loadReactivos();
  }, []);

  const loadReactivos = async () => {
    try {
      const response = await reactivoService.getAll();
      setReactivos(response.data);
    } catch (error) {
      // Error cargando reactivos
    } finally {
      setLoading(false);
    }
  };

  const filteredReactivos = reactivos
    .filter((r) => (categoriaFiltro ? r.categoria === categoriaFiltro : true))
    .filter(
      (r) =>
        r.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.codigo.toLowerCase().includes(searchTerm.toLowerCase()),
    );

  const stockBajo = reactivos.filter(
    (r) => r.stockActual <= r.stockMinimo && r.stockMinimo > 0,
  );
  const totalReactivos = reactivos.length;
  const totalConsumo = reactivos.reduce(
    (acc, r) => acc + (r._count?.movimientos || 0),
    0,
  );
  const stockPromedio = Math.round(
    reactivos.reduce((acc, r) => acc + r.stockActual, 0) /
      (reactivos.length || 1),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div
            className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: "#009933", borderTopColor: "#FFCC33" }}
          ></div>
          <p
            className="text-sm"
            style={{ color: "#666666", fontFamily: "'Montserrat', sans-serif" }}
          >
            Cargando inventario...
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
            <FlaskConical className="w-7 h-7" style={{ color: "#009933" }} />
          </div>
          <div>
            <h1
              className="text-2xl font-bold"
              style={{
                color: "#009933",
                fontFamily: "'Trajan Pro Bold', serif",
              }}
            >
              Inventario de Reactivos
            </h1>
            <p
              className="text-sm mt-0.5"
              style={{
                color: "#666666",
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              Control y trazabilidad de reactivos del laboratorio
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowConsumoModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all hover:shadow-md"
            style={{
              borderColor: "#DC262640",
              color: "#DC2626",
              backgroundColor: "#FFFFFF",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#FEF2F2";
              e.currentTarget.style.borderColor = "#DC2626";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#FFFFFF";
              e.currentTarget.style.borderColor = "#DC262640";
            }}
          >
            <TrendingDown className="w-4 h-4" />
            Registrar Consumo
          </button>
          <button
            onClick={() => {
              setReactivoSeleccionado(null);
              setShowIngresoModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all hover:shadow-md"
            style={{
              borderColor: "#00993340",
              color: "#009933",
              backgroundColor: "#FFFFFF",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#E8F5E9";
              e.currentTarget.style.borderColor = "#009933";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#FFFFFF";
              e.currentTarget.style.borderColor = "#00993340";
            }}
          >
            <TrendingUp className="w-4 h-4" />
            Registrar Ingreso
          </button>
          <button
            onClick={() => setShowNuevoModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:shadow-md"
            style={{ backgroundColor: "#009933" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#00802b";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#009933";
            }}
          >
            <Plus className="w-4 h-4" />
            Nuevo Reactivo
          </button>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div
          className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-all duration-200"
          style={{ borderColor: "#E5E5E5" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#E8F5E9" }}
            >
              <Package className="w-5 h-5" style={{ color: "#009933" }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: "#666666" }}>
                Total reactivos
              </p>
              <p className="text-2xl font-bold" style={{ color: "#009933" }}>
                {totalReactivos}
              </p>
            </div>
          </div>
        </div>

        <div
          className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-all duration-200"
          style={{ borderColor: "#E5E5E5" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#E8F5E9" }}
            >
              <Box className="w-5 h-5" style={{ color: "#009933" }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: "#666666" }}>
                Stock promedio
              </p>
              <p className="text-2xl font-bold" style={{ color: "#009933" }}>
                {stockPromedio}
              </p>
            </div>
          </div>
        </div>

        <div
          className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-all duration-200"
          style={{ borderColor: "#E5E5E5" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#FFF9E8" }}
            >
              <TrendingDown className="w-5 h-5" style={{ color: "#FFCC33" }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: "#666666" }}>
                Movimientos
              </p>
              <p className="text-2xl font-bold" style={{ color: "#FFCC33" }}>
                {totalConsumo}
              </p>
            </div>
          </div>
        </div>

        <div
          className="bg-white rounded-xl border p-4 shadow-sm transition-all duration-200"
          style={{ borderColor: stockBajo.length > 0 ? "#FEE2E2" : "#E5E5E5" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: stockBajo.length > 0 ? "#FEF2F2" : "#F5F5F5",
              }}
            >
              <AlertTriangle
                className="w-5 h-5"
                style={{ color: stockBajo.length > 0 ? "#DC2626" : "#CCCCCC" }}
              />
            </div>
            <div>
              <p className="text-xs" style={{ color: "#666666" }}>
                Stock bajo mínimo
              </p>
              <p
                className="text-2xl font-bold"
                style={{ color: stockBajo.length > 0 ? "#DC2626" : "#009933" }}
              >
                {stockBajo.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerta stock bajo */}
      {stockBajo.length > 0 && (
        <div
          className="rounded-xl p-4 border flex items-start gap-3 animate-in fade-in slide-in-from-top-2"
          style={{ backgroundColor: "#FEF2F2", borderColor: "#FEE2E2" }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "#DC262620" }}
          >
            <AlertTriangle className="w-4 h-4" style={{ color: "#DC2626" }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold" style={{ color: "#DC2626" }}>
              {stockBajo.length} reactivo(s) con stock bajo mínimo
            </p>
            <p className="text-sm mt-1" style={{ color: "#666666" }}>
              {stockBajo
                .map(
                  (r) => `${r.nombre} (${r.stockActual} ${UNIDADES[r.unidad]})`,
                )
                .join(" · ")}
            </p>
          </div>
        </div>
      )}

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
            <input
              placeholder="Buscar por nombre o código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border rounded-xl focus:outline-none text-sm transition-all"
              style={{
                borderColor: "#E5E5E5",
                color: "#333333",
                fontFamily: "'Montserrat', sans-serif",
              }}
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
          <div className="relative sm:w-64">
            <Filter
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "#666666" }}
            />
            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 border rounded-xl text-sm focus:outline-none appearance-none cursor-pointer transition-all"
              style={{
                borderColor: "#E5E5E5",
                color: "#333333",
                fontFamily: "'Montserrat', sans-serif",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#009933")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E5E5")}
            >
              <option value="">Todas las categorías</option>
              {Object.entries(CATEGORIAS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: "#666666" }}
            />
          </div>
        </div>
      </div>

      {/* Tabla de reactivos */}
      {filteredReactivos.length === 0 ? (
        <div
          className="bg-white rounded-2xl border p-12 text-center shadow-sm"
          style={{ borderColor: "#E5E5E5" }}
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "#F5F5F5" }}
          >
            <FlaskConical className="w-10 h-10" style={{ color: "#CCCCCC" }} />
          </div>
          <h3
            className="text-lg font-medium mb-2"
            style={{ color: "#333333", fontFamily: "'Montserrat', sans-serif" }}
          >
            {searchTerm || categoriaFiltro
              ? "No se encontraron reactivos"
              : "No hay reactivos registrados"}
          </h3>
          <p className="text-sm" style={{ color: "#666666" }}>
            {searchTerm || categoriaFiltro
              ? "Intenta con otros términos o filtros"
              : "Comienza agregando el primer reactivo"}
          </p>
        </div>
      ) : (
        <div
          className="bg-white rounded-2xl border shadow-sm overflow-hidden"
          style={{ borderColor: "#E5E5E5" }}
        >
          {/* Vista Desktop: Tabla */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead
                className="border-b"
                style={{ backgroundColor: "#F9F9F9", borderColor: "#E5E5E5" }}
              >
                <tr>
                  <th
                    className="px-6 py-4 text-left font-medium"
                    style={{ color: "#666666" }}
                  >
                    Reactivo
                  </th>
                  <th
                    className="px-6 py-4 text-left font-medium"
                    style={{ color: "#666666" }}
                  >
                    Categoría
                  </th>
                  <th
                    className="px-6 py-4 text-right font-medium"
                    style={{ color: "#666666" }}
                  >
                    Stock actual
                  </th>
                  <th
                    className="px-6 py-4 text-right font-medium"
                    style={{ color: "#666666" }}
                  >
                    Stock mínimo
                  </th>
                  <th
                    className="px-6 py-4 text-center font-medium"
                    style={{ color: "#666666" }}
                  >
                    Estado
                  </th>
                  <th
                    className="px-6 py-4 text-center font-medium"
                    style={{ color: "#666666" }}
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "#E5E5E5" }}>
                {filteredReactivos.map((reactivo) => {
                  const stockBajoItem =
                    reactivo.stockActual <= reactivo.stockMinimo &&
                    reactivo.stockMinimo > 0;
                  return (
                    <tr
                      key={reactivo.id}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div
                          className="font-medium"
                          style={{ color: "#009933" }}
                        >
                          {reactivo.nombre}
                        </div>
                        <div
                          className="text-xs font-mono"
                          style={{ color: "#666666" }}
                        >
                          {reactivo.codigo}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="text-xs px-2.5 py-1 rounded-full"
                          style={{
                            backgroundColor: "#E8F5E9",
                            color: "#009933",
                          }}
                        >
                          {CATEGORIAS[reactivo.categoria]}
                        </span>
                      </td>
                      <td
                        className="px-6 py-4 text-right font-mono font-medium"
                        style={{ color: stockBajoItem ? "#DC2626" : "#009933" }}
                      >
                        {reactivo.stockActual}{" "}
                        <span className="text-xs" style={{ color: "#666666" }}>
                          {UNIDADES[reactivo.unidad]}
                        </span>
                      </td>
                      <td
                        className="px-6 py-4 text-right font-mono"
                        style={{ color: "#666666" }}
                      >
                        {reactivo.stockMinimo}{" "}
                        <span className="text-xs">
                          {UNIDADES[reactivo.unidad]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {stockBajoItem ? (
                          <span
                            className="text-xs px-2.5 py-1 rounded-full font-medium"
                            style={{
                              backgroundColor: "#FEF2F2",
                              color: "#DC2626",
                            }}
                          >
                            <AlertTriangle className="w-3 h-3 inline mr-1" />
                            Stock bajo
                          </span>
                        ) : (
                          <span
                            className="text-xs px-2.5 py-1 rounded-full font-medium"
                            style={{
                              backgroundColor: "#E8F5E9",
                              color: "#009933",
                            }}
                          >
                            <CheckCircle className="w-3 h-3 inline mr-1" />
                            Normal
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => {
                              setReactivoSeleccionado(reactivo);
                              setShowEditModal(true);
                            }}
                            className="p-2 rounded-lg transition-all opacity-70 hover:opacity-100"
                            style={{ color: "#666666" }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#E8F5E9";
                              e.currentTarget.style.color = "#009933";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor =
                                "transparent";
                              e.currentTarget.style.color = "#666666";
                            }}
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setReactivoSeleccionado(reactivo);
                              setShowIngresoModal(true);
                            }}
                            className="p-2 rounded-lg transition-all opacity-70 hover:opacity-100"
                            style={{ color: "#666666" }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#E8F5E9";
                              e.currentTarget.style.color = "#009933";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor =
                                "transparent";
                              e.currentTarget.style.color = "#666666";
                            }}
                            title="Registrar ingreso"
                          >
                            <TrendingUp className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Vista Móvil: Tarjetas */}
          <div
            className="lg:hidden divide-y"
            style={{ borderColor: "#E5E5E5" }}
          >
            {filteredReactivos.map((reactivo) => {
              const stockBajoItem =
                reactivo.stockActual <= reactivo.stockMinimo &&
                reactivo.stockMinimo > 0;
              return (
                <div
                  key={reactivo.id}
                  className="p-4 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3
                        className="font-semibold"
                        style={{ color: "#009933" }}
                      >
                        {reactivo.nombre}
                      </h3>
                      <p
                        className="text-xs font-mono mt-0.5"
                        style={{ color: "#666666" }}
                      >
                        {reactivo.codigo}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setReactivoSeleccionado(reactivo);
                          setShowEditModal(true);
                        }}
                        className="p-2 rounded-lg transition-colors"
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
                      <button
                        onClick={() => {
                          setReactivoSeleccionado(reactivo);
                          setShowIngresoModal(true);
                        }}
                        className="p-2 rounded-lg transition-colors"
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
                        <TrendingUp className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <p className="text-xs" style={{ color: "#666666" }}>
                        Categoría
                      </p>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full inline-block mt-1"
                        style={{ backgroundColor: "#E8F5E9", color: "#009933" }}
                      >
                        {CATEGORIAS[reactivo.categoria]}
                      </span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <p className="text-xs" style={{ color: "#666666" }}>
                        Estado
                      </p>
                      {stockBajoItem ? (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full inline-block mt-1"
                          style={{
                            backgroundColor: "#FEF2F2",
                            color: "#DC2626",
                          }}
                        >
                          <AlertTriangle className="w-3 h-3 inline mr-1" />
                          Stock bajo
                        </span>
                      ) : (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full inline-block mt-1"
                          style={{
                            backgroundColor: "#E8F5E9",
                            color: "#009933",
                          }}
                        >
                          <CheckCircle className="w-3 h-3 inline mr-1" />
                          Normal
                        </span>
                      )}
                    </div>
                  </div>

                  <div
                    className="flex justify-between items-center pt-2 border-t"
                    style={{ borderColor: "#E5E5E5" }}
                  >
                    <div>
                      <p className="text-xs" style={{ color: "#666666" }}>
                        Stock actual
                      </p>
                      <p
                        className="font-mono font-medium"
                        style={{ color: stockBajoItem ? "#DC2626" : "#009933" }}
                      >
                        {reactivo.stockActual}{" "}
                        <span className="text-xs">
                          {UNIDADES[reactivo.unidad]}
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs" style={{ color: "#666666" }}>
                        Stock mínimo
                      </p>
                      <p className="font-mono" style={{ color: "#666666" }}>
                        {reactivo.stockMinimo}{" "}
                        <span className="text-xs">
                          {UNIDADES[reactivo.unidad]}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer con totales */}
          <div
            className="border-t px-6 py-3 flex justify-between items-center text-sm"
            style={{ backgroundColor: "#F9F9F9", borderColor: "#E5E5E5" }}
          >
            <span style={{ color: "#666666" }}>
              Mostrando {filteredReactivos.length} de {reactivos.length}{" "}
              reactivos
            </span>
            <span className="font-medium" style={{ color: "#009933" }}>
              Total unidades:{" "}
              {reactivos.reduce((acc, r) => acc + r.stockActual, 0)}
            </span>
          </div>
        </div>
      )}

      {/* Modales */}
      <NuevoReactivoModal
        isOpen={showNuevoModal}
        onClose={() => setShowNuevoModal(false)}
        onSaved={loadReactivos}
      />
      <EditReactivoModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        reactivo={reactivoSeleccionado}
        onSaved={loadReactivos}
      />
      <RegistrarIngresoModal
        isOpen={showIngresoModal}
        onClose={() => setShowIngresoModal(false)}
        reactivo={reactivoSeleccionado}
        onSaved={loadReactivos}
      />
      <RegistrarConsumoModal
        isOpen={showConsumoModal}
        onClose={() => setShowConsumoModal(false)}
        analysis={null}
        onSaved={loadReactivos}
      />
    </div>
  );
}
