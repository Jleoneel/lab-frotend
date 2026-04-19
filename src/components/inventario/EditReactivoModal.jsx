import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import Modal from '../ui/Modal';
import { reactivoService, CATEGORIAS, UNIDADES } from '../../services/reactivoService';
import Swal from 'sweetalert2';

export default function EditReactivoModal({ isOpen, onClose, reactivo, onSaved }) {
  const [formData, setFormData] = useState({ nombre: '', categoria: '', unidad: '', stockMinimo: '0', isActive: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && reactivo) {
      setFormData({
        nombre: reactivo.nombre,
        categoria: reactivo.categoria,
        unidad: reactivo.unidad,
        stockMinimo: String(reactivo.stockMinimo),
        isActive: reactivo.isActive
      });
    }
  }, [isOpen, reactivo]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await reactivoService.update(reactivo.id, formData);
      await Swal.fire({ icon: 'success', title: '¡Actualizado!', confirmButtonColor: '#009933', timer: 1500, timerProgressBar: true });
      onSaved();
      onClose();
    } catch (error) {
      await Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar', confirmButtonColor: '#dc3545' });
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5',
    borderRadius: '12px', fontSize: '14px', color: '#333333', outline: 'none'
  };
  const labelStyle = { display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#666666' };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Reactivo">
      <div className="space-y-4">
        <div>
          <label style={labelStyle}>Nombre *</label>
          <input name="nombre" value={formData.nombre} onChange={handleChange} style={inputStyle}
            onFocus={(e) => e.currentTarget.style.borderColor = '#009933'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#E5E5E5'} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Categoría *</label>
            <select name="categoria" value={formData.categoria} onChange={handleChange} style={{ ...inputStyle, appearance: 'auto' }}>
              {Object.entries(CATEGORIAS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Unidad</label>
            <select name="unidad" value={formData.unidad} onChange={handleChange} style={{ ...inputStyle, appearance: 'auto' }}>
              {Object.entries(UNIDADES).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Stock mínimo</label>
          <input type="number" name="stockMinimo" value={formData.stockMinimo} onChange={handleChange}
            style={inputStyle} min="0" step="0.01"
            onFocus={(e) => e.currentTarget.style.borderColor = '#009933'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#E5E5E5'} />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" name="isActive" id="isActive" checked={formData.isActive} onChange={handleChange}
            className="w-4 h-4 rounded" style={{ accentColor: '#009933' }} />
          <label htmlFor="isActive" className="text-sm cursor-pointer" style={{ color: '#666666' }}>Reactivo activo</label>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t" style={{ borderColor: '#E5E5E5' }}>
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm" style={{ color: '#666666' }}>Cancelar</button>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
            style={{ backgroundColor: '#009933' }}>
            <Save className="w-4 h-4" />
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </Modal>
  );
}