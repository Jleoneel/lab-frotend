// components/inventario/EditReactivoModal.jsx
import { useState, useEffect } from "react";
import {
  Save,
  Package,
  Layers,
  Scale,
  AlertCircle,
  CheckCircle,
  Edit,
  Eye,
  EyeOff,
} from "lucide-react";
import Modal from "../ui/Modal";
import { reactivoService, UNIDADES } from "../../services/reactivoService";
import { categoriaReactivoService } from "../../services/categoriaReactivoService";
import Swal from "sweetalert2";

export default function EditReactivoModal({
  isOpen,
  onClose,
  reactivo,
  onSaved,
}) {
  const [formData, setFormData] = useState({
    nombre: "",
    categoriaId: "",
    unidad: "",
    stockMinimo: "0",
    isActive: true,
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    if (isOpen) {
      categoriaReactivoService.getAll().then((res) => {
        setCategorias(Array.isArray(res.data) ? res.data : []);
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && reactivo) {
      setFormData({
        nombre: reactivo.nombre || "",
        categoriaId: reactivo.categoriaId || "",
        unidad: reactivo.unidad || "",
        stockMinimo: String(reactivo.stockMinimo ?? "0"),
        isActive: reactivo.isActive ?? true,
      });
      setErrors({});
    }
  }, [isOpen, reactivo]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
    if (!formData.categoriaId)
      newErrors.categoriaId = "Debes seleccionar una categoría";
    return newErrors;
  };

  const handleSave = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      await Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor completa los campos obligatorios",
        confirmButtonColor: "#009933",
        timer: 2000,
        timerProgressBar: true,
      });
      return;
    }

    setSaving(true);
    try {
      await reactivoService.update(reactivo.id, formData);
      await Swal.fire({
        icon: "success",
        title: "¡Reactivo actualizado!",
        text: "Los cambios se guardaron correctamente",
        confirmButtonColor: "#009933",
        timer: 2000,
        timerProgressBar: true,
      });
      onSaved();
      onClose();
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message || "No se pudo actualizar el reactivo",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setSaving(false);
    }
  };

  const unidadesDisponibles = Object.entries(UNIDADES);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Reactivo" size="md">
      <div className="space-y-5">
        {/* Header informativo */}
        <div
          className="rounded-xl p-3 flex items-start gap-2"
          style={{ backgroundColor: "#E8F5E9", border: "1px solid #00993330" }}
        >
          <Edit
            className="w-4 h-4 flex-shrink-0 mt-0.5"
            style={{ color: "#009933" }}
          />
          <div>
            <p className="text-xs font-medium" style={{ color: "#009933" }}>
              Editando reactivo
            </p>
            <p className="text-xs mt-0.5" style={{ color: "#666666" }}>
              Modifica los campos que necesites actualizar
            </p>
          </div>
        </div>

        {/* Información del reactivo */}
        {reactivo && (
          <div
            className="rounded-xl p-3 flex items-center gap-2"
            style={{ backgroundColor: "#F9F9F9", border: "1px solid #E5E5E5" }}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#E8F5E9" }}
            >
              <Package className="w-3 h-3" style={{ color: "#009933" }} />
            </div>
            <p className="text-xs" style={{ color: "#666666" }}>
              Editando:{" "}
              <span className="font-medium" style={{ color: "#009933" }}>
                {reactivo.nombre}
              </span>
              <span className="mx-1">•</span>
              <span className="font-mono">{reactivo.codigo}</span>
            </p>
          </div>
        )}

        {/* Nombre */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: "#666666" }}
          >
            <span className="flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5" />
              Nombre
              <span style={{ color: "#DC2626" }}>*</span>
            </span>
          </label>
          <input
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border rounded-xl focus:outline-none transition-all"
            style={{
              borderColor: errors.nombre ? "#FECACA" : "#E5E5E5",
              color: "#333333",
            }}
            placeholder="Ej: Acetona"
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#009933";
              e.currentTarget.style.boxShadow = "0 0 0 2px #00993320";
            }}
            onBlur={(e) => {
              if (!errors.nombre) e.currentTarget.style.borderColor = "#E5E5E5";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
          {errors.nombre && (
            <p className="text-xs mt-1" style={{ color: "#DC2626" }}>
              {errors.nombre}
            </p>
          )}
        </div>

        {/* Categoría y Unidad */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "#666666" }}
            >
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Categoría
                <span style={{ color: "#DC2626" }}>*</span>
              </span>
            </label>
            <select
              name="categoriaId"
              value={formData.categoriaId}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border rounded-xl focus:outline-none transition-all appearance-none cursor-pointer"
              style={{
                borderColor: errors.categoriaId ? "#FECACA" : "#E5E5E5",
                color: "#333333",
                fontFamily: "'Montserrat', sans-serif",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#009933";
                e.currentTarget.style.boxShadow = "0 0 0 2px #00993320";
              }}
              onBlur={(e) => {
                if (!errors.categoriaId)
                  e.currentTarget.style.borderColor = "#E5E5E5";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <option value="">Seleccionar categoría</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
            {errors.categoriaId && (
              <p className="text-xs mt-1" style={{ color: "#DC2626" }}>
                {errors.categoriaId}
              </p>
            )}
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "#666666" }}
            >
              <span className="flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5" />
                Unidad
              </span>
            </label>
            <select
              name="unidad"
              value={formData.unidad}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border rounded-xl focus:outline-none transition-all appearance-none cursor-pointer"
              style={{
                borderColor: "#E5E5E5",
                color: "#333333",
                fontFamily: "'Montserrat', sans-serif",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#009933";
                e.currentTarget.style.boxShadow = "0 0 0 2px #00993320";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#E5E5E5";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {unidadesDisponibles.map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <p className="text-xs mt-1" style={{ color: "#999999" }}>
              Unidad de medida del reactivo
            </p>
          </div>
        </div>

        {/* Stock mínimo */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: "#666666" }}
          >
            <span className="flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              Stock mínimo (alerta)
            </span>
          </label>
          <div className="relative">
            <input
              type="number"
              name="stockMinimo"
              value={formData.stockMinimo}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border rounded-xl focus:outline-none transition-all"
              style={{ borderColor: "#E5E5E5", color: "#333333" }}
              min="0"
              step="0.01"
              placeholder="0"
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#009933";
                e.currentTarget.style.boxShadow = "0 0 0 2px #00993320";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#E5E5E5";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <AlertCircle className="w-4 h-4" style={{ color: "#CCCCCC" }} />
            </div>
          </div>
          <p className="text-xs mt-1" style={{ color: "#999999" }}>
            Cuando el stock actual sea menor o igual a este valor, se generará
            una alerta
          </p>
        </div>

        {/* Estado activo - Toggle mejorado */}
        <div
          className="rounded-xl p-4 border"
          style={{ backgroundColor: "#F9F9F9", borderColor: "#E5E5E5" }}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="checkbox"
                name="isActive"
                id="isActive-checkbox"
                checked={formData.isActive}
                onChange={handleChange}
                className="sr-only"
              />
              <div
                onClick={() =>
                  setFormData((prev) => ({ ...prev, isActive: !prev.isActive }))
                }
                className={`
                  w-10 h-6 rounded-full p-1 cursor-pointer transition-colors duration-200
                  ${formData.isActive ? "bg-[#009933]" : "bg-gray-300"}
                `}
              >
                <div
                  className={`
                  w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200
                  ${formData.isActive ? "translate-x-4" : "translate-x-0"}
                `}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="isActive-checkbox"
                className="text-sm font-medium cursor-pointer"
                style={{ color: "#333333" }}
              >
                Reactivo activo
              </label>
              <p className="text-xs mt-0.5" style={{ color: "#666666" }}>
                {formData.isActive
                  ? "El reactivo estará disponible en el inventario"
                  : "El reactivo no aparecerá en las listas activas"}
              </p>
            </div>
          </div>
        </div>

        {/* Resumen de cambios */}
        <div
          className="rounded-xl p-3 border"
          style={{ backgroundColor: "#FFF9E8", borderColor: "#FFCC3330" }}
        >
          <div className="flex items-center gap-2">
            <CheckCircle
              className="w-4 h-4 flex-shrink-0"
              style={{ color: "#FFCC33" }}
            />
            <p className="text-xs" style={{ color: "#996600" }}>
              Los cambios se aplicarán inmediatamente en el sistema
            </p>
          </div>
        </div>

        {/* Botones de acción */}
        <div
          className="flex justify-end gap-3 pt-4 border-t"
          style={{ borderColor: "#E5E5E5" }}
        >
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{ color: "#666666" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#F5F5F5")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#009933" }}
            onMouseEnter={(e) => {
              if (!saving) e.currentTarget.style.backgroundColor = "#00802b";
            }}
            onMouseLeave={(e) => {
              if (!saving) e.currentTarget.style.backgroundColor = "#009933";
            }}
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Guardar Cambios
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
