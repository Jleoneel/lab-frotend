import { Settings, KeyRound, LogOut } from 'lucide-react';

//eslint-disable-next-line
function MenuButton({ icon: Icon, onClick, children, gold }) {
  const baseColor = gold ? '#FFCC33' : '#666666';
  const hoverBg = gold ? '#FFF9E8' : '#F5F5F5';
  return (
    <button
      onClick={onClick}
      className="w-full px-4 py-2 text-sm flex items-center gap-2 transition-colors"
      style={{ color: baseColor }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = hoverBg; e.currentTarget.style.color = '#009933'; }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = baseColor; }}
    >
      <Icon className="w-4 h-4" />
      {children}
    </button>
  );
}

export default function UserMenuDropdown({ user, onClose, onSettings, onChangePassword, onLogout }) {
  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div
        className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border py-2 z-40"
        style={{ borderColor: '#E5E5E5' }}
      >
        <div className="px-4 py-3 border-b" style={{ borderColor: '#E5E5E5' }}>
          <p className="text-sm font-medium" style={{ color: '#333333' }}>{user?.fullName}</p>
          <p className="text-xs" style={{ color: '#666666' }}>{user?.email}</p>
        </div>
        <div className="py-1">
          <MenuButton icon={Settings} onClick={onSettings}>Configuración</MenuButton>
          <MenuButton icon={KeyRound} onClick={onChangePassword}>Cambiar contraseña</MenuButton>
        </div>
        <div className="border-t py-1" style={{ borderColor: '#E5E5E5' }}>
          <MenuButton icon={LogOut} onClick={onLogout} gold>Cerrar sesión</MenuButton>
        </div>
      </div>
    </>
  );
}
