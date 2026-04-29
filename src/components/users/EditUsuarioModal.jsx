import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import Modal from '../ui/Modal';
import { userService } from '../../services/userService';
import Swal from 'sweetalert2';

export default function EditUsuarioModal({ isOpen, onClose, user, onSaved }) {
    const [formData, setFormData] = useState({ fullName: '', email: '', role: 'ANALYST', isActive: true });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isOpen && user) {
            setFormData({ fullName: user.fullName, email: user.email, role: user.role, isActive: user.isActive });
        }
    }, [isOpen, user]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await userService.update(user.id, formData);
            await Swal.fire({ icon: 'success', title: '¡Usuario actualizado!', confirmButtonColor: '#009933', timer: 1500, timerProgressBar: true });
            onSaved();
            onClose();
        } catch (error) {
            await Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'Error al actualizar', confirmButtonColor: '#dc3545' });
        } finally {
            setSaving(false);
        }
    };

    const inputStyle = { width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: '12px', fontSize: '14px', color: '#333333', outline: 'none' };
    const labelStyle = { display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px', color: '#666666' };
    const onFocus = (e) => { e.currentTarget.style.borderColor = '#009933'; e.currentTarget.style.boxShadow = '0 0 0 2px #00993320'; };
    const onBlur = (e) => { e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.boxShadow = 'none'; };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Editar Usuario">
            <div className="space-y-4">
                <div>
                    <label style={labelStyle}>Nombre completo *</label>
                    <input name="fullName" value={formData.fullName} onChange={handleChange}
                        style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div>
                    <label style={labelStyle}>Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange}
                        style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div>
                    <label style={labelStyle}>Rol *</label>
                    <select name="role" value={formData.role} onChange={handleChange}
                        style={{ ...inputStyle, appearance: 'auto' }}>
                        <option value="ANALYST">Analista</option>
                        <option value="ADMIN">Administrador</option>
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <input type="checkbox" name="isActive" id="isActive" checked={formData.isActive}
                        onChange={handleChange} className="w-4 h-4 rounded" style={{ accentColor: '#009933' }} />
                    <label htmlFor="isActive" className="text-sm cursor-pointer" style={{ color: '#666666' }}>
                        Usuario activo
                    </label>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t" style={{ borderColor: '#E5E5E5' }}>
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm" style={{ color: '#666666' }}>Cancelar</button>
                    <button onClick={handleSave} disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
                        style={{ backgroundColor: '#009933' }}>
                        <Save className="w-4 h-4" />
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </div>
        </Modal>
    );
}