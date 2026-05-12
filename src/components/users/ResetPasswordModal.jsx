import { useState } from 'react';
import { KeyRound } from 'lucide-react';
import Modal from '../ui/Modal';
import PasswordInput from '../common/PasswordInput';
import ModalActions from '../common/ModalActions';
import { userService } from '../../services/userService';
import Swal from 'sweetalert2';

export default function ResetPasswordModal({ isOpen, onClose, user }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!password || password.length < 6) {
      await Swal.fire({ icon: 'warning', title: 'Contraseña muy corta', text: 'Mínimo 6 caracteres', confirmButtonColor: '#009933' });
      return;
    }
    if (password !== confirmPassword) {
      await Swal.fire({ icon: 'warning', title: 'Las contraseñas no coinciden', confirmButtonColor: '#009933' });
      return;
    }
    setSaving(true);
    try {
      await userService.resetPassword(user.id, password);
      await Swal.fire({ icon: 'success', title: '¡Contraseña actualizada!', confirmButtonColor: '#009933', timer: 1500, timerProgressBar: true });
      setPassword('');
      setConfirmPassword('');
      onClose();
    } catch {
      await Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar la contraseña', confirmButtonColor: '#dc3545' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Resetear Contraseña">
      <div className="space-y-4">
        {user && (
          <div className="px-4 py-3 rounded-xl" style={{ backgroundColor: '#F9F9F9', border: '1px solid #E5E5E5' }}>
            <p className="text-sm" style={{ color: '#666666' }}>
              Cambiando contraseña de:{' '}
              <span className="font-semibold" style={{ color: '#009933' }}>{user.fullName}</span>
            </p>
          </div>
        )}

        <PasswordInput
          label="Nueva contraseña *"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mínimo 6 caracteres"
        />

        <div>
          <PasswordInput
            label="Confirmar contraseña *"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repite la contraseña"
          />
          {confirmPassword && password !== confirmPassword && (
            <p className="text-xs mt-1" style={{ color: '#DC2626' }}>Las contraseñas no coinciden</p>
          )}
        </div>

        <ModalActions
          onCancel={onClose}
          onConfirm={handleSave}
          confirmLabel="Actualizar Contraseña"
          loadingLabel="Actualizando..."
          loading={saving}
          disabled={!password || password !== confirmPassword}
          icon={KeyRound}
        />
      </div>
    </Modal>
  );
}
