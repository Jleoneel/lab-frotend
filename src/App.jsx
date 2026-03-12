// App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";

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
import ServiceForm from './pages/services/ServiceForm';

// Componente para rutas protegidas
const RutaProtegida = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/login" element={<Login />} />

      {/* Redirección por defecto */}
      <Route path="/" element={<Navigate to="/quotes" replace />} />

      {/* Rutas protegidas */}
      <Route
        path="/"
        element={
          <RutaProtegida>
            <LayoutPrincipal />
          </RutaProtegida>
        }
      >
        {/* OPERACIÓN - Flujo principal */}
        <Route path="quotes" element={<QuotesList />} />
        <Route path="quotes/new" element={<NewQuote />} />
        <Route path="quotes/:id" element={<QuoteDetail />} />

        <Route path="requests" element={<RequestsList />} />
        <Route path="requests/:id" element={<RequestDetail />} />

        <Route path="production" element={<ProductionKanban />} />
        <Route path="samples/:id" element={<SampleDetail />} />

        {/* CATÁLOGOS */}
        <Route path="clients" element={<ClientsList />} />
        <Route path="clients/new" element={<ClientForm />} />
        <Route path="clients/:id" element={<ClientForm />} />

        <Route path="services" element={<ServicesList />} />
        <Route path="services/new" element={<ServiceForm />} />
        <Route path="services/:id" element={<ServiceForm />} />

        {/* SALIDAS (placeholder) */}
        <Route path="reports" element={<div>Reportes - Próximamente</div>} />

        {/* CONFIGURACIÓN (placeholder) */}
        <Route
          path="settings"
          element={<div>Configuración - Próximamente</div>}
        />

        {/* 404 dentro de la app */}
        <Route path="*" element={<div>Página no encontrada</div>} />
      </Route>

      {/* 404 general */}
      <Route path="*" element={<div>Página no encontrada</div>} />
    </Routes>
  );
}

export default App;
