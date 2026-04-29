import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlaskConical, Calendar, CheckCircle, Clock, Play } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/axios';
import Badge from '../../components/ui/Badge';

const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    RUNNING: 'bg-blue-100 text-blue-700',
    DONE: 'bg-green-100 text-green-700'
};

const statusLabels = {
    PENDING: 'Pendiente',
    RUNNING: 'En Proceso',
    DONE: 'Completado'
};

const statusIcons = {
    PENDING: Clock,
    RUNNING: Play,
    DONE: CheckCircle
};

export default function MisAnalisis() {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [analyses, setAnalyses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtroEstado, setFiltroEstado] = useState('');

    useEffect(() => {
        loadMisAnalisis();
    }, []);

    const loadMisAnalisis = async () => {
        try {
            const response = await api.get('/samples/my-analyses');
            const data = response.data || [];
            setAnalyses(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error cargando análisis:', error);
        } finally {
            setLoading(false);
        }
    };

    const filtered = analyses.filter(a =>
        filtroEstado ? a.status === filtroEstado : true
    );

    const pendientes = analyses.filter(a => a.status === 'PENDING').length;
    const enProceso = analyses.filter(a => a.status === 'RUNNING').length;
    const completados = analyses.filter(a => a.status === 'DONE').length;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 rounded-full animate-spin mx-auto mb-4"
                        style={{ borderColor: '#009933', borderTopColor: '#FFCC33' }}></div>
                    <p className="text-sm" style={{ color: '#666666' }}>Cargando tus análisis...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E8F5E9' }}>
                    <FlaskConical className="w-6 h-6" style={{ color: '#009933' }} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: '#009933' }}>
                        Mis Análisis
                    </h1>
                    <p className="text-sm" style={{ color: '#666666' }}>
                        Bienvenido, {user?.fullName} — análisis asignados a ti
                    </p>
                </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Pendientes', value: pendientes, color: '#FFCC33', bg: '#FFF9E8' },
                    { label: 'En proceso', value: enProceso, color: '#3B82F6', bg: '#EFF6FF' },
                    { label: 'Completados', value: completados, color: '#009933', bg: '#E8F5E9' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-xl border p-4 shadow-sm" style={{ borderColor: '#E5E5E5' }}>
                        <p className="text-sm" style={{ color: '#666666' }}>{stat.label}</p>
                        <p className="text-2xl font-bold mt-1" style={{ color: stat.color }}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Filtro */}
            <div className="bg-white rounded-xl border p-4 shadow-sm" style={{ borderColor: '#E5E5E5' }}>
                <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}
                    className="px-4 py-2 border rounded-xl text-sm focus:outline-none"
                    style={{ borderColor: '#E5E5E5', color: '#333333' }}>
                    <option value="">Todos los estados</option>
                    <option value="PENDING">Pendientes</option>
                    <option value="RUNNING">En proceso</option>
                    <option value="DONE">Completados</option>
                </select>
            </div>

            {/* Lista */}
            {filtered.length === 0 ? (
                <div className="bg-white rounded-2xl border p-12 text-center shadow-sm" style={{ borderColor: '#E5E5E5' }}>
                    <FlaskConical className="w-12 h-12 mx-auto mb-4" style={{ color: '#CCCCCC' }} />
                    <p className="text-lg font-medium" style={{ color: '#333333' }}>
                        {filtroEstado ? 'No hay análisis con ese estado' : 'No tienes análisis asignados'}
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: '#E5E5E5' }}>
                    <table className="w-full text-sm">
                        <thead className="border-b" style={{ backgroundColor: '#F9F9F9', borderColor: '#E5E5E5' }}>
                            <tr>
                                <th className="px-6 py-4 text-left font-medium" style={{ color: '#666666' }}>Análisis</th>
                                <th className="px-6 py-4 text-left font-medium" style={{ color: '#666666' }}>Muestra</th>
                                <th className="px-6 py-4 text-left font-medium" style={{ color: '#666666' }}>Cliente</th>
                                <th className="px-6 py-4 text-center font-medium" style={{ color: '#666666' }}>Estado</th>
                                <th className="px-6 py-4 text-center font-medium" style={{ color: '#666666' }}>Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y" style={{ borderColor: '#E5E5E5' }}>
                            {filtered.map((analysis) => {
                                const StatusIcon = statusIcons[analysis.status] || Clock;
                                return (
                                    <tr key={analysis.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium" style={{ color: '#009933' }}>
                                                {analysis.service?.name}
                                            </div>
                                            <div className="text-xs font-mono" style={{ color: '#666666' }}>
                                                {analysis.service?.code}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium" style={{ color: '#333333' }}>
                                                {analysis.sample?.sampleCode}
                                            </div>
                                            <div className="text-xs" style={{ color: '#666666' }}>
                                                {analysis.sample?.sampleName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm" style={{ color: '#666666' }}>
                                            {analysis.sample?.request?.client?.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full font-medium ${statusColors[analysis.status]}`}>
                                                <StatusIcon className="w-3 h-3" />
                                                {statusLabels[analysis.status]}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => navigate(`/samples/${analysis.sample?.id}`)}
                                                className="text-xs px-3 py-1.5 rounded-lg font-medium text-white"
                                                style={{ backgroundColor: '#009933' }}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00802b'}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#009933'}
                                            >
                                                Ver muestra
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}