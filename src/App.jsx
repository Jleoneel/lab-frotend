// App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import MisAnalisis from './pages/analyst/MisAnalisis';

// Layout
import LayoutPrincipal from "./components/layouts/LayoutPrincipal";

// Auth
import Login from "./pages/auth/Login";

// Módulo Cotizaciones
import QuotesList from "./pages/quotes/QuotesList";
import QuoteDetail from "./pages/quotes/QuoteDetail";
import NewQuote from "./pages/quotes/NewQuote";

// Módulo Solicitudes
import RequestsList from "./pages/requests/RequestsList";
import RequestDetail from "./pages/requests/RequestDetail";

// Módulo Producción
import ProductionKanban from "./pages/production/ProductionKanban";
import SampleDetail from "./pages/samples/SampleDetail";

// Catálogos
import ClientsList from "./pages/clients/ClientsList";
import ClientForm from "./pages/clients/ClientForm";
import ServicesList from "./pages/services/ServicesList";
import ServiceForm from "./pages/services/ServiceForm";

import SettingsPage from "./pages/settings/SettingsPage";

// REACTIVOS
import ReactivosList from './pages/inventario/ReactivosList';

// EQUIPOS
import EquiposList from './pages/inventario/EquiposList';

// Usuarios
import UsersList from './pages/users/UsersList';

// Documentos
import DocumentosPage from './pages/documentos/DocumentosPage';

//MENSAJES
import MensajesPage from './pages/mensajes/MensajesPage';

//REPORTES
import ReportsPage from './pages/reports/ReportsPage';

// Seguimiento
import SeguimientoPage from './pages/public/SeguimientoPage';

// Componente para rutas protegidas (solo autenticado)
const RutaProtegida = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Componente para rutas solo admin
const SoloAdmin = ({ children }) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/mis-analisis" replace />;
  }

  return children;
};

// Componente para rutas solo analyst (o roles no-admin)
const SoloAnalyst = ({ children }) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si es ADMIN, también puede acceder (opcional, según tu lógica)
  if (user?.role === 'ANALYST') {
    return children;
  }

  // Si es ADMIN, redirige a quotes o dashboard
  if (user?.role === 'ADMIN') {
    return <Navigate to="/quotes" replace />;
  }

  return <Navigate to="/mis-analisis" replace />;
};

function App() {
  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/login" element={<Login />} />

      <Route path="/seguimiento/:sampleCode" element={<SeguimientoPage />} />

      {/* Redirección por defecto basada en rol */}
      <Route path="/" element={<Navigate to="/quotes" replace />} />


      {/* Rutas protegidas - Layout principal */}
      <Route
        path="/"
        element={
          <RutaProtegida>
            <LayoutPrincipal />
          </RutaProtegida>
        }
      >
        {/* Ruta específica para ANALYST */}
        <Route path="mis-analisis" element={<MisAnalisis />} />

        {/* RUTAS SOLO ADMIN */}
        {/* OPERACIÓN - Flujo principal */}
        <Route path="quotes" element={<SoloAdmin><QuotesList /></SoloAdmin>} />
        <Route path="quotes/new" element={<SoloAdmin><NewQuote /></SoloAdmin>} />
        <Route path="quotes/:id" element={<SoloAdmin><QuoteDetail /></SoloAdmin>} />

        <Route path="requests" element={<SoloAdmin><RequestsList /></SoloAdmin>} />
        <Route path="requests/:id" element={<SoloAdmin><RequestDetail /></SoloAdmin>} />

        {/* CATÁLOGOS - Solo admin */}
        <Route path="clients" element={<SoloAdmin><ClientsList /></SoloAdmin>} />
        <Route path="clients/new" element={<SoloAdmin><ClientForm /></SoloAdmin>} />
        <Route path="clients/:id" element={<SoloAdmin><ClientForm /></SoloAdmin>} />

        <Route path="services" element={<SoloAdmin><ServicesList /></SoloAdmin>} />
        <Route path="services/new" element={<SoloAdmin><ServiceForm /></SoloAdmin>} />
        <Route path="services/:id" element={<SoloAdmin><ServiceForm /></SoloAdmin>} />

        {/* INVENTARIO - Solo admin */}
        <Route path="reactivos" element={<SoloAdmin><ReactivosList /></SoloAdmin>} />
        <Route path="equipos" element={<SoloAdmin><EquiposList /></SoloAdmin>} />

        {/* Usuarios - Solo admin */}
        <Route path="users" element={<SoloAdmin><UsersList /></SoloAdmin>} />

        {/* Configuración - Solo admin */}
        <Route path="settings" element={<SoloAdmin><SettingsPage /></SoloAdmin>} />

        {/* RUTAS ACCESIBLES PARA AMBOS ROLES */}
        {/* Producción - ambos roles pueden ver */}
        <Route path="production" element={<ProductionKanban />} />
        <Route path="samples/:id" element={<SampleDetail />} />
        <Route path="documentos" element={<DocumentosPage />} />
        <Route path="mensajes" element={<MensajesPage />} />

        {/* Reportes (placeholder) */}
        <Route path="reports" element={<ReportsPage />} />

        {/* 404 dentro de la app */}
        <Route path="*" element={<div>Página no encontrada</div>} />
      </Route>

      {/* 404 general */}
      <Route path="*" element={<div>Página no encontrada</div>} />
    </Routes>
  );
}

export default App;