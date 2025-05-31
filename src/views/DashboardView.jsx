import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { formatCurrency } from '../utils/formatters';
import { CustomTooltip } from '../utils/charts';
import KpiCard from '../components/KpiCard';
import { 
  BarChart, Bar, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart
} from 'recharts';
import { 
  TrendingUp, Award, Euro, Activity, BarChart3, Download, PlusCircle, Target
} from 'lucide-react';

const DashboardView = () => {
  const { 
    deals, 
    stats, 
    analyticsData, 
    selectedMetric, 
    setSelectedMetric,
    setCurrentView,
    setShowForm
  } = useContext(AppContext);

  if (deals.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
        <div className="text-gray-400 mb-4">
          <BarChart3 size={64} className="mx-auto" />
        </div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Nessun Dato Disponibile</h3>
        <p className="text-gray-500 mb-6">Inizia creando la tua prima trattativa per vedere le analytics avanzate</p>
        <button
          onClick={() => {
            setCurrentView('pipeline'); 
            setShowForm(true);
          }}
          className="text-white px-6 py-2 rounded-lg inline-flex items-center gap-2 transform hover:scale-105 transition-all"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
          }}
        >
          <PlusCircle size={16} />
          Crea Prima Trattativa
        </button>
        
        <div className="mt-6 p-4 rounded-lg border" style={{
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%)',
          borderColor: 'rgba(102, 126, 234, 0.2)'
        }}>
          <h4 className="text-sm font-semibold mb-2" style={{color: '#667eea'}}>🚀 Funzionalità Principali</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs" style={{color: '#5a6fd8'}}>
            <div className="flex items-center gap-1"><Download size={12} /><span>Export/Import dati</span></div>
            <div className="flex items-center gap-1"><BarChart3 size={12} /><span>6+ grafici avanzati</span></div>
            <div className="flex items-center gap-1"><Target size={12} /><span>Salvataggio automatico</span></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          title="Volume Totale Pipeline" 
          value={formatCurrency(stats.volumeTotale)} 
          icon={Euro}
          gradientStyle={{background: 'linear-gradient(135deg, #667eea 0%, #5a6fd8 100%)'}}
        />
        <KpiCard 
          title="Trattative Acquisite" 
          value={stats.acquisite.toString()}
          description={`${stats.conversionRate}% di conversione`}
          icon={Award}
          gradientStyle={{background: 'linear-gradient(135deg, #28a745 0%, #218838 100%)'}}
        />
        <KpiCard 
          title="Trattative Totali" 
          value={stats.totale.toString()}
          description={`${stats.inCorso} in corso`}
          icon={Activity}
          gradientStyle={{background: 'linear-gradient(135deg, #764ba2 0%, #8b5cf6 100%)'}}
        />
        <KpiCard 
          title="Volume Acquisito" 
          value={formatCurrency(stats.volumeAcquisito)}
          description="Fatturato confermato"
          icon={TrendingUp}
          gradientStyle={{background: 'linear-gradient(135deg, #ff8c00 0%, #cc7000 100%)'}}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Performance Commerciali</h3>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500"
            >
              <option value="volume">Volume (€)</option>
              <option value="trattative">N. Trattative</option>
              <option value="acquisite">N. Acquisite</option>
              <option value="tasso">Tasso Conversione (%)</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.salesData.sort((a,b) => b[selectedMetric] - a[selectedMetric])} margin={{ top: 5, right: 20, left: 0, bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="commerciale" angle={-45} textAnchor="end" interval={0} height={80} tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={value => selectedMetric === 'volume' ? formatCurrency(value) : (selectedMetric === 'tasso' ? `${value}%` : value)} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey={selectedMetric} fill="#3B82F6" radius={[4, 4, 0, 0]} name={selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Stati Pipeline (Conteggio)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.pipelineData}
                cx="50%" cy="50%" outerRadius={100}
                dataKey="count" nameKey="stato" labelLine={false}
                label={({ stato, percent, count }) => `${stato} (${count}): ${(percent * 100).toFixed(0)}%`}
                fontSize={11}
              >
                {analyticsData.pipelineData.map((entry, index) => (
                  <Cell key={`cell-pipeline-${index}-${entry.stato}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Trend Ultimi 12 Mesi</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={analyticsData.monthlyTrends} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0"/>
                  <XAxis dataKey="mese" tick={{ fontSize: 11 }}/>
                  <YAxis yAxisId="left" label={{ value: 'Conteggio', angle: -90, position: 'insideLeft', fontSize: 12, dy: 40 }} tick={{ fontSize: 11 }}/>
                  <YAxis yAxisId="right" orientation="right" label={{ value: 'Tasso % / Volume €', angle: 90, position: 'insideRight', fontSize: 12, dy: -60 }} tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar yAxisId="left" dataKey="trattative" fill="#8884d8" name="Trattative" />
                  <Line yAxisId="left" type="monotone" dataKey="acquisite" stroke="#82ca9d" strokeWidth={2} name="Acquisite" />
                  <Line yAxisId="right" type="monotone" dataKey="volume" stroke="#ffc658" strokeWidth={2} name="Volume Acquisito (€)" dot={{r:3}} />
                  <Line yAxisId="right" type="monotone" dataKey="tasso" stroke="#ff7300" strokeWidth={2} name="Tasso Conversione (%)" dot={{r:3}}/>
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Performance per Ramo (Top 8 per N.)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[...analyticsData.ramiData].sort((a,b) => b.count - a.count).slice(0, 8)} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0"/>
                  <XAxis type="number" tick={{ fontSize: 11 }}/>
                  <YAxis dataKey="ramo" type="category" width={100} tick={{ fontSize: 10 }}/>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="count" fill="#8B5CF6" name="N. Trattative" />
                  <Bar dataKey="acquisite" fill="#10B981" name="N. Acquisite" />
                  <Bar dataKey="volume" fill="#FFC658" name="Volume Acquisito (€)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
      </div>
          
      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Funnel di Conversione</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.funnelData} margin={{ top: 20, right: 20, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0"/>
              <XAxis dataKey="stage" angle={-45} textAnchor="end" height={70} interval={0} tick={{ fontSize: 11 }}/>
              <YAxis tick={{ fontSize: 11 }}/>
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Conteggio" radius={[4, 4, 0, 0]}>
                {analyticsData.funnelData.map((entry, index) => (
                  <Cell key={`funnel-cell-${index}-${entry.stage}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Radar Top 5 Commerciali (Performance Relativa %)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={analyticsData.radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="commerciale" tick={{ fontSize: 10 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} tick={{ fontSize: 10 }}/>
              <Radar name="Volume" dataKey="volume" stroke="#8884d8" fill="#8884d8" fillOpacity={0.4}/>
              <Radar name="Trattative" dataKey="trattative" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.4}/>
              <Radar name="Acquisite" dataKey="acquisite" stroke="#ffc658" fill="#ffc658" fillOpacity={0.4}/>
              <Radar name="Tasso Conv." dataKey="tasso" stroke="#ff7300" fill="#ff7300" fillOpacity={0.4}/> {/* Tasso è già in % */}
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performers Table */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Classifica Commerciali (Top 5 per Volume)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="p-3 font-medium text-gray-600">Commerciale</th>
                <th className="p-3 font-medium text-gray-600 text-right">Volume (€)</th>
                <th className="p-3 font-medium text-gray-600 text-right">Trattative</th>
                <th className="p-3 font-medium text-gray-600 text-right">Acquisite</th>
                <th className="p-3 font-medium text-gray-600 text-right">Conv. (%)</th>
              </tr>
            </thead>
            <tbody>
              {[...analyticsData.salesData]
                .sort((a, b) => b.volume - a.volume)
                .slice(0, 5)
                .map((commercial) => (
                <tr key={commercial.commerciale} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-800">{commercial.commerciale}</td>
                  <td className="p-3 text-green-600 font-medium text-right">{formatCurrency(commercial.volume)}</td>
                  <td className="p-3 text-gray-700 text-right">{commercial.trattative}</td>
                  <td className="p-3 text-gray-700 text-right">{commercial.acquisite}</td>
                  <td className="p-3 text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      commercial.tasso >= 40 ? 'bg-green-100 text-green-800' :
                      commercial.tasso >= 25 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {commercial.tasso.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Info Storage & Export */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl shadow-lg border border-green-200">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-green-600 p-2 bg-white rounded-full shadow">
              <Award size={32} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">💾 Sistema Completo Attivo</h3>
              <p className="text-sm text-gray-600 mt-1">
                <strong>{deals.length} trattative</strong> gestite • 
                <strong> {analyticsData.salesData.length} commerciali</strong> attivi • 
                <strong> {analyticsData.ramiData.length} rami</strong> assicurativi.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-4 md:mt-0">
              <span className="text-xs text-gray-500">Backup automatico locale. Export/Import disponibili nell'header.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;