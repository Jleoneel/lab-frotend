import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import Modal from '../ui/Modal';
import { equipoService, ESTADOS_EQUIPO } from '../../services/equipoService';
import Swal from 'sweetalert2';

const toDateInput = (date) => {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
};

export default function EditEquipoModal({ isOpen, onClose, equipo, onSaved }) {
  const [formData, setFormData] = useState({
    nombre: '', modelo: '', marca: '', serie: '',
    codigoInventario: '', ubicacion: '',
    fechaAdquisicion: '', fechaMantenimiento: '',
    fechaCalibracion: '', estado: 'ACTIVO'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && equipo) {
      setFormData({
        nombre: equipo.nombre || '',
        modelo: equipo.modelo || '',
        marca: equipo.marca || '',
        serie: equipo.serie || '',
        codigoInventario: equipo.codigoInventario || '',
        ubicacion: equipo.ubicacion || '',
        fechaAdquisicion: toDateInput(equipo.fechaAdquisicion),
        fechaMantenimiento: toDateInput(equipo.fechaMantenimiento),
        fechaCalibracion: toDateInput(equipo.fechaCalibracion),
        estado: equipo.estado || 'ACTIVO'
      });
    }
  }, [isOpen, equipo]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    try {
      await equipoService.update(equipo.id, formData);
      await Swal.fire({ icon: 'success', title: '¡Equipo actualizado!', confirmButtonColor: '#009933', timer: 1500, timerProgressBar: true });
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
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Equipo" size="lg">
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label style={labelStyle}>Nombre *</label>
            <input name="nombre" value={formData.nombre} onChange={handleChange} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
          </div>
          <div>
            <label style={labelStyle}>Marca</label>
            <input name="marca" value={formData.marca} onChange={handleChange} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
          </div>
          <div>
            <label style={labelStyle}>Modelo</label>
            <input name="modelo" value={formData.modelo} onChange={handleChange} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
          </div>
          <div>
            <label style={labelStyle}>Serie</label>
            <input name="serie" value={formData.serie} onChange={handleChange} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
          </div>
          <div>
            <label style={labelStyle}>Código de inventario *</label>
            <input name="codigoInventario" value={formData.codigoInventario} onChange={handleChange} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
          </div>
          <div className="col-span-2">
            <label style={labelStyle}>Ubicación</label>
            <input name="ubicacion" value={formData.ubicacion} onChange={handleChange} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
          </div>
          <div>
            <label style={labelStyle}>Fecha de adquisición</label>
            <input type="date" name="fechaAdquisicion" value={formData.fechaAdquisicion} onChange={handleChange} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
          </div>
          <div>
            <label style={labelStyle}>Estado</label>
            <select name="estado" value={formData.estado} onChange={handleChange} style={{ ...inputStyle, appearance: 'auto' }}>
              {Object.entries(ESTADOS_EQUIPO).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Fecha de mantenimiento</label>
            <input type="date" name="fechaMantenimiento" value={formData.fechaMantenimiento} onChange={handleChange} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
          </div>
          <div>
            <label style={labelStyle}>Fecha de calibración</label>
            <input type="date" name="fechaCalibracion" value={formData.fechaCalibracion} onChange={handleChange} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
          </div>
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