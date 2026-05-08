// pages/documents/DocumentosPage.jsx
import { useState, useEffect } from 'react';
import { 
  Plus, 
  ExternalLink, 
  Trash2, 
  Pencil, 
  FolderOpen, 
  Link, 
  X, 
  Save, 
  ChevronDown, 
  ChevronUp,
  FileText,
  Globe,
  Archive
} from 'lucide-react';
import { documentoService } from '../../services/documentoService';
import { useAuthStore } from '../../store/authStore';
import Swal from 'sweetalert2';

export default function DocumentosPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandidas, setExpandidas] = useState({});

  // Estados modales
  const [showCatModal, setShowCatModal] = useState(false);
  const [showEnlaceModal, setShowEnlaceModal] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [editingEnlace, setEditingEnlace] = useState(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  // Formularios
  const [catNombre, setCatNombre] = useState('');
  const [enlaceForm, setEnlaceForm] = useState({ titulo: '', url: '', descripcion: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const data = await documentoService.getAll();
      setCategorias(Array.isArray(data) ? data : []);
      const exp = {};
      data.forEach(c => exp[c.id] = true);
      setExpandidas(exp);
    } catch (error) {
      console.error(error);
      await Swal.fire({
        icon: 'error',
        title: 'Error al cargar',
        text: 'No se pudieron cargar los documentos',
        confirmButtonColor: '#DC2626',
        timer: 3000,
        timerProgressBar: true
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandidas(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Categorías
  const handleSaveCategoria = async () => {
    if (!catNombre.trim()) {
      await Swal.fire({
        icon: 'warning',
        title: 'Nombre requerido',
        text: 'Debes ingresar un nombre para la categoría',
        confirmButtonColor: '#009933',
        timer: 2000,
        timerProgressBar: true
      });
      return;
    }
    setSaving(true);
    try {
      if (editingCat) {
        await documentoService.updateCategoria(editingCat.id, { nombre: catNombre });
        await Swal.fire({
          icon: 'success',
          title: 'Categoría actualizada',
          text: 'Los cambios se guardaron correctamente',
          confirmButtonColor: '#009933',
          timer: 1500,
          timerProgressBar: true
        });
      } else {
        await documentoService.createCategoria(catNombre);
        await Swal.fire({
          icon: 'success',
          title: 'Categoría creada',
          text: 'La categoría se agregó correctamente',
          confirmButtonColor: '#009933',
          timer: 1500,
          timerProgressBar: true
        });
      }
      await loadData();
      setShowCatModal(false);
      setCatNombre('');
      setEditingCat(null);
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'No se pudo guardar la categoría',
        confirmButtonColor: '#DC2626'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategoria = async (cat) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar categoría?',
      html: `Se eliminará la categoría <strong>"${cat.nombre}"</strong> y <strong>todos sus enlaces</strong>.<br>Esta acción no se puede deshacer.`,
      showCancelButton: true,
      confirmButtonColor: '#DC2626',
      cancelButtonColor: '#666666',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;
    try {
      await documentoService.deleteCategoria(cat.id);
      await loadData();
      await Swal.fire({
        icon: 'success',
        title: 'Categoría eliminada',
        text: 'La categoría y sus enlaces fueron eliminados',
        confirmButtonColor: '#009933',
        timer: 1500,
        timerProgressBar: true
      });
      //eslint-disable-next-line no-unused-vars
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar la categoría',
        confirmButtonColor: '#DC2626'
      });
    }
  };

  // Enlaces
  const handleSaveEnlace = async () => {
    if (!enlaceForm.titulo.trim()) {
      await Swal.fire({
        icon: 'warning',
        title: 'Título requerido',
        text: 'Debes ingresar un título para el enlace',
        confirmButtonColor: '#009933',
        timer: 2000,
        timerProgressBar: true
      });
      return;
    }
    if (!enlaceForm.url.trim()) {
      await Swal.fire({
        icon: 'warning',
        title: 'URL requerida',
        text: 'Debes ingresar una dirección URL válida',
        confirmButtonColor: '#009933',
        timer: 2000,
        timerProgressBar: true
      });
      return;
    }
    setSaving(true);
    try {
      if (editingEnlace) {
        await documentoService.updateEnlace(editingEnlace.id, enlaceForm);
        await Swal.fire({
          icon: 'success',
          title: 'Enlace actualizado',
          text: 'Los cambios se guardaron correctamente',
          confirmButtonColor: '#009933',
          timer: 1500,
          timerProgressBar: true
        });
      } else {
        await documentoService.createEnlace({ ...enlaceForm, categoriaId: categoriaSeleccionada.id });
        await Swal.fire({
          icon: 'success',
          title: 'Enlace agregado',
          text: 'El documento se agregó correctamente',
          confirmButtonColor: '#009933',
          timer: 1500,
          timerProgressBar: true
        });
      }
      await loadData();
      setShowEnlaceModal(false);
      setEnlaceForm({ titulo: '', url: '', descripcion: '' });
      setEditingEnlace(null);
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'No se pudo guardar el enlace',
        confirmButtonColor: '#DC2626'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEnlace = async (enlace) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar enlace?',
      html: `Se eliminará el documento <strong>"${enlace.titulo}"</strong>`,
      showCancelButton: true,
      confirmButtonColor: '#DC2626',
      cancelButtonColor: '#666666',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;
    try {
      await documentoService.deleteEnlace(enlace.id);
      await loadData();
      await Swal.fire({
        icon: 'success',
        title: 'Enlace eliminado',
        text: 'El documento fue eliminado correctamente',
        confirmButtonColor: '#009933',
        timer: 1500,
        timerProgressBar: true
      });
      //eslint-disable-next-line no-unused-vars
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar el enlace',
        confirmButtonColor: '#DC2626'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: '#009933', borderTopColor: '#FFCC33' }}></div>
          <p className="text-sm" style={{ color: '#666666', fontFamily: "'Montserrat', sans-serif" }}>
            Cargando documentos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"
            style={{ backgroundColor: '#E8F5E9' }}>
            <Archive className="w-7 h-7" style={{ color: '#009933' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#009933', fontFamily: "'Trajan Pro Bold', serif" }}>
              Archivos y Documentación
            </h1>
            <p className="text-sm mt-0.5" style={{ color: '#666666', fontFamily: "'Montserrat', sans-serif" }}>
              Recursos y enlaces del laboratorio
            </p>
          </div>
        </div>
        {isAdmin && (
          <button
            onClick={() => { setEditingCat(null); setCatNombre(''); setShowCatModal(true); }}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:shadow-md"
            style={{ backgroundColor: '#009933' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00802b'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#009933'}
          >
            <Plus className="w-4 h-4" />
            Nueva Categoría
          </button>
        )}
      </div>

      {/* Estadísticas rápidas */}
      {categorias.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-all duration-200"
            style={{ borderColor: '#E5E5E5' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E8F5E9' }}>
                <FolderOpen className="w-5 h-5" style={{ color: '#009933' }} />
              </div>
              <div>
                <p className="text-xs" style={{ color: '#666666' }}>Categorías</p>
                <p className="text-2xl font-bold" style={{ color: '#009933' }}>{categorias.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-all duration-200"
            style={{ borderColor: '#E5E5E5' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FFF9E8' }}>
                <Link className="w-5 h-5" style={{ color: '#FFCC33' }} />
              </div>
              <div>
                <p className="text-xs" style={{ color: '#666666' }}>Total enlaces</p>
                <p className="text-2xl font-bold" style={{ color: '#FFCC33' }}>
                  {categorias.reduce((acc, cat) => acc + (cat.enlaces?.length || 0), 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-all duration-200 sm:col-span-1 col-span-2"
            style={{ borderColor: '#E5E5E5' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E8F5E9' }}>
                <FileText className="w-5 h-5" style={{ color: '#009933' }} />
              </div>
              <div>
                <p className="text-xs" style={{ color: '#666666' }}>Documentos</p>
                <p className="text-2xl font-bold" style={{ color: '#009933' }}>
                  {categorias.reduce((acc, cat) => acc + (cat.enlaces?.length || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de categorías */}
      {categorias.length === 0 ? (
        <div className="bg-white rounded-2xl border p-12 text-center shadow-sm" style={{ borderColor: '#E5E5E5' }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#F5F5F5' }}>
            <FolderOpen className="w-10 h-10" style={{ color: '#CCCCCC' }} />
          </div>
          <h3 className="text-lg font-medium mb-2" style={{ color: '#333333', fontFamily: "'Montserrat', sans-serif" }}>
            No hay documentos
          </h3>
          <p className="text-sm" style={{ color: '#666666' }}>
            {isAdmin ? 'Crea una categoría para comenzar' : 'Aún no hay documentos disponibles'}
          </p>
          {isAdmin && (
            <button
              onClick={() => { setEditingCat(null); setCatNombre(''); setShowCatModal(true); }}
              className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white mx-auto"
              style={{ backgroundColor: '#009933' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00802b'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#009933'}
            >
              <Plus className="w-4 h-4" />
              Crear primera categoría
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {categorias.map((cat) => (
            <div key={cat.id} className="bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
              style={{ borderColor: '#E5E5E5' }}>

              {/* Header categoría */}
              <div className="flex items-center justify-between px-6 py-4 cursor-pointer transition-colors"
                style={{ backgroundColor: '#F9F9F9', borderBottom: expandidas[cat.id] ? '1px solid #E5E5E5' : 'none' }}
                onClick={() => toggleExpand(cat.id)}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E8F5E9' }}>
                    <FolderOpen className="w-5 h-5" style={{ color: '#009933' }} />
                  </div>
                  <div>
                    <h2 className="font-semibold text-base" style={{ color: '#009933' }}>{cat.nombre}</h2>
                    <p className="text-xs" style={{ color: '#666666' }}>
                      {cat.enlaces?.length || 0} enlace{cat.enlaces?.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditingCat(cat); setCatNombre(cat.nombre); setShowCatModal(true); }}
                        className="p-2 rounded-lg transition-all"
                        style={{ color: '#666666' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E8F5E9'; e.currentTarget.style.color = '#009933'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#666666'; }}>
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteCategoria(cat); }}
                        className="p-2 rounded-lg transition-all"
                        style={{ color: '#666666' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FEF2F2'; e.currentTarget.style.color = '#DC2626'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#666666'; }}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  {expandidas[cat.id]
                    ? <ChevronUp className="w-5 h-5" style={{ color: '#666666' }} />
                    : <ChevronDown className="w-5 h-5" style={{ color: '#666666' }} />
                  }
                </div>
              </div>

              {/* Lista de enlaces */}
              {expandidas[cat.id] && (
                <div className="p-4 space-y-2">
                  {cat.enlaces?.map((enlace) => (
                    <div key={enlace.id}
                      className="flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 group hover:shadow-sm"
                      style={{ borderColor: '#E5E5E5', backgroundColor: '#FAFAFA' }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = '#009933'}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = '#E5E5E5'}>
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: '#E8F5E9' }}>
                          <Globe className="w-4 h-4" style={{ color: '#009933' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <a href={enlace.url} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 font-medium text-sm transition-all hover:underline"
                            style={{ color: '#009933' }}
                            onClick={(e) => e.stopPropagation()}>
                            {enlace.titulo}
                            <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 opacity-70 group-hover:opacity-100" />
                          </a>
                          {enlace.descripcion && (
                            <p className="text-xs truncate mt-0.5" style={{ color: '#666666' }}>{enlace.descripcion}</p>
                          )}
                        </div>
                      </div>
                      {isAdmin && (
                        <div className="flex gap-1 ml-3 opacity-0 group-hover:opacity-100 transition-all">
                          <button
                            onClick={() => { setEditingEnlace(enlace); setEnlaceForm({ titulo: enlace.titulo, url: enlace.url, descripcion: enlace.descripcion || '' }); setCategoriaSeleccionada(cat); setShowEnlaceModal(true); }}
                            className="p-1.5 rounded-lg transition-colors"
                            style={{ color: '#666666' }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E8F5E9'; e.currentTarget.style.color = '#009933'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#666666'; }}>
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteEnlace(enlace)}
                            className="p-1.5 rounded-lg transition-colors"
                            style={{ color: '#666666' }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FEF2F2'; e.currentTarget.style.color = '#DC2626'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#666666'; }}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Botón agregar enlace */}
                  {isAdmin && (
                    <button
                      onClick={() => { setCategoriaSeleccionada(cat); setEditingEnlace(null); setEnlaceForm({ titulo: '', url: '', descripcion: '' }); setShowEnlaceModal(true); }}
                      className="w-full py-3 border-2 border-dashed rounded-xl text-sm flex items-center justify-center gap-2 transition-all"
                      style={{ borderColor: '#00993340', color: '#009933' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E8F5E9'; e.currentTarget.style.borderColor = '#009933'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = '#00993340'; }}>
                      <Plus className="w-4 h-4" />
                      Agregar enlace
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal Categoría */}
      {showCatModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b" style={{ borderColor: '#E5E5E5', backgroundColor: '#F9F9F9' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-5 h-5" style={{ color: '#009933' }} />
                  <h3 className="text-lg font-semibold" style={{ color: '#009933' }}>
                    {editingCat ? 'Editar Categoría' : 'Nueva Categoría'}
                  </h3>
                </div>
                <button onClick={() => setShowCatModal(false)} className="p-1 rounded-lg transition-colors" style={{ color: '#666666' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F5F5F5'; e.currentTarget.style.color = '#009933'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#666666'; }}>
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#666666' }}>Nombre *</label>
                <input
                  value={catNombre}
                  onChange={(e) => setCatNombre(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveCategoria()}
                  className="w-full px-4 py-2.5 border rounded-xl focus:outline-none transition-all"
                  style={{ borderColor: '#E5E5E5', color: '#333333' }}
                  placeholder="Ej: Documentación de Sistema"
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#009933'; e.currentTarget.style.boxShadow = '0 0 0 2px #00993320'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.boxShadow = 'none'; }}
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowCatModal(false)} className="px-4 py-2 rounded-lg text-sm transition-colors" style={{ color: '#666666' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F5F5'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  Cancelar
                </button>
                <button onClick={handleSaveCategoria} disabled={saving || !catNombre.trim()}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white transition-all disabled:opacity-50"
                  style={{ backgroundColor: '#009933' }}
                  onMouseEnter={(e) => { if (!saving && catNombre.trim()) e.currentTarget.style.backgroundColor = '#00802b'; }}
                  onMouseLeave={(e) => { if (!saving) e.currentTarget.style.backgroundColor = '#009933'; }}>
                  <Save className="w-4 h-4" />
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Enlace */}
      {showEnlaceModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b" style={{ borderColor: '#E5E5E5', backgroundColor: '#F9F9F9' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Link className="w-5 h-5" style={{ color: '#009933' }} />
                  <h3 className="text-lg font-semibold" style={{ color: '#009933' }}>
                    {editingEnlace ? 'Editar Enlace' : 'Nuevo Enlace'}
                  </h3>
                </div>
                <button onClick={() => setShowEnlaceModal(false)} className="p-1 rounded-lg transition-colors" style={{ color: '#666666' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F5F5F5'; e.currentTarget.style.color = '#009933'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#666666'; }}>
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {!editingEnlace && categoriaSeleccionada && (
                <div className="px-3 py-2 rounded-lg text-sm flex items-center gap-2" style={{ backgroundColor: '#E8F5E9', color: '#009933' }}>
                  <FolderOpen className="w-4 h-4" />
                  <span>Categoría: <strong>{categoriaSeleccionada.nombre}</strong></span>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#666666' }}>Título *</label>
                <input
                  value={enlaceForm.titulo}
                  onChange={(e) => setEnlaceForm({ ...enlaceForm, titulo: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-xl focus:outline-none transition-all"
                  style={{ borderColor: '#E5E5E5', color: '#333333' }}
                  placeholder="Ej: Manual de Calidad"
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#009933'; e.currentTarget.style.boxShadow = '0 0 0 2px #00993320'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#666666' }}>URL *</label>
                <input
                  value={enlaceForm.url}
                  onChange={(e) => setEnlaceForm({ ...enlaceForm, url: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-xl focus:outline-none transition-all"
                  style={{ borderColor: '#E5E5E5', color: '#333333' }}
                  placeholder="https://drive.google.com/..."
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#009933'; e.currentTarget.style.boxShadow = '0 0 0 2px #00993320'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#666666' }}>Descripción (opcional)</label>
                <input
                  value={enlaceForm.descripcion}
                  onChange={(e) => setEnlaceForm({ ...enlaceForm, descripcion: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-xl focus:outline-none transition-all"
                  style={{ borderColor: '#E5E5E5', color: '#333333' }}
                  placeholder="Breve descripción del documento"
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#009933'; e.currentTarget.style.boxShadow = '0 0 0 2px #00993320'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowEnlaceModal(false)} className="px-4 py-2 rounded-lg text-sm transition-colors" style={{ color: '#666666' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F5F5'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  Cancelar
                </button>
                <button onClick={handleSaveEnlace} disabled={saving || !enlaceForm.titulo.trim() || !enlaceForm.url.trim()}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white transition-all disabled:opacity-50"
                  style={{ backgroundColor: '#009933' }}
                  onMouseEnter={(e) => { if (!saving && enlaceForm.titulo.trim() && enlaceForm.url.trim()) e.currentTarget.style.backgroundColor = '#00802b'; }}
                  onMouseLeave={(e) => { if (!saving) e.currentTarget.style.backgroundColor = '#009933'; }}>
                  <Save className="w-4 h-4" />
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}