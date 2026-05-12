import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Bell, ChevronDown, Moon, Sun } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { mensajeService } from "../../services/mensajeService";
import CambiarPasswordModal from "../users/CambiarPasswordModal";
import NotificationDropdown from "./NotificationDropdown";
import UserMenuDropdown from "./UserMenuDropdown";
import MensajeModal from "./MensajeModal";
import ConversacionModal from "./ConversacionModal";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/quotes": "Cotizaciones",
  "/quotes/new": "Nueva Cotización",
  "/requests": "Solicitudes",
  "/production": "Producción",
  "/samples": "Muestras",
  "/clients": "Clientes",
  "/clients/new": "Nuevo Cliente",
  "/services": "Servicios",
  "/services/new": "Nuevo Servicio",
  "/reports": "Reportes",
  "/settings": "Ajustes",
};

const getPageTitle = (pathname) => {
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (pathname.startsWith("/quotes/")) return "Detalle de Cotización";
  if (pathname.startsWith("/requests/")) return "Detalle de Solicitud";
  if (pathname.startsWith("/samples/")) return "Detalle de Muestra";
  if (pathname.startsWith("/clients/")) return "Detalle de Cliente";
  if (pathname.startsWith("/services/")) return "Detalle de Servicio";
  return "CABA UTM";
};

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [conversacionAbierta, setConversacionAbierta] = useState(null);
  const eventSourceRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleSidebarChange = (e) => setSidebarCollapsed(e.detail.collapsed);
    window.addEventListener("sidebarCollapsed", handleSidebarChange);
    return () =>
      window.removeEventListener("sidebarCollapsed", handleSidebarChange);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const connect = () => {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
      const es = new EventSource(
        `${apiUrl}/notifications/stream?token=${token}`,
      );

      es.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          setNotifCount(data.count);
          setNotifications(data.notifications || []);
          //eslint-disable-next-line
        } catch (err) {}
      };

      es.onerror = () => {
        es.close();
        setTimeout(connect, 5000);
      };

      eventSourceRef.current = es;
    };

    connect();
    return () => eventSourceRef.current?.close();
  }, [user]);

  const handleLogout = () => {
    eventSourceRef.current?.close();
    logout();
    navigate("/login");
  };

  const handleNotifClick = async (notif) => {
    setShowNotifMenu(false);
    if (notif.tipo === "ANALISIS_PENDIENTE") navigate("/mis-analisis");
    else if (notif.tipo === "STOCK_BAJO") navigate("/reactivos");
    else if (notif.tipo === "LISTO_INFORME") navigate("/production");
    else if (
      notif.tipo === "CALIBRACION_PROXIMA" ||
      notif.tipo === "CALIBRACION_VENCIDA"
    )
      navigate("/equipos");
    else if (notif.tipo === "MENSAJE") {
      try {
        const todos = await mensajeService.getAll();
        const msg = todos.find((m) => m.id === notif.mensajeId);
        setConversacionAbierta({
          otroUserId: msg?.from?.id || notif.mensajeId,
          otroUserName: msg?.from?.fullName || notif.titulo,
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleMarkAllRead = async () => {
    await mensajeService.marcarTodosLeidos();
    setShowNotifMenu(false);
  };

  const sidebarWidth = sidebarCollapsed ? "left-20" : "left-64";

  return (
    <>
      <nav
        className={`bg-white border-b fixed top-0 right-0 h-16 z-20 transition-all duration-300 ${sidebarWidth} ${scrolled ? "shadow-md" : ""}`}
        style={{ borderBottomColor: "#E5E5E5" }}
      >
        <div className="h-full px-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold" style={{ color: "#009933" }}>
            {getPageTitle(location.pathname)}
          </h1>

          <div className="flex items-center space-x-3">
            {/* Dark mode */}
            <button
              onClick={() => {
                setIsDarkMode(!isDarkMode);
                document.documentElement.classList.toggle("dark");
              }}
              className="p-2 rounded-lg transition-colors"
              style={{ color: "#666666" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#F5F5F5";
                e.currentTarget.style.color = "#009933";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#666666";
              }}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Notificaciones */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="p-2 rounded-lg transition-colors relative"
                style={{ color: "#666666" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#F5F5F5";
                  e.currentTarget.style.color = "#009933";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#666666";
                }}
              >
                <Bell className="w-5 h-5" />
                {notifCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: "#DC2626", fontSize: "10px" }}
                  >
                    {notifCount > 9 ? "9+" : notifCount}
                  </span>
                )}
              </button>
              {showNotifMenu && (
                <NotificationDropdown
                  notifications={notifications}
                  notifCount={notifCount}
                  onClose={() => setShowNotifMenu(false)}
                  onNotifClick={handleNotifClick}
                  onMarkAllRead={handleMarkAllRead}
                />
              )}
            </div>

            {/* Perfil */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 pl-3 rounded-lg transition-colors"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#F5F5F5")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <div className="text-right hidden md:block">
                  <p
                    className="text-sm font-medium"
                    style={{ color: "#333333" }}
                  >
                    {user?.fullName || "Usuario"}
                  </p>
                  <p className="text-xs" style={{ color: "#666666" }}>
                    {user?.role || "ADMIN"}
                  </p>
                </div>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white shadow-sm"
                  style={{ backgroundColor: "#009933" }}
                >
                  {user?.fullName?.charAt(0) || "A"}
                </div>
                <ChevronDown
                  className="w-4 h-4 hidden md:block"
                  style={{ color: "#666666" }}
                />
              </button>
              {showUserMenu && (
                <UserMenuDropdown
                  user={user}
                  onClose={() => setShowUserMenu(false)}
                  onSettings={() => {
                    setShowUserMenu(false);
                    navigate("/settings");
                  }}
                  onChangePassword={() => {
                    setShowUserMenu(false);
                    setShowPasswordModal(true);
                  }}
                  onLogout={handleLogout}
                />
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="h-16" />
      <ConversacionModal
        isOpen={!!conversacionAbierta}
        onClose={() => setConversacionAbierta(null)}
        otroUserId={conversacionAbierta?.otroUserId}
        otroUserName={conversacionAbierta?.otroUserName}
      />

      <CambiarPasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </>
  );
}
