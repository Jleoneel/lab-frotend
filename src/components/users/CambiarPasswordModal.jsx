// components/auth/CambiarPasswordModal.jsx
import { useState } from 'react';
import { KeyRound, Eye, EyeOff, Save, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import Modal from '../ui/Modal';
import api from '../../lib/axios';
import Swal from 'sweetalert2';

export default function CambiarPasswordModal({ isOpen, onClose }) {
  const [form, setForm] = useState({ passwordActual: '', passwordNueva: '', confirmar: '' });
  const [showActual, setShowActual] = useState(false);
  const [showNueva, setShowNueva] = useState(false);
  const [saving, setSaving] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calcularFortaleza = (password) => {
    let fuerza = 0;
    if (password.length >= 6) fuerza++;
    if (password.length >= 8) fuerza++;
    if (/[A-Z]/.test(password)) fuerza++;
    if (/[0-9]/.test(password)) fuerza++;
    if (/[^A-Za-z0-9]/.test(password)) fuerza++;
    return Math.min(fuerza, 4);
  };

  const handlePasswordChange = (e) => {
    const nueva = e.target.value;
    setForm({ ...form, passwordNueva: nueva });
    setPasswordStrength(calcularFortaleza(nueva));
  };

  const getStrengthText = () => {
    const texts = ['', 'Débil', 'Básica', 'Buena', 'Fuerte'];
    return texts[passwordStrength];
  };

  const getStrengthColor = () => {
    const colors = ['', '#DC2626', '#FFCC33', '#009933', '#00802b'];
    return colors[passwordStrength];
  };

  const inputStyle = {
    width: '100%', padding: '10px 12px', border: '1px solid #E5E5E5',
    borderRadius: '12px', fontSize: '14px', color: '#333333', outline: 'none',
    fontFamily: "'Montserrat', sans-serif"
  };
  const onFocus = (e) => { e.currentTarget.style.borderColor = '#009933'; e.currentTarget.style.boxShadow = '0 0 0 2px #00993320'; };
  const onBlur = (e) => { e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.boxShadow = 'none'; };

  const handleSave = async () => {
    if (!form.passwordActual || !form.passwordNueva || !form.confirmar) {
      return Swal.fire({ 
        icon: 'warning', 
        title: 'Campos incompletos', 
        text: 'Por favor completa todos los campos',
        confirmButtonColor: '#009933',
        timer: 2000,
        timerProgressBar: true
      });
    }
    if (form.passwordNueva !== form.confirmar) {
      return Swal.fire({ 
        icon: 'warning', 
        title: 'Contraseñas no coinciden', 
        text: 'La nueva contraseña y su confirmación deben ser iguales',
        confirmButtonColor: '#009933'
      });
    }
    if (form.passwordNueva.length < 6) {
      return Swal.fire({ 
        icon: 'warning', 
        title: 'Contraseña muy corta', 
        text: 'La contraseña debe tener al menos 6 caracteres',
        confirmButtonColor: '#009933'
      });
    }

    setSaving(true);
    try {
      await api.patch('/users/me/password', {
        passwordActual: form.passwordActual,
        passwordNueva: form.passwordNueva
      });
      await Swal.fire({
        icon: 'success',
        title: '¡Contraseña actualizada!',
        text: 'Tu contraseña se ha cambiado correctamente',
        confirmButtonColor: '#009933',
        timer: 2000,
        timerProgressBar: true
      });
      setForm({ passwordActual: '', passwordNueva: '', confirmar: '' });
      setPasswordStrength(0);
      onClose();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'No se pudo actualizar la contraseña',
        confirmButtonColor: '#dc3545'
      });
    } finally {
      setSaving(false);
    }
  };

  const isFormValid = form.passwordActual && form.passwordNueva && form.confirmar && 
                      form.passwordNueva === form.confirmar && form.passwordNueva.length >= 6;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cambiar Contraseña" size="md">
      <div className="space-y-5">
        {/* Header informativo */}
        <div className="rounded-xl p-3 flex items-start gap-2" style={{ backgroundColor: "#E8F5E9", border: "1px solid #00993330" }}>
          <KeyRound className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#009933" }} />
          <div>
            <p className="text-xs font-medium" style={{ color: "#009933" }}>Seguridad de la cuenta</p>
            <p className="text-xs mt-0.5" style={{ color: "#666666" }}>
              Recomendamos usar una contraseña segura que no uses en otros servicios
            </p>
          </div>
        </div>

        {/* Contraseña actual */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "#666666" }}>
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              Contraseña actual
              <span style={{ color: "#DC2626" }}>*</span>
            </span>
          </label>
          <div className="relative">
            <input
              type={showActual ? 'text' : 'password'}
              value={form.passwordActual}
              onChange={(e) => setForm({ ...form, passwordActual: e.target.value })}
              style={{ ...inputStyle, paddingRight: '40px' }}
              placeholder="Ingresa tu contraseña actual"
              onFocus={onFocus}
              onBlur={onBlur}
            />
            <button
              type="button"
              onClick={() => setShowActual(!showActual)}
              className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: '#666666' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#009933'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#666666'}
            >
              {showActual ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Nueva contraseña */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "#666666" }}>
            <span className="flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5" />
              Nueva contraseña
              <span style={{ color: "#DC2626" }}>*</span>
            </span>
          </label>
          <div className="relative">
            <input
              type={showNueva ? 'text' : 'password'}
              value={form.passwordNueva}
              onChange={handlePasswordChange}
              style={{ ...inputStyle, paddingRight: '40px' }}
              placeholder="Mínimo 6 caracteres"
              onFocus={onFocus}
              onBlur={onBlur}
            />
            <button
              type="button"
              onClick={() => setShowNueva(!showNueva)}
              className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: '#666666' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#009933'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#666666'}
            >
              {showNueva ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          
          {/* Indicador de fortaleza */}
          {form.passwordNueva && (
            <div className="mt-2 space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className="h-1 flex-1 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: level <= passwordStrength ? getStrengthColor() : '#E5E5E5'
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs" style={{ color: getStrengthColor() }}>
                  <span className="font-medium">{getStrengthText()}</span>
                  {passwordStrength === 4 && " - ¡Excelente contraseña!"}
                </p>
                <p className="text-xs" style={{ color: '#999999' }}>
                  {form.passwordNueva.length}/20 caracteres
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Confirmar contraseña */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "#666666" }}>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              Confirmar nueva contraseña
              <span style={{ color: "#DC2626" }}>*</span>
            </span>
          </label>
          <input
            type="password"
            value={form.confirmar}
            onChange={(e) => setForm({ ...form, confirmar: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            style={inputStyle}
            placeholder="Repite la nueva contraseña"
            onFocus={onFocus}
            onBlur={onBlur}
          />
          
          {/* Indicador de coincidencia */}
          {form.confirmar && (
            <div className="flex items-center gap-1.5 mt-1.5">
              {form.passwordNueva !== form.confirmar ? (
                <>
                  <AlertCircle className="w-3.5 h-3.5" style={{ color: '#DC2626' }} />
                  <p className="text-xs" style={{ color: '#DC2626' }}>Las contraseñas no coinciden</p>
                </>
              ) : form.confirmar.length >= 6 ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" style={{ color: '#009933' }} />
                  <p className="text-xs" style={{ color: '#009933' }}>Las contraseñas coinciden ✓</p>
                </>
              ) : (
                <p className="text-xs" style={{ color: '#999999' }}>Escribe la contraseña nuevamente para confirmar</p>
              )}
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-3 pt-2 border-t" style={{ borderColor: "#E5E5E5" }}>
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
            disabled={saving || !isFormValid}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#009933" }}
            onMouseEnter={(e) => { if (!saving && isFormValid) e.currentTarget.style.backgroundColor = "#00802b"; }}
            onMouseLeave={(e) => { if (!saving) e.currentTarget.style.backgroundColor = "#009933"; }}
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Actualizando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Actualizar Contraseña
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}