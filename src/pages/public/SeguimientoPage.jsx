// pages/public/SeguimientoPage.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  CheckCircle,
  Clock,
  Loader,
  AlertCircle,
  FlaskConical,
  Calendar,
  User,
  MapPin,
  QrCode,
  TrendingUp,
  FileText,
  Beaker,
  ArrowRight
} from "lucide-react";

const STATUS_LABELS = {
  EN_COLA: { label: "En Cola", color: "#666666", bg: "#F5F5F5", step: 1 },
  EN_PROCESO: { label: "En Proceso", color: "#996600", bg: "#FFF9E8", step: 2 },
  LISTO_PARA_INFORME: {
    label: "Listo para Informe",
    color: "#1D4ED8",
    bg: "#EFF6FF",
    step: 3,
  },
  TERMINADO: { label: "Completado", color: "#009933", bg: "#E8F5E9", step: 4 },
};

const SERVICE_STATUS = {
  PENDING: { label: "Pendiente", icon: Clock, color: "#666666" },
  RUNNING: { label: "En proceso", icon: Loader, color: "#996600" },
  DONE: { label: "Completado", icon: CheckCircle, color: "#009933" },
};

const STEPS = [
  { step: 1, label: "Recibido", icon: "📦" },
  { step: 2, label: "En Análisis", icon: "🔬" },
  { step: 3, label: "Listo para Informe", icon: "📄" },
  { step: 4, label: "Completado", icon: "✅" },
];

