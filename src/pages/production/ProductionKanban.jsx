// pages/production/ProductionKanban.jsx
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
      // Error cargando kanban
    } finally {
      setLoading(false);
    }
  };

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
          <div className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: '#009933', borderTopColor: '#FFCC33' }}></div>
          <p className="text-sm" style={{ color: '#666666', fontFamily: "'Montserrat', sans-serif" }}>Cargando producción...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con título y controles */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E8F5E9' }}>
            <svg className="w-5 h-5" style={{ color: '#009933' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#009933', fontFamily: "'Trajan Pro Bold', serif" }}>
              Producción
            </h1>
            <p className="text-sm mt-0.5" style={{ color: '#666666', fontFamily: "'Montserrat', sans-serif" }}>
              Gestiona el flujo de trabajo de las muestras
            </p>
          </div>
        </div>

        {/* Controles de filtro para Terminados */}
        <div className="flex items-center gap-3 bg-white border rounded-xl px-4 py-2 shadow-sm" style={{ borderColor: '#E5E5E5' }}>
          <span className="text-sm" style={{ color: '#666666' }}>Terminados:</span>
          
          {!showTodosTerminados && (
            <select
              value={diasFiltro}
              onChange={e => setDiasFiltro(Number(e.target.value))}
              className="text-sm border-0 bg-transparent focus:outline-none font-medium"
              style={{ color: '#009933' }}
            >
              <option value={1}>Hoy</option>
              <option value={7}>Últimos 7 días</option>
              <option value={30}>Últimos 30 días</option>
            </select>
          )}

          <button
            onClick={() => setShowTodosTerminados(!showTodosTerminados)}
            className="text-sm px-3 py-1 rounded-lg transition-all duration-200"
            style={{
              backgroundColor: showTodosTerminados ? '#009933' : '#F5F5F5',
              color: showTodosTerminados ? '#FFFFFF' : '#666666'
            }}
            onMouseEnter={(e) => {
              if (!showTodosTerminados) {
                e.currentTarget.style.backgroundColor = '#E8F5E9';
                e.currentTarget.style.color = '#009933';
              }
            }}
            onMouseLeave={(e) => {
              if (!showTodosTerminados) {
                e.currentTarget.style.backgroundColor = '#F5F5F5';
                e.currentTarget.style.color = '#666666';
              }
            }}
          >
            {showTodosTerminados ? 'Ver recientes' : 'Ver todos'}
          </button>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
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