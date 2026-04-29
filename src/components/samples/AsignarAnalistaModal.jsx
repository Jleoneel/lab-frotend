import { useState, useEffect } from 'react';
import { User, Save } from 'lucide-react';
import Modal from '../ui/Modal';
import { userService } from '../../services/userService';
import { sampleService } from '../../services/sampleService';
import Swal from 'sweetalert2';

export default function AsignarAnalistaModal({ isOpen, onClose, analysis, onSaved }) {
  const [analistas, setAnalistas] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadAnalistas();
      setSelectedUserId(analysis?.assignedToId || '');
    }
  }, [isOpen, analysis]);

  const loadAnalistas = async () => {
    try {
      const response = await userService.getAnalistas();
      setAnalistas(response.data || []);
    } catch (error) {
      console.error('Error cargando analistas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedUserId) {
      await Swal.fire({
        icon: 'warning',
        title: 'Selecciona un analista',
        confirmButtonColor: '#009933'
      });
      return;
    }

    setSaving(true);
    try {
      await sampleService.assignAnalista(analysis.id, selectedUserId);
      await Swal.fire({
        icon: 'success',
        title: '¡Analista asignado!',
        confirmButtonColor: '#009933',
        timer: 1500,
        timerProgressBar: true
      });
      onSaved();
      onClose();
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error al asignar',
        confirmButtonColor: '#dc3545'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Asignar Analista">
      <div className="space-y-4">

        {/* Info del análisis */}
        {analysis && (
          <div className="px-4 py-3 rounded-xl flex items-center gap-3"
            style={{ backgroundColor: '#E8F5E9', border: '1px solid #BBF7D0' }}>
            <User className="w-4 h-4 flex-shrink-0" style={{ color: '#009933' }} />
            <div>
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#666666' }}>Análisis</p>
              <p className="text-sm font-semibold" style={{ color: '#009933' }}>
                {analysis.service?.name}
              </p>
              {analysis.assignedTo && (
                <p className="text-xs mt-1" style={{ color: '#666666' }}>
                  Actualmente asignado a: <span className="font-medium">{analysis.assignedTo}</span>
                </p>
              )}
            </div>
          </div>
        )}

        {/* Lista de analistas */}
        {loading ? (
          <div className="flex justify-center py-6">
            <div className="w-8 h-8 border-4 rounded-full animate-spin"
              style={{ borderColor: '#009933', borderTopColor: '#FFCC33' }}></div>
          </div>
        ) : analistas.length === 0 ? (
          <div className="text-center py-8 rounded-xl" style={{ backgroundColor: '#F9F9F9' }}>
            <User className="w-10 h-10 mx-auto mb-2" style={{ color: '#CCCCCC' }} />
            <p className="text-sm" style={{ color: '#666666' }}>
              No hay analistas registrados
            </p>
            <p className="text-xs mt-1" style={{ color: '#999999' }}>
              Crea usuarios con rol ANALYST primero
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm font-medium" style={{ color: '#666666' }}>
              Selecciona un analista:
            </p>
            {analistas.map((analista) => (
              <div
                key={analista.id}
                onClick={() => setSelectedUserId(analista.id)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all"
                style={{
                  borderColor: selectedUserId === analista.id ? '#009933' : '#E5E5E5',
                  backgroundColor: selectedUserId === analista.id ? '#E8F5E9' : '#F9F9F9'
                }}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ backgroundColor: '#009933' }}>
                  {analista.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: '#333333' }}>
                    {analista.fullName}
                  </p>
                  <p className="text-xs" style={{ color: '#666666' }}>{analista.email}</p>
                </div>
                {selectedUserId === analista.id && (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#009933' }}>
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4 border-t" style={{ borderColor: '#E5E5E5' }}>
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm" style={{ color: '#666666' }}>
            Cancelar
          </button>
          <button onClick={handleSave} disabled={saving || !selectedUserId || loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
            style={{ backgroundColor: '#009933' }}>
            <Save className="w-4 h-4" />
            {saving ? 'Asignando...' : 'Asignar'}
          </button>
        </div>
      </div>
    </Modal>
  );
}