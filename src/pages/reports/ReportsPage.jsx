// pages/reports/ReportsPage.jsx
import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  FlaskConical, 
  Package, 
  Download, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Clock,
  CheckCircle,
  FileText,
  DollarSign,
  PieChart
} from 'lucide-react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import * as XLSX from 'xlsx';
import { reportService } from '../../services/reportService';

const PERIODOS = [
  { label: 'Hoy', value: 'hoy' },
  { label: 'Esta semana', value: 'semana' },
  { label: 'Este mes', value: 'mes' },
  { label: 'Personalizado', value: 'custom' },
];

const getPeriodoFechas = (periodo) => {
  const hoy = new Date();
  const hasta = hoy.toISOString().split('T')[0];
  switch (periodo) {
    case 'hoy':
      return { desde: hasta, hasta };
    case 'semana': {
      const lunes = new Date(hoy);
      lunes.setDate(hoy.getDate() - hoy.getDay() + 1);
      return { desde: lunes.toISOString().split('T')[0], hasta };
    }
    case 'mes': {
      const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
      return { desde: inicio.toISOString().split('T')[0], hasta };
    }
    default:
      return { desde: null, hasta: null };
  }
};

export default function ReportsPage() {
  const [periodo, setPeriodo] = useState('mes');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [loading, setLoading] = useState(true);
  const [produccion, setProduccion] = useState(null);
  const [analistas, setAnalistas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [inventario, setInventario] = useState(null);

  useEffect(() => {
    if (periodo !== 'custom') loadData();
  }, [periodo]);

  const getParams = () => {
    if (periodo === 'custom') return { desde: fechaDesde, hasta: fechaHasta };
    return getPeriodoFechas(periodo);
  };

  const loadData = async () => {
    setLoading(true);
    const { desde, hasta } = getParams();
    try {
      const [prod, anal, serv, inv] = await Promise.all([
        reportService.getProduccion(desde, hasta),
        reportService.getAnalistas(desde, hasta),
        reportService.getServicios(desde, hasta),
        reportService.getInventario(desde, hasta),
      ]);
      setProduccion(prod);
      setAnalistas(anal);
      setServicios(serv);
      setInventario(inv);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const exportarMuestras = () => {
    if (!produccion?.muestras) return;
    const ws = XLSX.utils.json_to_sheet(produccion.muestras.map(m => ({
      'Código': m.sampleCode,
      'Muestra': m.sampleName || '-',
      'Cliente': m.cliente,
      'Estado': m.status,
      'Análisis Total': m.totalAnalisis,
      'Análisis Completados': m.analisisCompletados,
      'Fecha': new Date(m.createdAt).toLocaleDateString('es-EC')
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Muestras');
    XLSX.writeFile(wb, `reporte-muestras-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportarAnalistas = () => {
    if (!analistas.length) return;
    const ws = XLSX.utils.json_to_sheet(analistas.map(a => ({
      'Analista': a.nombre,
      'Asignados': a.asignados,
      'Completados': a.completados,
      'En Proceso': a.enProceso,
      'Pendientes': a.pendientes,
      'Cumplimiento %': a.cumplimiento
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Analistas');
    XLSX.writeFile(wb, `reporte-analistas-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const chartProduccion = {
    chart: { type: 'column', style: { fontFamily: 'Montserrat, sans-serif' }, backgroundColor: 'transparent' },
    title: { text: null },
    xAxis: {
      categories: produccion ? Object.keys(produccion.porDia) : [],
      labels: { style: { color: '#666666', fontSize: '11px' }, rotation: -45 }
    },
    yAxis: {
      title: { text: 'Muestras', style: { color: '#666666' } },
      allowDecimals: false,
      gridLineColor: '#E5E5E5'
    },
    plotOptions: {
      column: {
        borderRadius: 8,
        dataLabels: { enabled: true, style: { fontWeight: 'bold', color: '#009933' } }
      }
    },
    series: [{
      name: 'Muestras',
      data: produccion ? Object.values(produccion.porDia) : [],
      color: '#009933',
      borderColor: '#009933',
      borderWidth: 0
    }],
    credits: { enabled: false },
    legend: { enabled: false }
  };

  const chartServicios = {
    chart: { type: 'pie', style: { fontFamily: 'Montserrat, sans-serif' }, backgroundColor: 'transparent' },
    title: { text: null },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f}%',
          style: { color: '#666666', fontSize: '11px' }
        },
        showInLegend: true,
        legendType: 'point'
      }
    },
    series: [{
      name: 'Solicitudes',
      data: servicios.map((s, i) => ({
        name: s.nombre.length > 25 ? s.nombre.substring(0, 22) + '...' : s.nombre,
        y: s.cantidad,
        color: ['#009933', '#FFCC33', '#666666', '#00CC44', '#FFD700', '#4CAF50', '#FFC107', '#9E9E9E', '#81C784', '#FFD54F'][i % 10]
      }))
    }],
    credits: { enabled: false }
  };

  const chartAnalistas = {
    chart: { type: 'bar', style: { fontFamily: 'Montserrat, sans-serif' }, backgroundColor: 'transparent' },
    title: { text: null },
    xAxis: {
      categories: analistas.map(a => a.nombre.length > 15 ? a.nombre.substring(0, 12) + '...' : a.nombre),
      labels: { style: { color: '#666666' } },
      gridLineColor: '#E5E5E5'
    },
    yAxis: { title: { text: 'Análisis' }, allowDecimals: false, gridLineColor: '#E5E5E5' },
    plotOptions: {
      bar: { borderRadius: 4, dataLabels: { enabled: true, style: { color: '#333333' } } }
    },
    series: [
      { name: 'Completados', data: analistas.map(a => a.completados), color: '#009933' },
      { name: 'En Proceso', data: analistas.map(a => a.enProceso), color: '#FFCC33' },
      { name: 'Pendientes', data: analistas.map(a => a.pendientes), color: '#666666' },
    ],
    credits: { enabled: false },
    legend: {
      itemStyle: { color: '#666666' },
      itemHoverStyle: { color: '#009933' }
    }
  };

  const inputStyle = {
    padding: '8px 12px', border: '1px solid #E5E5E5',
    borderRadius: '12px', fontSize: '13px', color: '#333333', outline: 'none',
    fontFamily: "'Montserrat', sans-serif"
  };

  //eslint-disable-next-line no-unused-vars
  const KPICard = ({ icon: Icon, label, value, color = '#009933', bg = '#E8F5E9', trend, trendValue }) => (
    <div className="bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all duration-200" style={{ borderColor: '#E5E5E5' }}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: bg }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div>
          <p className="text-2xl font-bold" style={{ color }}>{value ?? '-'}</p>
          <p className="text-xs" style={{ color: '#666666' }}>{label}</p>
          {trend && (
            <div className="flex items-center gap-0.5 mt-1">
              {trend === 'up' ? <TrendingUp className="w-3 h-3" style={{ color: '#009933' }} /> : <TrendingDown className="w-3 h-3" style={{ color: '#DC2626' }} />}
              <span className="text-xs" style={{ color: trend === 'up' ? '#009933' : '#DC2626' }}>{trendValue}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm" style={{ backgroundColor: '#E8F5E9' }}>
            <BarChart3 className="w-7 h-7" style={{ color: '#009933' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#009933', fontFamily: "'Trajan Pro Bold', serif" }}>
              Reportes y Estadísticas
            </h1>
            <p className="text-sm mt-0.5" style={{ color: '#666666', fontFamily: "'Montserrat', sans-serif" }}>
              Análisis de producción y rendimiento del laboratorio
            </p>
          </div>
        </div>
      </div>

      {/* Filtros período */}
      <div className="bg-white rounded-xl border p-4 shadow-sm" style={{ borderColor: '#E5E5E5' }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Calendar className="w-4 h-4" style={{ color: '#666666' }} />
            <span className="text-sm" style={{ color: '#666666' }}>Período:</span>
            {PERIODOS.map(p => (
              <button
                key={p.value}
                onClick={() => setPeriodo(p.value)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  backgroundColor: periodo === p.value ? '#009933' : '#F5F5F5',
                  color: periodo === p.value ? '#FFFFFF' : '#666666'
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
          {periodo === 'custom' && (
            <div className="flex items-center gap-2 flex-wrap">
              <input
                type="date"
                value={fechaDesde}
                onChange={e => setFechaDesde(e.target.value)}
                style={inputStyle}
                className="w-36"
              />
              <span className="text-xs" style={{ color: '#666666' }}>a</span>
              <input
                type="date"
                value={fechaHasta}
                onChange={e => setFechaHasta(e.target.value)}
                style={inputStyle}
                className="w-36"
              />
              <button
                onClick={loadData}
                className="p-2 rounded-xl transition-all hover:shadow-md"
                style={{ backgroundColor: '#009933', color: '#FFFFFF' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00802b'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#009933'}
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="text-center">
            <div className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4"
              style={{ borderColor: '#009933', borderTopColor: '#FFCC33' }}></div>
            <p className="text-sm" style={{ color: '#666666' }}>Cargando reportes...</p>
          </div>
        </div>
      ) : (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <KPICard icon={BarChart3} label="Muestras" value={produccion?.kpis?.totalMuestras} />
            <KPICard icon={FlaskConical} label="Análisis completados" value={produccion?.kpis?.analisisCompletados} />
            <KPICard icon={FileText} label="Solicitudes" value={produccion?.kpis?.totalSolicitudes} />
            <KPICard icon={CheckCircle} label="Cotiz. convertidas" value={produccion?.kpis?.cotizacionesConvertidas} color="#996600" bg="#FFF9E8" />
            <KPICard icon={Users} label="Clientes atendidos" value={produccion?.kpis?.clientesAtendidos} />
          </div>

          {/* Producción por día */}
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition-all duration-200" style={{ borderColor: '#E5E5E5' }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 border-b" style={{ borderColor: '#E5E5E5', backgroundColor: '#F9F9F9' }}>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" style={{ color: '#009933' }} />
                <h2 className="text-base font-semibold" style={{ color: '#333333' }}>
                  Muestras por día
                </h2>
              </div>
              <button
                onClick={exportarMuestras}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{ backgroundColor: '#E8F5E9', color: '#009933' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#009933'; e.currentTarget.style.color = '#FFFFFF'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#E8F5E9'; e.currentTarget.style.color = '#009933'; }}
              >
                <Download className="w-3.5 h-3.5" />
                Exportar Excel
              </button>
            </div>
            <div className="p-6">
              {Object.keys(produccion?.porDia || {}).length === 0 ? (
                <div className="text-center py-12">
                  <BarChart3 className="w-12 h-12 mx-auto mb-3" style={{ color: '#CCCCCC' }} />
                  <p style={{ color: '#999999' }}>Sin datos en este período</p>
                </div>
              ) : (
                <HighchartsReact highcharts={Highcharts} options={chartProduccion} />
              )}
            </div>
          </div>

          {/* Analistas y Servicios */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Rendimiento analistas */}
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition-all duration-200" style={{ borderColor: '#E5E5E5' }}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 border-b" style={{ borderColor: '#E5E5E5', backgroundColor: '#F9F9F9' }}>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" style={{ color: '#009933' }} />
                  <h2 className="text-base font-semibold" style={{ color: '#333333' }}>
                    Rendimiento por Analista
                  </h2>
                </div>
                <button
                  onClick={exportarAnalistas}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{ backgroundColor: '#E8F5E9', color: '#009933' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#009933'; e.currentTarget.style.color = '#FFFFFF'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#E8F5E9'; e.currentTarget.style.color = '#009933'; }}
                >
                  <Download className="w-3.5 h-3.5" />
                  Exportar Excel
                </button>
              </div>
              <div className="p-6">
                {analistas.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 mx-auto mb-3" style={{ color: '#CCCCCC' }} />
                    <p style={{ color: '#999999' }}>Sin datos de analistas</p>
                  </div>
                ) : (
                  <>
                    <HighchartsReact highcharts={Highcharts} options={chartAnalistas} />
                    <div className="overflow-x-auto mt-6">
                      <table className="w-full text-xs">
                        <thead>
                          <tr style={{ borderBottom: '1px solid #E5E5E5' }}>
                            <th className="py-2 text-left font-medium" style={{ color: '#666666' }}>Analista</th>
                            <th className="py-2 text-left font-medium" style={{ color: '#666666' }}>Asig.</th>
                            <th className="py-2 text-left font-medium" style={{ color: '#666666' }}>Comp.</th>
                            <th className="py-2 text-left font-medium" style={{ color: '#666666' }}>Cumpl.%</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analistas.map(a => (
                            <tr key={a.id} style={{ borderBottom: '1px solid #F5F5F5' }}>
                              <td className="py-2" style={{ color: '#333333' }}>{a.nombre}</td>
                              <td className="py-2" style={{ color: '#666666' }}>{a.asignados}</td>
                              <td className="py-2" style={{ color: '#009933' }}>{a.completados}</td>
                              <td className="py-2">
                                <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium"
                                  style={{
                                    backgroundColor: a.cumplimiento >= 80 ? '#E8F5E9' : a.cumplimiento >= 50 ? '#FFF9E8' : '#FEF2F2',
                                    color: a.cumplimiento >= 80 ? '#009933' : a.cumplimiento >= 50 ? '#996600' : '#DC2626'
                                  }}>
                                  {a.cumplimiento}%
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Servicios más solicitados */}
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition-all duration-200" style={{ borderColor: '#E5E5E5' }}>
              <div className="px-6 py-4 border-b" style={{ borderColor: '#E5E5E5', backgroundColor: '#F9F9F9' }}>
                <div className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" style={{ color: '#009933' }} />
                  <h2 className="text-base font-semibold" style={{ color: '#333333' }}>
                    Servicios más solicitados
                  </h2>
                </div>
              </div>
              <div className="p-6">
                {servicios.length === 0 ? (
                  <div className="text-center py-12">
                    <FlaskConical className="w-12 h-12 mx-auto mb-3" style={{ color: '#CCCCCC' }} />
                    <p style={{ color: '#999999' }}>Sin datos de servicios</p>
                  </div>
                ) : (
                  <HighchartsReact highcharts={Highcharts} options={chartServicios} />
                )}
              </div>
            </div>
          </div>

          {/* Movimientos de Inventario */}
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition-all duration-200" style={{ borderColor: '#E5E5E5' }}>
            <div className="px-6 py-4 border-b" style={{ borderColor: '#E5E5E5', backgroundColor: '#F9F9F9' }}>
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5" style={{ color: '#009933' }} />
                <h2 className="text-base font-semibold" style={{ color: '#333333' }}>
                  Movimientos de Inventario
                </h2>
              </div>
            </div>
            <div className="p-6">
              {!inventario?.resumen?.length ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 mx-auto mb-3" style={{ color: '#CCCCCC' }} />
                  <p style={{ color: '#999999' }}>Sin movimientos en este período</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottom: '1px solid #E5E5E5', backgroundColor: '#F9F9F9' }}>
                        <th className="px-4 py-3 text-left font-medium" style={{ color: '#666666' }}>Reactivo</th>
                        <th className="px-4 py-3 text-left font-medium" style={{ color: '#666666' }}>Ingresos</th>
                        <th className="px-4 py-3 text-left font-medium" style={{ color: '#666666' }}>Consumos</th>
                        <th className="px-4 py-3 text-left font-medium" style={{ color: '#666666' }}>Unidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventario.resumen.map((r, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #F5F5F5' }}>
                          <td className="px-4 py-3 font-medium" style={{ color: '#333333' }}>{r.nombre}</td>
                          <td className="px-4 py-3" style={{ color: '#009933' }}>+{r.ingresos.toFixed(2)}</td>
                          <td className="px-4 py-3" style={{ color: '#DC2626' }}>-{r.consumos.toFixed(2)}</td>
                          <td className="px-4 py-3" style={{ color: '#666666' }}>{r.unidad === 'LITROS' ? 'L' : 'KG'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}