import { useState } from 'react';
import { Save, User, Mail, Lock, Shield, AlertCircle, PlusCircle } from 'lucide-react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import PasswordInput from '../common/PasswordInput';
import InfoBanner from '../common/InfoBanner';
import ModalActions from '../common/ModalActions';
import { userService } from '../../services/userService';
import Swal from 'sweetalert2';

const ROLES = [
  { value: 'ANALYST', label: 'Analista',       description: 'Puede gestionar análisis y resultados' },
  { value: 'ADMIN',   label: 'Administrador',   description: 'Acceso completo al sistema' },
];

export default function NuevoUsuarioModal({ isOpen, onClose, onSaved }) {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', role: 'ANALYST' });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'El nombre completo es obligatorio';
    if (!formData.email.trim()) newErrors.email = 'El email es obligatorio';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email inválido';
    if (!formData.password) newErrors.password = 'La contraseña es obligatoria';
    if (formData.password && formData.password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
    return newErrors;
  };

  const handleSave = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      await Swal.fire({ icon: 'warning', title: 'Campos incompletos', text: 'Por favor completa todos los campos correctamente', confirmButtonColor: '#009933', timer: 2000, timerProgressBar: true });
      return;
    }
    setSaving(true);
    try {
      await userService.create(formData);
      await Swal.fire({ icon: 'success', title: '¡Usuario creado!', text: `El usuario ${formData.fullName} ha sido registrado correctamente`, confirmButtonColor: '#009933', timer: 2000, timerProgressBar: true });
      setFormData({ fullName: '', email: '', password: '', role: 'ANALYST' });
      setErrors({});
      onSaved();
      onClose();
    } catch (error) {
      await Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'No se pudo crear el usuario', confirmButtonColor: '#dc3545' });
    } finally {
      setSaving(false);
    }
  };

  const roleSelected = ROLES.find(r => r.value === formData.role);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nuevo Usuario" size="md">
      <div className="space-y-5">
        <InfoBanner
          icon={PlusCircle}
          title="Registro de nuevo usuario"
          description="Completa los campos para crear un nuevo usuario en el sistema"
          variant="green"
        />

        <Input
          label="Nombre completo *"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          error={errors.fullName}
          icon={User}
          placeholder="Ej: Juan Pérez"
        />

        <Input
          label="Correo electrónico *"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          icon={Mail}
          placeholder="Ej: juan@utm.edu.ec"
        />

        <div>
          <PasswordInput
            label="Contraseña *"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Mínimo 6 caracteres"
          />
          {!errors.password && formData.password.length > 0 && formData.password.length < 6 && (
            <p className="text-xs mt-1" style={{ color: '#FFCC33' }}>⚠ La contraseña es muy corta</p>
          )}
          {formData.password.length >= 6 && (
            <p className="text-xs mt-1" style={{ color: '#009933' }}>✓ Contraseña válida</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#666666' }}>
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              Rol *
            </span>
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
          {roleSelected && (
            <p className="text-xs mt-1" style={{ color: '#666666' }}>{roleSelected.description}</p>
          )}
        </div>

        <InfoBanner
          icon={AlertCircle}
          description={<>Los campos marcados con <span style={{ color: '#DC2626' }}>*</span> son obligatorios</>}
          variant="gold"
        />

        <ModalActions
          onCancel={onClose}
          onConfirm={handleSave}
          confirmLabel="Crear Usuario"
          loadingLabel="Creando..."
          loading={saving}
          icon={Save}
        />
      </div>
    </Modal>
  );
}
