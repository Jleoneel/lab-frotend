// pages/services/ServicesList.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Beaker,
  Edit,
  Trash2,
  DollarSign,
  Users,
  ToggleLeft,
  ToggleRight,
  Search,
  Filter,
  Package,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreVertical
} from "lucide-react";
import { serviceService } from "../../services/serviceService";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import EditServiceModal from "../../components/services/EditServiceModal";

// Componente Modal de confirmación mejorado
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, service }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in">
          {/* Header con color de advertencia */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-lg p-2">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Confirmar eliminación</h3>
                <p className="text-sm text-white/80">Esta acción no se puede deshacer</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6">
              <p className="text-gray-700">
                ¿Estás seguro que deseas eliminar el servicio{" "}
                <span className="font-semibold text-red-600">"{service?.name}"</span>?
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Código: <span className="font-mono">{service?.code}</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <Button
                variant="ghost"
                onClick={onClose}
                className="order-2 sm:order-1"
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={onConfirm}
                className="order-1 sm:order-2"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar Servicio
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ServicesList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [showInactive, setShowInactive] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState(null);
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await serviceService.getAll();
      setServices(response.data);
    } catch (error) {
      console.error("Error cargando servicios:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!serviceToDelete) return;

    try {
      await serviceService.delete(serviceToDelete.id);
      setServices(services.filter((s) => s.id !== serviceToDelete.id));
      setShowDeleteModal(false);
      setServiceToDelete(null);
    } catch (error) {
      console.error("Error eliminando servicio:", error);
    }
  };

  const handleToggleActive = async (service) => {
    try {
      await serviceService.update(service.id, {
        ...service,
        isActive: !service.isActive,
      });
      setServices(
        services.map((s) =>
          s.id === service.id ? { ...s, isActive: !s.isActive } : s,
        ),
      );
    } catch (error) {
      console.error("Error cambiando estado:", error);
    }
  };

  // Filtrar y ordenar servicios
  const filteredServices = services
    .filter((service) => (showInactive ? true : service.isActive))
    .filter(
      (service) =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.code.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === 'priceExternal' || sortBy === 'priceStudent') {
        aVal = parseFloat(aVal) || 0;
        bVal = parseFloat(bVal) || 0;
      }
      
      const direction = sortDirection === 'asc' ? 1 : -1;
      return (aVal > bVal ? 1 : -1) * direction;
    });

  // Estadísticas
  const totalServices = services.length;
  const activeServices = services.filter(s => s.isActive).length;
  const inactiveServices = services.filter(s => !s.isActive).length;
  const avgPriceExternal = services.reduce((acc, s) => acc + (parseFloat(s.priceExternal) || 0), 0) / (services.length || 1);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando servicios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header con título y botón nuevo servicio */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
            <Beaker className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Servicios de Análisis
            </h1>
            <p className="text-sm text-gray-500">Catálogo de servicios disponibles</p>
          </div>
        </div>

        <Link to="/services/new">
          <Button className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Servicio
          </Button>
        </Link>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Beaker className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-xl font-bold text-gray-800">{totalServices}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Activos</p>
              <p className="text-xl font-bold text-gray-800">{activeServices}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Inactivos</p>
              <p className="text-xl font-bold text-gray-800">{inactiveServices}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Precio prom.</p>
              <p className="text-xl font-bold text-gray-800">
                ${avgPriceExternal.toLocaleString("es-CL")}
              </p>
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
              placeholder="Buscar por código o nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowInactive(!showInactive)}
              className={`flex items-center px-4 py-2 rounded-xl border transition-all ${
                showInactive
                  ? "bg-purple-50 border-purple-200 text-purple-700"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {showInactive ? (
                <ToggleRight className="w-5 h-5 mr-2" />
              ) : (
                <ToggleLeft className="w-5 h-5 mr-2" />
              )}
              <span className="hidden sm:inline">
                {showInactive ? "Ocultar inactivos" : "Mostrar inactivos"}
              </span>
            </button>

            <select
              value={`${sortBy}-${sortDirection}`}
              onChange={(e) => {
                const [field, direction] = e.target.value.split('-');
                setSortBy(field);
                setSortDirection(direction);
              }}
              className="px-3 py-2 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="name-asc">Nombre (A-Z)</option>
              <option value="name-desc">Nombre (Z-A)</option>
              <option value="code-asc">Código (A-Z)</option>
              <option value="code-desc">Código (Z-A)</option>
              <option value="priceExternal-asc">Precio (menor a mayor)</option>
              <option value="priceExternal-desc">Precio (mayor a menor)</option>
            </select>
          </div>
        </div>

        {/* Resultados de búsqueda */}
        {searchTerm && (
          <p className="text-sm text-gray-500 mt-3">
            {filteredServices.length} resultado(s) para "{searchTerm}"
          </p>
        )}
      </div>

      {/* Lista de servicios */}
      {filteredServices.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Beaker className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || showInactive
              ? "No se encontraron servicios"
              : "No hay servicios registrados"}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || showInactive
              ? "Intenta con otros términos de búsqueda o filtros"
              : "Comienza agregando tu primer servicio de análisis"}
          </p>
          {!searchTerm && !showInactive && (
            <Link to="/services/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Agregar Servicio
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className={`
                group relative bg-white rounded-2xl border border-gray-100 p-6 
                hover:shadow-lg transition-all duration-200
                ${!service.isActive ? "opacity-75 bg-gray-50/50" : ""}
              `}
            >
              {/* Badge de estado flotante */}
              <div className="absolute top-4 right-4">
                {!service.isActive && (
                  <Badge className="bg-gray-200 text-gray-700 border-gray-300">
                    Inactivo
                  </Badge>
                )}
              </div>

              {/* Icono decorativo de fondo */}
              <div className="absolute bottom-4 right-4 opacity-5">
                <Beaker className="w-24 h-24 text-purple-600" />
              </div>

              <div className="relative">
                {/* Header con código y acciones */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {service.name}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded-lg inline-block">
                      {service.code}
                    </p>
                  </div>
                </div>

                {/* Precios en formato de tarjetas */}
                <div className="grid grid-cols-2 gap-2 mt-4 mb-4">
                  <div className="bg-blue-50 rounded-xl p-3 text-center">
                    <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-xs font-medium">Externo</span>
                    </div>
                    <p className="text-lg font-bold text-blue-700">
                      ${parseFloat(service.priceExternal).toLocaleString("es-CL")}
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 rounded-xl p-3 text-center">
                    <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                      <Users className="w-4 h-4" />
                      <span className="text-xs font-medium">Estudiante</span>
                    </div>
                    <p className="text-lg font-bold text-purple-700">
                      ${parseFloat(service.priceStudent).toLocaleString("es-CL")}
                    </p>
                  </div>
                </div>

                {/* Estadísticas rápidas */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">En cotizaciones</p>
                    <p className="text-sm font-semibold text-gray-700">
                      {service._count?.quoteItems || 0}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">En análisis</p>
                    <p className="text-sm font-semibold text-gray-700">
                      {service._count?.sampleServices || 0}
                    </p>
                  </div>
                </div>

                {/* Barra de acciones */}
                <div className="flex items-center justify-end gap-1 mt-4 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleToggleActive(service)}
                    className={`p-2 rounded-lg transition-colors ${
                      service.isActive
                        ? "text-green-600 hover:bg-green-50"
                        : "text-gray-400 hover:bg-gray-100"
                    }`}
                    title={service.isActive ? "Desactivar" : "Activar"}
                  >
                    {service.isActive ? (
                      <ToggleRight className="w-5 h-5" />
                    ) : (
                      <ToggleLeft className="w-5 h-5" />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setServiceToEdit(service);
                      setShowEditModal(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => {
                      setServiceToDelete(service);
                      setShowDeleteModal(true);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modales */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        service={serviceToDelete}
      />

      <EditServiceModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        service={serviceToEdit}
        onSaved={loadServices}
      />
    </div>
  );
}