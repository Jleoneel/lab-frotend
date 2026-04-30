import { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import Modal from '../ui/Modal';
import { reactivoService, UNIDADES } from '../../services/reactivoService';
import Swal from 'sweetalert2';

export default function RegistrarIngresoModal({ isOpen, onClose, reactivo, onSaved }) {
  const [reactivos, setReactivos] = useState([]);
  const [formData, setFormData] = useState({ reactivoId: '', cantidad: '', observaciones: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadReactivos();
      if (reactivo) setFormData(prev => ({ ...prev, reactivoId: reactivo.id }));
    }
  }, [isOpen, reactivo]);

  const loadReactivos = async () => {
    try {
      const response = await reactivoService.getAll();
      setReactivos(response.data.filter(r => r.isActive));
    } catch (error) { }
  };

  const handleSave = async () => {
    if (!formData.reactivoId || !formData.cantidad) {
      await Swal.fire({ icon: 'warning', title: 'Campos requeridos', text: 'Selecciona un reactivo e ingresa la cantidad', confirmButtonColor: '#009933' });
      return;
    }
    setSaving(true);
    try {
      await reactivoService.registrarMovimiento({
        reactivoId: formData.reactivoId,
        tipo: 'INGRESO',
        razon: 'INICIO',
        cantidad: parseFloat(formData.cantidad),
        observaciones: formData.observaciones || null
      });
      await Swal.fire({ icon: 'success', title: '¡Ingreso registrado!', confirmButtonColor: '#009933', timer: 1500, timerProgressBar: true });
      setFormData({ reactivoId: reactivo?.id || '', cantidad: '', observaciones: '' });
      onSaved();
      onClose();
    } catch (error) {
      await Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'Error al registrar', confirmButtonColor: '#dc3545' });
    } finally {
      setSaving(false);
    }
  };

  const reactivoActual = reactivos.find(r => r.id === formData.reactivoId);
  const inputStyle = { width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5', borderRadius: '12px', fontSize: '14px', color: '#333333', outline: 'none' };
  const labelStyle = { display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#666666' };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar Ingreso de Stock">
      <div className="space-y-4">
        <div>
          <label style={labelStyle}>Reactivo *</label>
          <select value={formData.reactivoId} onChange={(e) => setFormData({ ...formData, reactivoId: e.target.value })}
            style={{ ...inputStyle, appearance: 'auto' }}>
            <option value="">Seleccionar reactivo</option>
            {reactivos.map(r => (
              <option key={r.id} value={r.id}>{r.nombre} ({r.codigo})</option>
            ))}
          </select>
        </div>

        {reactivoActual && (
          <div className="px-4 py-3 rounded-xl flex items-center gap-2 text-sm"
            style={{ backgroundColor: '#E8F5E9', border: '1px solid #BBF7D0' }}>
            <span style={{ color: '#666666' }}>Stock actual:</span>
            <span className="font-bold" style={{ color: '#009933' }}>
              {reactivoActual.stockActual} {UNIDADES[reactivoActual.unidad]}
            </span>
          </div>
        )}

        <div>
          <label style={labelStyle}>Cantidad a ingresar *</label>
          <input type="number" value={formData.cantidad}
            onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
            style={inputStyle} min="0.01" step="0.01" placeholder="0.00"
            onFocus={(e) => e.currentTarget.style.borderColor = '#009933'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#E5E5E5'} />
        </div>

        <div>
          <label style={labelStyle}>Observaciones</label>
          <textarea value={formData.observaciones}
            onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
            style={{ ...inputStyle, resize: 'none' }} rows="2" placeholder="Opcional..."
            onFocus={(e) => e.currentTarget.style.borderColor = '#009933'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#E5E5E5'} />
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t" style={{ borderColor: '#E5E5E5' }}>
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm" style={{ color: '#666666' }}>Cancelar</button>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
            style={{ backgroundColor: '#009933' }}>
            <TrendingUp className="w-4 h-4" />
            {saving ? 'Registrando...' : 'Registrar Ingreso'}
          </button>
        </div>
      </div>
    </Modal>
  );
}