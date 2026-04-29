import { useState } from 'react';
import { Save } from 'lucide-react';
import Modal from '../ui/Modal';
import { equipoService, ESTADOS_EQUIPO } from '../../services/equipoService';
import Swal from 'sweetalert2';

export default function NuevoEquipoModal({ isOpen, onClose, onSaved }) {
  const [formData, setFormData] = useState({
    nombre: '', modelo: '', marca: '', serie: '',
    codigoInventario: '', ubicacion: '',
    fechaAdquisicion: '', fechaMantenimiento: '',
    fechaCalibracion: '', estado: 'ACTIVO'
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    if (!formData.nombre || !formData.codigoInventario) {
      await Swal.fire({ icon: 'warning', title: 'Campos requeridos', text: 'Nombre y código de inventario son obligatorios', confirmButtonColor: '#009933' });
      return;
    }
    setSaving(true);
    try {
      await equipoService.create(formData);
      await Swal.fire({ icon: 'success', title: '¡Equipo registrado!', confirmButtonColor: '#009933', timer: 1500, timerProgressBar: true });
      setFormData({ nombre: '', modelo: '', marca: '', serie: '', codigoInventario: '', ubicacion: '', fechaAdquisicion: '', fechaMantenimiento: '', fechaCalibracion: '', estado: 'ACTIVO' });
      onSaved();
      onClose();
    } catch (error) {
      await Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'Error al registrar', confirmButtonColor: '#dc3545' });
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = { width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: '12px', fontSize: '14px', color: '#333333', outline: 'none' };
  const labelStyle = { display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px', color: '#666666' };
  const onFocus = (e) => { e.currentTarget.style.borderColor = '#009933'; e.currentTarget.style.boxShadow = '0 0 0 2px #00993320'; };
  const onBlur = (e) => { e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.boxShadow = 'none'; };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nuevo Equipo" size="lg">
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label style={labelStyle}>Nombre *</label>
            <input name="nombre" value={formData.nombre} onChange={handleChange} style={inputStyle} placeholder="Ej: Balanza analítica" onFocus={onFocus} onBlur={onBlur} />
          </div>
          <div>
            <label style={labelStyle}>Marca</label>
            <input name="marca" value={formData.marca} onChange={handleChange} style={inputStyle} placeholder="Ej: OHAUS" onFocus={onFocus} onBlur={onBlur} />
          </div>
          <div>
            <label style={labelStyle}>Modelo</label>
            <input name="modelo" value={formData.modelo} onChange={handleChange} style={inputStyle} placeholder="Ej: PA224" onFocus={onFocus} onBlur={onBlur} />
          </div>
          <div>
            <label style={labelStyle}>Serie</label>
            <input name="serie" value={formData.serie} onChange={handleChange} style={inputStyle} placeholder="Ej: SN123456" onFocus={onFocus} onBlur={onBlur} />
          </div>
          <div>
            <label style={labelStyle}>Código de inventario *</label>
            <input name="codigoInventario" value={formData.codigoInventario} onChange={handleChange} style={inputStyle} placeholder="Ej: EQ-001" onFocus={onFocus} onBlur={onBlur} />
          </div>
          <div className="col-span-2">
            <label style={labelStyle}>Ubicación</label>
            <input name="ubicacion" value={formData.ubicacion} onChange={handleChange} style={inputStyle} placeholder="Ej: Laboratorio de Bromatología" onFocus={onFocus} onBlur={onBlur} />
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
            {saving ? 'Guardando...' : 'Registrar Equipo'}
          </button>
        </div>
      </div>
    </Modal>
  );
}