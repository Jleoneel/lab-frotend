import { useState } from 'react';
import { Save } from 'lucide-react';
import Modal from '../ui/Modal';
import { reactivoService, CATEGORIAS, UNIDADES } from '../../services/reactivoService';
import Swal from 'sweetalert2';

export default function NuevoReactivoModal({ isOpen, onClose, onSaved }) {
  const [formData, setFormData] = useState({
    codigo: '', nombre: '', categoria: '', unidad: 'LITROS', stockMinimo: '0'
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!formData.codigo || !formData.nombre || !formData.categoria) {
      await Swal.fire({ icon: 'warning', title: 'Campos requeridos', text: 'Código, nombre y categoría son obligatorios', confirmButtonColor: '#009933' });
      return;
    }
    setSaving(true);
    try {
      await reactivoService.create(formData);
      await Swal.fire({ icon: 'success', title: '¡Reactivo creado!', confirmButtonColor: '#009933', timer: 1500, timerProgressBar: true });
      setFormData({ codigo: '', nombre: '', categoria: '', unidad: 'LITROS', stockMinimo: '0' });
      onSaved();
      onClose();
    } catch (error) {
      await Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'Error al crear reactivo', confirmButtonColor: '#dc3545' });
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
    <Modal isOpen={isOpen} onClose={onClose} title="Nuevo Reactivo">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Código *</label>
            <input name="codigo" value={formData.codigo} onChange={handleChange} style={inputStyle} placeholder="Ej: ACE-001"
              onFocus={(e) => e.currentTarget.style.borderColor = '#009933'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#E5E5E5'} />
          </div>
          <div>
            <label style={labelStyle}>Unidad *</label>
            <select name="unidad" value={formData.unidad} onChange={handleChange} style={{ ...inputStyle, appearance: 'auto' }}>
              {Object.entries(UNIDADES).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Nombre *</label>
          <input name="nombre" value={formData.nombre} onChange={handleChange} style={inputStyle} placeholder="Ej: Acetona"
            onFocus={(e) => e.currentTarget.style.borderColor = '#009933'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#E5E5E5'} />
        </div>

        <div>
          <label style={labelStyle}>Categoría *</label>
          <select name="categoria" value={formData.categoria} onChange={handleChange} style={{ ...inputStyle, appearance: 'auto' }}>
            <option value="">Seleccionar categoría</option>
            {Object.entries(CATEGORIAS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Stock mínimo (alerta)</label>
          <input type="number" name="stockMinimo" value={formData.stockMinimo} onChange={handleChange}
            style={inputStyle} min="0" step="0.01"
            onFocus={(e) => e.currentTarget.style.borderColor = '#009933'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#E5E5E5'} />
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