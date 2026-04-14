// components/samples/SampleAnalysesTable.jsx
import { useState } from 'react';
import { Play, CheckCircle, FileText, AlertCircle, Download } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  RUNNING: 'bg-blue-100 text-blue-700 border-blue-200',
  DONE: 'bg-green-100 text-green-700 border-green-200'
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
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#F9F9F9' }}>
          <AlertCircle className="w-8 h-8" style={{ color: '#CCCCCC' }} />
        </div>
        <p className="text-sm" style={{ color: '#666666', fontFamily: "'Montserrat', sans-serif" }}>
          No hay análisis asignados a esta muestra
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b" style={{ borderColor: '#E5E5E5' }}>
            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#666666' }}>
              Análisis
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#666666' }}>
              Estado
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#666666' }}>
              Asignado a
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#666666' }}>
              Resultado
            </th>
            <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider" style={{ color: '#666666' }}>
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y" style={{ borderColor: '#E5E5E5' }}>
          {analyses.map((analysis) => (
            <>
              <tr key={analysis.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium" style={{ color: '#009933' }}>
                    {analysis.service?.name}
                  </div>
                  {analysis.service?.code && (
                    <div className="text-xs" style={{ color: '#666666' }}>
                      {analysis.service?.code}
                    </div>
                  )}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge className={statusColors[analysis.status]}>
                    {statusLabels[analysis.status]}
                  </Badge>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#666666' }}>
                  {analysis.assignedTo || 'No asignado'}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  {analysis.result ? (
                    <button
                      onClick={() => setExpandedRow(expandedRow === analysis.id ? null : analysis.id)}
                      className="text-sm flex items-center gap-1 transition-colors"
                      style={{ color: '#009933' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#00802b'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#009933'}
                    >
                      <FileText className="w-4 h-4" />
                      Ver resultado
                    </button>
                  ) : (
                    <span className="text-sm" style={{ color: '#999999' }}>Sin resultado</span>
                  )}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {!readOnly && (
                    <div className="flex justify-end gap-2">
                      {analysis.status === 'PENDING' && (
                        <button
                          onClick={() => onStatusChange(analysis.id, 'RUNNING')}
                          className="p-2 rounded-lg transition-colors"
                          style={{ color: '#666666' }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E8F5E9'; e.currentTarget.style.color = '#009933'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#666666'; }}
                          title="Iniciar análisis"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                      )}
                      
                      {analysis.status === 'RUNNING' && (
                        <>
                          <button
                            onClick={() => onStatusChange(analysis.id, 'PENDING')}
                            className="p-2 rounded-lg transition-colors"
                            style={{ color: '#666666' }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FFF9E8'; e.currentTarget.style.color = '#FFCC33'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#666666'; }}
                            title="Pausar"
                          >
                            <AlertCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onRegisterResult(analysis)}
                            className="p-2 rounded-lg transition-colors"
                            style={{ color: '#666666' }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E8F5E9'; e.currentTarget.style.color = '#009933'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#666666'; }}
                            title="Registrar resultado"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      
                      {analysis.status === 'DONE' && analysis.result && (
                        <button
                          onClick={() => setExpandedRow(expandedRow === analysis.id ? null : analysis.id)}
                          className="p-2 rounded-lg transition-colors"
                          style={{ color: '#666666' }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F5F5F5'; e.currentTarget.style.color = '#009933'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#666666'; }}
                          title="Ver resultado"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
              
              {/* Fila expandida para mostrar resultado */}
              {expandedRow === analysis.id && analysis.result && (
                <tr className="hover:bg-gray-50/50">
                  <td colSpan="5" className="px-6 py-4">
                    <div className="rounded-xl p-4" style={{ backgroundColor: '#F9F9F9', border: '1px solid #E5E5E5' }}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E8F5E9' }}>
                          <FileText className="w-3 h-3" style={{ color: '#009933' }} />
                        </div>
                        <h4 className="text-sm font-semibold" style={{ color: '#009933' }}>
                          Resultado del análisis
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        {analysis.result.resultText && (
                          <div className="p-3 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5' }}>
                            <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: '#666666' }}>Resultado</p>
                            <p className="font-medium" style={{ color: '#333333' }}>{analysis.result.resultText}</p>
                          </div>
                        )}
                        {analysis.result.resultNumber && (
                          <div className="p-3 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5' }}>
                            <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: '#666666' }}>Valor</p>
                            <p className="font-medium" style={{ color: '#009933' }}>
                              {analysis.result.resultNumber} {analysis.result.unit || ''}
                            </p>
                          </div>
                        )}
                        <div className="p-3 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5' }}>
                          <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: '#666666' }}>Registrado por</p>
                          <p className="font-medium" style={{ color: '#333333' }}>{analysis.result.recordedBy}</p>
                        </div>
                        <div className="p-3 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5' }}>
                          <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: '#666666' }}>Fecha</p>
                          <p className="font-medium" style={{ color: '#333333' }}>
                            {new Date(analysis.result.recordedAt).toLocaleString()}
                          </p>
                        </div>
                        {analysis.result.observaciones && (
                          <div className="p-3 rounded-lg sm:col-span-2" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5' }}>
                            <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: '#666666' }}>Observaciones</p>
                            <p className="font-medium" style={{ color: '#333333' }}>{analysis.result.observaciones}</p>
                          </div>
                        )}
                        {/* Mostrar archivos de evidencia si existen */}
                        {analysis.result.archivos?.length > 0 && (
                          <div className="p-3 rounded-lg sm:col-span-2" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5' }}>
                            <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: '#666666' }}>
                              Archivos de evidencia ({analysis.result.archivos.length})
                            </p>
                            <div className="space-y-1">
                              {analysis.result.archivos.map((archivo) => (
                                <a
                                  key={archivo.id}
                                  href={`http://localhost:4000${archivo.path}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-sm font-medium transition-colors"
                                  style={{ color: '#009933' }}
                                  onMouseEnter={(e) => e.currentTarget.style.color = '#00802b'}
                                  onMouseLeave={(e) => e.currentTarget.style.color = '#009933'}
                                >
                                  <Download className="w-4 h-4 flex-shrink-0" />
                                  {archivo.filename}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      {analysis.result.isFinal && (
                        <div className="mt-3 flex justify-end">
                          <Badge variant="utm_green">Resultado Final</Badge>
                        </div>
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