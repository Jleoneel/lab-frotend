import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, Beaker, Edit, Trash2, DollarSign, Users,
  ToggleLeft, ToggleRight, Search, XCircle, CheckCircle,
} from 'lucide-react';
import { serviceService } from '../../services/serviceService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import EditServiceModal from '../../components/services/EditServiceModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import EmptyState from '../../components/common/EmptyState';
import IconButton from '../../components/common/IconButton';
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal';

export default function ServicesList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [showInactive, setShowInactive] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => { loadServices(); }, []);

  const loadServices = async () => {
    try {
      const response = await serviceService.getAll();
      setServices(response.data);
    } catch {
      // silently handled
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
    } catch {
      // silently handled
    }
  };

  const handleToggleActive = async (service) => {
    try {
      await serviceService.update(service.id, { ...service, isActive: !service.isActive });
      setServices(services.map((s) => s.id === service.id ? { ...s, isActive: !s.isActive } : s));
    } catch {
      // silently handled
    }
  };

  const filteredServices = services
    .filter((s) => showInactive || s.isActive)
    .filter(
      (s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.code.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      if (sortBy === 'priceExternal' || sortBy === 'priceStudent') {
        aVal = parseFloat(aVal) || 0;
        bVal = parseFloat(bVal) || 0;
      }
      return (aVal > bVal ? 1 : -1) * (sortDirection === 'asc' ? 1 : -1);
    });

  const avgPrice = services.reduce((a, s) => a + (parseFloat(s.priceExternal) || 0), 0) / (services.length || 1);

  if (loading) return <LoadingSpinner message="Cargando servicios..." />;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader
        icon={Beaker}
        title="Servicios de Análisis"
        subtitle="Catálogo de servicios disponibles"
      >
        <Link to="/services/new">
          <Button className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Servicio
          </Button>
        </Link>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Beaker}       label="Total"      value={services.length}                                variant="green" />
        <StatCard icon={CheckCircle}  label="Activos"    value={services.filter(s => s.isActive).length}        variant="green" />
        <StatCard icon={XCircle}      label="Inactivos"  value={services.filter(s => !s.isActive).length}       variant="gray"  />
        <StatCard icon={DollarSign}   label="Precio prom." value={`$${avgPrice.toLocaleString('es-CL')}`}       variant="gold"  />
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border p-4 shadow-sm" style={{ borderColor: '#E5E5E5' }}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#666666' }} />
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
                color: showInactive ? '#009933' : '#666666',
              }}
            >
              {showInactive ? <ToggleRight className="w-5 h-5 mr-2" /> : <ToggleLeft className="w-5 h-5 mr-2" />}
              <span className="hidden sm:inline">
                {showInactive ? 'Ocultar inactivos' : 'Mostrar inactivos'}
              </span>
            </button>
            <select
              value={`${sortBy}-${sortDirection}`}
              onChange={(e) => {
                const [field, dir] = e.target.value.split('-');
                setSortBy(field);
                setSortDirection(dir);
              }}
              className="px-3 py-2 border rounded-xl bg-white text-sm focus:outline-none"
              style={{ borderColor: '#E5E5E5', color: '#333333' }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#009933')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#E5E5E5')}
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

      {filteredServices.length === 0 ? (
        <EmptyState
          icon={Beaker}
          title={searchTerm || showInactive ? 'No se encontraron servicios' : 'No hay servicios registrados'}
          description={
            searchTerm || showInactive
              ? 'Intenta con otros términos de búsqueda o filtros'
              : 'Comienza agregando tu primer servicio de análisis'
          }
          action={
            !searchTerm && !showInactive && (
              <Link to="/services/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Servicio
                </Button>
              </Link>
            )
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onEdit={() => { setServiceToEdit(service); setShowEditModal(true); }}
              onDelete={() => { setServiceToDelete(service); setShowDeleteModal(true); }}
              onToggle={() => handleToggleActive(service)}
            />
          ))}
        </div>
      )}

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        description={
          <>
            ¿Estás seguro que deseas eliminar el servicio{' '}
            <span className="font-semibold" style={{ color: '#DC2626' }}>
              "{serviceToDelete?.name}"
            </span>
            ?
          </>
        }
        detail={serviceToDelete?.code ? `Código: ${serviceToDelete.code}` : undefined}
        confirmLabel="Eliminar Servicio"
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

function ServiceCard({ service, onEdit, onDelete, onToggle }) {
  return (
    <div
      className={`group relative bg-white rounded-2xl border p-6 hover:shadow-lg transition-all duration-200 ${!service.isActive ? 'opacity-75' : ''}`}
      style={{ borderColor: '#E5E5E5' }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#009933')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#E5E5E5')}
    >
      {!service.isActive && (
        <div className="absolute top-4 right-4">
          <Badge variant="utm_gray">Inactivo</Badge>
        </div>
      )}
      <div className="absolute bottom-4 right-4 opacity-5">
        <Beaker className="w-24 h-24" style={{ color: '#009933' }} />
      </div>

      <div className="relative">
        <div className="mb-3">
          <h3 className="text-lg font-semibold" style={{ color: '#009933' }}>{service.name}</h3>
          <p
            className="text-sm font-mono px-2 py-1 rounded-lg inline-block mt-1"
            style={{ backgroundColor: '#F9F9F9', color: '#666666' }}
          >
            {service.code}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="rounded-xl p-3 text-center" style={{ backgroundColor: '#E8F5E9' }}>
            <div className="flex items-center justify-center gap-1 mb-1" style={{ color: '#009933' }}>
              <DollarSign className="w-4 h-4" />
              <span className="text-xs font-medium">Externo</span>
            </div>
            <p className="text-lg font-bold" style={{ color: '#009933' }}>
              ${parseFloat(service.priceExternal).toLocaleString('es-CL')}
            </p>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ backgroundColor: '#FFF9E8' }}>
            <div className="flex items-center justify-center gap-1 mb-1" style={{ color: '#FFCC33' }}>
              <Users className="w-4 h-4" />
              <span className="text-xs font-medium">Estudiante</span>
            </div>
            <p className="text-lg font-bold" style={{ color: '#FFCC33' }}>
              ${parseFloat(service.priceStudent).toLocaleString('es-CL')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-4 border-t" style={{ borderColor: '#E5E5E5' }}>
          <div className="text-center">
            <p className="text-xs" style={{ color: '#666666' }}>En cotizaciones</p>
            <p className="text-sm font-semibold" style={{ color: '#009933' }}>
              {service._count?.quoteItems ?? 0}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs" style={{ color: '#666666' }}>En análisis</p>
            <p className="text-sm font-semibold" style={{ color: '#FFCC33' }}>
              {service._count?.sampleServices ?? 0}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-1 mt-4 pt-3 border-t" style={{ borderColor: '#E5E5E5' }}>
          <button
            onClick={onToggle}
            className="p-2 rounded-lg transition-colors"
            style={{ color: service.isActive ? '#009933' : '#666666' }}
            title={service.isActive ? 'Desactivar' : 'Activar'}
          >
            {service.isActive
              ? <ToggleRight className="w-5 h-5" />
              : <ToggleLeft className="w-5 h-5" />}
          </button>
          <IconButton icon={Edit}   onClick={onEdit}   title="Editar"   variant="green" size="lg" />
          <IconButton icon={Trash2} onClick={onDelete} title="Eliminar" variant="red"   size="lg" />
        </div>
      </div>
    </div>
  );
}
