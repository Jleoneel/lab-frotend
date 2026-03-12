import { useState } from "react";
import { Plus, X, CheckSquare, Square } from "lucide-react";
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

  const addSample = () => {
    setSamples([...samples, {
      sampleName: "",
      description: "",
      serviceIds: [],  // nueva muestra sin análisis por defecto
    }]);
  };

  const removeSample = (index) => {
    if (samples.length === 1) return;
    setSamples(samples.filter((_, i) => i !== index));
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Convertir a Solicitud">
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        <p className="text-sm text-gray-600">
          Registra las muestras y asigna los análisis correspondientes a cada una:
        </p>

        {samples.map((sample, sampleIndex) => (
          <div key={sampleIndex} className="p-4 border rounded-lg bg-gray-50">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-gray-700">
                Muestra #{sampleIndex + 1}
              </span>
              {samples.length > 1 && (
                <button
                  onClick={() => removeSample(sampleIndex)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <Input
              placeholder="Nombre de la muestra *"
              value={sample.sampleName}
              onChange={(e) => updateSample(sampleIndex, "sampleName", e.target.value)}
              className="mb-2"
            />
            <Input
              placeholder="Descripción (opcional)"
              value={sample.description}
              onChange={(e) => updateSample(sampleIndex, "description", e.target.value)}
              className="mb-3"
            />

            <div>
              <p className="text-xs font-medium text-gray-600 mb-2">
                Análisis a realizar:
              </p>
              <div className="space-y-1">
                {quoteItems.map((item) => {
                  const isSelected = sample.serviceIds.includes(item.serviceId);
                  const usado = serviceUsage[item.serviceId] || 0;
                  // Si está seleccionado en esta muestra, el disponible real es quantity - (usado - 1)
                  const disponible = item.quantity - usado;
                  const agotado = !isSelected && disponible <= 0;

                  return (
                    <button
                      key={item.serviceId}
                      type="button"
                      onClick={() => toggleService(sampleIndex, item.serviceId, agotado)}
                      disabled={agotado}
                      className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded text-sm transition-colors
                        ${isSelected
                          ? "bg-purple-50 text-purple-800 border border-purple-200"
                          : agotado
                            ? "bg-gray-50 text-gray-300 border border-gray-100 cursor-not-allowed"
                            : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-100"
                        }`}
                    >
                      <span className="flex items-center gap-2">
                        {isSelected
                          ? <CheckSquare className="w-4 h-4 flex-shrink-0" />
                          : <Square className="w-4 h-4 flex-shrink-0" />
                        }
                        <span className="text-left">
                          {item.serviceName}
                          <span className="text-xs ml-1 opacity-60">{item.serviceCode}</span>
                        </span>
                      </span>

                      {/* Contador: usos restantes / total cotizado */}
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium
                        ${agotado
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-100 text-gray-500"
                        }`}>
                        {isSelected
                          ? `${item.quantity - disponible}/${item.quantity}`
                          : `${disponible}/${item.quantity}`
                        }
                      </span>
                    </button>
                  );
                })}
              </div>
              {sample.serviceIds.length === 0 && (
                <p className="text-xs text-red-500 mt-1">
                  Selecciona al menos un análisis
                </p>
              )}
            </div>
          </div>
        ))}

        <Button type="button" variant="secondary" onClick={addSample} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Agregar otra muestra
        </Button>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t mt-4">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleConfirm} disabled={loading || !canConfirm}>
          {loading
            ? "Convirtiendo..."
            : `Convertir (${samples.filter((s) => s.sampleName.trim()).length} muestras)`}
        </Button>
      </div>
    </Modal>
  );
}