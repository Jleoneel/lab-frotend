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

// Componente Modal de confirmación con colores UTM
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, service }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in">
          {/* Header con color rojo UTM */}
          <div className="px-6 py-4" style={{ backgroundColor: '#DC2626' }}>
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
            <div className="rounded-xl p-4 mb-6" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FEE2E2' }}>
              <p className="text-gray-700">
                ¿Estás seguro que deseas eliminar el servicio{" "}
                <span className="font-semibold" style={{ color: '#DC2626' }}>"{service?.name}"</span>?
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

  const totalServices = services.length;
  const activeServices = services.filter(s => s.isActive).length;
  const inactiveServices = services.filter(s => !s.isActive).length;
  const avgPriceExternal = services.reduce((acc, s) => acc + (parseFloat(s.priceExternal) || 0), 0) / (services.length || 1);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: '#009933', borderTopColor: '#FFCC33' }}></div>
          <p className="text-sm" style={{ color: '#666666', fontFamily: "'Montserrat', sans-serif" }}>Cargando servicios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header con título y botón nuevo servicio */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E8F5E9' }}>
            <Beaker className="w-5 h-5" style={{ color: '#009933' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#009933', fontFamily: "'Trajan Pro Bold', serif" }}>
              Servicios de Análisis
            </h1>
            <p className="text-sm" style={{ color: '#666666', fontFamily: "'Montserrat', sans-serif" }}>
              Catálogo de servicios disponibles
            </p>
          </div>
        </div>

        <Link to="/services/new">
          <Button className="w-full sm:w-auto" style={{ backgroundColor: '#009933' }}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Servicio
          </Button>
        </Link>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-4 shadow-sm" style={{ borderColor: '#E5E5E5' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E8F5E9' }}>
              <Beaker className="w-5 h-5" style={{ color: '#009933' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: '#666666' }}>Total</p>
              <p className="text-xl font-bold" style={{ color: '#009933' }}>{totalServices}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4 shadow-sm" style={{ borderColor: '#E5E5E5' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E8F5E9' }}>
              <CheckCircle className="w-5 h-5" style={{ color: '#009933' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: '#666666' }}>Activos</p>
              <p className="text-xl font-bold" style={{ color: '#009933' }}>{activeServices}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4 shadow-sm" style={{ borderColor: '#E5E5E5' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F9F9F9' }}>
              <XCircle className="w-5 h-5" style={{ color: '#666666' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: '#666666' }}>Inactivos</p>
              <p className="text-xl font-bold" style={{ color: '#666666' }}>{inactiveServices}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4 shadow-sm" style={{ borderColor: '#E5E5E5' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FFF9E8' }}>
              <DollarSign className="w-5 h-5" style={{ color: '#FFCC33' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: '#666666' }}>Precio prom.</p>
              <p className="text-xl font-bold" style={{ color: '#FFCC33' }}>
                ${avgPriceExternal.toLocaleString("es-CL")}
              </p>
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
              placeholder="Buscar por código o nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowInactive(!showInactive)}
              className="flex items-center px-4 py-2 rounded-xl border transition-all"
              style={{
                backgroundColor: showInactive ? '#E8F5E9' : '#FFFFFF',
                borderColor: showInactive ? '#009933' : '#E5E5E5',
                color: showInactive ? '#009933' : '#666666'
              }}
              onMouseEnter={(e) => {
                if (!showInactive) {
                  e.currentTarget.style.backgroundColor = '#F5F5F5';
                  e.currentTarget.style.borderColor = '#009933';
                  e.currentTarget.style.color = '#009933';
                }
              }}
              onMouseLeave={(e) => {
                if (!showInactive) {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.borderColor = '#E5E5E5';
                  e.currentTarget.style.color = '#666666';
                }
              }}
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
              className="px-3 py-2 border rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-offset-0"
              style={{ borderColor: '#E5E5E5', color: '#333333', fontFamily: "'Montserrat', sans-serif" }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#009933'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#E5E5E5'}
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

        {searchTerm && (
          <p className="text-sm mt-3" style={{ color: '#666666' }}>
            {filteredServices.length} resultado(s) para "{searchTerm}"
          </p>
        )}
      </div>

      {/* Lista de servicios */}
      {filteredServices.length === 0 ? (
        <div className="bg-white rounded-2xl border p-12 text-center shadow-sm" style={{ borderColor: '#E5E5E5' }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#F5F5F5' }}>
            <Beaker className="w-10 h-10" style={{ color: '#CCCCCC' }} />
          </div>
          <h3 className="text-lg font-medium mb-2" style={{ color: '#333333' }}>
            {searchTerm || showInactive ? "No se encontraron servicios" : "No hay servicios registrados"}
          </h3>
          <p className="text-sm mb-4" style={{ color: '#666666' }}>
            {searchTerm || showInactive
              ? "Intenta con otros términos de búsqueda o filtros"
              : "Comienza agregando tu primer servicio de análisis"}
          </p>
          {!searchTerm && !showInactive && (
            <Link to="/services/new">
              <Button style={{ backgroundColor: '#009933' }}>
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
                group relative bg-white rounded-2xl border p-6 
                hover:shadow-lg transition-all duration-200
                ${!service.isActive ? "opacity-75 bg-gray-50/50" : ""}
              `}
              style={{ borderColor: '#E5E5E5' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#009933'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#E5E5E5'}
            >
              {/* Badge de estado flotante */}
              <div className="absolute top-4 right-4">
                {!service.isActive && (
                  <Badge variant="utm_gray">Inactivo</Badge>
                )}
              </div>

              {/* Icono decorativo de fondo */}
              <div className="absolute bottom-4 right-4 opacity-5">
                <Beaker className="w-24 h-24" style={{ color: '#009933' }} />
              </div>

              <div className="relative">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold" style={{ color: '#009933' }}>
                        {service.name}
                      </h3>
                    </div>
                    <p className="text-sm font-mono px-2 py-1 rounded-lg inline-block" style={{ backgroundColor: '#F9F9F9', color: '#666666' }}>
                      {service.code}
                    </p>
                  </div>
                </div>

                {/* Precios en formato de tarjetas */}
                <div className="grid grid-cols-2 gap-2 mt-4 mb-4">
                  <div className="rounded-xl p-3 text-center" style={{ backgroundColor: '#E8F5E9' }}>
                    <div className="flex items-center justify-center gap-1 mb-1" style={{ color: '#009933' }}>
                      <DollarSign className="w-4 h-4" />
                      <span className="text-xs font-medium">Externo</span>
                    </div>
                    <p className="text-lg font-bold" style={{ color: '#009933' }}>
                      ${parseFloat(service.priceExternal).toLocaleString("es-CL")}
                    </p>
                  </div>
                  
                  <div className="rounded-xl p-3 text-center" style={{ backgroundColor: '#FFF9E8' }}>
                    <div className="flex items-center justify-center gap-1 mb-1" style={{ color: '#FFCC33' }}>
                      <Users className="w-4 h-4" />
                      <span className="text-xs font-medium">Estudiante</span>
                    </div>
                    <p className="text-lg font-bold" style={{ color: '#FFCC33' }}>
                      ${parseFloat(service.priceStudent).toLocaleString("es-CL")}
                    </p>
                  </div>
                </div>

                {/* Estadísticas rápidas */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t" style={{ borderColor: '#E5E5E5' }}>
                  <div className="text-center">
                    <p className="text-xs" style={{ color: '#666666' }}>En cotizaciones</p>
                    <p className="text-sm font-semibold" style={{ color: '#009933' }}>
                      {service._count?.quoteItems || 0}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs" style={{ color: '#666666' }}>En análisis</p>
                    <p className="text-sm font-semibold" style={{ color: '#FFCC33' }}>
                      {service._count?.sampleServices || 0}
                    </p>
                  </div>
                </div>

                {/* Barra de acciones */}
                <div className="flex items-center justify-end gap-1 mt-4 pt-3 border-t" style={{ borderColor: '#E5E5E5' }}>
                  <button
                    onClick={() => handleToggleActive(service)}
                    className="p-2 rounded-lg transition-colors"
                    style={{ color: service.isActive ? '#009933' : '#666666' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = service.isActive ? '#E8F5E9' : '#F5F5F5';
                      e.currentTarget.style.color = service.isActive ? '#00802b' : '#009933';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = service.isActive ? '#009933' : '#666666';
                    }}
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
                    className="p-2 rounded-lg transition-colors"
                    style={{ color: '#666666' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E8F5E9'; e.currentTarget.style.color = '#009933'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#666666'; }}
                    title="Editar"
                  >
                    <Edit className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => {
                      setServiceToDelete(service);
                      setShowDeleteModal(true);
                    }}
                    className="p-2 rounded-lg transition-colors"
                    style={{ color: '#666666' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FEF2F2'; e.currentTarget.style.color = '#DC2626'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#666666'; }}
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