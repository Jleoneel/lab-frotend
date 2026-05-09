import { AlertCircle, Trash2 } from 'lucide-react';
import Button from '../ui/Button';

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  description,
  detail,
  confirmLabel = 'Eliminar',
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in">
          <div className="px-6 py-4" style={{ backgroundColor: '#DC2626' }}>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-lg p-2">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Confirmar eliminación
                </h3>
                <p className="text-sm text-white/80">
                  Esta acción no se puede deshacer
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div
              className="rounded-xl p-4 mb-6"
              style={{ backgroundColor: '#FEF2F2', border: '1px solid #FEE2E2' }}
            >
              <p className="text-gray-700">{description}</p>
              {detail && (
                <p className="text-sm text-gray-500 mt-2">{detail}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <Button variant="ghost" onClick={onClose} className="order-2 sm:order-1">
                Cancelar
              </Button>
              <Button variant="danger" onClick={onConfirm} className="order-1 sm:order-2">
                <Trash2 className="w-4 h-4 mr-2" />
                {confirmLabel}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
