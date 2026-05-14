import { useState } from 'react';
import { Calendar, Save } from 'lucide-react';
import Modal from '../ui/Modal';
import { equipoService } from '../../services/equipoService';
import Swal from 'sweetalert2';

export default function RegistrarCalibracionModal({ isOpen, onClose, equipo, onSaved }) {
  const [fecha, setFecha] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [saving, setSaving] = useState(false);

  const inputStyle = {
    width: '100%', padding: '8px 12px', border: '1px solid #E5E5E5',
    borderRadius: '12px', fontSize: '14px', color: '#333333', outline: 'none'
  };
  const onFocus = (e) => { e.currentTarget.style.borderColor = '#009933'; e.currentTarget.style.boxShadow = '0 0 0 2px #00993320'; };
  const onBlur = (e) => { e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.boxShadow = 'none'; };

  const handleSave = async () => {
    if (!fecha) return Swal.fire({ icon: 'warning', title: 'Selecciona la nueva fecha', confirmButtonColor: '#009933' });

    setSaving(true);
    try {
      await equipoService.update(equipo.id, {
        fechaCalibracion: new Date(fecha).toISOString(),
        ...(observaciones.trim() ? { observaciones } : {})
      });
      await Swal.fire({
        icon: 'success',
        title: '¡Calibración registrada!',
        text: `Próxima calibración: ${new Date(fecha).toLocaleDateString('es-EC')}`,
        confirmButtonColor: '#009933',
        timer: 2000,
        timerProgressBar: true
      });
      setFecha('');
      setObservaciones('');
      onSaved();
      onClose();
      //eslint-disable-next-line
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo registrar', confirmButtonColor: '#dc3545' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar Calibración">
      <div className="space-y-4">

        {equipo && (
          <div className="px-4 py-3 rounded-xl flex items-center gap-3"
            style={{ backgroundColor: '#E8F5E9', border: '1px solid #BBF7D0' }}>
            <Calendar className="w-4 h-4 flex-shrink-0" style={{ color: '#009933' }} />
            <div>
              <p className="text-sm font-medium" style={{ color: '#009933' }}>{equipo.nombre}</p>
              <p className="text-xs" style={{ color: '#666666' }}>
                Calibración anterior: {equipo.fechaCalibracion
                  ? new Date(equipo.fechaCalibracion).toLocaleDateString('es-EC')
                  : 'Sin registro'}
              </p>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#666666' }}>
            Nueva fecha de calibración *
          </label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            style={inputStyle}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#666666' }}>
            Observaciones (opcional)
          </label>
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            rows={3}
            placeholder="Ej: Calibrado por empresa XYZ, certificado #123..."
            className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none resize-none"
            style={{ borderColor: '#E5E5E5', color: '#333333' }}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t" style={{ borderColor: '#E5E5E5' }}>
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm" style={{ color: '#666666' }}>
            Cancelar
          </button>
          <button onClick={handleSave} disabled={saving || !fecha}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
            style={{ backgroundColor: '#009933' }}>
            <Save className="w-4 h-4" />
            {saving ? 'Guardando...' : 'Registrar'}
          </button>
        </div>
      </div>
    </Modal>
  );
}