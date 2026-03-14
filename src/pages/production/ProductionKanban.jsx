import { useState, useEffect } from 'react';
import { sampleService } from '../../services/sampleService';
import KanbanColumn from '../../components/samples/KanbanColumn';
import SampleCard from '../../components/samples/SampleCard';

const columns = [
  { id: 'EN_COLA', title: 'En Cola', color: 'default' },
  { id: 'EN_PROCESO', title: 'En Proceso', color: 'primary' },
  { id: 'LISTO_PARA_INFORME', title: 'Listo para Informe', color: 'warning' },
  { id: 'TERMINADO', title: 'Terminado', color: 'success' }
];

export default function ProductionKanban() {
  const [samples, setSamples] = useState({
    EN_COLA: [],
    EN_PROCESO: [],
    LISTO_PARA_INFORME: [],
    TERMINADO: []
  });
  const [loading, setLoading] = useState(true);
  const [showTodosTerminados, setShowTodosTerminados] = useState(false);
  const [diasFiltro, setDiasFiltro] = useState(7);

  useEffect(() => {
    loadKanban();
  }, []);

  const loadKanban = async () => {
    try {
      const response = await sampleService.getKanban();
      setSamples(response.data);
    } catch (error) {
      console.error('Error cargando kanban:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar terminados por días
  const terminadosFiltrados = showTodosTerminados
    ? samples.TERMINADO
    : samples.TERMINADO?.filter(s => {
        const dias = (Date.now() - new Date(s.receivedAt)) / (1000 * 60 * 60 * 24);
        return dias <= diasFiltro;
      });

  const kanbanFiltrado = { ...samples, TERMINADO: terminadosFiltrados };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando producción...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Producción</h1>

        {/* Controles de filtro para Terminados */}
        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
          <span className="text-sm text-gray-500">Terminados:</span>
          
          {!showTodosTerminados && (
            <select
              value={diasFiltro}
              onChange={e => setDiasFiltro(Number(e.target.value))}
              className="text-sm border-0 bg-transparent focus:outline-none text-gray-700 font-medium"
            >
              <option value={1}>Hoy</option>
              <option value={7}>Últimos 7 días</option>
              <option value={30}>Últimos 30 días</option>
            </select>
          )}

          <button
            onClick={() => setShowTodosTerminados(!showTodosTerminados)}
            className={`text-sm px-3 py-1 rounded-lg transition-colors ${
              showTodosTerminados
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {showTodosTerminados ? 'Ver recientes' : 'Ver todos'}
          </button>
        </div>
      </div>

      {/* Kanban */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map(column => (
          <KanbanColumn
            key={column.id}
            title={column.title}
            color={column.color}
            count={kanbanFiltrado[column.id]?.length || 0}
          >
            {kanbanFiltrado[column.id]?.map(sample => (
              <SampleCard key={sample.id} sample={sample} />
            ))}
          </KanbanColumn>
        ))}
      </div>
    </div>
  );
}