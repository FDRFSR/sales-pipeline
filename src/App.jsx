import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Target, Users, Euro, Calendar,
  Award, AlertCircle, Activity, Filter, RefreshCw, Download,
  PlusCircle, Building2, User, FileText, BarChart3, 
  Home, Settings, Menu, X, Edit, Trash2
} from 'lucide-react';

const UnifiedSalesPipeline = () => {
  // Stati delle trattative
  const dealStates = [
    { id: 'da_visitare', name: 'Da Visitare', color: 'bg-blue-500', description: 'Cliente da incontrare ancora' },
    { id: 'visionato', name: 'Visionato', color: 'bg-yellow-500', description: 'Primo incontro fatto. Valutare possibili sviluppi' },
    { id: 'in_trattativa', name: 'In Trattativa', color: 'bg-orange-500', description: 'Cliente incontrato, in attesa documentazione' },
    { id: 'da_quotare', name: 'Da Quotare', color: 'bg-purple-500', description: 'Documentazione ricevuta, da preparare quotazione' },
    { id: 'quotato', name: 'Quotato', color: 'bg-indigo-500', description: 'Quotazioni presentate al cliente' },
    { id: 'acquisita', name: 'Acquisita', color: 'bg-green-500', description: 'Trattativa conclusa con successo' },
    { id: 'persa', name: 'Persa', color: 'bg-red-500', description: 'Trattativa non conclusa' },
    { id: 'senza_seguito', name: 'Senza Seguito', color: 'bg-gray-500', description: 'Cliente non interessato' }
  ];

  // Commerciali
  const commerciali = [
    'POLI MAURO', 'FUSARRI FEDERICO', 'CAMPAGNARO LEONARDO', 'DURANTE LUCA',
    'CORRADI VALERIA', 'LAZZAROTTO GIAMPAOLO', 'MARIGA LUCIO', 'MANFRIN CHRISTIAN',
    'PESCE MATTIA', 'RASIA RODOLFO', 'MAZZOLA LORENA', 'TONIOLO MAURIZIO',
    'ROMANO SIMONE', 'BASEGGIO LEONARDO'
  ];

  // Rami assicurativi
  const ramiAssicurativi = [
    'INCENDIO', 'INFORTUNI', 'ELETTRONICA', 'D&O', 'RCTO', 'SANITARIA',
    'PROFESSIONALE', 'TUTELA LEGALE', 'MULTIRISCHI', 'CONSULENZA', 'RCP',
    'FOTOVOLTAICO', 'DEO', 'CAR', 'POSTUMA', 'RCPRODOTTI', 'CONDOMINIO'
  ];

  // State principale
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Dati delle trattative
  const [deals, setDeals] = useState([]);

  // State per form e filtri
  const [showForm, setShowForm] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [filterState, setFilterState] = useState('all');
  const [filterCommercial, setFilterCommercial] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  const [selectedMetric, setSelectedMetric] = useState('volume');

  // Form state
  const [formData, setFormData] = useState({
    ragioneSociale: '',
    commerciale: '',
    ramo: '',
    stato: 'da_visitare',
    premi: { marzo: 0, giugno: 0, settembre: 0, dicembre: 0 },
    note: '',
    compagnia: ''
  });

  // Calcola statistiche principali
  const stats = useMemo(() => {
    const totale = deals.length;
    const acquisite = deals.filter(d => d.stato === 'acquisita').length;
    const inCorso = deals.filter(d => ['da_visitare', 'visionato', 'in_trattativa', 'da_quotare', 'quotato'].includes(d.stato)).length;
    const volumeTotale = deals.reduce((sum, deal) => sum + deal.totale, 0);
    const volumeAcquisito = deals.filter(d => d.stato === 'acquisita').reduce((sum, deal) => sum + deal.totale, 0);
    const conversionRate = totale > 0 ? ((acquisite / totale) * 100).toFixed(1) : 0;
    
    return {
      totale,
      acquisite,
      inCorso,
      volumeTotale,
      volumeAcquisito,
      conversionRate
    };
  }, [deals]);

  // Dati per analytics
  const analyticsData = useMemo(() => {
    // Performance per commerciale
    const salesData = commerciali.map(commerciale => {
      const dealsByCommercial = deals.filter(d => d.commerciale === commerciale);
      const acquisite = dealsByCommercial.filter(d => d.stato === 'acquisita');
      const volume = acquisite.reduce((sum, deal) => sum + deal.totale, 0);
      const tasso = dealsByCommercial.length > 0 ? ((acquisite.length / dealsByCommercial.length) * 100).toFixed(1) : 0;
      
      return {
        commerciale,
        trattative: dealsByCommercial.length,
        volume,
        acquisite: acquisite.length,
        tasso: parseFloat(tasso)
      };
    }).filter(data => data.trattative > 0);

    // Distribuzione per ramo
    const ramiData = ramiAssicurativi.map(ramo => {
      const dealsByRamo = deals.filter(d => d.ramo === ramo);
      const volume = dealsByRamo.reduce((sum, deal) => sum + deal.totale, 0);
      
      return {
        ramo,
        count: dealsByRamo.length,
        volume,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`
      };
    }).filter(data => data.count > 0);

    // Stati pipeline
    const pipelineData = dealStates.map(state => {
      const dealsByState = deals.filter(d => d.stato === state.id);
      const volume = dealsByState.reduce((sum, deal) => sum + deal.totale, 0);
      
      return {
        stato: state.name,
        count: dealsByState.length,
        volume,
        color: state.color.replace('bg-', '').replace('-500', '')
      };
    }).filter(data => data.count > 0);

    return { salesData, ramiData, pipelineData };
  }, [deals]);

  // Filtra deals
  const filteredDeals = deals.filter(deal => {
    const stateMatch = filterState === 'all' || deal.stato === filterState;
    const commercialMatch = filterCommercial === 'all' || deal.commerciale === filterCommercial;
    return stateMatch && commercialMatch;
  });

  // Raggruppa per stato per la vista Kanban
  const dealsByState = dealStates.map(state => ({
    ...state,
    deals: filteredDeals.filter(deal => deal.stato === state.id),
    count: filteredDeals.filter(deal => deal.stato === state.id).length,
    volume: filteredDeals.filter(deal => deal.stato === state.id).reduce((sum, deal) => sum + deal.totale, 0)
  }));

  // Utility functions
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('it-IT');
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={`tooltip-${index}-${entry.name}`} style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('Volume') || entry.name.includes('volume') 
                ? formatCurrency(entry.value) 
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Form handlers
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePremioChange = (trimestre, value) => {
    const numValue = parseFloat(value) || 0;
    setFormData(prev => ({
      ...prev,
      premi: { ...prev.premi, [trimestre]: numValue }
    }));
  };

  const calculateTotal = () => {
    const { marzo, giugno, settembre, dicembre } = formData.premi;
    return marzo + giugno + settembre + dicembre;
  };

  const handleSubmit = () => {
    if (!formData.ragioneSociale.trim() || !formData.commerciale || !formData.ramo) {
      alert('Compila tutti i campi obbligatori');
      return;
    }

    const newDeal = {
      id: selectedDeal ? selectedDeal.id : Date.now(),
      ...formData,
      totale: calculateTotal(),
      dataCreazione: selectedDeal ? selectedDeal.dataCreazione : new Date(),
      ultimaModifica: new Date()
    };

    if (selectedDeal) {
      setDeals(prev => prev.map(deal => deal.id === selectedDeal.id ? newDeal : deal));
    } else {
      setDeals(prev => [...prev, newDeal]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      ragioneSociale: '',
      commerciale: '',
      ramo: '',
      stato: 'da_visitare',
      premi: { marzo: 0, giugno: 0, settembre: 0, dicembre: 0 },
      note: '',
      compagnia: ''
    });
    setShowForm(false);
    setSelectedDeal(null);
  };

  const editDeal = (deal) => {
    setSelectedDeal(deal);
    setFormData({
      ragioneSociale: deal.ragioneSociale,
      commerciale: deal.commerciale,
      ramo: deal.ramo,
      stato: deal.stato,
      premi: deal.premi,
      note: deal.note,
      compagnia: deal.compagnia
    });
    setShowForm(true);
  };

  const deleteDeal = (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questa trattativa?')) {
      setDeals(prev => prev.filter(deal => deal.id !== id));
    }
  };

  const updateDealState = (dealId, newState) => {
    setDeals(prev => prev.map(deal => 
      deal.id === dealId 
        ? { ...deal, stato: newState, ultimaModifica: new Date() }
        : deal
    ));
  };

  // Sidebar Navigation
  const navigationItems = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'pipeline', name: 'Pipeline', icon: Target },
    { id: 'deals', name: 'Trattative', icon: Building2 },
  ];

  // Dashboard Component
  const DashboardView = () => (
    <div className="space-y-6">
      {/* Empty State */}
      {deals.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="text-gray-400 mb-4">
            <BarChart3 size={64} className="mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Nessun Dato Disponibile</h3>
          <p className="text-gray-500 mb-6">Inizia creando la tua prima trattativa per vedere le analytics</p>
          <button
            onClick={() => {
              setCurrentView('pipeline');
              setShowForm(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2"
          >
            <PlusCircle size={16} />
            Crea Prima Trattativa
          </button>
        </div>
      )}
      
      {/* Data Views - Only show when there are deals */}
      {deals.length > 0 && (
        <React.Fragment>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Volume Totale</p>
              <p className="text-3xl font-bold">{formatCurrency(stats.volumeTotale)}</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp size={16} />
                <span className="text-sm">Performance globale</span>
              </div>
            </div>
            <Euro size={48} className="text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Trattative Acquisite</p>
              <p className="text-3xl font-bold">{stats.acquisite}</p>
              <div className="flex items-center gap-1 mt-2">
                <Target size={16} />
                <span className="text-sm">{stats.conversionRate}% conversion</span>
              </div>
            </div>
            <Award size={48} className="text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Trattative Totali</p>
              <p className="text-3xl font-bold">{stats.totale}</p>
              <div className="flex items-center gap-1 mt-2">
                <Users size={16} />
                <span className="text-sm">{stats.inCorso} in corso</span>
              </div>
            </div>
            <Activity size={48} className="text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Volume Acquisito</p>
              <p className="text-2xl font-bold">{formatCurrency(stats.volumeAcquisito)}</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp size={16} />
                <span className="text-sm">Fatturato confermato</span>
              </div>
            </div>
            <Euro size={48} className="text-orange-200" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Commerciali */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Performance Commerciali</h3>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1"
            >
              <option value="volume">Volume</option>
              <option value="trattative">Trattative</option>
              <option value="tasso">Tasso Conversione</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="commerciale" 
                angle={-45}
                textAnchor="end"
                height={100}
                fontSize={12}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey={selectedMetric} 
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stati Pipeline */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Stati Pipeline</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.pipelineData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
                label={({stato, count}) => `${stato}: ${count}`}
                labelLine={false}
                fontSize={12}
              >
                {analyticsData.pipelineData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 50%)`} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performers Table */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Top Performers</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="pb-2 text-sm font-medium text-gray-600">Commerciale</th>
                <th className="pb-2 text-sm font-medium text-gray-600">Volume</th>
                <th className="pb-2 text-sm font-medium text-gray-600">Trattative</th>
                <th className="pb-2 text-sm font-medium text-gray-600">Acquisite</th>
                <th className="pb-2 text-sm font-medium text-gray-600">Conv. %</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.salesData
                .sort((a, b) => b.volume - a.volume)
                .slice(0, 5)
                .map((commercial) => (
                <tr key={commercial.commerciale} className="border-b border-gray-100">
                  <td className="py-3 text-sm font-medium">{commercial.commerciale}</td>
                  <td className="py-3 text-sm text-green-600 font-medium">{formatCurrency(commercial.volume)}</td>
                  <td className="py-3 text-sm">{commercial.trattative}</td>
                  <td className="py-3 text-sm">{commercial.acquisite}</td>
                  <td className="py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      commercial.tasso >= 40 ? 'bg-green-100 text-green-800' :
                      commercial.tasso >= 25 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {commercial.tasso}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          }))}
        </div>
        </div>
        </>
      )}
    </div>
  );

  // Pipeline Kanban View
  const PipelineView = () => (
    <div className="space-y-6">
      {/* Empty State */}
      {deals.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Target size={64} className="mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Pipeline Vuota</h3>
          <p className="text-gray-500 mb-6">Inizia aggiungendo la tua prima trattativa per gestire il tuo sales pipeline</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2"
          >
            <PlusCircle size={16} />
            Aggiungi Trattativa
          </button>
        </div>
      )}

      {/* Pipeline Content - Only show when there are deals */}
      {deals.length > 0 && (
        <React.Fragment>
      {/* Filtri */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-600" />
            <span className="font-medium text-gray-700">Filtri:</span>
          </div>
          
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tutti gli stati</option>
            {dealStates.map(state => (
              <option key={`filter-state-${state.id}`} value={state.id}>{state.name}</option>
            ))}
          </select>

          <select
            value={filterCommercial}
            onChange={(e) => setFilterCommercial(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tutti i commerciali</option>
            {commerciali.map(commercial => (
              <option key={`filter-commercial-${commercial}`} value={commercial}>{commercial}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Pipeline Kanban */}
      <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-4 gap-6">
        {dealsByState.map(state => (
          <div key={`state-${state.id}`} className="bg-white rounded-xl shadow-lg">
            <div className={`${state.color} text-white p-4 rounded-t-xl`}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{state.name}</h3>
                <span className="bg-white bg-opacity-30 text-xs px-2 py-1 rounded-full">
                  {state.count}
                </span>
              </div>
              {state.volume > 0 && (
                <p className="text-xs opacity-90 mt-1">{formatCurrency(state.volume)}</p>
              )}
            </div>
            
            <div className="p-4 max-h-96 overflow-y-auto space-y-3">
              {state.deals.map(deal => (
                <div key={`deal-${deal.id}`} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm text-gray-900 truncate flex-1">
                      {deal.ragioneSociale}
                    </h4>
                    <div className="flex gap-1 ml-2">
                      <button
                        onClick={() => editDeal(deal)}
                        className="text-blue-600 hover:text-blue-800 text-xs"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => deleteDeal(deal.id)}
                        className="text-red-600 hover:text-red-800 text-xs"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <User size={12} />
                      <span className="truncate">{deal.commerciale}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Building2 size={12} />
                      <span>{deal.ramo}</span>
                    </div>
                    {deal.totale > 0 && (
                      <div className="flex items-center gap-1">
                        <Euro size={12} />
                        <span className="font-medium text-green-600">
                          {formatCurrency(deal.totale)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{formatDate(deal.ultimaModifica)}</span>
                    </div>
                  </div>
                  
                  {deal.note && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                      <div className="flex items-start gap-1">
                        <FileText size={12} className="text-gray-400 mt-0.5" />
                        <p className="text-gray-600 line-clamp-2">{deal.note}</p>
                      </div>
                    </div>
                  )}

                  {/* Quick Status Change */}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {dealStates.filter(s => s.id !== deal.stato).slice(0, 2).map(newState => (
                      <button
                        key={`${deal.id}-${newState.id}`}
                        onClick={() => updateDealState(deal.id, newState.id)}
                        className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 transition-colors"
                        title={`Sposta a ${newState.name}`}
                      >
                        → {newState.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              
              {state.deals.length === 0 && (
                <div className="text-center text-gray-400 py-8">
                  <p className="text-sm">Nessuna trattativa</p>
                </div>
              )}
            </div>
            }))}
        </div>
        </React.Fragment>
      )}
    </div>
  );

  // Deals List View
  const DealsView = () => (
    <div className="space-y-6">
      {/* Empty State */}
      {deals.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Building2 size={64} className="mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Nessuna Trattativa</h3>
          <p className="text-gray-500 mb-6">Non ci sono ancora trattative registrate nel sistema</p>
          <button
            onClick={() => {
              setCurrentView('pipeline');
              setShowForm(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2"
          >
            <PlusCircle size={16} />
            Crea Trattativa
          </button>
        </div>
      )}

      {/* Deals Table - Only show when there are deals */}
      {deals.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Tutte le Trattative</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commerciale</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ramo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stato</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Azioni</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDeals.map(deal => {
                const state = dealStates.find(s => s.id === deal.stato);
                return (
                  <tr key={`table-deal-${deal.id}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{deal.ragioneSociale}</div>
                        {deal.compagnia && (
                          <div className="text-sm text-gray-500">{deal.compagnia}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{deal.commerciale}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{deal.ramo}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white ${state?.color || 'bg-gray-500'}`}>
                        {state?.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {deal.totale > 0 ? formatCurrency(deal.totale) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(deal.ultimaModifica)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => editDeal(deal)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deleteDeal(deal.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Sales Pipeline</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="mt-6">
          {navigationItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={`nav-${item.id}`}
                onClick={() => {
                  setCurrentView(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
                  currentView === item.id
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <Menu size={24} />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                {navigationItems.find(item => item.id === currentView)?.name}
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              {(currentView === 'pipeline' || (currentView === 'deals' && deals.length > 0)) && (
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <PlusCircle size={16} />
                  Nuova Trattativa
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'pipeline' && <PipelineView />}
          {currentView === 'deals' && <DealsView />}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {selectedDeal ? 'Modifica Trattativa' : 'Nuova Trattativa'}
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ragione Sociale *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.ragioneSociale}
                      onChange={(e) => handleInputChange('ragioneSociale', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nome azienda cliente"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Commerciale *
                    </label>
                    <select
                      required
                      value={formData.commerciale}
                      onChange={(e) => handleInputChange('commerciale', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Seleziona commerciale</option>
                      {commerciali.map(commercial => (
                        <option key={`form-commercial-${commercial}`} value={commercial}>{commercial}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ramo Assicurativo *
                    </label>
                    <select
                      required
                      value={formData.ramo}
                      onChange={(e) => handleInputChange('ramo', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Seleziona ramo</option>
                      {ramiAssicurativi.map(ramo => (
                        <option key={`form-ramo-${ramo}`} value={ramo}>{ramo}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stato Trattativa
                    </label>
                    <select
                      value={formData.stato}
                      onChange={(e) => handleInputChange('stato', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {dealStates.map(state => (
                        <option key={`form-state-${state.id}`} value={state.id}>{state.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Compagnia
                    </label>
                    <input
                      type="text"
                      value={formData.compagnia}
                      onChange={(e) => handleInputChange('compagnia', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nome compagnia assicurativa"
                    />
                  </div>
                </div>

                {/* Premi Trimestrali */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Premi Trimestrali (€)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['marzo', 'giugno', 'settembre', 'dicembre'].map(trimestre => (
                      <div key={`premio-${trimestre}`}>
                        <label className="block text-xs text-gray-600 mb-1 capitalize">
                          {trimestre}
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.premi[trimestre]}
                          onChange={(e) => handlePremioChange(trimestre, e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <strong>Totale: {formatCurrency(calculateTotal())}</strong>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Note
                  </label>
                  <textarea
                    value={formData.note}
                    onChange={(e) => handleInputChange('note', e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Inserisci note sulla trattativa..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSubmit}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    {selectedDeal ? 'Aggiorna' : 'Crea'} Trattativa
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annulla
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedSalesPipeline;