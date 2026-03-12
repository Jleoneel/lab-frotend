// components/clients/EditClientModal.jsx
import { useState, useEffect } from 'react';
import { 
  Save, 
  User, 
  MapPin, 
  Building2, 
  Phone, 
  Mail,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { clientService } from '../../services/clientService';

export default function EditClientModal({ isOpen, onClose, client, onSaved }) {
  const [formData, setFormData] = useState({
    name: '', address: '', city: '', phone: '', email: ''
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && client) {
      setFormData({
        name: client.name || '',
        address: client.address || '',
        city: client.city || '',
        phone: client.phone || '',
        email: client.email || ''
      });
      setErrors({});
    }
  }, [isOpen, client]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
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
      await clientService.update(client.id, formData);
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
      title="Editar Cliente"
      size="md"
    >
      {/* Notificación de éxito */}
      {showSuccess && (
        <div className="absolute top-0 left-0 right-0 bg-green-50 border-b border-green-200 px-4 py-3 flex items-center gap-2 animate-in slide-in-from-top z-10">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="text-sm text-green-700 font-medium">Cliente actualizado correctamente</span>
        </div>
      )}

      <div className="space-y-6 pt-2">
        {/* Header decorativo con información del cliente */}
        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-800 truncate">{client?.name}</h3>
            <p className="text-xs text-gray-500 truncate">{client?.email || 'Sin email'}</p>
          </div>
          {client?.city && (
            <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
              <Building2 className="w-3 h-3" />
              <span>{client.city}</span>
            </div>
          )}
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
          {/* Nombre */}
          <Input
            label="Nombre *"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            icon={User}
            placeholder="Ej: Juan Pérez"
            required
          />

          {/* Grid para Ciudad y Teléfono */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Ciudad"
              name="city"
              value={formData.city}
              onChange={handleChange}
              icon={Building2}
              placeholder="Ej: Quito"
            />
            <Input
              label="Teléfono"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              icon={Phone}
              placeholder="Ej: +593 987654321"
            />
          </div>

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

          {/* Dirección */}
          <Input
            label="Dirección"
            name="address"
            value={formData.address}
            onChange={handleChange}
            icon={MapPin}
            placeholder="Ej: Av. Principal 123"
          />
        </div>

        {/* Vista previa rápida */}
        <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">
                {formData.name ? formData.name.charAt(0).toUpperCase() : '?'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700 truncate">
                {formData.name || 'Nombre no especificado'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {formData.email || formData.phone || 'Sin datos de contacto'}
              </p>
            </div>
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