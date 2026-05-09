// components/inventario/RegistrarConsumoModal.jsx
import { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  FlaskConical, 
  Package, 
  AlertCircle, 
  CheckCircle,
  TrendingDown,
  Hash,
  Scale,
  FileText
} from "lucide-react";
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
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadReactivos();
      loadRazones();
      setErrors({});
    }
  }, [isOpen]);

  const loadReactivos = async () => {
    try {
      const response = await reactivoService.getAll();
      setReactivos(response.data.filter((r) => r.isActive));
    } catch (error) {
      console.error("Error cargando reactivos:", error);
    }
  };

  const loadRazones = async () => {
    try {
      const { settingsService } = await import("../../services/settingsService");
      const razonesData = await settingsService.getRazones();
      setRazones(Array.isArray(razonesData) ? razonesData : []);
    } catch (error) {
      console.error("Error cargando razones:", error);
    }
  };

  const addConsumo = () => {
    setConsumos([
      ...consumos,
      { reactivoId: "", cantidad: "", razonId: "", observaciones: "" },
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
    // Limpiar error del campo
    if (errors[`${index}-${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`${index}-${field}`];
      setErrors(newErrors);
    }
  };

  const validateConsumos = () => {
    const newErrors = {};
    let hasError = false;
    
    consumos.forEach((consumo, idx) => {
      if (!consumo.reactivoId) {
        newErrors[`${idx}-reactivoId`] = true;
        hasError = true;
      }
      if (!consumo.cantidad || parseFloat(consumo.cantidad) <= 0) {
        newErrors[`${idx}-cantidad`] = true;
        hasError = true;
      }
      // Verificar stock suficiente
      const reactivo = reactivos.find(r => r.id === consumo.reactivoId);
      if (reactivo && consumo.cantidad && parseFloat(consumo.cantidad) > reactivo.stockActual) {
        newErrors[`${idx}-stock`] = true;
        hasError = true;
      }
    });
    
    setErrors(newErrors);
    return !hasError;
  };

  const handleSave = async () => {
    if (!validateConsumos()) {
      await Swal.fire({
        icon: "warning",
        title: "Datos incompletos",
        text: "Verifica que todos los campos estén completos y que haya stock suficiente",
        confirmButtonColor: "#009933",
        timer: 2500,
        timerProgressBar: true,
      });
      return;
    }

    setSaving(true);
    try {
      await Promise.all(
        consumos.map((c) =>
          reactivoService.registrarMovimiento({
            reactivoId: c.reactivoId,
            tipo: "CONSUMO",
            razonId: c.razonId || null,
            cantidad: parseFloat(c.cantidad),
            sampleServiceId: analysis?.id || null,
            observaciones: c.observaciones || null,
          })
        )
      );

      await Swal.fire({
        icon: "success",
        title: "¡Consumo registrado!",
        html: `${consumos.length} reactivo(s) registrados correctamente`,
        confirmButtonColor: "#009933",
        timer: 2000,
        timerProgressBar: true,
      });

      setConsumos([
        { reactivoId: "", cantidad: "", razonId: "", observaciones: "" },
      ]);
      setErrors({});
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
    padding: "8px 12px",
    border: "1px solid #E5E5E5",
    borderRadius: "12px",
    fontSize: "13px",
    color: "#333333",
    outline: "none",
    fontFamily: "'Montserrat', sans-serif",
    transition: "all 0.2s",
  };

  const focusStyle = (e) => {
    e.currentTarget.style.borderColor = "#009933";
    e.currentTarget.style.boxShadow = "0 0 0 2px #00993320";
  };

  const blurStyle = (e) => {
    e.currentTarget.style.borderColor = "#E5E5E5";
    e.currentTarget.style.boxShadow = "none";
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar Consumo de Reactivos" size="lg">
      <div className="space-y-5">
        
        {/* Header informativo */}
        <div className="rounded-xl p-3 flex items-start gap-2" style={{ backgroundColor: "#E8F5E9", border: "1px solid #00993330" }}>
          <TrendingDown className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#009933" }} />
          <div>
            <p className="text-xs font-medium" style={{ color: "#009933" }}>Registro de consumo</p>
            <p className="text-xs mt-0.5" style={{ color: "#666666" }}>
              Registra el consumo de reactivos del inventario
            </p>
          </div>
        </div>

        {/* Info del análisis */}
        {analysis && (
          <div className="rounded-xl p-4 flex items-start gap-3" style={{ backgroundColor: "#F9F9F9", border: "1px solid #E5E5E5" }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#E8F5E9" }}>
              <FlaskConical className="w-4 h-4" style={{ color: "#009933" }} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "#666666" }}>Análisis asociado</p>
              <p className="text-sm font-semibold mt-0.5" style={{ color: "#009933" }}>
                {analysis.service?.name}
              </p>
            </div>
          </div>
        )}

        {/* Lista de consumos */}
        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {consumos.map((consumo, index) => {
            const reactivoActual = reactivos.find((r) => r.id === consumo.reactivoId);
            const tieneErrorReactivo = errors[`${index}-reactivoId`];
            const tieneErrorCantidad = errors[`${index}-cantidad`];
            const tieneErrorStock = errors[`${index}-stock`];
            
            return (
              <div
                key={index}
                className="p-4 rounded-xl border space-y-3 transition-all"
                style={{ 
                  backgroundColor: "#F9F9F9", 
                  borderColor: (tieneErrorReactivo || tieneErrorCantidad || tieneErrorStock) ? "#FECACA" : "#E5E5E5" 
                }}
              >
                {/* Header del reactivo */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: "#E8F5E9" }}>
                      <Package className="w-2.5 h-2.5" style={{ color: "#009933" }} />
                    </div>
                    <p className="text-xs font-semibold" style={{ color: "#009933" }}>
                      Reactivo #{index + 1}
                    </p>
                  </div>
                  {consumos.length > 1 && (
                    <button
                      onClick={() => removeConsumo(index)}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: "#DC2626" }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#FEF2F2"; e.currentTarget.style.color = "#DC2626"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#DC2626"; }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Reactivo */}
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: "#666666" }}>
                      <span className="flex items-center gap-1">
                        <Hash className="w-3 h-3" />
                        Reactivo *
                      </span>
                    </label>
                    <select
                      value={consumo.reactivoId}
                      onChange={(e) => updateConsumo(index, "reactivoId", e.target.value)}
                      style={{ ...inputStyle, appearance: "auto" }}
                      onFocus={focusStyle}
                      onBlur={blurStyle}
                    >
                      <option value="">Seleccionar reactivo</option>
                      {reactivos.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.nombre} - Stock: {r.stockActual} {UNIDADES[r.unidad]}
                        </option>
                      ))}
                    </select>
                    {tieneErrorReactivo && (
                      <p className="text-xs mt-1" style={{ color: "#DC2626" }}>Selecciona un reactivo</p>
                    )}
                  </div>

                  {/* Cantidad */}
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: "#666666" }}>
                      <span className="flex items-center gap-1">
                        <Scale className="w-3 h-3" />
                        Cantidad {reactivoActual ? `(${UNIDADES[reactivoActual.unidad]})` : ""} *
                      </span>
                    </label>
                    <input
                      type="number"
                      value={consumo.cantidad}
                      onChange={(e) => updateConsumo(index, "cantidad", e.target.value)}
                      style={inputStyle}
                      min="0.001"
                      step="0.001"
                      placeholder="0.000"
                      onFocus={focusStyle}
                      onBlur={blurStyle}
                    />
                    {tieneErrorCantidad && (
                      <p className="text-xs mt-1" style={{ color: "#DC2626" }}>Ingresa una cantidad válida</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Razón */}
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: "#666666" }}>
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        Razón
                      </span>
                    </label>
                    <select
                      value={consumo.razonId || ""}
                      onChange={(e) => updateConsumo(index, "razonId", e.target.value)}
                      style={{ ...inputStyle, appearance: "auto" }}
                      onFocus={focusStyle}
                      onBlur={blurStyle}
                    >
                      <option value="">Sin razón</option>
                      {razones.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Observaciones */}
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: "#666666" }}>
                      <span className="flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Observaciones
                      </span>
                    </label>
                    <input
                      value={consumo.observaciones}
                      onChange={(e) => updateConsumo(index, "observaciones", e.target.value)}
                      style={inputStyle}
                      placeholder="Opcional..."
                      onFocus={focusStyle}
                      onBlur={blurStyle}
                    />
                  </div>
                </div>

                {/* Alerta stock bajo */}
                {reactivoActual && consumo.cantidad && parseFloat(consumo.cantidad) > 0 && (
                  parseFloat(consumo.cantidad) > reactivoActual.stockActual ? (
                    <div className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: "#FEF2F2", border: "1px solid #FEE2E2" }}>
                      <AlertCircle className="w-3.5 h-3.5" style={{ color: "#DC2626" }} />
                      <p className="text-xs" style={{ color: "#DC2626" }}>
                        Stock insuficiente — disponible: {reactivoActual.stockActual} {UNIDADES[reactivoActual.unidad]}
                      </p>
                    </div>
                  ) : parseFloat(consumo.cantidad) > reactivoActual.stockActual * 0.8 ? (
                    <div className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: "#FFF9E8", border: "1px solid #FFCC3330" }}>
                      <AlertCircle className="w-3.5 h-3.5" style={{ color: "#FFCC33" }} />
                      <p className="text-xs" style={{ color: "#996600" }}>
                        Este consumo dejará el stock bajo (quedará {reactivoActual.stockActual - parseFloat(consumo.cantidad)} {UNIDADES[reactivoActual.unidad]})
                      </p>
                    </div>
                  ) : null
                )}
              </div>
            );
          })}
        </div>

        {/* Botón agregar reactivo */}
        <button
          onClick={addConsumo}
          className="w-full py-3 border-2 border-dashed rounded-xl text-sm flex items-center justify-center gap-2 transition-all"
          style={{ borderColor: "#00993340", color: "#009933" }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#E8F5E9"; e.currentTarget.style.borderColor = "#009933"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.borderColor = "#00993340"; }}
        >
          <Plus className="w-4 h-4" />
          Agregar otro reactivo
        </button>

        {/* Resumen */}
        <div className="rounded-xl p-3 border" style={{ backgroundColor: "#F9F9F9", borderColor: "#E5E5E5" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#666666" }} />
              <p className="text-xs" style={{ color: "#666666" }}>
                Los campos marcados con <span style={{ color: "#DC2626" }}>*</span> son obligatorios
              </p>
            </div>
            <div className="text-xs" style={{ color: "#009933" }}>
              Total: {consumos.length} reactivo(s)
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: "#E5E5E5" }}>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{ color: "#666666" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#F5F5F5"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#009933" }}
            onMouseEnter={(e) => { if (!saving) e.currentTarget.style.backgroundColor = "#00802b"; }}
            onMouseLeave={(e) => { if (!saving) e.currentTarget.style.backgroundColor = "#009933"; }}
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Registrando...
              </>
            ) : (
              <>
                <TrendingDown className="w-4 h-4" />
                Registrar Consumo
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}