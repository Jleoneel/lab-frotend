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
import Swal from 'sweetalert2';

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
      //eslint-disable-next-line no-unused-vars
    } catch (error) {
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
        await Swal.fire({
          icon: 'success',
          title: '¡Cliente actualizado!',
          text: 'El cliente ha sido actualizado correctamente.',
          confirmButtonColor: '#009933',
          timer: 2000,
          timerProgressBar: true
        });
      } else {
        await clientService.create(formData);
        await Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          text: 'El cliente ha sido creado correctamente.',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
      }
      
      navigate('/clients');
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error al guardar cliente',
        text: error.response?.data?.message || 'Error al guardar el cliente',
        confirmButtonColor: '#dc3545'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: '#009933', borderTopColor: '#FFCC33' }}></div>
          <p className="text-sm" style={{ color: '#666666', fontFamily: "'Montserrat', sans-serif" }}>Cargando cliente...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/clients')}
          className="flex items-center mb-4 transition-colors group"
          style={{ color: '#666666' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#009933'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#666666'}
        >
          <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Volver a clientes
        </button>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E8F5E9' }}>
            <User className="w-7 h-7" style={{ color: '#009933' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#009933', fontFamily: "'Trajan Pro Bold', serif" }}>
              {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
            </h1>
            <p className="text-sm mt-1" style={{ color: '#666666', fontFamily: "'Montserrat', sans-serif" }}>
              {isEditing 
                ? 'Modifica los datos del cliente' 
                : 'Registra un nuevo cliente en el sistema'}
            </p>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border shadow-xl p-8 space-y-8" style={{ borderColor: '#E5E5E5' }}>
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
          {/* Nombre */}
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
            placeholder="Ej: Portoviejo"
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
        <div className="rounded-xl p-4 flex items-start gap-3" style={{ backgroundColor: '#E8F5E9', border: '1px solid #00993320' }}>
          <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#009933' }} />
          <div className="text-sm">
            <p className="font-medium" style={{ color: '#009933' }}>Completa los datos del cliente</p>
            <p className="text-xs mt-1" style={{ color: '#666666' }}>
              {isEditing 
                ? 'Los campos marcados con * son obligatorios. Puedes modificar cualquier información.'
                : 'Todos los campos marcados con * son obligatorios. El email debe ser válido.'}
            </p>
          </div>
        </div>

        {/* Vista previa */}
        {(formData.name || formData.email || formData.phone) && (
          <div className="rounded-xl p-4 border" style={{ backgroundColor: '#F9F9F9', borderColor: '#E5E5E5' }}>
            <p className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: '#666666' }}>
              Vista previa
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E8F5E9' }}>
                <span className="font-semibold" style={{ color: '#009933' }}>
                  {formData.name ? formData.name.charAt(0).toUpperCase() : '?'}
                </span>
              </div>
              <div>
                <p className="font-medium" style={{ color: '#333333' }}>
                  {formData.name || 'Nombre no especificado'}
                </p>
                <p className="text-xs" style={{ color: '#666666' }}>
                  {formData.email || formData.phone || 'Sin contacto'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t" style={{ borderColor: '#E5E5E5' }}>
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