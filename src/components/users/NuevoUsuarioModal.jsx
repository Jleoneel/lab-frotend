// components/users/NuevoUsuarioModal.jsx
import { useState } from 'react';
import { 
  Save, 
  Eye, 
  EyeOff, 
  User, 
  Mail, 
  Lock, 
  Shield, 
  CheckCircle,
  AlertCircle,
  PlusCircle
} from 'lucide-react';
import Modal from '../ui/Modal';
import { userService } from '../../services/userService';
import Swal from 'sweetalert2';

export default function NuevoUsuarioModal({ isOpen, onClose, onSaved }) {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', role: 'ANALYST' });
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'El nombre completo es obligatorio';
    if (!formData.email.trim()) newErrors.email = 'El email es obligatorio';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.password) newErrors.password = 'La contraseña es obligatoria';
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    return newErrors;
  };

  const handleSave = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      await Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos correctamente',
        confirmButtonColor: '#009933',
        timer: 2000,
        timerProgressBar: true
      });
      return;
    }

    setSaving(true);
    try {
      await userService.create(formData);
      await Swal.fire({
        icon: 'success',
        title: '¡Usuario creado!',
        text: `El usuario ${formData.fullName} ha sido registrado correctamente`,
        confirmButtonColor: '#009933',
        timer: 2000,
        timerProgressBar: true
      });
      setFormData({ fullName: '', email: '', password: '', role: 'ANALYST' });
      setErrors({});
      onSaved();
      onClose();
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'No se pudo crear el usuario',
        confirmButtonColor: '#dc3545'
      });
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #E5E5E5',
    borderRadius: '12px',
    fontSize: '14px',
    color: '#333333',
    outline: 'none',
    fontFamily: "'Montserrat', sans-serif",
    transition: 'all 0.2s'
  };
  
  //eslint-disable-next-line no-unused-vars
  const labelStyle = { 
    display: 'block', 
    fontSize: '13px', 
    fontWeight: '500', 
    marginBottom: '4px', 
    color: '#666666' 
  };
  
  const onFocus = (e) => { 
    e.currentTarget.style.borderColor = '#009933'; 
    e.currentTarget.style.boxShadow = '0 0 0 2px #00993320'; 
  };
  
  const onBlur = (e) => { 
    e.currentTarget.style.borderColor = '#E5E5E5'; 
    e.currentTarget.style.boxShadow = 'none'; 
  };

  const rolesDisponibles = [
    { value: 'ANALYST', label: ' Analista', description: 'Puede gestionar análisis y resultados' },
    { value: 'ADMIN', label: ' Administrador', description: 'Acceso completo al sistema' }
  ];

  const roleSelected = rolesDisponibles.find(r => r.value === formData.role);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nuevo Usuario" size="md">
      <div className="space-y-5">
        
        {/* Header informativo */}
        <div className="rounded-xl p-3 flex items-start gap-2" style={{ backgroundColor: "#E8F5E9", border: "1px solid #00993330" }}>
          <PlusCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#009933" }} />
          <div>
            <p className="text-xs font-medium" style={{ color: "#009933" }}>Registro de nuevo usuario</p>
            <p className="text-xs mt-0.5" style={{ color: "#666666" }}>
              Completa los campos para crear un nuevo usuario en el sistema
            </p>
          </div>
        </div>

        {/* Nombre completo */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "#666666" }}>
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              Nombre completo
              <span style={{ color: "#DC2626" }}>*</span>
            </span>
          </label>
          <input
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            style={{ 
              ...inputStyle,
              borderColor: errors.fullName ? '#FECACA' : '#E5E5E5'
            }}
            placeholder="Ej: Juan Pérez"
            onFocus={onFocus}
            onBlur={onBlur}
          />
          {errors.fullName && (
            <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "#666666" }}>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              Correo electrónico
              <span style={{ color: "#DC2626" }}>*</span>
            </span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{ 
              ...inputStyle,
              borderColor: errors.email ? '#FECACA' : '#E5E5E5'
            }}
            placeholder="Ej: juan@utm.edu.ec"
            onFocus={onFocus}
            onBlur={onBlur}
          />
          {errors.email && (
            <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.email}</p>
          )}
        </div>

        {/* Contraseña */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "#666666" }}>
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              Contraseña
              <span style={{ color: "#DC2626" }}>*</span>
            </span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{ 
                ...inputStyle, 
                paddingRight: '2.5rem',
                borderColor: errors.password ? '#FECACA' : '#E5E5E5'
              }}
              placeholder="Mínimo 6 caracteres"
              onFocus={onFocus}
              onBlur={onBlur}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: '#666666' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#009933'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#666666'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.password}</p>
          )}
          {!errors.password && formData.password && formData.password.length < 6 && formData.password.length > 0 && (
            <p className="text-xs mt-1" style={{ color: '#FFCC33' }}>⚠ La contraseña es muy corta (mínimo 6 caracteres)</p>
          )}
          {formData.password && formData.password.length >= 6 && (
            <p className="text-xs mt-1" style={{ color: '#009933' }}>✓ Contraseña válida</p>
          )}
        </div>

        {/* Rol */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "#666666" }}>
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              Rol
              <span style={{ color: "#DC2626" }}>*</span>
            </span>
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={{ ...inputStyle, appearance: 'auto' }}
            onFocus={onFocus}
            onBlur={onBlur}
          >
            {rolesDisponibles.map(role => (
              <option key={role.value} value={role.value}>{role.label}</option>
            ))}
          </select>
          {roleSelected && (
            <p className="text-xs mt-1" style={{ color: '#666666' }}>
              {roleSelected.description}
            </p>
          )}
        </div>

        {/* Resumen de campos obligatorios */}
        <div className="rounded-xl p-3 border" style={{ backgroundColor: "#FFF9E8", borderColor: "#FFCC3330" }}>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#FFCC33" }} />
            <p className="text-xs" style={{ color: "#996600" }}>
              Los campos marcados con <span style={{ color: "#DC2626" }}>*</span> son obligatorios
            </p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: "#E5E5E5" }}>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{ color: "#666666" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#F5F5F5"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#009933" }}
            onMouseEnter={(e) => { if (!saving) e.currentTarget.style.backgroundColor = "#00802b"; }}
            onMouseLeave={(e) => { if (!saving) e.currentTarget.style.backgroundColor = "#009933"; }}
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Crear Usuario
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}