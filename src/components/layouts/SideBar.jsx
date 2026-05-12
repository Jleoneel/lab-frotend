import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  FileText, ClipboardList, FlaskConical, Users, Beaker,
  BarChart3, Settings, ChevronRight, ChevronLeft, Menu, X, Microscope, FolderOpen,
} from 'lucide-react';
import { fonts } from '../../styles/tokens';

// ── Navigation config

const adminNavigation = [
  {
    title: 'OPERACIÓN',
    items: [
      { name: 'Cotizaciones', path: '/quotes',     icon: FileText      },
      { name: 'Solicitudes',  path: '/requests',   icon: ClipboardList },
      { name: 'Producción',   path: '/production', icon: FlaskConical  },
    ],
  },
  {
    title: 'INVENTARIO',
    items: [
      { name: 'Reactivos',   path: '/reactivos',   icon: FlaskConical },
      { name: 'Equipos',     path: '/equipos',     icon: Microscope   },
      { name: 'Documentos',  path: '/documentos',  icon: FolderOpen   },
    ],
  },
  {
    title: 'CATÁLOGOS',
    items: [
      { name: 'Clientes',  path: '/clients',  icon: Users  },
      { name: 'Servicios', path: '/services', icon: Beaker },
      { name: 'Usuarios',  path: '/users',    icon: Users  },
    ],
  },
  {
    title: 'SALIDAS',
    items: [{ name: 'Reportes', path: '/reports', icon: BarChart3 }],
  },
  {
    title: 'CONFIGURACIÓN',
    items: [{ name: 'Ajustes', path: '/settings', icon: Settings }],
  },
];

const analystNavigation = [
  {
    title: 'MI TRABAJO',
    items: [
      { name: 'Mis Análisis', path: '/mis-analisis', icon: FlaskConical },
      { name: 'Producción',   path: '/production',   icon: FlaskConical },
      { name: 'Documentos',   path: '/documentos',   icon: FolderOpen  },
    ],
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function NavItem({ item, collapsed, onClick }) {
  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${collapsed ? 'justify-center' : ''} ${isActive ? 'active' : ''}`
      }
      style={({ isActive }) => ({
        backgroundColor: isActive ? '#FFCC33' : 'transparent',
        color: isActive ? '#009933' : '#FFFFFF',
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
      title={collapsed ? item.name : undefined}
    >
      <item.icon className={`w-4 h-4 flex-shrink-0 ${!collapsed ? 'mr-3' : ''}`} />
      {!collapsed && (
        <>
          <span className="flex-1">{item.name}</span>
          <ChevronRight className="w-3 h-3 opacity-70" style={{ color: '#FFCC33' }} />
        </>
      )}
    </NavLink>
  );
}

function NavSection({ section, collapsed, onNavClick }) {
  return (
    <div className="mb-6">
      {!collapsed && (
        <h3
          className="text-xs font-semibold uppercase tracking-wider mb-2"
          style={{ color: '#FFFFFF' }}
        >
          {section.title}
        </h3>
      )}
      <ul className="space-y-1">
        {section.items.map((item) => (
          <li key={item.path}>
            <NavItem item={item} collapsed={collapsed} onClick={onNavClick} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function BrandHeader({ collapsed }) {
  return (
    <div className="p-5 border-b" style={{ borderColor: '#FFCC33' }}>
      {collapsed ? (
        <h1 className="text-xl font-bold text-center" style={{ color: '#FFCC33', fontFamily: fonts.heading }}>C</h1>
      ) : (
        <>
          <h1 className="text-xl font-bold" style={{ color: '#FFCC33', fontFamily: fonts.heading }}>CABA UTM</h1>
          <p className="text-xs mt-1" style={{ color: '#FFFFFF' }}>Centro de Análisis Biológico y Agroalimentario</p>
        </>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function Sidebar() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';
  const navigation = isAdmin ? adminNavigation : analystNavigation;

  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved !== null ? JSON.parse(saved) : false;
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsCollapsed(true);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleToggleCollapse = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    window.dispatchEvent(new CustomEvent('sidebarCollapsed', { detail: { collapsed: next } }));
    localStorage.setItem('sidebarCollapsed', JSON.stringify(next));
  };

  // ── Mobile ──────────────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="fixed top-4 left-4 z-50 p-2 text-white rounded-lg shadow-lg transition-colors"
          style={{ backgroundColor: '#009933' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#00802b')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#009933')}
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
          className={`fixed left-0 top-0 h-full z-50 w-64 transform transition-transform duration-300 ease-in-out ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
          style={{ backgroundColor: '#009933' }}
        >
          <BrandHeader collapsed={false} />
          <nav className="p-4 overflow-y-auto h-[calc(100vh-120px)]">
            {navigation.map((section) => (
              <NavSection
                key={section.title}
                section={section}
                collapsed={false}
                onNavClick={() => setIsMobileOpen(false)}
              />
            ))}
          </nav>
        </aside>
      </>
    );
  }

  // ── Desktop ─────────────────────────────────────────────────────────────────
  const sidebarWidth = isCollapsed ? 'w-20' : 'w-64';

  return (
    <>
      <aside
        className={`${sidebarWidth} h-screen fixed left-0 top-0 transition-all duration-300 ease-in-out z-30 flex flex-col shadow-xl`}
        style={{ backgroundColor: '#009933' }}
      >
        <div
          className={`p-5 border-b flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}
          style={{ borderColor: '#FFCC33' }}
        >
          <BrandHeader collapsed={isCollapsed} />
        </div>

        <button
          onClick={handleToggleCollapse}
          className="absolute -right-3 top-20 rounded-full p-1.5 transition-colors shadow-lg border z-40"
          style={{ backgroundColor: '#009933', borderColor: '#FFCC33', color: '#FFCC33' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#00802b')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#009933')}
          title={isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        <nav className="flex-1 p-4 overflow-y-auto">
          {navigation.map((section) => (
            <NavSection
              key={section.title}
              section={section}
              collapsed={isCollapsed}
              onNavClick={undefined}
            />
          ))}
        </nav>

        {!isCollapsed && (
          <div className="p-4 border-t" style={{ borderColor: '#FFCC33' }}>
            <p className="text-xs text-center" style={{ color: '#FFFFFF' }}>
              Centro de Análisis Biológico y Agroalimentario
            </p>
          </div>
        )}
      </aside>

      <div className={`${sidebarWidth} transition-all duration-300`} />
    </>
  );
}
