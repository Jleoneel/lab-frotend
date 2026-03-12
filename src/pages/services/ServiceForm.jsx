// pages/services/ServiceForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { serviceService } from '../../services/serviceService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

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
    try {
      const response = await serviceService.getById(id);
      setFormData(response.data);
    } catch (error) {
      console.error('Error cargando servicio:', error);
      navigate('/services');
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
    
    if (!formData.priceExternal || formData.priceExternal <= 0) {
      newErrors.priceExternal = 'El precio externo debe ser mayor a 0';
    }
    
    if (!formData.priceStudent || formData.priceStudent <= 0) {
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
      // Convertir precios a números
      const dataToSend = {
        ...formData,
        priceExternal: parseFloat(formData.priceExternal),
        priceStudent: parseFloat(formData.priceStudent)
      };

      if (isEditing) {
        await serviceService.update(id, dataToSend);
      } else {
        await serviceService.create(dataToSend);
      }
      navigate('/services');
    } catch (error) {
      console.error('Error guardando servicio:', error);
      setErrors({
        submit: error.response?.data?.message || 'Error al guardar el servicio'
      });
    } finally {
      setLoading(false);
    }
  };

  const generateCode = () => {
    // Generar código automático basado en el nombre
    if (formData.name) {
      const words = formData.name.split(' ');
      let code = '';
      
      if (words.length === 1) {
        code = words[0].substring(0, 4).toUpperCase();
      } else {
        code = words.map(word => word[0]).join('').toUpperCase();
      }
      
      // Agregar número aleatorio
      code += Math.floor(Math.random() * 1000);
      
      setFormData(prev => ({ ...prev, code }));
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/services')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Volver a servicios
        </button>

        <h1 className="text-2xl font-bold text-gray-800">
          {isEditing ? 'Editar Servicio' : 'Nuevo Servicio'}
        </h1>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 max-w-2xl">
        {errors.submit && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {errors.submit}
          </div>
        )}

        <div className="space-y-4">
          {/* Código y nombre */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                label="Código *"
                name="code"
                value={formData.code}
                onChange={handleChange}
                error={errors.code}
                required
              />
              {!isEditing && (
                <button
                  type="button"
                  onClick={generateCode}
                  className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                >
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
            />
          </div>

          {/* Precios */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Precio Externo *"
              type="number"
              name="priceExternal"
              value={formData.priceExternal}
              onChange={handleChange}
              error={errors.priceExternal}
              required
            />
            
            <Input
              label="Precio Estudiante *"
              type="number"
              name="priceStudent"
              value={formData.priceStudent}
              onChange={handleChange}
              error={errors.priceStudent}
              required
            />
          </div>
          {/* Estado activo */}
          {isEditing && (
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                id="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                Servicio activo
              </label>
            </div>
          )}

          {/* Botones */}
          <div className="pt-4 flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/services')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Guardando...' : 'Guardar Servicio'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}