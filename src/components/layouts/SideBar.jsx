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
  X,
  Microscope
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
    title: 'INVENTARIO',
    items: [
      { name: 'Reactivos', path: '/reactivos', icon: FlaskConical },
    ]
  },
  {
    title: 'EQUIPOS',
    items: [
      { name: 'Equipos', path: '/equipos', icon: Microscope },
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

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    return savedState !== null ? JSON.parse(savedState) : false;
  });
  
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
  }, []);

  const handleNavClick = () => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const handleToggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    window.dispatchEvent(new CustomEvent('sidebarCollapsed', { 
      detail: { collapsed: newState } 
    }));
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
  };

  const sidebarWidth = isCollapsed ? 'w-20' : 'w-64';
  const mobileSidebarClass = isMobileOpen ? 'translate-x-0' : '-translate-x-full';

  // Versión móvil
  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="fixed top-4 left-4 z-50 p-2 text-white rounded-lg shadow-lg transition-colors"
          style={{ backgroundColor: '#009933' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00802b'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#009933'}
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        <aside 
          className={`
            fixed left-0 top-0 h-full z-50 w-64
            transform transition-transform duration-300 ease-in-out
            ${mobileSidebarClass}
          `}
          style={{ backgroundColor: '#009933' }}
        >
          <div className="p-5 border-b" style={{ borderColor: '#FFCC33' }}>
            <h1 className="text-xl font-bold" style={{ color: '#FFCC33', fontFamily: "'Trajan Pro Bold', 'Trajan Pro', serif" }}>
              CABA UTM
            </h1>
            <p className="text-xs mt-1" style={{ color: '#FFFFFF', fontFamily: "'Montserrat', sans-serif" }}>
              Centro de Análisis Biológico y Agroalimentario
            </p>
          </div>
          
          <nav className="p-4 overflow-y-auto h-[calc(100vh-120px)]">
            {navigation.map((section) => (
              <div key={section.title} className="mb-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#FFFFFF', fontFamily: "'Montserrat', sans-serif" }}>
                  {section.title}
                </h3>
                <ul className="space-y-1">
                  {section.items.map((item) => (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        onClick={handleNavClick}
                        className={({ isActive }) =>
                          `flex items-center px-3 py-2 rounded-lg text-sm transition-colors`
                        }
                        style={({ isActive }) => ({
                          backgroundColor: isActive ? '#FFCC33' : 'transparent',
                          color: isActive ? '#009933' : '#FFFFFF',
                          fontFamily: "'Montserrat', sans-serif"
                        })}
                        onMouseEnter={(e) => {
                          if (!e.currentTarget.classList.contains('active')) {
                            e.currentTarget.style.backgroundColor = '#FFCC33';
                            e.currentTarget.style.color = '#009933';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!e.currentTarget.classList.contains('active')) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#FFFFFF';
                          }
                        }}
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

  // Versión desktop
  return (
    <>
      <aside 
        className={`
          ${sidebarWidth} h-screen fixed left-0 top-0
          transition-all duration-300 ease-in-out z-30
          flex flex-col shadow-xl
        `}
        style={{ backgroundColor: '#009933' }}
      >
        <div className={`
          p-5 border-b flex items-center
          ${isCollapsed ? 'justify-center' : 'justify-between'}
        `}
        style={{ borderColor: '#FFCC33' }}
        >
          {!isCollapsed ? (
            <div>
              <h1 className="text-xl font-bold" style={{ color: '#FFCC33', fontFamily: "'Trajan Pro Bold', 'Trajan Pro', serif" }}>
                CABA UTM
              </h1>
              <p className="text-xs mt-1" style={{ color: '#FFFFFF', fontFamily: "'Montserrat', sans-serif" }}>
                Centro de Análisis Biológico y Agroalimentario
              </p>
            </div>
          ) : (
            <h1 className="text-xl font-bold" style={{ color: '#FFCC33', fontFamily: "'Trajan Pro Bold', 'Trajan Pro', serif" }}>
              C
            </h1>
          )}
        </div>
        
        <button
          onClick={handleToggleCollapse}
          className="absolute -right-3 top-20 rounded-full p-1.5 transition-colors shadow-lg border z-40"
          style={{
            backgroundColor: '#009933',
            borderColor: '#FFCC33',
            color: '#FFCC33'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00802b'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#009933'}
          title={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>

        <nav className="flex-1 p-4 overflow-y-auto">
          {navigation.map((section) => (
            <div key={section.title} className="mb-6">
              {!isCollapsed && (
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#FFFFFF', fontFamily: "'Montserrat', sans-serif" }}>
                  {section.title}
                </h3>
              )}
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${isCollapsed ? 'justify-center' : ''}`
                      }
                      style={({ isActive }) => ({
                        backgroundColor: isActive ? '#FFCC33' : 'transparent',
                        color: isActive ? '#009933' : '#FFFFFF',
                        fontFamily: "'Montserrat', sans-serif"
                      })}
                      onMouseEnter={(e) => {
                        if (!e.currentTarget.classList.contains('active')) {
                          e.currentTarget.style.backgroundColor = '#FFCC33';
                          e.currentTarget.style.color = '#009933';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!e.currentTarget.classList.contains('active')) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#FFFFFF';
                        }
                      }}
                      title={isCollapsed ? item.name : undefined}
                    >
                      <item.icon className={`w-4 h-4 flex-shrink-0 ${!isCollapsed && 'mr-3'}`} />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1">{item.name}</span>
                          <ChevronRight className="w-3 h-3 opacity-70" style={{ color: '#FFCC33' }} />
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {!isCollapsed && (
          <div className="p-4 border-t" style={{ borderColor: '#FFCC33' }}>
            <p className="text-xs text-center" style={{ color: '#FFFFFF', fontFamily: "'Montserrat', sans-serif" }}>
              Centro de Análisis Biológico y Agroalimentario
            </p>
          </div>
        )}
      </aside>

      <div className={`${sidebarWidth} transition-all duration-300`} />
    </>
  );
}