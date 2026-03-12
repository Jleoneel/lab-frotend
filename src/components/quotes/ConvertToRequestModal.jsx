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
  ChevronUp
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
      description: "",
      serviceIds: quoteItems.map((i) => i.serviceId),
    },
  ]);

  const [expandedSamples, setExpandedSamples] = useState([0]); // primera muestra expandida por defecto

  const addSample = () => {
    const newIndex = samples.length;
    setSamples([...samples, {
      sampleName: "",
      description: "",
      serviceIds: [],
    }]);
    setExpandedSamples([...expandedSamples, newIndex]);
  };

  const removeSample = (index) => {
    if (samples.length === 1) return;
    setSamples(samples.filter((_, i) => i !== index));
    setExpandedSamples(expandedSamples.filter(i => i !== index));
  };

  const toggleSampleExpand = (index) => {
    if (expandedSamples.includes(index)) {
      setExpandedSamples(expandedSamples.filter(i => i !== index));
    } else {
      setExpandedSamples([...expandedSamples, index]);
    }
  };

  const updateSample = (index, field, value) => {
    const newSamples = [...samples];
    newSamples[index][field] = value;
    setSamples(newSamples);
  };

  const toggleService = (sampleIndex, serviceId, agotado) => {
    if (agotado) return;
    const newSamples = [...samples];
    const current = newSamples[sampleIndex].serviceIds;
    if (current.includes(serviceId)) {
      if (current.length === 1) return; // mínimo 1
      newSamples[sampleIndex].serviceIds = current.filter((id) => id !== serviceId);
    } else {
      newSamples[sampleIndex].serviceIds = [...current, serviceId];
    }
    setSamples(newSamples);
  };

  // Cuántas veces está usado cada servicio en TODAS las muestras
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

  const canConfirm =
    samples.some((s) => s.sampleName.trim() !== "") &&
    samples.every((s) => s.serviceIds.length > 0);

  // Estadísticas para el resumen
  const totalMuestrasValidas = samples.filter(s => s.sampleName.trim()).length;
  const totalAnalisisAsignados = samples.reduce((acc, s) => acc + s.serviceIds.length, 0);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Convertir Cotización a Solicitud"
      size="lg"
    >
      <div className="space-y-5">
        {/* Header con estadísticas rápidas */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-start gap-3">
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-800">Registro de Muestras</h3>
              <p className="text-sm text-gray-600 mt-1">
                Asigna los análisis disponibles a cada muestra. Cada análisis tiene una cantidad limitada según la cotización.
              </p>
              <div className="flex flex-wrap gap-3 mt-3">
                <div className="bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm">
                  <span className="text-gray-500">Muestras:</span>
                  <span className="ml-2 font-semibold text-blue-600">{totalMuestrasValidas}</span>
                </div>
                <div className="bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm">
                  <span className="text-gray-500">Análisis asignados:</span>
                  <span className="ml-2 font-semibold text-purple-600">{totalAnalisisAsignados}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de muestras */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {samples.map((sample, sampleIndex) => {
            const isExpanded = expandedSamples.includes(sampleIndex);
            const isComplete = sample.sampleName.trim() && sample.serviceIds.length > 0;
            const hasName = sample.sampleName.trim() !== "";
            
            return (
              <div
                key={sampleIndex}
                className={`
                  border rounded-xl transition-all duration-200
                  ${isComplete 
                    ? 'border-green-200 bg-green-50/30' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                  }
                  ${isExpanded ? 'shadow-md' : 'shadow-sm'}
                `}
              >
                {/* Header de la muestra (siempre visible) */}
                <div
                  onClick={() => toggleSampleExpand(sampleIndex)}
                  className="flex items-center justify-between p-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                      ${isComplete 
                        ? 'bg-green-100 text-green-600' 
                        : hasName 
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-400'
                      }
                    `}>
                      <Package className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800">
                          Muestra #{sampleIndex + 1}
                        </span>
                        {isComplete && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            Completa
                          </span>
                        )}
                      </div>
                      {sample.sampleName ? (
                        <p className="text-sm text-gray-600 truncate">{sample.sampleName}</p>
                      ) : (
                        <p className="text-sm text-gray-400 italic">Sin nombre</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full border">
                      {sample.serviceIds.length}/{quoteItems.length} análisis
                    </span>
                    {samples.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSample(sampleIndex);
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Contenido expandible */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-gray-100 space-y-4">
                    <Input
                      placeholder="Nombre de la muestra *"
                      value={sample.sampleName}
                      onChange={(e) => updateSample(sampleIndex, "sampleName", e.target.value)}
                    />
                    
                    <Input
                      placeholder="Descripción (opcional)"
                      value={sample.description}
                      onChange={(e) => updateSample(sampleIndex, "description", e.target.value)}
                    />

                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
                        <span>Selecciona los análisis a realizar</span>
                        <span className="text-gray-400">·</span>
                        <span className="text-gray-400">{sample.serviceIds.length} seleccionados</span>
                      </p>
                      
                      <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                        {quoteItems.map((item) => {
                          const isSelected = sample.serviceIds.includes(item.serviceId);
                          const usado = serviceUsage[item.serviceId] || 0;
                          const disponible = item.quantity - usado;
                          const agotado = !isSelected && disponible <= 0;

                          return (
                            <button
                              key={item.serviceId}
                              type="button"
                              onClick={() => toggleService(sampleIndex, item.serviceId, agotado)}
                              disabled={agotado}
                              className={`
                                w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm transition-all
                                ${isSelected
                                  ? "bg-purple-50 text-purple-700 border border-purple-200 shadow-sm"
                                  : agotado
                                    ? "bg-gray-50 text-gray-300 border border-gray-100 cursor-not-allowed"
                                    : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                }
                              `}
                            >
                              <span className="flex items-center gap-2 min-w-0">
                                {isSelected ? (
                                  <CheckSquare className="w-4 h-4 flex-shrink-0 text-purple-600" />
                                ) : (
                                  <Square className={`w-4 h-4 flex-shrink-0 ${agotado ? 'text-gray-300' : 'text-gray-400'}`} />
                                )}
                                <span className="truncate text-left">
                                  {item.serviceName}
                                  <span className="text-xs ml-1 opacity-60 font-mono">
                                    {item.serviceCode}
                                  </span>
                                </span>
                              </span>

                              <span className={`
                                text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0
                                ${isSelected
                                  ? "bg-purple-100 text-purple-700"
                                  : agotado
                                    ? "bg-red-100 text-red-600"
                                    : "bg-gray-100 text-gray-600"
                                }
                              `}>
                                {isSelected
                                  ? `${item.quantity - (usado - 1)}/${item.quantity}`
                                  : `${disponible}/${item.quantity}`
                                }
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {sample.serviceIds.length === 0 && (
                        <div className="flex items-center gap-2 mt-2 text-xs text-red-500 bg-red-50 p-2 rounded-lg">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span>Selecciona al menos un análisis para esta muestra</span>
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
          className="w-full py-3 border-dashed border-2 hover:border-blue-300 hover:bg-blue-50/50 transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar otra muestra
        </Button>

        {/* Resumen de validación */}
        {!canConfirm && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-medium">Completa los datos requeridos:</p>
              <ul className="list-disc list-inside mt-1 text-xs opacity-90">
                {!samples.some(s => s.sampleName.trim()) && (
                  <li>Agrega al menos una muestra con nombre</li>
                )}
                {samples.some(s => s.serviceIds.length === 0) && (
                  <li>Todas las muestras deben tener al menos un análisis</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Footer con botones de acción */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-5 border-t border-gray-200 mt-5">
        <Button type="button" variant="ghost" onClick={onClose} className="order-2 sm:order-1">
          Cancelar
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={loading || !canConfirm}
          className="order-1 sm:order-2"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Convirtiendo...
            </span>
          ) : (
            `Convertir (${totalMuestrasValidas} ${totalMuestrasValidas === 1 ? 'muestra' : 'muestras'})`
          )}
        </Button>
      </div>
    </Modal>
  );
}