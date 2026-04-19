import { useState, useEffect } from 'react';
import { Settings, Percent, Save, CheckCircle } from 'lucide-react';
import { settingsService } from '../../services/settingsService';
import Swal from 'sweetalert2';

export default function SettingsPage() {
  const [iva, setIva] = useState('');
  const [currentIva, setCurrentIva] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await settingsService.getIva();
      setIva(String(data.iva));
      setCurrentIva(data.iva);
    } catch (error) {
      console.error('Error cargando configuración:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const ivaNum = parseFloat(iva);
    if (isNaN(ivaNum) || ivaNum < 0 || ivaNum > 100) {
      await Swal.fire({
        icon: 'error',
        title: 'Valor inválido',
        text: 'El IVA debe ser un número entre 0 y 100',
        confirmButtonColor: '#009933'
      });
      return;
    }

    setSaving(true);
    try {
      await settingsService.updateIva(ivaNum);
      setCurrentIva(ivaNum);
      await Swal.fire({
        icon: 'success',
        title: '¡Configuración guardada!',
        text: `El IVA se actualizó a ${ivaNum}%`,
        confirmButtonColor: '#009933',
        timer: 2000,
        timerProgressBar: true
      });
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error al guardar',
        text: 'No se pudo actualizar el IVA',
        confirmButtonColor: '#dc3545'
      });
    } finally {
      setSaving(false);
    }
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
          <h1 className="text-2xl font-bold" style={{ color: '#009933' }}>
            Ajustes del Sistema
          </h1>
          <p className="text-sm" style={{ color: '#666666' }}>
            Configura los parámetros generales del sistema
          </p>
        </div>
      </div>

      {/* Tarjeta IVA */}
      <div className="bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: '#E5E5E5' }}>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E8F5E9' }}>
            <Percent className="w-4 h-4" style={{ color: '#009933' }} />
          </div>
          <div>
            <h2 className="text-base font-semibold" style={{ color: '#333333' }}>
              Impuesto al Valor Agregado (IVA)
            </h2>
            <p className="text-xs" style={{ color: '#666666' }}>
              Se aplicará automáticamente a todas las nuevas cotizaciones
            </p>
          </div>
        </div>

        {/* Valor actual */}
        {currentIva !== null && (
          <div className="flex items-center gap-2 mb-4 px-4 py-3 rounded-xl" style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
            <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#009933' }} />
            <p className="text-sm" style={{ color: '#009933' }}>
              IVA actual: <span className="font-bold">{currentIva}%</span>
            </p>
          </div>
        )}

        {/* Input */}
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1" style={{ color: '#666666' }}>
              Nuevo valor de IVA (%)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                value={iva}
                onChange={(e) => setIva(e.target.value)}
                className="w-full px-4 py-2.5 border rounded-xl focus:outline-none transition-shadow"
                style={{ borderColor: '#E5E5E5', color: '#333333' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#009933'; e.currentTarget.style.boxShadow = '0 0 0 2px #00993320'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.boxShadow = 'none'; }}
                placeholder="Ej: 15"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: '#666666' }}>%</span>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving || iva === String(currentIva)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#009933', color: '#FFFFFF' }}
            onMouseEnter={(e) => { if (!saving) e.currentTarget.style.backgroundColor = '#00802b'; }}
            onMouseLeave={(e) => { if (!saving) e.currentTarget.style.backgroundColor = '#009933'; }}
          >
            <Save className="w-4 h-4" />
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>

        <p className="text-xs mt-3" style={{ color: '#999999' }}>
          * Las cotizaciones ya creadas no se verán afectadas por este cambio.
        </p>
      </div>
    </div>
  );
}