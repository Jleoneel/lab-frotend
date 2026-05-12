import { useState } from 'react';
import { Save, Shield, Lock, CheckCircle, AlertCircle, KeyRound, RefreshCw } from 'lucide-react';
import Modal from '../ui/Modal';
import PasswordInput from '../common/PasswordInput';
import InfoBanner from '../common/InfoBanner';
import ModalActions from '../common/ModalActions';
import api from '../../lib/axios';
import Swal from 'sweetalert2';

function calcularFortaleza(password) {
  let f = 0;
  if (password.length >= 6) f++;
  if (password.length >= 8) f++;
  if (/[A-Z]/.test(password)) f++;
  if (/[0-9]/.test(password)) f++;
  if (/[^A-Za-z0-9]/.test(password)) f++;
  return Math.min(f, 4);
}

const STRENGTH_TEXT  = ['', 'Débil', 'Básica', 'Buena', 'Fuerte'];
const STRENGTH_COLOR = ['', '#DC2626', '#FFCC33', '#009933', '#00802b'];

const REQUISITOS = [
  { label: 'Mínimo 6 caracteres',    test: (p) => p.length >= 6 },
  { label: 'Al menos una mayúscula', test: (p) => /[A-Z]/.test(p) },
  { label: 'Al menos un número',     test: (p) => /[0-9]/.test(p) },
  { label: 'Caracteres especiales',  test: (p) => /[^A-Za-z0-9]/.test(p) },
];

export default function CambiarPasswordModal({ isOpen, onClose }) {
  const [form, setForm] = useState({ passwordActual: '', passwordNueva: '', confirmar: '' });
  const [saving, setSaving] = useState(false);
  const [touched, setTouched] = useState({});

  const strength = calcularFortaleza(form.passwordNueva);
  const isValid = form.passwordActual && form.passwordNueva && form.confirmar &&
                  form.passwordNueva === form.confirmar && form.passwordNueva.length >= 6;

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleBlur = (field) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSave = async () => {
    if (!form.passwordActual || !form.passwordNueva || !form.confirmar) {
      return Swal.fire({ icon: 'warning', title: 'Campos incompletos', text: 'Por favor completa todos los campos', confirmButtonColor: '#009933', timer: 2000, timerProgressBar: true });
    }
    if (form.passwordNueva !== form.confirmar) {
      return Swal.fire({ icon: 'warning', title: 'Contraseñas no coinciden', text: 'La nueva contraseña y su confirmación deben ser iguales', confirmButtonColor: '#009933' });
    }
    if (form.passwordNueva.length < 6) {
      return Swal.fire({ icon: 'warning', title: 'Contraseña muy corta', text: 'La contraseña debe tener al menos 6 caracteres', confirmButtonColor: '#009933' });
    }
    setSaving(true);
    try {
      await api.patch('/users/me/password', { passwordActual: form.passwordActual, passwordNueva: form.passwordNueva });
      await Swal.fire({ icon: 'success', title: '¡Contraseña actualizada!', text: 'Tu contraseña se ha cambiado correctamente', confirmButtonColor: '#009933', timer: 2000, timerProgressBar: true });
      setForm({ passwordActual: '', passwordNueva: '', confirmar: '' });
      setTouched({});
      onClose();
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'No se pudo actualizar la contraseña', confirmButtonColor: '#dc3545' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cambiar Contraseña" size="md">
      <div className="space-y-5">
        <InfoBanner
          icon={RefreshCw}
          title="Actualización de contraseña"
          description="Recomendamos usar una contraseña segura que no uses en otros servicios"
          variant="green"
        />

        <div>
          <PasswordInput
            label="Contraseña actual *"
            value={form.passwordActual}
            onChange={handleChange('passwordActual')}
            onBlur={handleBlur('passwordActual')}
            placeholder="Ingresa tu contraseña actual"
          />
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" style={{ borderColor: '#E5E5E5' }} />
          </div>
          <div className="relative flex justify-center">
            <span className="px-3 text-xs bg-white" style={{ color: '#999999' }}>Nueva contraseña</span>
          </div>
        </div>

        <div>
          <PasswordInput
            label="Nueva contraseña *"
            value={form.passwordNueva}
            onChange={(e) => { handleChange('passwordNueva')(e); }}
            onBlur={handleBlur('passwordNueva')}
            placeholder="Mínimo 6 caracteres"
          />

          {touched.passwordNueva && form.passwordNueva && (
            <div className="mt-3 space-y-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className="h-1.5 flex-1 rounded-full transition-all duration-300"
                    style={{ backgroundColor: level <= strength ? STRENGTH_COLOR[strength] : '#E5E5E5' }}
                  />
                ))}
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs font-medium" style={{ color: STRENGTH_COLOR[strength] }}>
                  Fortaleza: {STRENGTH_TEXT[strength]}{strength === 4 ? ' ✨' : ''}
                </p>
                <p className="text-xs" style={{ color: '#999999' }}>
                  {form.passwordNueva.length}/20 caracteres
                </p>
              </div>

              <div className="p-3 rounded-lg" style={{ backgroundColor: '#F9F9F9', border: '1px solid #E5E5E5' }}>
                <p className="text-xs font-medium mb-2" style={{ color: '#666666' }}>Requisitos de seguridad:</p>
                <div className="grid grid-cols-2 gap-1">
                  {REQUISITOS.map((req) => {
                    const valid = req.test(form.passwordNueva);
                    return (
                      <div key={req.label} className="flex items-center gap-1.5">
                        {valid
                          ? <CheckCircle className="w-3 h-3" style={{ color: '#009933' }} />
                          : <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#E5E5E5' }} />
                        }
                        <span className="text-xs" style={{ color: valid ? '#009933' : '#999999' }}>{req.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <PasswordInput
            label="Confirmar nueva contraseña *"
            value={form.confirmar}
            onChange={handleChange('confirmar')}
            onBlur={handleBlur('confirmar')}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            placeholder="Repite la nueva contraseña"
          />
          {touched.confirmar && form.confirmar && (
            <div className="flex items-center gap-1.5 mt-1.5">
              {form.passwordNueva !== form.confirmar ? (
                <><AlertCircle className="w-3.5 h-3.5" style={{ color: '#DC2626' }} /><p className="text-xs" style={{ color: '#DC2626' }}>Las contraseñas no coinciden</p></>
              ) : (
                <><CheckCircle className="w-3.5 h-3.5" style={{ color: '#009933' }} /><p className="text-xs" style={{ color: '#009933' }}>Las contraseñas coinciden ✓</p></>
              )}
            </div>
          )}
        </div>

        <InfoBanner icon={KeyRound} description="Las contraseñas se almacenan de forma segura y encriptada" variant="gray" />

        <ModalActions
          onCancel={onClose}
          onConfirm={handleSave}
          confirmLabel="Actualizar Contraseña"
          loadingLabel="Actualizando..."
          loading={saving}
          disabled={!isValid}
          icon={Save}
        />
      </div>
    </Modal>
  );
}
