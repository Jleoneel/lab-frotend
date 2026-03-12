// components/layout/Sidebar.jsx
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FileText, 
  ClipboardList, 
  FlaskConical,
  Users,
  Beaker,
  BarChart3,
  Settings,
  ChevronRight,
  ChevronLeft,
  Menu,
  X
} from 'lucide-react';

const navigation = [
  {
    title: 'OPERACIÓN',
    items: [
      { name: 'Cotizaciones', path: '/quotes', icon: FileText },
      { name: 'Solicitudes', path: '/requests', icon: ClipboardList },
      { name: 'Producción', path: '/production', icon: FlaskConical },
    ]
  },
  {
    title: 'CATÁLOGOS',
    items: [
      { name: 'Clientes', path: '/clients', icon: Users },
      { name: 'Servicios', path: '/services', icon: Beaker },
    ]
  },
  {
    title: 'SALIDAS',
    items: [
      { name: 'Reportes', path: '/reports', icon: BarChart3 },
    ]
  },
  {
    title: 'CONFIGURACIÓN',
    items: [
      { name: 'Ajustes', path: '/settings', icon: Settings },
    ]
  }
];

// components/layout/Sidebar.jsx
export default function Sidebar() {
  // Inicializar estado directamente desde localStorage
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    return savedState !== null ? JSON.parse(savedState) : false;
  });
  
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []); // Eliminamos setIsCollapsed de dependencias porque no cambia

  // Cerrar móvil al navegar
  const handleNavClick = () => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  // Manejar colapso/expansión
  const handleToggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    window.dispatchEvent(new CustomEvent('sidebarCollapsed', { 
      detail: { collapsed: newState } 
    }));
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
  };

  // ... resto del código igual


  // Ancho del sidebar según estado
  const sidebarWidth = isCollapsed ? 'w-20' : 'w-64';
  const mobileSidebarClass = isMobileOpen ? 'translate-x-0' : '-translate-x-full';

  // Si es móvil, mostrar menú hamburguesa y sidebar flotante
  if (isMobile) {
    return (
      <>
        {/* Botón de menú hamburguesa */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg shadow-lg hover:bg-gray-800 transition-colors"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Overlay oscuro cuando el sidebar está abierto */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* Sidebar flotante para móvil */}
        <aside className={`
          fixed left-0 top-0 h-full bg-gray-900 text-white z-50 w-64
          transform transition-transform duration-300 ease-in-out
          ${mobileSidebarClass}
        `}>
          <div className="p-5 border-b border-gray-800">
            <h1 className="text-xl font-bold text-white">LAB UTM</h1>
            <p className="text-xs text-gray-400 mt-1">Sistema de Trazabilidad</p>
          </div>
          
          <nav className="p-4 overflow-y-auto h-[calc(100vh-120px)]">
            {navigation.map((section) => (
              <div key={section.title} className="mb-6">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  {section.title}
                </h3>
                <ul className="space-y-1">
                  {section.items.map((item) => (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        onClick={handleNavClick}
                        className={({ isActive }) =>
                          `flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                            isActive 
                              ? 'bg-blue-600 text-white' 
                              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                          }`
                        }
                      >
                        <item.icon className="w-4 h-4 mr-3 flex-shrink-0" />
                        <span className="truncate">{item.name}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>
      </>
    );
  }

  // Sidebar para desktop (colapsable)
  return (
    <>
      <aside className={`
        ${sidebarWidth} bg-gray-900 text-white h-screen fixed left-0 top-0
        transition-all duration-300 ease-in-out z-30
        flex flex-col
      `}>
        {/* Header con logo */}
        <div className={`
          p-5 border-b border-gray-800 flex items-center
          ${isCollapsed ? 'justify-center' : 'justify-between'}
        `}>
          {!isCollapsed ? (
            <div>
              <h1 className="text-xl font-bold text-white">LAB UTM</h1>
              <p className="text-xs text-gray-400 mt-1">Sistema de Trazabilidad</p>
            </div>
          ) : (
            <h1 className="text-xl font-bold text-white">L</h1>
          )}
        </div>
        
        {/* Botón para colapsar/expandir */}
        <button
          onClick={handleToggleCollapse}
          className="absolute -right-3 top-20 bg-gray-800 text-white rounded-full p-1.5 hover:bg-gray-700 transition-colors shadow-lg z-40"
          title={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>

        {/* Navegación */}
        <nav className="flex-1 p-4 overflow-y-auto">
          {navigation.map((section) => (
            <div key={section.title} className="mb-6">
              {!isCollapsed && (
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  {section.title}
                </h3>
              )}
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                          isActive 
                            ? 'bg-blue-600 text-white' 
                            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        } ${isCollapsed ? 'justify-center' : ''}`
                      }
                      title={isCollapsed ? item.name : undefined}
                    >
                      <item.icon className={`w-4 h-4 flex-shrink-0 ${!isCollapsed && 'mr-3'}`} />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1">{item.name}</span>
                          <ChevronRight className="w-3 h-3 opacity-50" />
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer del sidebar (opcional) */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-800">
            <p className="text-xs text-gray-400 text-center">
              v1.0.0
            </p>
          </div>
        )}
      </aside>

      {/* Espaciador para el contenido principal */}
      <div className={`${sidebarWidth} transition-all duration-300`} />
    </>
  );
}