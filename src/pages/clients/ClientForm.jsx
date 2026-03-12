// pages/clients/ClientForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  User, 
  MapPin, 
  Building2, 
  Phone, 
  Mail,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Info
} from 'lucide-react';
import { clientService } from '../../services/clientService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function ClientForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    phone: '',
    email: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isEditing) {
      loadClient();
    }
  }, [id]);

  const loadClient = async () => {
    setLoading(true);
    try {
      const response = await clientService.getById(id);
      setFormData(response.data);
    } catch (error) {
      console.error('Error cargando cliente:', error);
      navigate('/clients');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    
    try {
      if (isEditing) {
        await clientService.update(id, formData);
      } else {
        await clientService.create(formData);
      }
      
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/clients');
      }, 1500);
    } catch (error) {
      console.error('Error guardando cliente:', error);
      setErrors({
        submit: error.response?.data?.message || 'Error al guardar el cliente'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando cliente...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Notificación de éxito */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-white border border-green-200 text-green-800 px-5 py-4 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-right-4 fade-in duration-300">
          <div className="bg-green-100 rounded-full p-1">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold">¡Cliente guardado!</p>
            <p className="text-sm text-green-600">Redirigiendo a la lista...</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/clients')}
          className="flex items-center text-gray-500 hover:text-gray-700 mb-4 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Volver a clientes
        </button>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center">
            <User className="w-7 h-7 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {isEditing 
                ? 'Modifica los datos del cliente' 
                : 'Registra un nuevo cliente en el sistema'}
            </p>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8 space-y-8">
        {/* Mensaje de error general */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-800">
              <p className="font-medium">Error al guardar</p>
              <p className="text-red-600">{errors.submit}</p>
            </div>
          </div>
        )}

        {/* Grid de campos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre (ocupa toda la fila en móvil, pero en desktop es el primer campo) */}
          <div className="md:col-span-2">
            <Input
              label="Nombre *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
              icon={User}
              placeholder="Ej: Juan Pérez"
            />
          </div>

          {/* Dirección */}
          <Input
            label="Dirección"
            name="address"
            value={formData.address}
            onChange={handleChange}
            error={errors.address}
            icon={MapPin}
            placeholder="Ej: Av. Principal 123"
          />

          {/* Ciudad */}
          <Input
            label="Ciudad"
            name="city"
            value={formData.city}
            onChange={handleChange}
            error={errors.city}
            icon={Building2}
            placeholder="Ej: Quito"
          />

          {/* Teléfono */}
          <Input
            label="Teléfono"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            icon={Phone}
            placeholder="Ej: +593 987654321"
          />

          {/* Email */}
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            icon={Mail}
            placeholder="Ej: cliente@email.com"
          />
        </div>

        {/* Información adicional */}
        <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Completa los datos del cliente</p>
            <p className="text-blue-600 text-xs mt-1">
              {isEditing 
                ? 'Los campos marcados con * son obligatorios. Puedes modificar cualquier información.'
                : 'Todos los campos marcados con * son obligatorios. El email debe ser válido.'}
            </p>
          </div>
        </div>

        {/* Vista previa (solo si hay datos) */}
        {(formData.name || formData.email || formData.phone) && (
          <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-200">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
              Vista previa
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">
                  {formData.name ? formData.name.charAt(0).toUpperCase() : '?'}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-800">
                  {formData.name || 'Nombre no especificado'}
                </p>
                <p className="text-xs text-gray-500">
                  {formData.email || formData.phone || 'Sin contacto'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/clients')}
            className="order-2 sm:order-1"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="order-1 sm:order-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Guardando...
              </span>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {isEditing ? 'Actualizar Cliente' : 'Guardar Cliente'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}