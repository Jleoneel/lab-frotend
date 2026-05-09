// components/users/EditUsuarioModal.jsx
import { useState, useEffect } from 'react';
import { 
  Save, 
  User, 
  Mail, 
  Shield, 
  CheckCircle,
  AlertCircle,
  Edit,
  Eye,
  EyeOff
} from 'lucide-react';
import Modal from '../ui/Modal';
import { userService } from '../../services/userService';
import Swal from 'sweetalert2';

export default function EditUsuarioModal({ isOpen, onClose, user, onSaved }) {
  const [formData, setFormData] = useState({ fullName: '', email: '', role: 'ANALYST', isActive: true });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && user) {
      setFormData({ 
        fullName: user.fullName || '', 
        email: user.email || '', 
        role: user.role || 'ANALYST', 
        isActive: user.isActive ?? true 
      });
      setErrors({});
    }
  }, [isOpen, user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'El nombre completo es obligatorio';
    if (!formData.email.trim()) newErrors.email = 'El email es obligatorio';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
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
        text: 'Por favor completa los campos requeridos',
        confirmButtonColor: '#009933',
        timer: 2000,
        timerProgressBar: true
      });
      return;
    }

    setSaving(true);
    try {
      await userService.update(user.id, formData);
      await Swal.fire({
        icon: 'success',
        title: '¡Usuario actualizado!',
        text: `Los datos de ${formData.fullName} se han modificado correctamente`,
        confirmButtonColor: '#009933',
        timer: 2000,
        timerProgressBar: true
      });
      onSaved();
      onClose();
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'No se pudo actualizar el usuario',
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
    { value: 'ANALYST', label: 'Analista', description: 'Puede gestionar análisis y resultados' },
    { value: 'ADMIN', label: 'Administrador', description: 'Acceso completo al sistema' }
  ];

  const roleSelected = rolesDisponibles.find(r => r.value === formData.role);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Usuario" size="md">
      <div className="space-y-5">
        
        {/* Header informativo */}
        <div className="rounded-xl p-3 flex items-start gap-2" style={{ backgroundColor: "#E8F5E9", border: "1px solid #00993330" }}>
          <Edit className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#009933" }} />
          <div>
            <p className="text-xs font-medium" style={{ color: "#009933" }}>Editando usuario</p>
            <p className="text-xs mt-0.5" style={{ color: "#666666" }}>
              Modifica los datos del usuario seleccionado
            </p>
          </div>
        </div>

        {/* Información del usuario */}
        {user && (
          <div className="rounded-xl p-3 flex items-center gap-2" style={{ backgroundColor: "#F9F9F9", border: "1px solid #E5E5E5" }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: "#E8F5E9" }}>
              <User className="w-3 h-3" style={{ color: "#009933" }} />
            </div>
            <p className="text-xs" style={{ color: "#666666" }}>
              Editando: <span className="font-medium" style={{ color: "#009933" }}>{user.fullName}</span>
              <span className="mx-1">•</span>
              <span className="font-mono">{user.email}</span>
            </p>
          </div>
        )}

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

        {/* Estado activo - Toggle mejorado */}
        <div className="rounded-xl p-4 border" style={{ backgroundColor: "#F9F9F9", borderColor: "#E5E5E5" }}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="checkbox"
                name="isActive"
                id="isActive-checkbox"
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
              <label htmlFor="isActive-checkbox" className="text-sm font-medium cursor-pointer" style={{ color: "#333333" }}>
                Usuario activo
              </label>
              <p className="text-xs mt-0.5" style={{ color: "#666666" }}>
                {formData.isActive 
                  ? 'El usuario puede acceder al sistema' 
                  : 'El usuario no podrá iniciar sesión'}
              </p>
            </div>
          </div>
        </div>

        {/* Resumen de cambios */}
        <div className="rounded-xl p-3 border" style={{ backgroundColor: "#FFF9E8", borderColor: "#FFCC3330" }}>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#FFCC33" }} />
            <p className="text-xs" style={{ color: "#996600" }}>
              Los cambios se aplicarán inmediatamente en el sistema
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
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Guardar Cambios
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}