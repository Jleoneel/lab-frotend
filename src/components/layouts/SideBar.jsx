// components/layout/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { 
  FileText, 
  ClipboardList, 
  FlaskConical,
  Users,
  Beaker,
  BarChart3,
  Settings,
  ChevronRight
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

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-5 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white">LAB UTM</h1>
        <p className="text-xs text-gray-400 mt-1">Sistema de Trazabilidad</p>
      </div>
      
      <nav className="p-4">
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
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActive 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`
                    }
                  >
                    <item.icon className="w-4 h-4 mr-3" />
                    {item.name}
                    <ChevronRight className="w-3 h-3 ml-auto opacity-50" />
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}