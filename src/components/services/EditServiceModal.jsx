// components/services/EditServiceModal.jsx
import { useState, useEffect } from 'react';
import { 
  Save, 
  Code, 
  FileText, 
  DollarSign, 
  Users, 
  Tag,
  AlertCircle,
  X,
  CheckCircle
} from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { serviceService } from '../../services/serviceService';

export default function EditServiceModal({ isOpen, onClose, service, onSaved }) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    priceExternal: '',
    priceStudent: '',
    isActive: true
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && service) {
      setFormData({
        code: service.code,
        name: service.name,
        priceExternal: service.priceExternal,
        priceStudent: service.priceStudent,
        isActive: service.isActive
      });
      setErrors({});
    }
  }, [isOpen, service]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.code.trim()) newErrors.code = 'El código es obligatorio';
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!formData.priceExternal || parseFloat(formData.priceExternal) <= 0) {
      newErrors.priceExternal = 'Debe ser mayor a 0';
    }
    if (!formData.priceStudent || parseFloat(formData.priceStudent) <= 0) {
      newErrors.priceStudent = 'Debe ser mayor a 0';
    }
    return newErrors;
  };

  const handleSave = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);
    try {
      await serviceService.update(service.id, {
        ...formData,
        priceExternal: parseFloat(formData.priceExternal),
        priceStudent: parseFloat(formData.priceStudent)
      });
      
      setShowSuccess(true);
      setTimeout(() => {
        onSaved();
        onClose();
        setShowSuccess(false);
      }, 1500);
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Error al guardar' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Editar Servicio"
      size="md"
    >
      {/* Notificación de éxito */}
      {showSuccess && (
        <div className="absolute top-0 left-0 right-0 bg-green-50 border-b border-green-200 px-4 py-3 flex items-center gap-2 animate-in slide-in-from-top">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="text-sm text-green-700 font-medium">Servicio actualizado correctamente</span>
        </div>
      )}

      <div className="space-y-6 pt-2">
        {/* Header decorativo */}
        <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
          <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
            <Tag className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-800">{service?.name}</h3>
            <p className="text-xs text-gray-500">Código: {service?.code}</p>
          </div>
        </div>

        {/* Mensaje de error general */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        {/* Campos del formulario */}
        <div className="space-y-4">
          {/* Código y Nombre */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Código *"
              name="code"
              value={formData.code}
              onChange={handleChange}
              error={errors.code}
              icon={Code}
              placeholder="Ej: BIO001"
            />
            <Input
              label="Nombre *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              icon={FileText}
              placeholder="Ej: Análisis de pH"
            />
          </div>

          {/* Precios */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Precio Externo *"
              type="number"
              name="priceExternal"
              value={formData.priceExternal}
              onChange={handleChange}
              error={errors.priceExternal}
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
              icon={Users}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>

          {/* Toggle de estado activo (mejorado) */}
          <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive-modal"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div
                  onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                  className={`
                    w-10 h-6 rounded-full p-1 cursor-pointer transition-colors duration-200
                    ${formData.isActive ? 'bg-green-500' : 'bg-gray-300'}
                  `}
                >
                  <div className={`
                    w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200
                    ${formData.isActive ? 'translate-x-4' : 'translate-x-0'}
                  `} />
                </div>
              </div>
              <div>
                <label htmlFor="isActive-modal" className="font-medium text-gray-700 cursor-pointer">
                  Servicio activo
                </label>
                <p className="text-xs text-gray-500">
                  {formData.isActive 
                    ? 'El servicio está disponible en el catálogo' 
                    : 'El servicio no aparecerá en nuevas cotizaciones'}
                </p>
              </div>
            </div>
          </div>

          {/* Resumen de cambios */}
          <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100">
            <p className="text-xs text-blue-700 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Los cambios se reflejarán inmediatamente en el sistema
            </p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100">
          <Button
            variant="ghost"
            onClick={onClose}
            className="order-2 sm:order-1"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="order-1 sm:order-2"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Guardando...
              </span>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Guardar Cambios
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}