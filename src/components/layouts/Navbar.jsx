// components/layout/Navbar.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Bell, 
  User, 
  LogOut, 
  ChevronDown,
  Settings,
  HelpCircle,
  Moon,
  Sun,
  Search
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

// Mapeo de rutas a títulos
const pageTitles = {
  '/dashboard': 'Dashboard',
  '/quotes': 'Cotizaciones',
  '/quotes/new': 'Nueva Cotización',
  '/requests': 'Solicitudes',
  '/production': 'Producción',
  '/samples': 'Muestras',
  '/clients': 'Clientes',
  '/clients/new': 'Nuevo Cliente',
  '/services': 'Servicios',
  '/services/new': 'Nuevo Servicio',
  '/reports': 'Reportes',
  '/settings': 'Ajustes',
};

// Obtener título basado en la ruta
const getPageTitle = (pathname) => {
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (pathname.startsWith('/quotes/')) return 'Detalle de Cotización';
  if (pathname.startsWith('/requests/')) return 'Detalle de Solicitud';
  if (pathname.startsWith('/samples/')) return 'Detalle de Muestra';
  if (pathname.startsWith('/clients/')) return 'Detalle de Cliente';
  if (pathname.startsWith('/services/')) return 'Detalle de Servicio';
  return 'CABA UTM';
};

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleSidebarChange = (e) => {
      setSidebarCollapsed(e.detail.collapsed);
    };
    window.addEventListener('sidebarCollapsed', handleSidebarChange);
    return () => window.removeEventListener('sidebarCollapsed', handleSidebarChange);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const pageTitle = getPageTitle(location.pathname);
  const sidebarWidth = sidebarCollapsed ? 'left-20' : 'left-64';

  return (
    <>
      <nav className={`
        bg-white border-b fixed top-0 right-0 h-16 z-20
        transition-all duration-300
        ${sidebarWidth}
        ${scrolled ? 'shadow-md' : ''}
      `} style={{ borderBottomColor: '#E5E5E5' }}>
        <div className="h-full px-6 flex items-center justify-between">
          {/* Título de la página */}
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold" style={{ color: '#009933', fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>
              {pageTitle}
            </h1>
            {location.pathname !== '/dashboard' && (
              <span className="text-sm" style={{ color: '#666666', fontFamily: "'Montserrat', sans-serif" }}>
                {location.pathname.split('/').filter(Boolean).join(' / ')}
              </span>
            )}
          </div>

          {/* Acciones y perfil */}
          <div className="flex items-center space-x-3">
            {/* Barra de búsqueda */}
            <div className="hidden md:flex items-center rounded-lg px-3 py-1.5 transition-colors" style={{ backgroundColor: '#F5F5F5' }}>
              <Search className="w-4 h-4 mr-2" style={{ color: '#666666' }} />
              <input
                type="text"
                placeholder="Buscar..."
                className="bg-transparent border-none focus:outline-none text-sm w-48"
                style={{ color: '#333333', fontFamily: "'Montserrat', sans-serif" }}
              />
            </div>

            {/* Botón de tema */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg transition-colors"
              style={{ color: '#666666' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F5F5F5'; e.currentTarget.style.color = '#009933'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#666666'; }}
              title={isDarkMode ? "Modo claro" : "Modo oscuro"}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notificaciones */}
            <button
              className="p-2 rounded-lg transition-colors relative"
              style={{ color: '#666666' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F5F5F5'; e.currentTarget.style.color = '#009933'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#666666'; }}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: '#FFCC33' }}></span>
            </button>

            {/* Perfil de usuario */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 pl-3 rounded-lg transition-colors"
                style={{ borderLeftColor: '#E5E5E5' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F5F5'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium" style={{ color: '#333333', fontFamily: "'Montserrat', sans-serif" }}>
                    {user?.fullName || 'Usuario'}
                  </p>
                  <p className="text-xs" style={{ color: '#666666', fontFamily: "'Montserrat', sans-serif" }}>
                    {user?.role || 'Administrador'}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white shadow-sm" style={{ backgroundColor: '#009933' }}>
                  {user?.fullName?.charAt(0) || 'A'}
                </div>
                <ChevronDown className="w-4 h-4 hidden md:block" style={{ color: '#666666' }} />
              </button>

              {/* Menú desplegable */}
              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowUserMenu(false)} />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border py-2 z-40 animate-in slide-in-from-top-2 fade-in" style={{ borderColor: '#E5E5E5' }}>
                    <div className="px-4 py-3 border-b" style={{ borderColor: '#E5E5E5' }}>
                      <p className="text-sm font-medium" style={{ color: '#333333', fontFamily: "'Montserrat', sans-serif" }}>{user?.fullName}</p>
                      <p className="text-xs" style={{ color: '#666666' }}>{user?.email}</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate('/settings');
                        }}
                        className="w-full px-4 py-2 text-sm flex items-center gap-2 transition-colors"
                        style={{ color: '#666666' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F5F5F5'; e.currentTarget.style.color = '#009933'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#666666'; }}
                      >
                        <Settings className="w-4 h-4" />
                        Configuración
                      </button>
                      <button
                        onClick={() => setShowUserMenu(false)}
                        className="w-full px-4 py-2 text-sm flex items-center gap-2 transition-colors"
                        style={{ color: '#666666' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F5F5F5'; e.currentTarget.style.color = '#009933'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#666666'; }}
                      >
                        <HelpCircle className="w-4 h-4" />
                        Ayuda
                      </button>
                    </div>

                    <div className="border-t py-1" style={{ borderColor: '#E5E5E5' }}>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-sm flex items-center gap-2 transition-colors"
                        style={{ color: '#FFCC33' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FFF9E8'; e.currentTarget.style.color = '#009933'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#FFCC33'; }}
                      >
                        <LogOut className="w-4 h-4" />
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="h-16" />
    </>
  );
}