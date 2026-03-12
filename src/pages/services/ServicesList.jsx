// pages/services/ServicesList.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Beaker, Edit, Trash2, DollarSign, Users, ToggleLeft, ToggleRight } from 'lucide-react';
import { serviceService } from '../../services/serviceService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';

export default function ServicesList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [showInactive, setShowInactive] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await serviceService.getAll();
      setServices(response.data);
    } catch (error) {
      console.error('Error cargando servicios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!serviceToDelete) return;
    
    try {
      await serviceService.delete(serviceToDelete.id);
      setServices(services.filter(s => s.id !== serviceToDelete.id));
      setShowDeleteModal(false);
      setServiceToDelete(null);
    } catch (error) {
      console.error('Error eliminando servicio:', error);
    }
  };

  const handleToggleActive = async (service) => {
    try {
      await serviceService.update(service.id, {
        ...service,
        isActive: !service.isActive
      });
      // Actualizar lista
      setServices(services.map(s => 
        s.id === service.id ? { ...s, isActive: !s.isActive } : s
      ));
    } catch (error) {
      console.error('Error cambiando estado:', error);
    }
  };

  // Filtrar servicios
  const filteredServices = services
    .filter(service => showInactive ? true : service.isActive)
    .filter(service => 
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (loading) {
    return <div className="flex justify-center p-8">Cargando...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Servicios de Análisis</h1>
        <Link to="/services/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Servicio
          </Button>
        </Link>
      </div>

      {/* Filtros y búsqueda */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Buscar por código o nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        
        <button
          onClick={() => setShowInactive(!showInactive)}
          className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
            showInactive 
              ? 'bg-blue-50 border-blue-300 text-blue-700' 
              : 'bg-white border-gray-300 text-gray-700'
          }`}
        >
          {showInactive ? (
            <ToggleRight className="w-5 h-5 mr-2" />
          ) : (
            <ToggleLeft className="w-5 h-5 mr-2" />
          )}
          Mostrar inactivos
        </button>
      </div>

      {/* Lista de servicios */}
      {filteredServices.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Beaker className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No se encontraron servicios' : 'No hay servicios registrados'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm 
              ? 'Intenta con otros términos de búsqueda' 
              : 'Comienza agregando tu primer servicio de análisis'}
          </p>
          {!searchTerm && (
            <Link to="/services/new">
              <Button>Agregar Servicio</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className={`bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow ${
                !service.isActive ? 'opacity-75 bg-gray-50' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {service.name}
                    </h3>
                    {!service.isActive && (
                      <Badge className="bg-gray-200 text-gray-700">
                        Inactivo
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 font-mono">
                    {service.code}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleActive(service)}
                    className={`p-2 rounded-lg transition-colors ${
                      service.isActive 
                        ? 'text-green-600 hover:bg-green-50' 
                        : 'text-gray-400 hover:bg-gray-100'
                    }`}
                    title={service.isActive ? 'Desactivar' : 'Activar'}
                  >
                    {service.isActive ? (
                      <ToggleRight className="w-4 h-4" />
                    ) : (
                      <ToggleLeft className="w-4 h-4" />
                    )}
                  </button>
                  <Link
                    to={`/services/${service.id}`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => {
                      setServiceToDelete(service);
                      setShowDeleteModal(true);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Precios */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="w-4 h-4 mr-1" />
                    <span>Externo:</span>
                  </div>
                  <span className="font-semibold">
                    ${service.priceExternal?.toLocaleString('es-CL')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-1" />
                    <span>Estudiante:</span>
                  </div>
                  <span className="font-semibold">
                    ${service.priceStudent?.toLocaleString('es-CL')}
                  </span>
                </div>
              </div>

              {/* Estadísticas rápidas */}
              <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-2 text-center text-xs">
                <div>
                  <p className="text-gray-500">En cotizaciones</p>
                  <p className="font-semibold">{service._count?.quoteItems || 0}</p>
                </div>
                <div>
                  <p className="text-gray-500">En análisis</p>
                  <p className="font-semibold">{service._count?.sampleServices || 0}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowDeleteModal(false)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Confirmar eliminación
              </h3>
              <p className="text-gray-600 mb-6">
                ¿Estás seguro que deseas eliminar el servicio <span className="font-semibold">{serviceToDelete?.name}</span>?
                Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}