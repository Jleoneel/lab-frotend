// pages/auth/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { authService } from "../../services/authService";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  FlaskConical,
  AlertCircle,
  Beaker,
  ArrowRight,
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!formData.email || !formData.password) {
        throw new Error("Por favor completa todos los campos");
      }

      const response = await authService.login(formData);
      login(response.data.user, response.data.token);

      setTimeout(() => {
        navigate("/quotes", { replace: true });
      }, 500);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Error al iniciar sesión",
      );
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ backgroundColor: "#F5F5F5" }}
    >
      {/* Elementos decorativos de fondo con colores UTM */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Círculos decorativos en verde UTM */}
        <div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"
          style={{ backgroundColor: "#009933" }}
        ></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float animation-delay-2000"
          style={{ backgroundColor: "#FFCC33" }}
        ></div>

        {/* Patrón de cuadrícula sutil */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(#666666 1px, transparent 1px), linear-gradient(to right, #666666 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>

        {/* Iconos de laboratorio flotantes */}
        <FlaskConical
          className="absolute top-20 left-20 w-16 h-16 opacity-10 rotate-12"
          style={{ color: "#009933" }}
        />
        <Beaker
          className="absolute bottom-20 right-20 w-20 h-20 opacity-10 -rotate-12"
          style={{ color: "#FFCC33" }}
        />
      </div>

      {/* Contenedor principal con animación */}
      <div
        className={`
        relative z-10 w-full max-w-md
        transform transition-all duration-700 ease-out
        ${mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}
      `}
      >
        {/* Tarjeta de login */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Header con verde UTM */}
          <div
            className="px-8 py-6 text-center relative overflow-hidden"
            style={{ backgroundColor: "#009933" }}
          >
            <div className="absolute inset-0 bg-white/5 skew-y-3 transform"></div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-2xl mb-4 backdrop-blur-sm border border-white/20 shadow-lg">
                <FlaskConical className="w-10 h-10 text-white" />
              </div>
              <h1
                className="text-3xl font-bold text-white mb-1"
                style={{ fontFamily: "'Trajan Pro Bold', 'Trajan Pro', serif" }}
              >
                CABA UTM
              </h1>
              <p
                className="text-white/80 text-sm font-light"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Centro de Análisis Biológico y Agroalimentario
              </p>
            </div>
          </div>

          {/* Cuerpo del formulario */}
          <div className="p-8">
            {/* Mensaje de error */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-shake">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-700">
                  <p className="font-medium mb-1">Error de autenticación</p>
                  <p className="text-red-600 text-xs">{error}</p>
                </div>
              </div>
            )}

            {/* Indicador de carga */}
            {loading && !error && (
              <div
                className="mb-6 p-4 rounded-xl flex items-center gap-3"
                style={{
                  backgroundColor: "#E8F5E9",
                  border: "1px solid #00993320",
                }}
              >
                <div
                  className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                  style={{
                    borderColor: "#009933",
                    borderTopColor: "transparent",
                  }}
                />
                <p className="text-sm" style={{ color: "#009933" }}>
                  Verificando credenciales...
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Campo Email */}
              <div className="group">
                <label
                  className="block text-sm font-medium mb-1"
                  style={{
                    color: "#666666",
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                >
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors"
                    style={{ color: "#666666" }}
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ej: investigador@lab.com"
                    required
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-gray-50/50 focus:bg-white"
                    style={{
                      borderColor: "#E5E5E5",
                      fontFamily: "'Montserrat', sans-serif",
                      color: "#333333",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#009933";
                      e.target.style.boxShadow = "0 0 0 2px #00993320";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#E5E5E5";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>

              {/* Campo Contraseña */}
              <div className="group">
                <label
                  className="block text-sm font-medium mb-1"
                  style={{
                    color: "#666666",
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                >
                  Contraseña
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors"
                    style={{ color: "#666666" }}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    className="w-full pl-10 pr-12 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all bg-gray-50/50 focus:bg-white"
                    style={{
                      borderColor: "#E5E5E5",
                      fontFamily: "'Montserrat', sans-serif",
                      color: "#333333",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#009933";
                      e.target.style.boxShadow = "0 0 0 2px #00993320";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#E5E5E5";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors"
                    style={{ color: "#666666" }}
                    tabIndex="-1"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Opciones adicionales */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded focus:ring-0 cursor-pointer"
                    style={{ accentColor: "#009933" }}
                  />
                  <span
                    className="text-sm transition-colors"
                    style={{
                      color: "#666666",
                      fontFamily: "'Montserrat', sans-serif",
                    }}
                  >
                    Recordar acceso
                  </span>
                </label>
              </div>

              {/* Botón de inicio de sesión */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                  backgroundColor: "#009933",
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 500,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#00802b")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#009933")
                }
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Iniciando sesión...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Acceder al Sistema
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                )}
              </button>
            </form>

            {/* Separador */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div
                  className="w-full border-t"
                  style={{ borderColor: "#E5E5E5" }}
                ></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span
                  className="px-4 bg-white"
                  style={{
                    color: "#666666",
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                >
                  Bienvenido, Usuario
                </span>
              </div>
            </div>

            {/* Información del sistema */}
            <div
              className="mt-6 pt-6 border-t"
              style={{ borderColor: "#E5E5E5" }}
            >
              <div
                className="flex items-center justify-center gap-2 text-xs"
                style={{
                  color: "#999999",
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                <FlaskConical
                  className="w-3 h-3"
                  style={{ color: "#009933" }}
                />
                <span>
                  CABA UTM v1.0 - Centro de Análisis Biológico y Agroalimentario
                </span>
                f
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.05);
          }
        }
        .animate-float {
          animation: float 15s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-2px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(2px);
          }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
