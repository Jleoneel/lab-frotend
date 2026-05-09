// components/inventario/RegistrarIngresoModal.jsx
import { useState, useEffect } from 'react';
import { TrendingUp, Package, AlertCircle, CheckCircle, Hash, Scale } from 'lucide-react';
import Modal from '../ui/Modal';
import { reactivoService, UNIDADES } from '../../services/reactivoService';
import Swal from 'sweetalert2';

export default function RegistrarIngresoModal({ isOpen, onClose, reactivo, onSaved }) {
  const [reactivos, setReactivos] = useState([]);
  const [formData, setFormData] = useState({ reactivoId: '', cantidad: '', observaciones: '' });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadReactivos();
      if (reactivo) setFormData(prev => ({ ...prev, reactivoId: reactivo.id }));
      setErrors({});
    }
  }, [isOpen, reactivo]);

  const loadReactivos = async () => {
    try {
      const response = await reactivoService.getAll();
      setReactivos(response.data.filter(r => r.isActive));
    } catch (error) {
      console.error('Error cargando reactivos:', error);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.reactivoId) newErrors.reactivoId = 'Debes seleccionar un reactivo';
    if (!formData.cantidad) newErrors.cantidad = 'Debes ingresar una cantidad';
    if (parseFloat(formData.cantidad) <= 0) newErrors.cantidad = 'La cantidad debe ser mayor a 0';
    return newErrors;
  };

  const handleSave = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      await Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor completa los campos requeridos',
        confirmButtonColor: '#009933',
        timer: 2000,
        timerProgressBar: true
      });
      return;
    }

    setSaving(true);
    try {
      await reactivoService.registrarMovimiento({
        reactivoId: formData.reactivoId,
        tipo: 'INGRESO',
        razon: 'INICIO',
        cantidad: parseFloat(formData.cantidad),
        observaciones: formData.observaciones || null
      });
      
      await Swal.fire({
        icon: 'success',
        title: '¡Ingreso registrado!',
        text: `Se han agregado ${formData.cantidad} unidades al stock`,
        confirmButtonColor: '#009933',
        timer: 2000,
        timerProgressBar: true
      });
      
      setFormData({ reactivoId: reactivo?.id || '', cantidad: '', observaciones: '' });
      setErrors({});
      onSaved();
      onClose();
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'No se pudo registrar el ingreso',
        confirmButtonColor: '#dc3545'
      });
    } finally {
      setSaving(false);
    }
  };

  const reactivoActual = reactivos.find(r => r.id === formData.reactivoId);
  const nuevaCantidad = formData.cantidad ? parseFloat(formData.cantidad) : 0;
  const stockFuturo = reactivoActual ? (reactivoActual.stockActual || 0) + nuevaCantidad : 0;

   //eslint-disable-next-line
  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #E5E5E5',
    borderRadius: '12px',
    fontSize: '14px',
    color: '#333333',
    outline: 'none',
    fontFamily: "'Montserrat', sans-serif"
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar Ingreso de Stock" size="md">
      <div className="space-y-5">
        
        {/* Header informativo */}
        <div className="rounded-xl p-3 flex items-start gap-2" style={{ backgroundColor: "#E8F5E9", border: "1px solid #00993330" }}>
          <TrendingUp className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#009933" }} />
          <div>
            <p className="text-xs font-medium" style={{ color: "#009933" }}>Registro de ingreso</p>
            <p className="text-xs mt-0.5" style={{ color: "#666666" }}>
              Agrega stock al inventario de reactivos
            </p>
          </div>
        </div>

        {/* Selección de reactivo */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "#666666" }}>
            <span className="flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5" />
              Reactivo
              <span style={{ color: "#DC2626" }}>*</span>
            </span>
          </label>
          <select
            value={formData.reactivoId}
            onChange={(e) => setFormData({ ...formData, reactivoId: e.target.value })}
            className="w-full px-4 py-2.5 border rounded-xl focus:outline-none transition-all appearance-none cursor-pointer"
            style={{ 
              borderColor: errors.reactivoId ? '#FECACA' : '#E5E5E5',
              color: '#333333',
              fontFamily: "'Montserrat', sans-serif"
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#009933'; e.currentTarget.style.boxShadow = '0 0 0 2px #00993320'; }}
            onBlur={(e) => { if (!errors.reactivoId) e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <option value="">Seleccionar reactivo</option>
            {reactivos.map(r => (
              <option key={r.id} value={r.id}>
                {r.nombre} ({r.codigo})
              </option>
            ))}
          </select>
          {errors.reactivoId && (
            <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.reactivoId}</p>
          )}
        </div>

        {/* Información del reactivo seleccionado */}
        {reactivoActual && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl p-3" style={{ backgroundColor: "#F9F9F9", border: "1px solid #E5E5E5" }}>
              <div className="flex items-center gap-2">
                <Hash className="w-3.5 h-3.5" style={{ color: "#666666" }} />
                <p className="text-xs" style={{ color: "#666666" }}>Código</p>
              </div>
              <p className="text-sm font-mono mt-0.5" style={{ color: "#009933" }}>{reactivoActual.codigo}</p>
            </div>
            <div className="rounded-xl p-3" style={{ backgroundColor: "#E8F5E9", border: "1px solid #00993330" }}>
              <div className="flex items-center gap-2">
                <Scale className="w-3.5 h-3.5" style={{ color: "#009933" }} />
                <p className="text-xs" style={{ color: "#666666" }}>Stock actual</p>
              </div>
              <p className="text-lg font-bold" style={{ color: "#009933" }}>
                {reactivoActual.stockActual} <span className="text-sm">{UNIDADES[reactivoActual.unidad]}</span>
              </p>
            </div>
          </div>
        )}

        {/* Cantidad a ingresar */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "#666666" }}>
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              Cantidad a ingresar
              <span style={{ color: "#DC2626" }}>*</span>
            </span>
          </label>
          <div className="relative">
            <input
              type="number"
              value={formData.cantidad}
              onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
              className="w-full px-4 py-2.5 border rounded-xl focus:outline-none transition-all"
              style={{ 
                borderColor: errors.cantidad ? '#FECACA' : '#E5E5E5',
                color: '#333333'
              }}
              min="0.01"
              step="0.01"
              placeholder="0.00"
              onFocus={(e) => { e.currentTarget.style.borderColor = '#009933'; e.currentTarget.style.boxShadow = '0 0 0 2px #00993320'; }}
              onBlur={(e) => { if (!errors.cantidad) e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.boxShadow = 'none'; }}
            />
            {reactivoActual && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <p className="text-sm" style={{ color: '#666666' }}>{UNIDADES[reactivoActual.unidad]}</p>
              </div>
            )}
          </div>
          {errors.cantidad && (
            <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.cantidad}</p>
          )}
        </div>

        {/* Vista previa de stock después del ingreso */}
        {reactivoActual && formData.cantidad && parseFloat(formData.cantidad) > 0 && (
          <div className="rounded-xl p-3 border" style={{ backgroundColor: "#FFF9E8", borderColor: "#FFCC3330" }}>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#FFCC33" }} />
              <p className="text-xs font-medium" style={{ color: "#996600" }}>Vista previa del stock</p>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-xs" style={{ color: "#666666" }}>Stock actual:</span>
              <span className="font-mono font-medium" style={{ color: "#666666" }}>
                {reactivoActual.stockActual || 0} {UNIDADES[reactivoActual.unidad]}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-xs" style={{ color: "#666666" }}>Ingreso:</span>
              <span className="font-mono font-medium" style={{ color: "#009933" }}>
                + {nuevaCantidad} {UNIDADES[reactivoActual.unidad]}
              </span>
            </div>
            <div className="border-t mt-2 pt-2 flex items-center justify-between text-sm" style={{ borderColor: "#FFCC3340" }}>
              <span className="text-xs font-medium" style={{ color: "#996600" }}>Nuevo stock:</span>
              <span className="font-mono font-bold" style={{ color: "#009933" }}>
                {stockFuturo} {UNIDADES[reactivoActual.unidad]}
              </span>
            </div>
          </div>
        )}

        {/* Observaciones */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "#666666" }}>
            <span className="flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              Observaciones
            </span>
          </label>
          <textarea
            value={formData.observaciones}
            onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
            className="w-full px-4 py-2.5 border rounded-xl focus:outline-none transition-all resize-none"
            style={{ borderColor: '#E5E5E5', color: '#333333', fontFamily: "'Montserrat', sans-serif" }}
            rows="3"
            placeholder="Ej: Compra realizada a proveedor XYZ, factura #001..."
            onFocus={(e) => { e.currentTarget.style.borderColor = '#009933'; e.currentTarget.style.boxShadow = '0 0 0 2px #00993320'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.boxShadow = 'none'; }}
          />
          <p className="text-xs mt-1" style={{ color: '#999999' }}>
            Información adicional sobre este ingreso (opcional)
          </p>
        </div>

        {/* Resumen */}
        <div className="rounded-xl p-3 border" style={{ backgroundColor: "#F9F9F9", borderColor: "#E5E5E5" }}>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#666666" }} />
            <p className="text-xs" style={{ color: "#666666" }}>
              Los campos marcados con <span style={{ color: "#DC2626" }}>*</span> son obligatorios
            </p>
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
                <TrendingUp className="w-4 h-4" />
                Registrar Ingreso
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}