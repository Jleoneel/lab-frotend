// components/inventario/NuevoReactivoModal.jsx
import { useState, useEffect } from "react";
import {
  Save,
  Package,
  Hash,
  FlaskConical,
  AlertCircle,
  CheckCircle,
  PlusCircle,
  Layers,
  Scale,
} from "lucide-react";
import Modal from "../ui/Modal";
import { reactivoService, UNIDADES } from "../../services/reactivoService";
import { categoriaReactivoService } from "../../services/categoriaReactivoService";
import Swal from "sweetalert2";

export default function NuevoReactivoModal({ isOpen, onClose, onSaved }) {
  const [formData, setFormData] = useState({
    codigo: "",
    nombre: "",
    categoriaId: "",
    unidad: "LITROS",
    stockMinimo: "0",
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.codigo.trim()) newErrors.codigo = "El código es obligatorio";
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
      await reactivoService.create(formData);
      await Swal.fire({
        icon: "success",
        title: "¡Reactivo creado!",
        text: "El reactivo se ha agregado correctamente al inventario",
        confirmButtonColor: "#009933",
        timer: 2000,
        timerProgressBar: true,
      });
      setFormData({
        codigo: "",
        nombre: "",
        categoriaId: "",
        unidad: "LITROS",
        stockMinimo: "0",
      });
      setErrors({});
      onSaved();
      onClose();
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "No se pudo crear el reactivo",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setSaving(false);
    }
  };

  const unidadesDisponibles = Object.entries(UNIDADES);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nuevo Reactivo" size="md">
      <div className="space-y-5">
        {/* Header informativo */}
        <div
          className="rounded-xl p-3 flex items-start gap-2"
          style={{ backgroundColor: "#E8F5E9", border: "1px solid #00993330" }}
        >
          <PlusCircle
            className="w-4 h-4 flex-shrink-0 mt-0.5"
            style={{ color: "#009933" }}
          />
          <div>
            <p className="text-xs font-medium" style={{ color: "#009933" }}>
              Registro de nuevo reactivo
            </p>
            <p className="text-xs mt-0.5" style={{ color: "#666666" }}>
              Completa los campos para agregar un reactivo al inventario
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Código */}
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "#666666" }}
            >
              <span className="flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5" />
                Código
                <span style={{ color: "#DC2626" }}>*</span>
              </span>
            </label>
            <input
              name="codigo"
              value={formData.codigo}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border rounded-xl focus:outline-none transition-all"
              style={{
                borderColor: errors.codigo ? "#FECACA" : "#E5E5E5",
                color: "#333333",
              }}
              placeholder="Ej: ACE-001"
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#009933";
                e.currentTarget.style.boxShadow = "0 0 0 2px #00993320";
              }}
              onBlur={(e) => {
                if (!errors.codigo)
                  e.currentTarget.style.borderColor = "#E5E5E5";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            {errors.codigo && (
              <p className="text-xs mt-1" style={{ color: "#DC2626" }}>
                {errors.codigo}
              </p>
            )}
          </div>

          {/* Unidad */}
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "#666666" }}
            >
              <span className="flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5" />
                Unidad
                <span style={{ color: "#DC2626" }}>*</span>
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

        {/* Categoría */}
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
              borderColor: errors.categoria ? "#FECACA" : "#E5E5E5",
              color: "#333333",
              fontFamily: "'Montserrat', sans-serif",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#009933";
              e.currentTarget.style.boxShadow = "0 0 0 2px #00993320";
            }}
            onBlur={(e) => {
              if (!errors.categoria)
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
              <FlaskConical className="w-4 h-4" style={{ color: "#CCCCCC" }} />
            </div>
          </div>
          <p className="text-xs mt-1" style={{ color: "#999999" }}>
            Cuando el stock actual sea menor o igual a este valor, se generará
            una alerta
          </p>
        </div>

        {/* Resumen de campos obligatorios */}
        <div
          className="rounded-xl p-3 border"
          style={{ backgroundColor: "#FFF9E8", borderColor: "#FFCC3330" }}
        >
          <div className="flex items-center gap-2">
            <AlertCircle
              className="w-4 h-4 flex-shrink-0"
              style={{ color: "#FFCC33" }}
            />
            <p className="text-xs" style={{ color: "#996600" }}>
              Los campos marcados con{" "}
              <span style={{ color: "#DC2626" }}>*</span> son obligatorios
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
                Guardar Reactivo
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
