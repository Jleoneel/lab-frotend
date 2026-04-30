// components/samples/ResultFormModal.jsx
import { useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Swal from "sweetalert2";

export default function ResultFormModal({ isOpen, onClose, analysis, onSave }) {
  const [formData, setFormData] = useState({
    resultText: "",
    resultNumber: "",
    unit: "",
    isFinal: true,
    observaciones: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [archivos, setArchivos] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.resultText && !formData.resultNumber) {
      newErrors.result =
        "Debes ingresar al menos un resultado (texto o numérico)";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('resultText', formData.resultText || '');
      data.append('resultNumber', formData.resultNumber || '');
      data.append('unit', formData.unit || '');
      data.append('isFinal', formData.isFinal);
      data.append('observaciones', formData.observaciones || '');

      //múltiples archivos
      archivos.forEach(file => {
        data.append('archivos', file);
      });

      await onSave(analysis.id, data);

      await Swal.fire({
        icon: 'success',
        title: '¡Resultado registrado!',
        text: 'El resultado ha sido guardado correctamente.',
        confirmButtonColor: '#009933',
        timer: 2000,
        timerProgressBar: true
      });

      onClose();
    } catch (error) {
      // Error guardando resultado
      await Swal.fire({
        icon: 'error',
        title: 'Error al guardar resultado',
        text: 'No se pudo guardar el resultado. Inténtalo nuevamente.',
        confirmButtonColor: '#dc3545'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar Resultado">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Información del análisis */}
        <div
          className="rounded-xl p-4"
          style={{ backgroundColor: "#F9F9F9", border: "1px solid #E5E5E5" }}
        >
          <p
            className="text-xs font-medium uppercase tracking-wider mb-1"
            style={{ color: "#666666" }}
          >
            Análisis
          </p>
          <p
            className="font-semibold"
            style={{ color: "#009933", fontFamily: "'Montserrat', sans-serif" }}
          >
            {analysis?.serviceName}
          </p>
        </div>

        {/* Error general */}
        {errors.submit && (
          <div
            className="rounded-xl p-3 flex items-start gap-2"
            style={{ backgroundColor: "#FEF2F2", border: "1px solid #FEE2E2" }}
          >
            <svg
              className="w-4 h-4 flex-shrink-0 mt-0.5"
              style={{ color: "#DC2626" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm" style={{ color: "#DC2626" }}>
              {errors.submit}
            </p>
          </div>
        )}

        {/* Resultado texto */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: "#666666", fontFamily: "'Montserrat', sans-serif" }}
          >
            Resultado (texto)
          </label>
          <textarea
            name="resultText"
            value={formData.resultText}
            onChange={handleChange}
            rows="2"
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-0 transition-shadow resize-none"
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
            placeholder="Ej: Positivo, Negativo, Detectado, etc."
          />
        </div>

        {/* Resultado numérico y unidad */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Resultado (numérico)"
            type="number"
            name="resultNumber"
            value={formData.resultNumber}
            onChange={handleChange}
            placeholder="Ej: 12.5"
            step="any"
          />

          <Input
            label="Unidad"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            placeholder="Ej: mg/L, %, etc."
          />
        </div>

        {/* Error de resultado */}
        {errors.result && (
          <div
            className="flex items-center gap-2 text-sm"
            style={{ color: "#DC2626" }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{errors.result}</span>
          </div>
        )}

        {/* Checkbox resultado final */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isFinal"
            id="isFinal"
            checked={formData.isFinal}
            onChange={handleChange}
            className="w-4 h-4 rounded focus:ring-0 cursor-pointer"
            style={{ accentColor: "#009933" }}
          />
          <label
            htmlFor="isFinal"
            className="text-sm cursor-pointer"
            style={{ color: "#666666", fontFamily: "'Montserrat', sans-serif" }}
          >
            Marcar como resultado final
          </label>
        </div>

        {/* Observaciones */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: "#666666", fontFamily: "'Montserrat', sans-serif" }}
          >
            Observaciones
          </label>
          <textarea
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            rows="2"
            className="w-full px-4 py-2 border rounded-xl focus:outline-none transition-shadow resize-none"
            style={{ borderColor: "#E5E5E5", color: "#333333" }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#009933";
              e.currentTarget.style.boxShadow = "0 0 0 2px #00993320";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#E5E5E5";
              e.currentTarget.style.boxShadow = "none";
            }}
            placeholder="Notas adicionales sobre el resultado..."
          />
        </div>

        {/* Archivo de evidencia */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: "#666666", fontFamily: "'Montserrat', sans-serif" }}
          >
            Archivos de evidencia
            <span className="text-xs ml-1" style={{ color: "#999999" }}>
              (Excel, CSV, PDF, imagen — máx. 10MB c/u)
            </span>
          </label>
          <div
            className="border-2 border-dashed rounded-xl p-4 text-center transition-colors"
            style={{
              borderColor: archivos.length > 0 ? "#009933" : "#E5E5E5",
              backgroundColor: archivos.length > 0 ? "#F0FDF4" : "#F9F9F9",
            }}
          >
            <input
              type="file"
              id="archivosEvidencia"
              accept=".xlsx,.xls,.csv,.pdf,.png,.jpg,.jpeg"
              multiple
              className="hidden"
              onChange={(e) => setArchivos(Array.from(e.target.files))}
            />
            {archivos.length > 0 ? (
              <div className="space-y-2">
                {archivos.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-2"
                  >
                    <div
                      className="flex items-center gap-2 text-sm"
                      style={{ color: "#009933" }}
                    >
                      <svg
                        className="w-4 h-4 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="truncate max-w-[200px]">
                        {file.name}
                      </span>
                      <span style={{ color: "#666666" }}>
                        ({(file.size / 1024).toFixed(0)} KB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setArchivos(archivos.filter((_, i) => i !== index))
                      }
                      className="text-xs hover:underline ml-2"
                      style={{ color: "#DC2626" }}
                    >
                      Quitar
                    </button>
                  </div>
                ))}
                <label
                  htmlFor="archivosEvidencia"
                  className="cursor-pointer text-xs block mt-2"
                  style={{ color: "#009933" }}
                >
                  + Agregar más archivos
                </label>
              </div>
            ) : (
              <label htmlFor="archivosEvidencia" className="cursor-pointer">
                <div className="flex flex-col items-center gap-1">
                  <svg
                    className="w-8 h-8"
                    style={{ color: "#CCCCCC" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <span className="text-sm" style={{ color: "#666666" }}>
                    <span className="font-medium" style={{ color: "#009933" }}>
                      Haz clic para subir
                    </span>{" "}
                    o arrastra los archivos aquí
                  </span>
                </div>
              </label>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <div
          className="flex justify-end gap-3 pt-4 border-t"
          style={{ borderColor: "#E5E5E5" }}
        >
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: "#009933" }}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Guardando...
              </span>
            ) : (
              "Guardar Resultado"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
