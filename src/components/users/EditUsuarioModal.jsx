import { useState, useEffect } from 'react';
import { Save, User, Mail, Shield, CheckCircle, Edit } from 'lucide-react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import InfoBanner from '../common/InfoBanner';
import ModalActions from '../common/ModalActions';
import { userService } from '../../services/userService';
import Swal from 'sweetalert2';

const ROLES = [
  { value: 'ANALYST', label: 'Analista',     description: 'Puede gestionar análisis y resultados' },
  { value: 'ADMIN',   label: 'Administrador', description: 'Acceso completo al sistema' },
];

export default function EditUsuarioModal({ isOpen, onClose, user, onSaved }) {
  const [formData, setFormData] = useState({ fullName: '', email: '', role: 'ANALYST', isActive: true });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && user) {
      setFormData({ fullName: user.fullName || '', email: user.email || '', role: user.role || 'ANALYST', isActive: user.isActive ?? true });
      setErrors({});
    }
  }, [isOpen, user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'El nombre completo es obligatorio';
    if (!formData.email.trim()) newErrors.email = 'El email es obligatorio';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email inválido';
    return newErrors;
  };

  const handleSave = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      await Swal.fire({ icon: 'warning', title: 'Campos incompletos', text: 'Por favor completa los campos requeridos', confirmButtonColor: '#009933', timer: 2000, timerProgressBar: true });
      return;
    }
    setSaving(true);
    try {
      await userService.update(user.id, formData);
      await Swal.fire({ icon: 'success', title: '¡Usuario actualizado!', text: `Los datos de ${formData.fullName} se han modificado correctamente`, confirmButtonColor: '#009933', timer: 2000, timerProgressBar: true });
      onSaved();
      onClose();
    } catch (error) {
      await Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'No se pudo actualizar el usuario', confirmButtonColor: '#dc3545' });
    } finally {
      setSaving(false);
    }
  };

  const roleSelected = ROLES.find(r => r.value === formData.role);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Usuario" size="md">
      <div className="space-y-5">
        <InfoBanner icon={Edit} title="Editando usuario" description="Modifica los datos del usuario seleccionado" variant="green" />

        {user && (
          <div className="rounded-xl p-3 flex items-center gap-2" style={{ backgroundColor: '#F9F9F9', border: '1px solid #E5E5E5' }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E8F5E9' }}>
              <User className="w-3 h-3" style={{ color: '#009933' }} />
            </div>
            <p className="text-xs" style={{ color: '#666666' }}>
              Editando: <span className="font-medium" style={{ color: '#009933' }}>{user.fullName}</span>
              <span className="mx-1">•</span>
              <span className="font-mono">{user.email}</span>
            </p>
          </div>
        )}

        <Input label="Nombre completo *" name="fullName" value={formData.fullName} onChange={handleChange} error={errors.fullName} icon={User} placeholder="Ej: Juan Pérez" />
        <Input label="Correo electrónico *" type="email" name="email" value={formData.email} onChange={handleChange} error={errors.email} icon={Mail} placeholder="Ej: juan@utm.edu.ec" />

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#666666' }}>
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" />Rol *</span>
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none text-sm transition-shadow"
            style={{ borderColor: '#E5E5E5', color: '#333333' }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#009933'; e.currentTarget.style.boxShadow = '0 0 0 2px #00993320'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
          {roleSelected && <p className="text-xs mt-1" style={{ color: '#666666' }}>{roleSelected.description}</p>}
        </div>

        {/* Toggle activo */}
        <div className="rounded-xl p-4 border" style={{ backgroundColor: '#F9F9F9', borderColor: '#E5E5E5' }}>
          <div className="flex items-center gap-3">
            <div
              onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
              className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors duration-200 ${formData.isActive ? 'bg-[#009933]' : 'bg-gray-300'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${formData.isActive ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: '#333333' }}>Usuario activo</p>
              <p className="text-xs mt-0.5" style={{ color: '#666666' }}>
                {formData.isActive ? 'El usuario puede acceder al sistema' : 'El usuario no podrá iniciar sesión'}
              </p>
            </div>
          </div>
        </div>

        <InfoBanner icon={CheckCircle} description="Los cambios se aplicarán inmediatamente en el sistema" variant="gold" />

        <ModalActions onCancel={onClose} onConfirm={handleSave} confirmLabel="Guardar Cambios" loadingLabel="Guardando..." loading={saving} icon={Save} />
      </div>
    </Modal>
  );
}
