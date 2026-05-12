import { Bell } from 'lucide-react';

const notifColors = {
  ANALISIS_PENDIENTE: { color: '#009933', dot: '#009933' },
  CALIBRACION_PROXIMA: { color: '#996600', dot: '#FFCC33' },
  CALIBRACION_VENCIDA: { color: '#DC2626', dot: '#DC2626' },
  STOCK_BAJO:          { color: '#DC2626', dot: '#DC2626' },
  MENSAJE:             { color: '#1D4ED8', dot: '#3B82F6' },
  LISTO_INFORME: { bg: '#F0FDF4', color: '#15803D', dot: '#22C55E' },
};

export default function NotificationDropdown({ notifications, notifCount, onClose, onNotifClick, onMarkAllRead }) {
  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div
        className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border py-2 z-40"
        style={{ borderColor: '#E5E5E5' }}
      >
        <div className="px-4 py-2 border-b flex items-center justify-between" style={{ borderColor: '#E5E5E5' }}>
          <p className="text-sm font-semibold" style={{ color: '#333333' }}>Notificaciones</p>
          {notifCount > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}>
              {notifCount} pendiente{notifCount > 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="max-h-72 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Bell className="w-8 h-8 mx-auto mb-2" style={{ color: '#CCCCCC' }} />
              <p className="text-sm" style={{ color: '#999999' }}>Sin notificaciones</p>
            </div>
          ) : (
            notifications.map((notif) => {
              const style = notifColors[notif.tipo] || notifColors.ANALISIS_PENDIENTE;
              return (
                <div
                  key={notif.id}
                  className="px-4 py-3 border-b hover:bg-gray-50 transition-colors cursor-pointer"
                  style={{ borderColor: '#F5F5F5' }}
                  onClick={() => onNotifClick(notif)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: style.dot }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold" style={{ color: style.color }}>{notif.titulo}</p>
                      <p className="text-xs truncate mt-0.5" style={{ color: '#333333' }}>{notif.mensaje}</p>
                      {notif.cliente && (
                        <p className="text-xs mt-0.5" style={{ color: '#666666' }}>{notif.cliente}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {notifications.some((n) => n.tipo === 'MENSAJE') && (
            <div className="px-4 py-2 border-t" style={{ borderColor: '#E5E5E5' }}>
              <button
                onClick={onMarkAllRead}
                className="text-xs w-full text-center transition-colors"
                style={{ color: '#666666' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#009933')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#666666')}
              >
                Marcar todos como leídos
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
