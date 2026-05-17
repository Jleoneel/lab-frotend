// components/inventario/NuevoEquipoModal.jsx
import { useState } from 'react';
import {
  Save,
  Package,
  Hash,
  MapPin,
  Calendar,
  Wrench,
  Settings,
  Cpu,
  Tag,
  AlertCircle,
  CheckCircle,
  PlusCircle,
  ImagePlus,
  X
} from 'lucide-react';
import Modal from '../ui/Modal';
import { equipoService, ESTADOS_EQUIPO } from '../../services/equipoService';
import Swal from 'sweetalert2';

export default function NuevoEquipoModal({ isOpen, onClose, onSaved }) {
  const [formData, setFormData] = useState({
    nombre: '', modelo: '', marca: '', serie: '',
    codigoInventario: '', ubicacion: '',
    fechaAdquisicion: '', fechaMantenimiento: '',
    fechaCalibracion: '', estado: 'ACTIVO'
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFoto(file);
    setFotoPreview(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!formData.codigoInventario.trim()) newErrors.codigoInventario = 'El código de inventario es obligatorio';
    return newErrors;
  };

  const handleSave = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      await Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor completa los campos obligatorios',
        confirmButtonColor: '#009933',
        timer: 2000,
        timerProgressBar: true
      });
      return;
    }

    setSaving(true);
    try {
      await equipoService.create(formData, foto);
      await Swal.fire({
        icon: 'success',
        title: '¡Equipo registrado!',
        text: 'El equipo se ha agregado correctamente al inventario',
        confirmButtonColor: '#009933',
        timer: 2000,
        timerProgressBar: true
      });
      setFormData({
        nombre: '', modelo: '', marca: '', serie: '',
        codigoInventario: '', ubicacion: '',
        fechaAdquisicion: '', fechaMantenimiento: '',
        fechaCalibracion: '', estado: 'ACTIVO'
      });
      setErrors({});
      setFoto(null);
      setFotoPreview(null);
      onSaved();
      onClose();
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'No se pudo registrar el equipo',
        confirmButtonColor: '#dc3545'
      });
    } finally {
      setSaving(false);
    }
  };

  const estadosDisponibles = Object.entries(ESTADOS_EQUIPO);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nuevo Equipo" size="lg">
      <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">

        {/* Header informativo */}
        <div className="rounded-xl p-3 flex items-start gap-2" style={{ backgroundColor: "#E8F5E9", border: "1px solid #00993330" }}>
          <PlusCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#009933" }} />
          <div>
            <p className="text-xs font-medium" style={{ color: "#009933" }}>Registro de nuevo equipo</p>
            <p className="text-xs mt-0.5" style={{ color: "#666666" }}>
              Completa los campos para agregar un equipo al inventario
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nombre - colspan */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1" style={{ color: "#666666" }}>
              <span className="flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" />
                Nombre del equipo
                <span style={{ color: "#DC2626" }}>*</span>
              </span>
            </label>
            <input
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border rounded-xl focus:outline-none transition-all"
              style={{
                borderColor: errors.nombre ? '#FECACA' : '#E5E5E5',
                color: '#333333'
              }}
              placeholder="Ej: Espectrofotómetro UV-Vis"
              onFocus={(e) => { e.currentTarget.style.borderColor = '#009933'; e.currentTarget.style.boxShadow = '0 0 0 2px #00993320'; }}
              onBlur={(e) => { if (!errors.nombre) e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.boxShadow = 'none'; }}
            />
            {errors.nombre && (
              <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.nombre}</p>
            )}
          </div>

          {/* Marca */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#666666" }}>
              <span className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                Marca
              </span>
            </label>
            <input
              name="marca"
              value={formData.marca}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border rounded-xl focus:outline-none transition-all"
              style={{ borderColor: '#E5E5E5', color: '#333333' }}
              placeholder="Ej: Thermo Fisher"
              onFocus={(e) => { e.currentTarget.style.borderColor = '#009933'; e.currentTarget.style.boxShadow = '0 0 0 2px #00993320'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.boxShadow = 'none'; }}
            />
          </div>

          {/* Modelo */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#666666" }}>
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                Modelo
              </span>
            </label>
            <input
              name="modelo"
              value={formData.modelo}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border rounded-xl focus:outline-none transition-all"
              style={{ borderColor: '#E5E5E5', color: '#333333' }}
              placeholder="Ej: Evolution 201"
              onFocus={(e) => { e.currentTarget.style.borderColor = '#009933'; e.currentTarget.style.boxShadow = '0 0 0 2px #00993320'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.boxShadow = 'none'; }}
            />
          </div>

          {/* Serie */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#666666" }}>
              <span className="flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5" />
                Número de serie
              </span>
            </label>
            <input
              name="serie"
              value={formData.serie}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border rounded-xl focus:outline-none transition-all"
              style={{ borderColor: '#E5E5E5', color: '#333333' }}
              placeholder="Ej: SN12345678"
              onFocus={(e) => { e.currentTarget.style.borderColor = '#009933'; e.currentTarget.style.boxShadow = '0 0 0 2px #00993320'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.boxShadow = 'none'; }}
            />
          </div>

          {/* Código de inventario */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#666666" }}>
              <span className="flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5" />
                Código de inventario
                <span style={{ color: "#DC2626" }}>*</span>
              </span>
            </label>
            <input
              name="codigoInventario"
              value={formData.codigoInventario}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border rounded-xl focus:outline-none transition-all"
              style={{
                borderColor: errors.codigoInventario ? '#FECACA' : '#E5E5E5',
                color: '#333333'
              }}
              placeholder="Ej: LAB-001"
              onFocus={(e) => { e.currentTarget.style.borderColor = '#009933'; e.currentTarget.style.boxShadow = '0 0 0 2px #00993320'; }}
              onBlur={(e) => { if (!errors.codigoInventario) e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.boxShadow = 'none'; }}
            />
            {errors.codigoInventario && (
              <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{errors.codigoInventario}</p>
            )}
          </div>

          {/* Ubicación */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#666666" }}>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Ubicación
              </span>
            </label>
            <input
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border rounded-xl focus:outline-none transition-all"
              style={{ borderColor: '#E5E5E5', color: '#333333' }}
              placeholder="Ej: Laboratorio de Química - Estante 3"
              onFocus={(e) => { e.currentTarget.style.borderColor = '#009933'; e.currentTarget.style.boxShadow = '0 0 0 2px #00993320'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.boxShadow = 'none'; }}
            />
          </div>

          {/* Fecha de adquisición */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#666666" }}>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Fecha de adquisición
              </span>
            </label>
            <input
              type="date"
              name="fechaAdquisicion"
              value={formData.fechaAdquisicion}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border rounded-xl focus:outline-none transition-all"
              style={{ borderColor: '#E5E5E5', color: '#333333' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#009933'; e.currentTarget.style.boxShadow = '0 0 0 2px #00993320'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.boxShadow = 'none'; }}
            />
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#666666" }}>
              <span className="flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                Estado
              </span>
            </label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border rounded-xl focus:outline-none transition-all appearance-none cursor-pointer"
              style={{ borderColor: '#E5E5E5', color: '#333333', fontFamily: "'Montserrat', sans-serif" }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#009933'; e.currentTarget.style.boxShadow = '0 0 0 2px #00993320'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              {estadosDisponibles.map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <p className="text-xs mt-1" style={{ color: '#999999' }}>
              Estado inicial del equipo al momento del registro
            </p>
          </div>

          {/* Fecha de mantenimiento */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#666666" }}>
              <span className="flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5" />
                Fecha de mantenimiento
              </span>
            </label>
            <input
              type="date"
              name="fechaMantenimiento"
              value={formData.fechaMantenimiento}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border rounded-xl focus:outline-none transition-all"
              style={{ borderColor: '#E5E5E5', color: '#333333' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#009933'; e.currentTarget.style.boxShadow = '0 0 0 2px #00993320'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.boxShadow = 'none'; }}
            />
          </div>

          {/* Fecha de calibración */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#666666" }}>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Fecha de calibración
              </span>
            </label>
            <input
              type="date"
              name="fechaCalibracion"
              value={formData.fechaCalibracion}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border rounded-xl focus:outline-none transition-all"
              style={{ borderColor: '#E5E5E5', color: '#333333' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#009933'; e.currentTarget.style.boxShadow = '0 0 0 2px #00993320'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.boxShadow = 'none'; }}
            />
          </div>
        </div>

        {/* Foto del equipo */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1" style={{ color: "#666666" }}>
            <span className="flex items-center gap-1.5">
              <ImagePlus className="w-3.5 h-3.5" />
              Foto del equipo
            </span>
          </label>
          {fotoPreview ? (
            <div className="relative inline-block">
              <img src={fotoPreview} alt="preview"
                className="w-32 h-32 object-cover rounded-xl border"
                style={{ borderColor: '#E5E5E5' }} />
              <button
                onClick={() => { setFoto(null); setFotoPreview(null); }}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: '#DC2626' }}>
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer transition-all"
              style={{ borderColor: '#E5E5E5' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#009933'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#E5E5E5'}>
              <ImagePlus className="w-6 h-6 mb-1" style={{ color: '#CCCCCC' }} />
              <span className="text-xs" style={{ color: '#999999' }}>
                Click para subir imagen (JPG, PNG, WebP — máx 5MB)
              </span>
              <input type="file" className="hidden" accept="image/jpeg,image/png,image/webp"
                onChange={handleFoto} />
            </label>
          )}
        </div>

        {/* Resumen de campos obligatorios */}
        <div className="rounded-xl p-3 border" style={{ backgroundColor: "#FFF9E8", borderColor: "#FFCC3330" }}>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#FFCC33" }} />
            <p className="text-xs" style={{ color: "#996600" }}>
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
                <Save className="w-4 h-4" />
                Registrar Equipo
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}