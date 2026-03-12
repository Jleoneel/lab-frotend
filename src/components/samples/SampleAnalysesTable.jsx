// components/samples/SampleAnalysesTable.jsx
import { useState } from 'react';
import { Play, CheckCircle, FileText, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  RUNNING: 'bg-blue-100 text-blue-800',
  DONE: 'bg-green-100 text-green-800'
};

const statusLabels = {
  PENDING: 'Pendiente',
  RUNNING: 'En Proceso',
  DONE: 'Completado'
};

export default function SampleAnalysesTable({ 
  analyses, 
  onStatusChange, 
  onRegisterResult,
  readOnly = false 
}) {
  const [expandedRow, setExpandedRow] = useState(null);

  if (!analyses || analyses.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
        <p>No hay análisis asignados a esta muestra</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Análisis
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Asignado a
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Resultado
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {analyses.map((analysis) => (
            <>
              <tr key={analysis.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {/* ✅ FIX: usar analysis.service.name en lugar de analysis.serviceName */}
                  <div className="text-sm font-medium text-gray-900">
                    {analysis.service?.name}
                  </div>
                  {analysis.service?.code && (
                    <div className="text-xs text-gray-500">
                      {analysis.service?.code}
                    </div>
                  )}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge className={statusColors[analysis.status]}>
                    {statusLabels[analysis.status]}
                  </Badge>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {analysis.assignedTo || 'No asignado'}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  {analysis.result ? (
                    <button
                      onClick={() => setExpandedRow(expandedRow === analysis.id ? null : analysis.id)}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      Ver resultado
                    </button>
                  ) : (
                    <span className="text-sm text-gray-400">Sin resultado</span>
                  )}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {!readOnly && (
                    <div className="flex justify-end gap-2">
                      {analysis.status === 'PENDING' && (
                        <Button
                          size="sm"
                          onClick={() => onStatusChange(analysis.id, 'RUNNING')}
                          title="Iniciar análisis"
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                      )}
                      
                      {analysis.status === 'RUNNING' && (
                        <>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => onStatusChange(analysis.id, 'PENDING')}
                            title="Pausar"
                          >
                            <AlertCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => onRegisterResult(analysis)}
                            title="Registrar resultado"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      
                      {analysis.status === 'DONE' && analysis.result && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setExpandedRow(expandedRow === analysis.id ? null : analysis.id)}
                          title="Ver resultado"
                        >
                          <FileText className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
              
              {/* Fila expandida para mostrar resultado */}
              {expandedRow === analysis.id && analysis.result && (
                <tr className="bg-gray-50">
                  <td colSpan="5" className="px-6 py-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Resultado del análisis
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {analysis.result.resultText && (
                          <div>
                            <p className="text-gray-500">Resultado:</p>
                            <p className="font-medium">{analysis.result.resultText}</p>
                          </div>
                        )}
                        {analysis.result.resultNumber && (
                          <div>
                            <p className="text-gray-500">Valor:</p>
                            <p className="font-medium">
                              {analysis.result.resultNumber} {analysis.result.unit || ''}
                            </p>
                          </div>
                        )}
                        <div>
                          <p className="text-gray-500">Registrado por:</p>
                          <p className="font-medium">{analysis.result.recordedBy}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Fecha:</p>
                          <p className="font-medium">
                            {new Date(analysis.result.recordedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {analysis.result.isFinal && (
                        <Badge className="bg-green-100 text-green-800 mt-2">
                          Resultado Final
                        </Badge>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}