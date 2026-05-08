// components/layout/Navbar.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Bell,
  User,
  LogOut,
  ChevronDown,
  Settings,
  HelpCircle,
  Moon,
  Sun,
  X,
  KeyRound,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { mensajeService } from "../../services/mensajeService";
import CambiarPasswordModal from "../users/CambiarPasswordModal";

// Mapeo de rutas a títulos
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

// Obtener título basado en la ruta
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

  //Notificaciones
  const [notifCount, setNotifCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const eventSourceRef = useRef(null);
  const [mensajeAbierto, setMensajeAbierto] = useState(null);

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

  //Conectar SSE
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const connect = () => {
      const es = new EventSource(
        `http://localhost:4000/notifications/stream?token=${token}`,
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
        // Reconectar en 5s
        setTimeout(connect, 5000);
      };

      eventSourceRef.current = es;
    };

    connect();

    return () => {
      eventSourceRef.current?.close();
    };
  }, [user]);

  const handleLogout = () => {
    eventSourceRef.current?.close();
    logout();
    navigate("/login");
  };

  const pageTitle = getPageTitle(location.pathname);
  const sidebarWidth = sidebarCollapsed ? "left-20" : "left-64";

  const notifColors = {
    ANALISIS_PENDIENTE: { bg: "#E8F5E9", color: "#009933", dot: "#009933" },
    CALIBRACION_PROXIMA: { bg: "#FFF9E8", color: "#996600", dot: "#FFCC33" },
    CALIBRACION_VENCIDA: { bg: "#FEF2F2", color: "#DC2626", dot: "#DC2626" },
    STOCK_BAJO: { bg: "#FEF2F2", color: "#DC2626", dot: "#DC2626" },
    MENSAJE: { bg: "#EFF6FF", color: "#1D4ED8", dot: "#3B82F6" }, // 👈
  };

  return (
    <>
      <nav
        className={`bg-white border-b fixed top-0 right-0 h-16 z-20 transition-all duration-300 ${sidebarWidth} ${scrolled ? "shadow-md" : ""}`}
        style={{ borderBottomColor: "#E5E5E5" }}
      >
        <div className="h-full px-6 flex items-center justify-between">
          {/* Título */}
          <div className="flex items-center space-x-4">
            <h1
              className="text-xl font-semibold"
              style={{
                color: "#009933",
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              {pageTitle}
            </h1>
          </div>

          {/* Acciones */}
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

            {/*Notificaciones */}
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
                    className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: "#DC2626", fontSize: "10px" }}
                  >
                    {notifCount > 9 ? "9+" : notifCount}
                  </span>
                )}
              </button>

              {/* Dropdown notificaciones */}
              {showNotifMenu && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowNotifMenu(false)}
                  />
                  <div
                    className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border py-2 z-40"
                    style={{ borderColor: "#E5E5E5" }}
                  >
                    <div
                      className="px-4 py-2 border-b flex items-center justify-between"
                      style={{ borderColor: "#E5E5E5" }}
                    >
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "#333333" }}
                      >
                        Notificaciones
                      </p>
                      {notifCount > 0 && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{
                            backgroundColor: "#FEF2F2",
                            color: "#DC2626",
                          }}
                        >
                          {notifCount} pendiente{notifCount > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center">
                          <Bell
                            className="w-8 h-8 mx-auto mb-2"
                            style={{ color: "#CCCCCC" }}
                          />
                          <p className="text-sm" style={{ color: "#999999" }}>
                            Sin notificaciones
                          </p>
                        </div>
                      ) : (
                        notifications.map((notif) => {
                          const style =
                            notifColors[notif.tipo] ||
                            notifColors.ANALISIS_PENDIENTE;
                          return (
                            <div
                              key={notif.id}
                              className="px-4 py-3 border-b hover:bg-gray-50 transition-colors cursor-pointer"
                              style={{ borderColor: "#F5F5F5" }}
                              onClick={async () => {
                                setShowNotifMenu(false);
                                if (notif.tipo === "ANALISIS_PENDIENTE")
                                  navigate("/mis-analisis");
                                else if (notif.tipo === "STOCK_BAJO")
                                  navigate("/reactivos");
                                else if (
                                  notif.tipo === "CALIBRACION_PROXIMA" ||
                                  notif.tipo === "CALIBRACION_VENCIDA"
                                )
                                  navigate("/equipos");
                                else if (notif.tipo === "MENSAJE") {
                                  try {
                                    await mensajeService.marcarLeido(
                                      notif.mensajeId,
                                    );
                                    const todos = await mensajeService.getAll();
                                    const completo = todos.find(
                                      (m) => m.id === notif.mensajeId,
                                    );
                                    setMensajeAbierto({
                                      ...notif,
                                      mensaje:
                                        completo?.contenido || notif.mensaje,
                                    });
                                  } catch (e) {
                                    console.error(e);
                                  }
                                }
                              }}
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                                  style={{ backgroundColor: style.dot }}
                                ></div>
                                <div className="flex-1 min-w-0">
                                  <p
                                    className="text-xs font-semibold"
                                    style={{ color: style.color }}
                                  >
                                    {notif.titulo}
                                  </p>
                                  <p
                                    className="text-xs truncate mt-0.5"
                                    style={{ color: "#333333" }}
                                  >
                                    {notif.mensaje}
                                  </p>
                                  {notif.cliente && (
                                    <p
                                      className="text-xs mt-0.5"
                                      style={{ color: "#666666" }}
                                    >
                                      {notif.cliente}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                      {notifications.some((n) => n.tipo === "MENSAJE") && (
                        <div
                          className="px-4 py-2 border-t"
                          style={{ borderColor: "#E5E5E5" }}
                        >
                          <button
                            onClick={async () => {
                              await mensajeService.marcarTodosLeidos();
                              setShowNotifMenu(false);
                            }}
                            className="text-xs w-full text-center transition-colors"
                            style={{ color: "#666666" }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.color = "#009933")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.color = "#666666")
                            }
                          >
                            Marcar todos como leídos
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </>
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
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border py-2 z-40"
                    style={{ borderColor: "#E5E5E5" }}
                  >
                    <div
                      className="px-4 py-3 border-b"
                      style={{ borderColor: "#E5E5E5" }}
                    >
                      <p
                        className="text-sm font-medium"
                        style={{ color: "#333333" }}
                      >
                        {user?.fullName}
                      </p>
                      <p className="text-xs" style={{ color: "#666666" }}>
                        {user?.email}
                      </p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate("/settings");
                        }}
                        className="w-full px-4 py-2 text-sm flex items-center gap-2 transition-colors"
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
                        <Settings className="w-4 h-4" />
                        Configuración
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setShowPasswordModal(true);
                      }}
                      className="w-full px-4 py-2 text-sm flex items-center gap-2 transition-colors"
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
                      <KeyRound className="w-4 h-4" />
                      Cambiar contraseña
                    </button>
                    <div
                      className="border-t py-1"
                      style={{ borderColor: "#E5E5E5" }}
                    >
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-sm flex items-center gap-2 transition-colors"
                        style={{ color: "#FFCC33" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#FFF9E8";
                          e.currentTarget.style.color = "#009933";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = "#FFCC33";
                        }}
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
      {mensajeAbierto && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-lg font-semibold"
                style={{ color: "#009933" }}
              >
                {mensajeAbierto.titulo}
              </h3>
              <button
                onClick={() => setMensajeAbierto(null)}
                style={{ color: "#666666" }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div
              className="px-4 py-4 rounded-xl text-sm leading-relaxed"
              style={{
                backgroundColor: "#F9F9F9",
                color: "#333333",
                border: "1px solid #E5E5E5",
              }}
            >
              {mensajeAbierto.mensaje}
            </div>
            <p className="text-xs mt-3 text-right" style={{ color: "#999999" }}>
              {new Date(mensajeAbierto.fecha).toLocaleString("es-EC")}
            </p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setMensajeAbierto(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                style={{ backgroundColor: "#009933" }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
      <CambiarPasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </>
  );
}
