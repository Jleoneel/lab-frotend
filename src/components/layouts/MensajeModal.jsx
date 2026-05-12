import { X } from 'lucide-react';

export default function MensajeModal({ mensaje, onClose }) {
  if (!mensaje) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold" style={{ color: '#009933' }}>{mensaje.titulo}</h3>
          <button onClick={onClose} style={{ color: '#666666' }}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <div
          className="px-4 py-4 rounded-xl text-sm leading-relaxed"
          style={{ backgroundColor: '#F9F9F9', color: '#333333', border: '1px solid #E5E5E5' }}
        >
          {mensaje.mensaje}
        </div>
        <p className="text-xs mt-3 text-right" style={{ color: '#999999' }}>
          {new Date(mensaje.fecha).toLocaleString('es-EC')}
        </p>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ backgroundColor: '#009933' }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