export default function SeguimientoPage() {
  const { sampleCode } = useParams();
  const [sample, setSample] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const load = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
        const response = await fetch(`${apiUrl}/public/samples/${sampleCode}`);

        if (response.status === 404) {
          setError("No se encontró la muestra");
          return;
        }
        if (!response.ok) {
          setError("Error al cargar la información");
          return;
        }

        const data = await response.json();
        setSample(data);
      } catch (e) {
        setError("Error al cargar la información");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [sampleCode]);

  const statusInfo = sample
    ? STATUS_LABELS[sample.status] || STATUS_LABELS.EN_COLA
    : null;
  const currentStep = statusInfo?.step || 1;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAFAFA" }}>
      {/* Header con gradiente */}
      <div className="relative overflow-hidden" style={{ backgroundColor: "#009933" }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-white" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-white" />
        </div>
        <div className="max-w-2xl mx-auto px-4 py-6 flex items-center justify-between relative">
          <div>
            <h1
              className="text-xl font-bold text-white"
              style={{ fontFamily: "'Trajan Pro Bold', serif" }}
            >
              CABA UTM
            </h1>
            <p className="text-xs text-white/80 mt-0.5">
              Centro de Análisis Biológico y Agroalimentario
            </p>
          </div>
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ backgroundColor: "#FFCC33" }}
          >
            <FlaskConical className="w-6 h-6" style={{ color: "#009933" }} />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div
              className="w-12 h-12 border-4 rounded-full animate-spin"
              style={{ borderColor: "#009933", borderTopColor: "#FFCC33" }}
            ></div>
            <p className="text-sm font-medium" style={{ color: "#666666" }}>
              Buscando muestra...
            </p>
            <p className="text-xs" style={{ color: "#999999" }}>
              Código: {sampleCode}
            </p>
          </div>
        ) : error ? (
          <div
            className="bg-white rounded-2xl border p-10 text-center shadow-sm animate-in fade-in zoom-in duration-300"
            style={{ borderColor: "#E5E5E5" }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: "#FEF2F2" }}
            >
              <AlertCircle className="w-10 h-10" style={{ color: "#DC2626" }} />
            </div>
            <p className="text-lg font-semibold" style={{ color: "#333333" }}>
              {error}
            </p>
            <p className="text-sm mt-2" style={{ color: "#666666" }}>
              Verifica el código QR e intenta nuevamente
            </p>
            <div className="mt-6 p-4 rounded-xl" style={{ backgroundColor: "#F9F9F9" }}>
              <QrCode className="w-8 h-8 mx-auto mb-2" style={{ color: "#CCCCCC" }} />
              <p className="text-xs" style={{ color: "#999999" }}>
                Código buscado: <span className="font-mono">{sampleCode}</span>
              </p>
            </div>
          </div>
        ) : (
          <div className={`space-y-5 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {/* Tarjeta principal - Código y estado */}
            <div
              className="bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition-all duration-200"
              style={{ borderColor: "#E5E5E5" }}
            >
              <div className="p-5 border-b" style={{ borderColor: "#E5E5E5", backgroundColor: "#F9F9F9" }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4" style={{ color: "#009933" }} />
                    <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "#666666" }}>
                      Código de muestra
                    </p>
                  </div>
                  <span
                    className="px-3 py-1.5 rounded-full text-sm font-medium shadow-sm"
                    style={{
                      backgroundColor: statusInfo?.bg,
                      color: statusInfo?.color,
                    }}
                  >
                    {statusInfo?.label}
                  </span>
                </div>
                <p
                  className="text-3xl font-bold mt-2 font-mono"
                  style={{ color: "#009933" }}
                >
                  {sample.sampleCode}
                </p>
                {sample.sampleName && (
                  <p className="text-sm mt-1" style={{ color: "#666666" }}>
                    {sample.sampleName}
                  </p>
                )}
              </div>

              {/* Información de la muestra */}
              <div className="p-5 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#666666" }}>
                  Información de la muestra
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {sample.objetivoAnalisis && (
                    <div className="flex items-start gap-2 p-2 rounded-lg" style={{ backgroundColor: "#F9F9F9" }}>
                      <FileText className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "#009933" }} />
                      <div>
                        <p className="text-xs" style={{ color: "#666666" }}>Objetivo</p>
                        <p className="text-xs font-medium" style={{ color: "#333333" }}>
                          {sample.objetivoAnalisis}
                        </p>
                      </div>
                    </div>
                  )}
                  {sample.cantidadRecibida && (
                    <div className="flex items-start gap-2 p-2 rounded-lg" style={{ backgroundColor: "#F9F9F9" }}>
                      <TrendingUp className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "#009933" }} />
                      <div>
                        <p className="text-xs" style={{ color: "#666666" }}>Cantidad</p>
                        <p className="text-xs font-medium" style={{ color: "#333333" }}>
                          {sample.cantidadRecibida}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t space-y-2" style={{ borderColor: "#E5E5E5" }}>
                  {sample.cliente && (
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#666666" }} />
                      <p className="text-sm" style={{ color: "#333333" }}>
                        {sample.cliente}
                      </p>
                    </div>
                  )}
                  {sample.ciudad && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#666666" }} />
                      <p className="text-sm" style={{ color: "#333333" }}>
                        {sample.ciudad}
                      </p>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#666666" }} />
                    <p className="text-sm" style={{ color: "#333333" }}>
                      Recibido el{" "}
                      {new Date(sample.receivedAt).toLocaleDateString("es-EC", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline de progreso */}
            <div
              className="bg-white rounded-2xl border shadow-sm p-5 hover:shadow-md transition-all duration-200"
              style={{ borderColor: "#E5E5E5" }}
            >
              <div className="flex items-center gap-2 mb-5">
                <TrendingUp className="w-4 h-4" style={{ color: "#009933" }} />
                <p className="text-sm font-semibold" style={{ color: "#333333" }}>
                  Progreso de la muestra
                </p>
              </div>

              {/* Timeline visual */}
              <div className="relative">
                <div className="flex items-center justify-between">
                  {STEPS.map((s, i) => {
                    const done = currentStep > s.step;
                    const active = currentStep === s.step;
                    return (
                      <div key={s.step} className="flex flex-col items-center flex-1">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-300"
                          style={{
                            backgroundColor:
                              done || active ? "#009933" : "#F5F5F5",
                            border: done || active ? "2px solid #009933" : "2px solid #E5E5E5",
                            transform: active ? "scale(1.1)" : "scale(1)"
                          }}
                        >
                          {done ? (
                            <CheckCircle className="w-5 h-5 text-white" />
                          ) : active ? (
                            <div className="w-3 h-3 rounded-full bg-white" />
                          ) : (
                            <span className="text-sm" style={{ color: "#CCCCCC" }}>{s.icon}</span>
                          )}
                        </div>
                        <p
                          className="text-xs mt-2 text-center font-medium"
                          style={{
                            color: done || active ? "#009933" : "#999999",
                          }}
                        >
                          {s.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Barra de progreso */}
              <div className="mt-6 pt-4 border-t" style={{ borderColor: "#E5E5E5" }}>
                <div className="flex justify-between text-xs mb-2">
                  <span style={{ color: "#666666" }}>Análisis completados</span>
                  <span className="font-semibold" style={{ color: "#009933" }}>
                    {sample.analisisCompletados}/{sample.totalAnalisis}
                  </span>
                </div>
                <div
                  className="w-full h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: "#E5E5E5" }}
                >
                  <div
                    className="h-2 rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${sample.progreso}%`,
                      backgroundColor: "#009933",
                    }}
                  />
                </div>
                <p className="text-xs text-right mt-1" style={{ color: "#999999" }}>
                  {sample.progreso}% completado
                </p>
              </div>
            </div>

            {/* Lista de análisis */}
            <div
              className="bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition-all duration-200"
              style={{ borderColor: "#E5E5E5" }}
            >
              <div className="px-5 py-4 border-b" style={{ borderColor: "#E5E5E5", backgroundColor: "#F9F9F9" }}>
                <div className="flex items-center gap-2">
                  <Beaker className="w-4 h-4" style={{ color: "#009933" }} />
                  <p className="text-sm font-semibold" style={{ color: "#333333" }}>
                    Análisis solicitados
                  </p>
                </div>
              </div>
              <div className="p-4 space-y-2">
                {sample.servicios.map((s, idx) => {
                  const st = SERVICE_STATUS[s.status] || SERVICE_STATUS.PENDING;
                  const Icon = st.icon;
                  return (
                    <div
                      key={s.id}
                      className="flex items-center justify-between p-3 rounded-xl transition-all duration-200 hover:shadow-sm"
                      style={{ backgroundColor: idx % 2 === 0 ? "#FAFAFA" : "#FFFFFF", border: "1px solid #F0F0F0" }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#E8F5E9" }}>
                          <FlaskConical className="w-4 h-4" style={{ color: "#009933" }} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate" style={{ color: "#333333" }}>
                            {s.nombre}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-mono" style={{ color: "#666666" }}>
                              {s.codigo}
                            </span>
                            {s.repeticion > 1 && (
                              <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "#F5F5F5", color: "#666666" }}>
                                x{s.repeticion}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Icon className="w-3.5 h-3.5" style={{ color: st.color }} />
                        <span className="text-xs font-medium" style={{ color: st.color }}>
                          {st.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer institucional */}
            <div className="text-center py-4 space-y-2">
              <div className="flex items-center justify-center gap-2">
                <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: "#009933" }} />
                <span className="text-xs font-medium" style={{ color: "#009933" }}>CABA UTM</span>
                <div className="w-8 h-0.5 rounded-full" style={{ backgroundColor: "#009933" }} />
              </div>
              <p className="text-xs" style={{ color: "#666666" }}>
                Universidad Técnica de Manabí — Centro de Análisis Biológico y Agroalimentario
              </p>
              <p className="text-xs" style={{ color: "#CCCCCC" }}>
                Portal de seguimiento de muestras
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}