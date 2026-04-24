import { useState, useEffect } from 'react';
import { Settings, Percent, Save, CheckCircle, Plus, Pencil, Trash2, X } from 'lucide-react';
import { settingsService } from '../../services/settingsService';
import Swal from 'sweetalert2';

export default function SettingsPage() {
  const [iva, setIva] = useState('');
  const [currentIva, setCurrentIva] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Razones
  const [razones, setRazones] = useState([]);
  const [nuevaRazon, setNuevaRazon] = useState('');
  const [editingRazon, setEditingRazon] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [savingRazon, setSavingRazon] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [ivaData, razonesData] = await Promise.all([
        settingsService.getIva(),
        settingsService.getRazones()
      ]);
      setIva(String(ivaData.iva));
      setCurrentIva(ivaData.iva);
      setRazones(Array.isArray(razonesData) ? razonesData : []);
    } catch (error) {
      console.error('Error cargando configuración:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveIva = async () => {
    const ivaNum = parseFloat(iva);
    if (isNaN(ivaNum) || ivaNum < 0 || ivaNum > 100) {
      await Swal.fire({ icon: 'error', title: 'Valor inválido', text: 'El IVA debe ser entre 0 y 100', confirmButtonColor: '#009933' });
      return;
    }
    setSaving(true);
    try {
      await settingsService.updateIva(ivaNum);
      setCurrentIva(ivaNum);
      await Swal.fire({ icon: 'success', title: '¡IVA actualizado!', text: `Nuevo IVA: ${ivaNum}%`, confirmButtonColor: '#009933', timer: 2000, timerProgressBar: true });
    } catch (error) {
      await Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar el IVA', confirmButtonColor: '#dc3545' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddRazon = async () => {
    if (!nuevaRazon.trim()) return;
    setSavingRazon(true);
    try {
      const created = await settingsService.createRazon(nuevaRazon.trim());
      setRazones([...razones, created]);
      setNuevaRazon('');
    } catch (error) {
      await Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'Error al crear razón', confirmButtonColor: '#dc3545' });
    } finally {
      setSavingRazon(false);
    }
  };

  const handleUpdateRazon = async (id) => {
    if (!editNombre.trim()) return;
    try {
      const updated = await settingsService.updateRazon(id, { nombre: editNombre.trim() });
      setRazones(razones.map(r => r.id === id ? updated : r));
      setEditingRazon(null);
      setEditNombre('');
    } catch (error) {
      await Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar', confirmButtonColor: '#dc3545' });
    }
  };

  const handleDeleteRazon = async (razon) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar razón?',
      text: `Se eliminará "${razon.nombre}"`,
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#666666',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;
    try {
      await settingsService.deleteRazon(razon.id);
      setRazones(razones.filter(r => r.id !== razon.id));
    } catch (error) {
      await Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar', confirmButtonColor: '#dc3545' });
    }
  };

  const inputStyle = {
    padding: '8px 12px', border: '1px solid #E5E5E5',
    borderRadius: '12px', fontSize: '14px', color: '#333333', outline: 'none'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: '#009933', borderTopColor: '#FFCC33' }}></div>
          <p className="text-sm" style={{ color: '#666666' }}>Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E8F5E9' }}>
          <Settings className="w-6 h-6" style={{ color: '#009933' }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#009933' }}>Ajustes del Sistema</h1>
          <p className="text-sm" style={{ color: '#666666' }}>Configura los parámetros generales del sistema</p>
        </div>
      </div>

      {/* Tarjeta IVA */}
      <div className="bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: '#E5E5E5' }}>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E8F5E9' }}>
            <Percent className="w-4 h-4" style={{ color: '#009933' }} />
          </div>
          <div>
            <h2 className="text-base font-semibold" style={{ color: '#333333' }}>IVA</h2>
            <p className="text-xs" style={{ color: '#666666' }}>Se aplicará a todas las nuevas cotizaciones</p>
          </div>
        </div>

        {currentIva !== null && (
          <div className="flex items-center gap-2 mb-4 px-4 py-3 rounded-xl"
            style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
            <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#009933' }} />
            <p className="text-sm" style={{ color: '#009933' }}>
              IVA actual: <span className="font-bold">{currentIva}%</span>
            </p>
          </div>
        )}

        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1" style={{ color: '#666666' }}>Nuevo valor (%)</label>
            <div className="relative">
              <input type="number" min="0" max="100" step="1" value={iva}
                onChange={(e) => setIva(e.target.value)}
                style={{ ...inputStyle, width: '100%', paddingRight: '2.5rem' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#009933'; e.currentTarget.style.boxShadow = '0 0 0 2px #00993320'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.boxShadow = 'none'; }}
                placeholder="Ej: 15" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#666666' }}>%</span>
            </div>
          </div>
          <button onClick={handleSaveIva} disabled={saving || iva === String(currentIva)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-white disabled:opacity-50"
            style={{ backgroundColor: '#009933' }}
            onMouseEnter={(e) => { if (!saving) e.currentTarget.style.backgroundColor = '#00802b'; }}
            onMouseLeave={(e) => { if (!saving) e.currentTarget.style.backgroundColor = '#009933'; }}>
            <Save className="w-4 h-4" />
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
        <p className="text-xs mt-3" style={{ color: '#999999' }}>
          * Las cotizaciones ya creadas no se verán afectadas.
        </p>
      </div>

      {/* Tarjeta Razones de Consumo */}
      <div className="bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: '#E5E5E5' }}>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E8F5E9' }}>
            <Settings className="w-4 h-4" style={{ color: '#009933' }} />
          </div>
          <div>
            <h2 className="text-base font-semibold" style={{ color: '#333333' }}>Razones de Consumo</h2>
            <p className="text-xs" style={{ color: '#666666' }}>Gestiona las razones disponibles para registrar consumos</p>
          </div>
        </div>

        {/* Agregar nueva razón */}
        <div className="flex gap-3 mb-4">
          <input
            value={nuevaRazon}
            onChange={(e) => setNuevaRazon(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddRazon()}
            style={{ ...inputStyle, flex: 1 }}
            placeholder="Nueva razón... (ej: Práctica estudiantil)"
            onFocus={(e) => { e.currentTarget.style.borderColor = '#009933'; e.currentTarget.style.boxShadow = '0 0 0 2px #00993320'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.boxShadow = 'none'; }}
          />
          <button onClick={handleAddRazon} disabled={savingRazon || !nuevaRazon.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-50"
            style={{ backgroundColor: '#009933' }}
            onMouseEnter={(e) => { if (!savingRazon) e.currentTarget.style.backgroundColor = '#00802b'; }}
            onMouseLeave={(e) => { if (!savingRazon) e.currentTarget.style.backgroundColor = '#009933'; }}>
            <Plus className="w-4 h-4" />
            Agregar
          </button>
        </div>

        {/* Lista de razones */}
        {razones.length === 0 ? (
          <div className="text-center py-8 rounded-xl" style={{ backgroundColor: '#F9F9F9' }}>
            <p className="text-sm" style={{ color: '#999999' }}>No hay razones registradas</p>
          </div>
        ) : (
          <div className="space-y-2">
            {razones.map((razon) => (
              <div key={razon.id} className="flex items-center justify-between px-4 py-3 rounded-xl border"
                style={{ backgroundColor: '#F9F9F9', borderColor: '#E5E5E5' }}>
                {editingRazon === razon.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      value={editNombre}
                      onChange={(e) => setEditNombre(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleUpdateRazon(razon.id)}
                      style={{ ...inputStyle, flex: 1 }}
                      autoFocus
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#009933'; e.currentTarget.style.boxShadow = '0 0 0 2px #00993320'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                    <button onClick={() => handleUpdateRazon(razon.id)}
                      className="p-2 rounded-lg" style={{ color: '#009933' }}>
                      <Save className="w-4 h-4" />
                    </button>
                    <button onClick={() => { setEditingRazon(null); setEditNombre(''); }}
                      className="p-2 rounded-lg" style={{ color: '#666666' }}>
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-sm font-medium" style={{ color: '#333333' }}>{razon.nombre}</span>
                    <div className="flex gap-1">
                      <button onClick={() => { setEditingRazon(razon.id); setEditNombre(razon.nombre); }}
                        className="p-2 rounded-lg transition-colors" style={{ color: '#666666' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E8F5E9'; e.currentTarget.style.color = '#009933'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#666666'; }}>
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button onClick={() => handleDeleteRazon(razon)}
                        className="p-2 rounded-lg transition-colors" style={{ color: '#666666' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FEF2F2'; e.currentTarget.style.color = '#DC2626'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#666666'; }}>
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}