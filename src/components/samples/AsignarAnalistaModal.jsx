// components/samples/AsignarAnalistaModal.jsx
import { useState, useEffect } from "react";
import { User, Save, Mail, ClipboardList, Send, CheckCircle } from "lucide-react";
import Modal from "../ui/Modal";
import { userService } from "../../services/userService";
import { sampleService } from "../../services/sampleService";
import Swal from "sweetalert2";
import { mensajeService } from "../../services/mensajeService";

export default function AsignarAnalistaModal({
  isOpen,
  onClose,
  analysis,
  onSaved,
}) {
  const [analistas, setAnalistas] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [instrucciones, setInstrucciones] = useState("");

  useEffect(() => {
    if (isOpen) {
      loadAnalistas();
      setSelectedUserId(analysis?.assignedToId || "");
      setInstrucciones("");
    }
  }, [isOpen, analysis]);

  const loadAnalistas = async () => {
    setLoading(true);
    try {
      const response = await userService.getAnalistas();
      setAnalistas(response.data || []);
    } catch (error) {
      console.error("Error cargando analistas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedUserId) {
      await Swal.fire({
        icon: "warning",
        title: "Selecciona un analista",
        text: "Debes seleccionar un analista para continuar",
        confirmButtonColor: "#009933",
        timer: 2500,
        timerProgressBar: true,
      });
      return;
    }

    setSaving(true);
    try {
      await sampleService.assignAnalista(analysis.id, selectedUserId);
      
      if (instrucciones.trim()) {
        await mensajeService.send(
          selectedUserId,
          `INSTRUCCIONES PARA ANÁLISIS: ${analysis.service?.name}\n\nInstrucciones:\n${instrucciones}\n\n---\n`
        );
      }

      await Swal.fire({
        icon: "success",
        title: "¡Analista asignado!",
        html: `Se ha asignado el análisis <strong>${analysis.service?.name}</strong> correctamente${instrucciones.trim() ? ' con instrucciones especiales.' : '.'}`,
        confirmButtonColor: "#009933",
        timer: 2000,
        timerProgressBar: true,
      });
      
      setInstrucciones("");
      onSaved();
      onClose();
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error al asignar",
        text: error.response?.data?.message || "No se pudo asignar el analista",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setSaving(false);
    }
  };

  const selectedAnalista = analistas.find(a => a.id === selectedUserId);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Asignar Analista" size="md">
      <div className="space-y-5">
        {/* Info del análisis */}
        {analysis && (
          <div
            className="rounded-xl p-4 flex items-start gap-3"
            style={{ backgroundColor: "#E8F5E9", border: "1px solid #00993330" }}
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-white shadow-sm">
              <ClipboardList className="w-5 h-5" style={{ color: "#009933" }} />
            </div>
            <div className="flex-1">
              <p
                className="text-xs font-medium uppercase tracking-wider"
                style={{ color: "#666666" }}
              >
                Análisis a asignar
              </p>
              <p className="text-base font-semibold mt-0.5" style={{ color: "#009933" }}>
                {analysis.service?.name}
              </p>
              {analysis.assignedTo && (
                <div className="flex items-center gap-1.5 mt-2">
                  <User className="w-3.5 h-3.5" style={{ color: "#666666" }} />
                  <p className="text-xs" style={{ color: "#666666" }}>
                    Actualmente asignado a: <span className="font-medium" style={{ color: "#009933" }}>{analysis.assignedTo}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Lista de analistas */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div
              className="w-10 h-10 border-4 rounded-full animate-spin mb-3"
              style={{ borderColor: "#009933", borderTopColor: "#FFCC33" }}
            ></div>
            <p className="text-sm" style={{ color: "#666666" }}>Cargando analistas...</p>
          </div>
        ) : analistas.length === 0 ? (
          <div
            className="text-center py-10 rounded-xl"
            style={{ backgroundColor: "#F9F9F9" }}
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: "#F5F5F5" }}>
              <User className="w-8 h-8" style={{ color: "#CCCCCC" }} />
            </div>
            <p className="text-sm font-medium" style={{ color: "#666666" }}>
              No hay analistas registrados
            </p>
            <p className="text-xs mt-1" style={{ color: "#999999" }}>
              Crea usuarios con rol ANALYST primero en el panel de usuarios
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium" style={{ color: "#666666" }}>
                Selecciona un analista:
              </p>
              <p className="text-xs" style={{ color: "#999999" }}>
                {analistas.length} disponible{analistas.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {analistas.map((analista) => (
                <div
                  key={analista.id}
                  onClick={() => setSelectedUserId(analista.id)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-sm"
                  style={{
                    borderColor: selectedUserId === analista.id ? "#009933" : "#E5E5E5",
                    backgroundColor: selectedUserId === analista.id ? "#E8F5E9" : "#FFFFFF",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm flex-shrink-0"
                    style={{ backgroundColor: "#009933" }}
                  >
                    {analista.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold" style={{ color: "#333333" }}>
                      {analista.fullName}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3" style={{ color: "#666666" }} />
                      <p className="text-xs truncate" style={{ color: "#666666" }}>
                        {analista.email}
                      </p>
                    </div>
                  </div>
                  {selectedUserId === analista.id && (
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "#009933" }}
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Instrucciones */}
            <div className="pt-2">
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#666666" }}>
                <div className="flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5" />
                  <span>Instrucciones para el analista</span>
                  <span className="text-xs font-normal" style={{ color: "#999999" }}>(opcional)</span>
                </div>
              </label>
              <textarea
                value={instrucciones}
                onChange={(e) => setInstrucciones(e.target.value)}
                rows={3}
                placeholder="Ej: Procesar antes del viernes, prioridad alta, utilizar reactivo específico..."
                className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none transition-all resize-none"
                style={{ borderColor: "#E5E5E5", color: "#333333", fontFamily: "'Montserrat', sans-serif" }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#009933";
                  e.currentTarget.style.boxShadow = "0 0 0 2px #00993320";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#E5E5E5";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              <p className="text-xs mt-1.5" style={{ color: "#999999" }}>
                Esta instrucción será enviada como mensaje al analista seleccionado
              </p>
            </div>
          </div>
        )}

        {/* Resumen de selección */}
        {selectedUserId && selectedAnalista && !loading && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: "#FFF9E8", border: "1px solid #FFCC3330" }}>
            <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#FFCC33" }} />
            <p className="text-xs" style={{ color: "#996600" }}>
              Se asignará a <strong>{selectedAnalista.fullName}</strong>
              {instrucciones.trim() && " con instrucciones adicionales"}
            </p>
          </div>
        )}

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
            disabled={saving || !selectedUserId || loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#009933" }}
            onMouseEnter={(e) => { if (!saving && selectedUserId) e.currentTarget.style.backgroundColor = "#00802b"; }}
            onMouseLeave={(e) => { if (!saving) e.currentTarget.style.backgroundColor = "#009933"; }}
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Asignando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Asignar Analista
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}