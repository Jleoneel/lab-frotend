// pages/production/ProductionKanban.jsx (versión simplificada sin drag & drop)
import { useState, useEffect } from 'react';
import { sampleService } from '../../services/sampleService';
import KanbanColumn from '../../components/samples/KanbanColumn';
import SampleCard from '../../components/samples/SampleCard';

const columns = [
  { id: 'EN_COLA', title: 'En Cola', color: 'bg-gray-100' },
  { id: 'EN_PROCESO', title: 'En Proceso', color: 'bg-blue-100' },
  { id: 'LISTO_PARA_INFORME', title: 'Listo para Informe', color: 'bg-yellow-100' },
  { id: 'TERMINADO', title: 'Terminado', color: 'bg-green-100' }
];

export default function ProductionKanban() {
  const [samples, setSamples] = useState({
    EN_COLA: [],
    EN_PROCESO: [],
    LISTO_PARA_INFORME: [],
    TERMINADO: []
  });
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div className="flex justify-center p-8">Cargando...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Producción</h1>
      
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map(column => (
          <KanbanColumn
            key={column.id}
            title={column.title}
            color={column.color}
          >
            {samples[column.id]?.map(sample => (
              <SampleCard key={sample.id} sample={sample} />
            ))}
          </KanbanColumn>
        ))}
      </div>
    </div>
  );
}