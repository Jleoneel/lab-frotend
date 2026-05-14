// components/quotes/ConvertToRequestModal.jsx
import { useState } from "react";
import {
  Plus,
  X,
  CheckSquare,
  Square,
  Package,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function ConvertToRequestModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
  quoteItems = [],
}) {
  const [samples, setSamples] = useState([
    {
      sampleName: "",
      objetivoAnalisis: "",
      cantidadRecibida: "",
      serviceIds: [],
    },
  ]);

  const [expandedSamples, setExpandedSamples] = useState([0]);

  const addSample = () => {
    const newIndex = samples.length;
    setSamples([
      ...samples,
      {
        sampleName: "",
        objetivoAnalisis: "",
        cantidadRecibida: "",
        serviceIds: [],
      },
    ]);
    setExpandedSamples([...expandedSamples, newIndex]);
  };

  const removeSample = (index) => {
    if (samples.length === 1) return;
    setSamples(samples.filter((_, i) => i !== index));
    setExpandedSamples(expandedSamples.filter((i) => i !== index));
  };

  const toggleSampleExpand = (index) => {
    if (expandedSamples.includes(index)) {
      setExpandedSamples(expandedSamples.filter((i) => i !== index));
    } else {
      setExpandedSamples([...expandedSamples, index]);
    }
  };

  const updateSample = (index, field, value) => {
    const newSamples = [...samples];
    newSamples[index][field] = value;
    setSamples(newSamples);
  };

  const addService = (sampleIndex, serviceId, agotado) => {
    if (agotado) return;
    const newSamples = [...samples];
    newSamples[sampleIndex].serviceIds = [
      ...newSamples[sampleIndex].serviceIds,
      serviceId,
    ];
    setSamples(newSamples);
  };

  const removeService = (sampleIndex, serviceId) => {
    const newSamples = [...samples];
    const ids = newSamples[sampleIndex].serviceIds;
    const lastIndex = ids.lastIndexOf(serviceId);
    if (lastIndex >= 0) {
      newSamples[sampleIndex].serviceIds = ids.filter(
        (_, i) => i !== lastIndex,
      );
    }
    setSamples(newSamples);
  };

  const serviceUsage = {};
  samples.forEach((sample) => {
    sample.serviceIds.forEach((id) => {
      serviceUsage[id] = (serviceUsage[id] || 0) + 1;
    });
  });

  const handleConfirm = () => {
    const validSamples = samples.filter((s) => s.sampleName.trim() !== "");
    if (validSamples.length === 0) return;
    onConfirm(validSamples);
  };

  // Total de análisis disponibles en la cotización
  const totalDisponible = quoteItems.reduce(
    (acc, item) => acc + item.quantity,
    0,
  );

  const totalMuestrasValidas = samples.filter((s) =>
    s.sampleName.trim(),
  ).length;
  const totalAnalisisAsignados = samples.reduce(
    (acc, s) => acc + s.serviceIds.length,
    0,
  );

  const canConfirm =
    samples.some((s) => s.sampleName.trim() !== "") &&
    samples.every((s) => s.serviceIds.length > 0) &&
    totalAnalisisAsignados === totalDisponible;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Convertir Cotización a Solicitud"
      size="lg"
    >
      <div className="space-y-5">
        {/* Header con estadísticas rápidas */}
        <div
          className="rounded-xl p-4 border"
          style={{ backgroundColor: "#E8F5E9", borderColor: "#00993330" }}
        >
          <div className="flex items-start gap-3">
            <div
              className="bg-white p-2 rounded-lg shadow-sm"
              style={{ border: "1px solid #E5E5E5" }}
            >
              <Package className="w-5 h-5" style={{ color: "#009933" }} />
            </div>
            <div className="flex-1">
              <h3
                className="font-medium"
                style={{
                  color: "#009933",
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                Registro de Muestras
              </h3>
              <p className="text-sm mt-1" style={{ color: "#666666" }}>
                Asigna los análisis disponibles a cada muestra. Cada análisis
                tiene una cantidad limitada según la cotización.
              </p>
              <div className="flex flex-wrap gap-3 mt-3">
                <div
                  className="bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm border"
                  style={{ borderColor: "#E5E5E5" }}
                >
                  <span style={{ color: "#666666" }}>Muestras:</span>
                  <span
                    className="ml-2 font-semibold"
                    style={{ color: "#009933" }}
                  >
                    {totalMuestrasValidas}
                  </span>
                </div>
                <div
                  className="bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm border"
                  style={{ borderColor: "#E5E5E5" }}
                >
                  <span style={{ color: "#666666" }}>Análisis asignados:</span>
                  <span
                    className="ml-2 font-semibold"
                    style={{ color: "#FFCC33" }}
                  >
                    {totalAnalisisAsignados}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de muestras */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {samples.map((sample, sampleIndex) => {
            const isExpanded = expandedSamples.includes(sampleIndex);
            const isComplete =
              sample.sampleName.trim() && sample.serviceIds.length > 0;
            const hasName = sample.sampleName.trim() !== "";

            return (
              <div
                key={sampleIndex}
                className={`
                  border rounded-xl transition-all duration-200
                  ${isExpanded ? "shadow-md" : "shadow-sm"}
                `}
                style={{
                  borderColor: isComplete ? "#00993330" : "#E5E5E5",
                  backgroundColor: isComplete ? "#E8F5E9" : "#FFFFFF",
                }}
              >
                {/* Header de la muestra */}
                <div
                  onClick={() => toggleSampleExpand(sampleIndex)}
                  className="flex items-center justify-between p-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: isComplete
                          ? "#E8F5E9"
                          : hasName
                            ? "#E8F5E9"
                            : "#F5F5F5",
                        color: isComplete
                          ? "#009933"
                          : hasName
                            ? "#009933"
                            : "#999999",
                      }}
                    >
                      <Package className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-medium"
                          style={{ color: "#333333" }}
                        >
                          Muestra #{sampleIndex + 1}
                        </span>
                        {isComplete && (
                          <span
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: "#E8F5E9",
                              color: "#009933",
                            }}
                          >
                            Completa
                          </span>
                        )}
                      </div>
                      {sample.sampleName ? (
                        <p
                          className="text-sm truncate"
                          style={{ color: "#666666" }}
                        >
                          {sample.sampleName}
                        </p>
                      ) : (
                        <p
                          className="text-sm italic"
                          style={{ color: "#999999" }}
                        >
                          Sin nombre
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className="text-xs px-2 py-1 rounded-full border"
                      style={{
                        color: "#666666",
                        backgroundColor: "#FFFFFF",
                        borderColor: "#E5E5E5",
                      }}
                    >
                      {sample.serviceIds.length}/{quoteItems.length} análisis
                    </span>
                    {samples.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSample(sampleIndex);
                        }}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: "#666666" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#FEF2F2";
                          e.currentTarget.style.color = "#DC2626";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = "#666666";
                        }}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    {isExpanded ? (
                      <ChevronUp
                        className="w-5 h-5"
                        style={{ color: "#666666" }}
                      />
                    ) : (
                      <ChevronDown
                        className="w-5 h-5"
                        style={{ color: "#666666" }}
                      />
                    )}
                  </div>
                </div>

                {/* Contenido expandible */}
                {isExpanded && (
                  <div
                    className="px-4 pb-4 pt-2 border-t space-y-4"
                    style={{ borderColor: "#E5E5E5" }}
                  >
                    <Input
                      placeholder="Nombre de la muestra *"
                      value={sample.sampleName}
                      onChange={(e) =>
                        updateSample(sampleIndex, "sampleName", e.target.value)
                      }
                    />

                    <Input
                      placeholder="Objetivo del análisis (opcional)"
                      value={sample.objetivoAnalisis}
                      onChange={(e) =>
                        updateSample(
                          sampleIndex,
                          "objetivoAnalisis",
                          e.target.value,
                        )
                      }
                    />
                    <Input
                      placeholder="Cantidad recibida (ej: 200mL/muestra)"
                      value={sample.cantidadRecibida}
                      onChange={(e) =>
                        updateSample(
                          sampleIndex,
                          "cantidadRecibida",
                          e.target.value,
                        )
                      }
                    />

                    <div>
                      <p
                        className="text-xs font-medium mb-2 flex items-center gap-1"
                        style={{ color: "#666666" }}
                      >
                        <span>Selecciona los análisis a realizar</span>
                        <span className="text-gray-400">·</span>
                        <span className="text-gray-400">
                          {sample.serviceIds.length} seleccionados
                        </span>
                      </p>

                      <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                        {quoteItems.map((item) => {
                          const usadoEnEstaMuestra = sample.serviceIds.filter(
                            (id) => id === item.serviceId,
                          ).length;
                          const usadoEnTotal =
                            serviceUsage[item.serviceId] || 0;
                          const disponible = item.quantity - usadoEnTotal;
                          const agotado = disponible <= 0;

                          return (
                            <div
                              key={item.serviceId}
                              className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm border"
                              style={{
                                backgroundColor:
                                  agotado && usadoEnEstaMuestra === 0
                                    ? "#F9F9F9"
                                    : "#FFFFFF",
                                borderColor: "#E5E5E5",
                                color: "#666666",
                              }}
                            >
                              <span className="truncate text-left flex-1">
                                {item.serviceName}
                                <span className="text-xs ml-1 opacity-60 font-mono">
                                  {item.serviceCode}
                                </span>
                              </span>

                              <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeService(sampleIndex, item.serviceId)
                                  }
                                  disabled={usadoEnEstaMuestra === 0}
                                  className="w-6 h-6 rounded-full transition-colors flex items-center justify-center font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                                  style={{
                                    backgroundColor: "#F5F5F5",
                                    color: "#666666",
                                  }}
                                  onMouseEnter={(e) => {
                                    if (usadoEnEstaMuestra > 0) {
                                      e.currentTarget.style.backgroundColor =
                                        "#FEF2F2";
                                      e.currentTarget.style.color = "#DC2626";
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (usadoEnEstaMuestra > 0) {
                                      e.currentTarget.style.backgroundColor =
                                        "#F5F5F5";
                                      e.currentTarget.style.color = "#666666";
                                    }
                                  }}
                                >
                                  −
                                </button>

                                <span
                                  className="w-6 text-center font-semibold"
                                  style={{ color: "#009933" }}
                                >
                                  {usadoEnEstaMuestra}
                                </span>

                                <button
                                  type="button"
                                  onClick={() =>
                                    addService(
                                      sampleIndex,
                                      item.serviceId,
                                      agotado,
                                    )
                                  }
                                  disabled={agotado}
                                  className="w-6 h-6 rounded-full transition-colors flex items-center justify-center font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                                  style={{
                                    backgroundColor: "#F5F5F5",
                                    color: "#666666",
                                  }}
                                  onMouseEnter={(e) => {
                                    if (!agotado) {
                                      e.currentTarget.style.backgroundColor =
                                        "#E8F5E9";
                                      e.currentTarget.style.color = "#009933";
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!agotado) {
                                      e.currentTarget.style.backgroundColor =
                                        "#F5F5F5";
                                      e.currentTarget.style.color = "#666666";
                                    }
                                  }}
                                >
                                  +
                                </button>

                                <span
                                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                                  style={{
                                    backgroundColor: agotado
                                      ? "#FEF2F2"
                                      : "#F5F5F5",
                                    color: agotado ? "#DC2626" : "#666666",
                                  }}
                                >
                                  {disponible}/{item.quantity}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {sample.serviceIds.length === 0 && (
                        <div
                          className="flex items-center gap-2 mt-2 text-xs p-2 rounded-lg"
                          style={{
                            backgroundColor: "#FEF2F2",
                            color: "#DC2626",
                          }}
                        >
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span>
                            Selecciona al menos un análisis para esta muestra
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Botón para agregar muestra */}
        <Button
          type="button"
          variant="secondary"
          onClick={addSample}
          className="w-full py-3 border-dashed border-2 transition-all"
          style={{ borderColor: "#E5E5E5" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#009933";
            e.currentTarget.style.backgroundColor = "#E8F5E9";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#E5E5E5";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar otra muestra
        </Button>

        {/* Resumen de validación */}
        {!canConfirm && (
          <div
            className="rounded-xl p-3 flex items-start gap-2"
            style={{
              backgroundColor: "#FFF9E8",
              border: "1px solid #FFCC3330",
            }}
          >
            <AlertCircle
              className="w-5 h-5 flex-shrink-0 mt-0.5"
              style={{ color: "#FFCC33" }}
            />
            <div className="text-sm" style={{ color: "#996600" }}>
              <p className="font-medium">Completa los datos requeridos:</p>
              <ul className="list-disc list-inside mt-1 text-xs opacity-90">
                {!samples.some((s) => s.sampleName.trim()) && (
                  <li>Agrega al menos una muestra con nombre</li>
                )}
                {samples.some((s) => s.serviceIds.length === 0) && (
                  <li>Todas las muestras deben tener al menos un análisis</li>
                )}
                {totalAnalisisAsignados < totalDisponible && (
                  <li>
                    Faltan {totalDisponible - totalAnalisisAsignados} análisis
                    por asignar ({totalAnalisisAsignados}/{totalDisponible}{" "}
                    asignados)
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Footer con botones de acción */}
      <div
        className="flex flex-col sm:flex-row justify-end gap-3 pt-5 border-t mt-5"
        style={{ borderColor: "#E5E5E5" }}
      >
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          className="order-2 sm:order-1"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={loading || !canConfirm}
          className="order-1 sm:order-2"
          style={{ backgroundColor: "#009933" }}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Convirtiendo...
            </span>
          ) : (
            `Convertir (${totalMuestrasValidas} ${totalMuestrasValidas === 1 ? "muestra" : "muestras"})`
          )}
        </Button>
      </div>
    </Modal>
  );
}
