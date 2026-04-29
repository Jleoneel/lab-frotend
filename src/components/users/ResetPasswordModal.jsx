import { useState } from 'react';
import { KeyRound, Eye, EyeOff } from 'lucide-react';
import Modal from '../ui/Modal';
import { userService } from '../../services/userService';
import Swal from 'sweetalert2';

export default function ResetPasswordModal({ isOpen, onClose, user }) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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
        } catch (error) {
            await Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar la contraseña', confirmButtonColor: '#dc3545' });
        } finally {
            setSaving(false);
        }
    };

    const inputStyle = { width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: '12px', fontSize: '14px', color: '#333333', outline: 'none', paddingRight: '2.5rem' };
    const labelStyle = { display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px', color: '#666666' };
    const onFocus = (e) => { e.currentTarget.style.borderColor = '#009933'; e.currentTarget.style.boxShadow = '0 0 0 2px #00993320'; };
    const onBlur = (e) => { e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.boxShadow = 'none'; };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Resetear Contraseña">
            <div className="space-y-4">
                {user && (
                    <div className="px-4 py-3 rounded-xl" style={{ backgroundColor: '#F9F9F9', border: '1px solid #E5E5E5' }}>
                        <p className="text-sm" style={{ color: '#666666' }}>
                            Cambiando contraseña de: <span className="font-semibold" style={{ color: '#009933' }}>{user.fullName}</span>
                        </p>
                    </div>
                )}

                <div>
                    <label style={labelStyle}>Nueva contraseña *</label>
                    <div className="relative">
                        <input type={showPassword ? 'text' : 'password'} value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={inputStyle} placeholder="Mínimo 6 caracteres" onFocus={onFocus} onBlur={onBlur} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#666666' }}>
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <div>
                    <label style={labelStyle}>Confirmar contraseña *</label>
                    <div className="relative">
                        <input type={showPassword ? 'text' : 'password'} value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            style={inputStyle} placeholder="Repite la contraseña" onFocus={onFocus} onBlur={onBlur} />
                    </div>
                    {confirmPassword && password !== confirmPassword && (
                        <p className="text-xs mt-1" style={{ color: '#DC2626' }}>Las contraseñas no coinciden</p>
                    )}
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t" style={{ borderColor: '#E5E5E5' }}>
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm" style={{ color: '#666666' }}>Cancelar</button>
                    <button onClick={handleSave} disabled={saving || !password || password !== confirmPassword}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
                        style={{ backgroundColor: '#009933' }}>
                        <KeyRound className="w-4 h-4" />
                        {saving ? 'Actualizando...' : 'Actualizar Contraseña'}
                    </button>
                </div>
            </div>
        </Modal>
    );
}