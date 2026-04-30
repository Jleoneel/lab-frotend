import { useState, useEffect } from "react";
import { Plus, Trash2, FlaskConical } from "lucide-react";
import Modal from "../ui/Modal";
import {
  reactivoService,
  UNIDADES,
} from "../../services/reactivoService";
import Swal from "sweetalert2";

export default function RegistrarConsumoModal({
  isOpen,
  onClose,
  analysis,
  onSaved,
}) {
  const [reactivos, setReactivos] = useState([]);
  const [consumos, setConsumos] = useState([
    { reactivoId: "", cantidad: "", razonId: "", observaciones: "" },
  ]);
  const [saving, setSaving] = useState(false);
  const [razones, setRazones] = useState([]);

  useEffect(() => {
    if (isOpen) loadReactivos();
    loadRazones();
  }, [isOpen]);

  const loadReactivos = async () => {
    try {
      const response = await reactivoService.getAll();
      setReactivos(response.data.filter((r) => r.isActive));
    } catch (error) {
      // Error registrando movimientos
    }
  };

  const addConsumo = () => {
    setConsumos([
      ...consumos,
      { reactivoId: "", cantidad: "", razon: "ANALISIS", observaciones: "" },
    ]);
  };

  const removeConsumo = (index) => {
    if (consumos.length === 1) return;
    setConsumos(consumos.filter((_, i) => i !== index));
  };

  const updateConsumo = (index, field, value) => {
    const newConsumos = [...consumos];
    newConsumos[index][field] = value;
    setConsumos(newConsumos);
  };

  const loadRazones = async () => {
    try {
      const { settingsService } =
        await import("../../services/settingsService");
      const razonesData = await settingsService.getRazones();
      setRazones(Array.isArray(razonesData) ? razonesData : []);
    } catch (error) {
      // Error cargando razones
    }
  };

  const handleSave = async () => {
    const invalid = consumos.some(
      (c) => !c.reactivoId || !c.cantidad || parseFloat(c.cantidad) <= 0,
    );
    if (invalid) {
      await Swal.fire({
        icon: "warning",
        title: "Datos incompletos",
        text: "Selecciona reactivo y cantidad en todos los registros",
        confirmButtonColor: "#009933",
      });
      return;
    }

    setSaving(true);
    try {
      // Registrar cada consumo
      await Promise.all(
        consumos.map((c) =>
          reactivoService.registrarMovimiento({
            reactivoId: c.reactivoId,
            tipo: "CONSUMO",
            razonId: c.razonId || null, // 👈
            cantidad: parseFloat(c.cantidad),
            sampleServiceId: analysis?.id || null,
            observaciones: c.observaciones || null,
          }),
        ),
      );

      await Swal.fire({
        icon: "success",
        title: "¡Consumo registrado!",
        text: `${consumos.length} reactivo(s) registrados correctamente`,
        confirmButtonColor: "#009933",
        timer: 2000,
        timerProgressBar: true,
      });

      setConsumos([
        { reactivoId: "", cantidad: "", razon: "ANALISIS", observaciones: "" },
      ]);
      onSaved?.();
      onClose();
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Error al registrar consumo",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "6px 10px",
    border: "1px solid #E5E5E5",
    borderRadius: "10px",
    fontSize: "13px",
    color: "#333333",
    outline: "none",
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Consumo de Reactivos"
      size="lg"
    >
      <div className="space-y-4">
        {/* Info del análisis */}
        {analysis && (
          <div
            className="px-4 py-3 rounded-xl flex items-center gap-3"
            style={{ backgroundColor: "#E8F5E9", border: "1px solid #BBF7D0" }}
          >
            <FlaskConical
              className="w-4 h-4 flex-shrink-0"
              style={{ color: "#009933" }}
            />
            <div>
              <p
                className="text-xs font-medium uppercase tracking-wider"
                style={{ color: "#666666" }}
              >
                Análisis
              </p>
              <p className="text-sm font-semibold" style={{ color: "#009933" }}>
                {analysis.service?.name}
              </p>
            </div>
          </div>
        )}

        {/* Lista de consumos */}
        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
          {consumos.map((consumo, index) => {
            const reactivoActual = reactivos.find(
              (r) => r.id === consumo.reactivoId,
            );
            return (
              <div
                key={index}
                className="p-4 rounded-xl border space-y-3"
                style={{ backgroundColor: "#F9F9F9", borderColor: "#E5E5E5" }}
              >
                <div className="flex items-center justify-between">
                  <p
                    className="text-xs font-medium"
                    style={{ color: "#009933" }}
                  >
                    Reactivo #{index + 1}
                  </p>
                  {consumos.length > 1 && (
                    <button
                      onClick={() => removeConsumo(index)}
                      className="p-1 rounded-lg transition-colors"
                      style={{ color: "#DC2626" }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      className="block text-xs font-medium mb-1"
                      style={{ color: "#666666" }}
                    >
                      Reactivo *
                    </label>
                    <select
                      value={consumo.reactivoId}
                      onChange={(e) =>
                        updateConsumo(index, "reactivoId", e.target.value)
                      }
                      style={{ ...inputStyle, appearance: "auto" }}
                    >
                      <option value="">Seleccionar...</option>
                      {reactivos.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.nombre} ({r.stockActual} {UNIDADES[r.unidad]})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      className="block text-xs font-medium mb-1"
                      style={{ color: "#666666" }}
                    >
                      Cantidad{" "}
                      {reactivoActual
                        ? `(${UNIDADES[reactivoActual.unidad]})`
                        : ""}{" "}
                      *
                    </label>
                    <input
                      type="number"
                      value={consumo.cantidad}
                      onChange={(e) =>
                        updateConsumo(index, "cantidad", e.target.value)
                      }
                      style={inputStyle}
                      min="0.001"
                      step="0.001"
                      placeholder="0.000"
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor = "#009933")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor = "#E5E5E5")
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      className="block text-xs font-medium mb-1"
                      style={{ color: "#666666" }}
                    >
                      Razón
                    </label>
                    <select
                      value={consumo.razonId || ""}
                      onChange={(e) =>
                        updateConsumo(index, "razonId", e.target.value)
                      }
                      style={{ ...inputStyle, appearance: "auto" }}
                    >
                      <option value="">Sin razón</option>
                      {razones.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      className="block text-xs font-medium mb-1"
                      style={{ color: "#666666" }}
                    >
                      Observaciones
                    </label>
                    <input
                      value={consumo.observaciones}
                      onChange={(e) =>
                        updateConsumo(index, "observaciones", e.target.value)
                      }
                      style={inputStyle}
                      placeholder="Opcional..."
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor = "#009933")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor = "#E5E5E5")
                      }
                    />
                  </div>
                </div>

                {/* Alerta stock bajo */}
                {reactivoActual &&
                  parseFloat(consumo.cantidad) > reactivoActual.stockActual && (
                    <p className="text-xs" style={{ color: "#DC2626" }}>
                      ⚠ Stock insuficiente — disponible:{" "}
                      {reactivoActual.stockActual}{" "}
                      {UNIDADES[reactivoActual.unidad]}
                    </p>
                  )}
              </div>
            );
          })}
        </div>

        {/* Botón agregar reactivo */}
        <button
          onClick={addConsumo}
          className="w-full py-2 border-2 border-dashed rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
          style={{ borderColor: "#009933", color: "#009933" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#E8F5E9")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          <Plus className="w-4 h-4" />
          Agregar otro reactivo
        </button>

        <div
          className="flex justify-end gap-2 pt-4 border-t"
          style={{ borderColor: "#E5E5E5" }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm"
            style={{ color: "#666666" }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
            style={{ backgroundColor: "#009933" }}
          >
            <FlaskConical className="w-4 h-4" />
            {saving ? "Registrando..." : "Registrar Consumo"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
