// pages/services/ServiceForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Code, 
  FileText, 
  DollarSign, 
  Users, 
  Tag,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Info
} from 'lucide-react';
import { serviceService } from '../../services/serviceService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Swal from 'sweetalert2';

export default function ServiceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    priceExternal: '',
    priceStudent: '',
    description: '',
    isActive: true
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing) {
      loadService();
    }
  }, [id]);

  const loadService = async () => {
    setLoading(true);
    try {
      const response = await serviceService.getById(id);
      setFormData(response.data);
    } catch (error) {
      console.error('Error cargando servicio:', error);
      navigate('/services');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
    
    if (!formData.code.trim()) {
      newErrors.code = 'El código es obligatorio';
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }
    
    if (!formData.priceExternal || parseFloat(formData.priceExternal) <= 0) {
      newErrors.priceExternal = 'El precio externo debe ser mayor a 0';
    }
    
    if (!formData.priceStudent || parseFloat(formData.priceStudent) <= 0) {
      newErrors.priceStudent = 'El precio estudiante debe ser mayor a 0';
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
      const dataToSend = {
        ...formData,
        priceExternal: parseFloat(formData.priceExternal),
        priceStudent: parseFloat(formData.priceStudent)
      };

      if (isEditing) {
        await serviceService.update(id, dataToSend);
        await Swal.fire({
          icon: 'success',
          title: '¡Servicio actualizado!',
          text: 'El servicio ha sido actualizado correctamente.',
          confirmButtonColor: '#009933',
          timer: 1000,
          timerProgressBar: true
        });
      } else {
        await serviceService.create(dataToSend);
        await Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          icon: 'success',
          text: 'El servicio ha sido creado correctamente.',
          confirmButtonColor: '#009933',
          timer: 2000,
          timerProgressBar: true
        });
      }
      
      navigate('/services');
    } catch (error) {
      console.error('Error guardando servicio:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error al guardar servicio',
        text: error.response?.data?.message || 'Error al guardar el servicio',
        confirmButtonColor: '#dc3545'
      });
    } finally {
      setLoading(false);
    }
  };

  const generateCode = () => {
    if (formData.name) {
      const words = formData.name.split(' ');
      let code = '';
      
      if (words.length === 1) {
        code = words[0].substring(0, 4).toUpperCase();
      } else {
        code = words.map(word => word[0]).join('').toUpperCase();
      }
      
      code += Math.floor(Math.random() * 1000);
      setFormData(prev => ({ ...prev, code }));
    }
  };

  if (loading && isEditing) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: '#009933', borderTopColor: '#FFCC33' }}></div>
          <p className="text-sm" style={{ color: '#666666', fontFamily: "'Montserrat', sans-serif" }}>Cargando servicio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/services')}
          className="flex items-center mb-4 transition-colors group"
          style={{ color: '#666666' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#009933'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#666666'}
        >
          <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Volver a servicios
        </button>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E8F5E9' }}>
            <Tag className="w-7 h-7" style={{ color: '#009933' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#009933', fontFamily: "'Trajan Pro Bold', serif" }}>
              {isEditing ? 'Editar Servicio' : 'Nuevo Servicio'}
            </h1>
            <p className="text-sm mt-1" style={{ color: '#666666', fontFamily: "'Montserrat', sans-serif" }}>
              {isEditing 
                ? 'Modifica los datos del servicio de análisis' 
                : 'Registra un nuevo servicio de análisis en el catálogo'}
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

        {/* Código y Nombre */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Input
              label="Código *"
              name="code"
              value={formData.code}
              onChange={handleChange}
              error={errors.code}
              required
              icon={Code}
              placeholder="Ej: BIO001"
            />
            {!isEditing && (
              <button
                type="button"
                onClick={generateCode}
                className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors"
                style={{ backgroundColor: '#E8F5E9', color: '#009933' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D4EAD5'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E8F5E9'}
              >
                <Sparkles className="w-3 h-3" />
                Generar código automático
              </button>
            )}
          </div>
          
          <Input
            label="Nombre *"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
            icon={FileText}
            placeholder="Ej: Análisis de pH"
          />
        </div>

        {/* Precios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Precio Externo *"
            type="number"
            name="priceExternal"
            value={formData.priceExternal}
            onChange={handleChange}
            error={errors.priceExternal}
            required
            icon={DollarSign}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
          
          <Input
            label="Precio Estudiante *"
            type="number"
            name="priceStudent"
            value={formData.priceStudent}
            onChange={handleChange}
            error={errors.priceStudent}
            required
            icon={Users}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>

        {/* Descripción (opcional) */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#666666', fontFamily: "'Montserrat', sans-serif" }}>
            Descripción
          </label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-0 transition-shadow resize-none"
            style={{ borderColor: '#E5E5E5', color: '#333333', fontFamily: "'Montserrat', sans-serif" }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#009933'; e.currentTarget.style.boxShadow = '0 0 0 2px #00993320'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.boxShadow = 'none'; }}
            placeholder="Descripción detallada del servicio (opcional)"
          />
        </div>

        {/* Estado activo (solo en edición) */}
        {isEditing && (
          <div className="rounded-xl p-4 border" style={{ backgroundColor: '#F9F9F9', borderColor: '#E5E5E5' }}>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div
                  onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                  className={`
                    w-10 h-6 rounded-full p-1 cursor-pointer transition-colors duration-200
                    ${formData.isActive ? 'bg-[#009933]' : 'bg-gray-300'}
                  `}
                >
                  <div className={`
                    w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200
                    ${formData.isActive ? 'translate-x-4' : 'translate-x-0'}
                  `} />
                </div>
              </div>
              <div>
                <label htmlFor="isActive" className="font-medium cursor-pointer" style={{ color: '#333333' }}>
                  Servicio activo
                </label>
                <p className="text-xs mt-0.5" style={{ color: '#666666' }}>
                  {formData.isActive 
                    ? 'El servicio está disponible para nuevas cotizaciones' 
                    : 'El servicio no aparecerá en el catálogo activo'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Información adicional */}
        {!isEditing && (
          <div className="rounded-xl p-4 flex items-start gap-3" style={{ backgroundColor: '#E8F5E9', border: '1px solid #00993320' }}>
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#009933' }} />
            <div className="text-sm">
              <p className="font-medium" style={{ color: '#009933' }}>Completa los datos del servicio</p>
              <p className="text-xs mt-1" style={{ color: '#666666' }}>
                Todos los campos marcados con * son obligatorios. Los precios deben ser mayores a 0.
              </p>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t" style={{ borderColor: '#E5E5E5' }}>
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/services')}
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
                {isEditing ? 'Actualizar Servicio' : 'Guardar Servicio'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}