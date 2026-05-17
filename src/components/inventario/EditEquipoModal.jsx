// components/inventario/EditEquipoModal.jsx
import { useState, useEffect, useRef } from 'react';
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
  Camera,
  Image,
  Trash2,
  Plus,
  Upload
} from 'lucide-react';
import Modal from '../ui/Modal';
import { equipoService, ESTADOS_EQUIPO } from '../../services/equipoService';
import Swal from 'sweetalert2';

const toDateInput = (date) => {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
};

export default function EditEquipoModal({ isOpen, onClose, equipo, onSaved }) {
  const [formData, setFormData] = useState({
    nombre: '', modelo: '', marca: '', serie: '',
    codigoInventario: '', ubicacion: '',
    fechaAdquisicion: '', fechaMantenimiento: '',
    fechaCalibracion: '', estado: 'ACTIVO'
  });
  const [fotos, setFotos] = useState([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && equipo) {
      setFormData({
        nombre: equipo.nombre || '',
        modelo: equipo.modelo || '',
        marca: equipo.marca || '',
        serie: equipo.serie || '',
        codigoInventario: equipo.codigoInventario || '',
        ubicacion: equipo.ubicacion || '',
        fechaAdquisicion: toDateInput(equipo.fechaAdquisicion),
        fechaMantenimiento: toDateInput(equipo.fechaMantenimiento),
        fechaCalibracion: toDateInput(equipo.fechaCalibracion),
        estado: equipo.estado || 'ACTIVO'
      });
      if (equipo.fotoUrl) {
        setFotos([{
          url: `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}${equipo.fotoUrl}`,
          isExisting: true
        }]);
      } else {
        setFotos([]);
      }
      setErrors({});
    }
  }, [isOpen, equipo]);

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

  // Manejo de fotos
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newFotos = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      isExisting: false
    }));
    setFotos(prev => [...prev, ...newFotos]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFoto = (index) => {
    const foto = fotos[index];
    if (foto.preview && !foto.isExisting) {
      URL.revokeObjectURL(foto.preview);
    }
    setFotos(prev => prev.filter((_, i) => i !== index));
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
      const fotoNueva = fotos.find(f => !f.isExisting)?.file || null;
      await equipoService.update(equipo.id, formData, fotoNueva);

      await Swal.fire({
        icon: 'success',
        title: '¡Equipo actualizado!',
        text: 'Los datos del equipo se han modificado correctamente',
        confirmButtonColor: '#009933',
        timer: 2000,
        timerProgressBar: true
      });

      fotos.forEach(foto => {
        if (foto.preview && !foto.isExisting) URL.revokeObjectURL(foto.preview);
      });

      onSaved();
      onClose();
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'No se pudo actualizar el equipo',
        confirmButtonColor: '#dc3545'
      });
    } finally {
      setSaving(false);
    }
  };

  const estadosDisponibles = Object.entries(ESTADOS_EQUIPO);
  const estadoActual = estadosDisponibles.find(([key]) => key === formData.estado);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Equipo" size="lg">
      <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">

        {/* Header informativo */}
        <div className="rounded-xl p-3 flex items-start gap-2" style={{ backgroundColor: "#E8F5E9", border: "1px solid #00993330" }}>
          <Wrench className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#009933" }} />
          <div>
            <p className="text-xs font-medium" style={{ color: "#009933" }}>Editando equipo</p>
            <p className="text-xs mt-0.5" style={{ color: "#666666" }}>
              Modifica los campos que necesites actualizar
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nombre */}
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
            {estadoActual && (
              <p className="text-xs mt-1" style={{ color: '#666666' }}>
                Estado actual: <span className="font-medium" style={{ color: '#009933' }}>{estadoActual[1]}</span>
              </p>
            )}
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

        {/* Sección de Fotos */}
        <div className="border rounded-xl p-4" style={{ borderColor: '#E5E5E5' }}>
          <div className="flex items-center gap-2 mb-3">
            <Camera className="w-4 h-4" style={{ color: '#009933' }} />
            <h3 className="text-sm font-semibold" style={{ color: '#333333' }}>Fotos del equipo</h3>
          </div>

          {/* Área de subida */}
          <div
            className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all hover:border-[#009933] hover:bg-[#E8F5E9]"
            style={{ borderColor: '#E5E5E5', backgroundColor: '#FAFAFA' }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
            <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: '#CCCCCC' }} />
            <p className="text-sm font-medium" style={{ color: '#666666' }}>
              Haz clic o arrastra imágenes
            </p>
            <p className="text-xs mt-1" style={{ color: '#999999' }}>
              Soporta JPG, PNG, GIF (máx. 5MB cada una)
            </p>
          </div>

          {/* Grid de fotos */}
          {fotos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
              {fotos.map((foto, idx) => (
                <div key={idx} className="relative group rounded-lg overflow-hidden border" style={{ borderColor: '#E5E5E5' }}>
                  <img
                    src={foto.preview || foto.url}
                    alt={`Equipo ${idx + 1}`}
                    className="w-full h-24 object-cover"
                  />
                  <button
                    onClick={() => removeFoto(idx)}
                    className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: '#DC2626' }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {fotos.length === 0 && (
            <p className="text-xs text-center mt-3" style={{ color: '#999999' }}>
              No hay fotos registradas
            </p>
          )}
        </div>

        {/* Resumen de cambios */}
        <div className="rounded-xl p-3 border" style={{ backgroundColor: "#FFF9E8", borderColor: "#FFCC3330" }}>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#FFCC33" }} />
            <p className="text-xs" style={{ color: "#996600" }}>
              Los cambios se aplicarán inmediatamente en el sistema
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