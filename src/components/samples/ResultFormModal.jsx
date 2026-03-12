// components/samples/ResultFormModal.jsx
import { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';

export default function ResultFormModal({ isOpen, onClose, analysis, onSave }) {
  const [formData, setFormData] = useState({
    resultText: '',
    resultNumber: '',
    unit: '',
    isFinal: true
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.resultText && !formData.resultNumber) {
      newErrors.result = 'Debes ingresar al menos un resultado (texto o numérico)';
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
      await onSave(analysis.id, formData);
      onClose();
    } catch (error) {
      console.error('Error guardando resultado:', error);
      setErrors({
        submit: 'Error al guardar el resultado'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar Resultado">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Información del análisis */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600">Análisis:</p>
          <p className="font-medium">{analysis?.serviceName}</p>
        </div>

        {errors.submit && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {errors.submit}
          </div>
        )}

        {/* Resultado texto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Resultado (texto)
          </label>
          <textarea
            name="resultText"
            value={formData.resultText}
            onChange={handleChange}
            rows="2"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: Positivo, Negativo, Detectado, etc."
          />
        </div>

        {/* Resultado numérico */}
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

        {errors.result && (
          <p className="text-sm text-red-600">{errors.result}</p>
        )}

        {/* Checkbox resultado final */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isFinal"
            id="isFinal"
            checked={formData.isFinal}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isFinal" className="ml-2 text-sm text-gray-700">
            Marcar como resultado final
          </label>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar Resultado'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}