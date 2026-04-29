import { useState } from 'react';
import { Save, Eye, EyeOff } from 'lucide-react';
import Modal from '../ui/Modal';
import { userService } from '../../services/userService';
import Swal from 'sweetalert2';

export default function NuevoUsuarioModal({ isOpen, onClose, onSaved }) {
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '', role: 'ANALYST' });
    const [showPassword, setShowPassword] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSave = async () => {
        if (!formData.fullName || !formData.email || !formData.password) {
            await Swal.fire({ icon: 'warning', title: 'Campos requeridos', text: 'Todos los campos son obligatorios', confirmButtonColor: '#009933' });
            return;
        }
        if (formData.password.length < 6) {
            await Swal.fire({ icon: 'warning', title: 'Contraseña muy corta', text: 'Mínimo 6 caracteres', confirmButtonColor: '#009933' });
            return;
        }
        setSaving(true);
        try {
            await userService.create(formData);
            await Swal.fire({ icon: 'success', title: '¡Usuario creado!', confirmButtonColor: '#009933', timer: 1500, timerProgressBar: true });
            setFormData({ fullName: '', email: '', password: '', role: 'ANALYST' });
            onSaved();
            onClose();
        } catch (error) {
            await Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'Error al crear usuario', confirmButtonColor: '#dc3545' });
        } finally {
            setSaving(false);
        }
    };

    const inputStyle = { width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: '12px', fontSize: '14px', color: '#333333', outline: 'none' };
    const labelStyle = { display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px', color: '#666666' };
    const onFocus = (e) => { e.currentTarget.style.borderColor = '#009933'; e.currentTarget.style.boxShadow = '0 0 0 2px #00993320'; };
    const onBlur = (e) => { e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.boxShadow = 'none'; };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Nuevo Usuario">
            <div className="space-y-4">
                <div>
                    <label style={labelStyle}>Nombre completo *</label>
                    <input name="fullName" value={formData.fullName} onChange={handleChange}
                        style={inputStyle} placeholder="Ej: Juan Pérez" onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div>
                    <label style={labelStyle}>Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange}
                        style={inputStyle} placeholder="Ej: juan@utm.edu.ec" onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div>
                    <label style={labelStyle}>Contraseña *</label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password" value={formData.password} onChange={handleChange}
                            style={{ ...inputStyle, paddingRight: '2.5rem' }}
                            placeholder="Mínimo 6 caracteres" onFocus={onFocus} onBlur={onBlur} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                            style={{ color: '#666666' }}>
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
                <div>
                    <label style={labelStyle}>Rol *</label>
                    <select name="role" value={formData.role} onChange={handleChange}
                        style={{ ...inputStyle, appearance: 'auto' }}>
                        <option value="ANALYST">Analista</option>
                        <option value="ADMIN">Administrador</option>
                    </select>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t" style={{ borderColor: '#E5E5E5' }}>
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm" style={{ color: '#666666' }}>Cancelar</button>
                    <button onClick={handleSave} disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
                        style={{ backgroundColor: '#009933' }}>
                        <Save className="w-4 h-4" />
                        {saving ? 'Creando...' : 'Crear Usuario'}
                    </button>
                </div>
            </div>
        </Modal>
    );
}