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
  // Exact match
  if (pageTitles[pathname]) return pageTitles[pathname];
  
  // Dynamic routes (ej: /quotes/123)
  if (pathname.startsWith('/quotes/')) return 'Detalle de Cotización';
  if (pathname.startsWith('/requests/')) return 'Detalle de Solicitud';
  if (pathname.startsWith('/samples/')) return 'Detalle de Muestra';
  if (pathname.startsWith('/clients/')) return 'Detalle de Cliente';
  if (pathname.startsWith('/services/')) return 'Detalle de Servicio';
  
  return 'LAB UTM';
};

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Detectar scroll para efecto de sombra
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Escuchar cambios en el sidebar (necesitas un evento personalizado o contexto)
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
    // Aquí implementarías la lógica de cambio de tema
    document.documentElement.classList.toggle('dark');
  };

  const pageTitle = getPageTitle(location.pathname);
  const sidebarWidth = sidebarCollapsed ? 'left-20' : 'left-64';

  return (
    <>
      <nav className={`
        bg-white/80 backdrop-blur-md border-b border-gray-200 
        fixed top-0 right-0 h-16 z-20
        transition-all duration-300
        ${sidebarWidth}
        ${scrolled ? 'shadow-md' : ''}
      `}>
        <div className="h-full px-6 flex items-center justify-between">
          {/* Título de la página y breadcrumb simple */}
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-800">
              {pageTitle}
            </h1>
            {location.pathname !== '/dashboard' && (
              <span className="text-sm text-gray-400">
                {location.pathname.split('/').filter(Boolean).join(' / ')}
              </span>
            )}
          </div>

          {/* Acciones y perfil */}
          <div className="flex items-center space-x-3">
            {/* Barra de búsqueda (opcional) */}
            <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-1.5">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Buscar..."
                className="bg-transparent border-none focus:outline-none text-sm w-48"
              />
            </div>

            {/* Botón de tema */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title={isDarkMode ? "Modo claro" : "Modo oscuro"}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notificaciones */}
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Perfil de usuario con menú desplegable */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 pl-3 border-l border-gray-200 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium text-gray-700">{user?.fullName || 'Usuario'}</p>
                  <p className="text-xs text-gray-500">{user?.role || 'Administrador'}</p>
                </div>
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-sm">
                  {user?.fullName?.charAt(0) || 'A'}
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
              </button>

              {/* Menú desplegable del usuario */}
              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-40 animate-in slide-in-from-top-2 fade-in">
                    {/* Header del menú */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>

                    {/* Opciones del menú */}
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate('/settings');
                        }}
                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        Configuración
                      </button>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          // Abrir ayuda
                        }}
                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <HelpCircle className="w-4 h-4" />
                        Ayuda
                      </button>
                    </div>

                    {/* Cerrar sesión */}
                    <div className="border-t border-gray-100 py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
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

      {/* Espaciador para el contenido (ajusta el padding-top) */}
      <div className="h-16" />
    </>
  );
}