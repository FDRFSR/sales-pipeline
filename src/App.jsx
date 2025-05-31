// Per far funzionare questo codice localmente, installa uuid:
// npm install uuid
// yarn add uuid
import { v4 as uuidv4 } from 'uuid'; // Per ID univoci

import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ComposedChart
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Target, Users, Euro, Calendar,
  Award, AlertCircle, Activity, Filter, RefreshCw, Download,
  PlusCircle, Building2, User, FileText, BarChart3, 
  Home, Settings, Menu, X, Edit, Trash2
} from 'lucide-react';

// Helper per mappare i nomi dei colori Tailwind a codici HEX
const tailwindColorNameToHex = (colorName) => {
  const map = {
    blue: '#3B82F6', yellow: '#EAB308', orange: '#F97316',
    purple: '#8B5CF6', indigo: '#6366F1', green: '#10B981',
    red: '#EF4444', gray: '#6B7280',
    // Aggiungi altri colori se necessario
  };
  return map[colorName.toLowerCase()] || '#CCCCCC'; // Default grigio se non trovato
};

// Helper per generare un colore HSL deterministico da una stringa
const stringToHslColor = (str, s = 70, l = 50) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash % 360); // Assicura h positivo
  return `hsl(${h}, ${s}%, ${l}%)`;
};


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
  const [isLoaded, setIsLoaded] = useState(false); // Flag per evitare salvataggio prematuro

  // State per form e filtri
  const [showForm, setShowForm] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [filterState, setFilterState] = useState('all');
  const [filterCommercial, setFilterCommercial] = useState('all');
  // const [selectedPeriod, setSelectedPeriod] = useState('2024'); // Rimosso perché non utilizzato
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

  // Carica dati all'avvio (UNA SOLA VOLTA)
  useEffect(() => {
    try {
      const savedDeals = localStorage.getItem('salesPipeline_deals');
      if (savedDeals) {
        const parsedDeals = JSON.parse(savedDeals);
        if (parsedDeals.length > 0) {
          const dealsWithDates = parsedDeals.map(deal => ({
            ...deal,
            id: deal.id || uuidv4(), // Assicura ID se mancante in vecchi dati
            dataCreazione: new Date(deal.dataCreazione),
            ultimaModifica: new Date(deal.ultimaModifica)
          }));
          setDeals(dealsWithDates);
          console.log(`✅ Caricati ${dealsWithDates.length} deals dal localStorage`);
        }
      }
      setIsLoaded(true); // Marca come caricato
    } catch (error) {
      console.error('Errore nel caricare i dati:', error);
      setIsLoaded(true);
    }
  }, []); // Dipendenze vuote = solo al mount

  // Salva deals automaticamente (SOLO dopo il caricamento iniziale)
  useEffect(() => {
    if (isLoaded) { // Salva solo se i dati sono stati caricati
      try {
        localStorage.setItem('salesPipeline_deals', JSON.stringify(deals));
        console.log(`💾 Salvati ${deals.length} deals nel localStorage`);
      } catch (error) {
        console.error('Errore nel salvare i dati:', error);
      }
    }
  }, [deals, isLoaded]);

  // Calcola statistiche principali
  const stats = useMemo(() => {
    const totale = deals.length;
    const acquisite = deals.filter(d => d.stato === 'acquisita').length;
    const inCorso = deals.filter(d => ['da_visitare', 'visionato', 'in_trattativa', 'da_quotare', 'quotato'].includes(d.stato)).length;
    const volumeTotale = deals.reduce((sum, deal) => sum + (deal.totale || 0), 0);
    const volumeAcquisito = deals.filter(d => d.stato === 'acquisita').reduce((sum, deal) => sum + (deal.totale || 0), 0);
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

  // Dati per analytics avanzate
  const analyticsData = useMemo(() => {
    // Performance per commerciale
    const salesData = commerciali.map(commerciale => {
      const dealsByCommercial = deals.filter(d => d.commerciale === commerciale);
      const acquisite = dealsByCommercial.filter(d => d.stato === 'acquisita');
      const volume = acquisite.reduce((sum, deal) => sum + (deal.totale || 0), 0);
      const tasso = dealsByCommercial.length > 0 ? ((acquisite.length / dealsByCommercial.length) * 100) : 0; // No toFixed yet
      
      return {
        commerciale,
        trattative: dealsByCommercial.length,
        volume,
        acquisite: acquisite.length,
        tasso: parseFloat(tasso.toFixed(1))
      };
    }).filter(data => data.trattative > 0);

    // Distribuzione per ramo
    const ramiData = ramiAssicurativi.map(ramo => {
      const dealsByRamo = deals.filter(d => d.ramo === ramo);
      const acquisite = dealsByRamo.filter(d => d.stato === 'acquisita');
      const volume = acquisite.reduce((sum, deal) => sum + (deal.totale || 0), 0);
      
      return {
        ramo,
        count: dealsByRamo.length,
        acquisite: acquisite.length,
        volume,
        tasso: dealsByRamo.length > 0 ? parseFloat(((acquisite.length / dealsByRamo.length) * 100).toFixed(1)) : 0,
        color: stringToHslColor(ramo) // Colore deterministico
      };
    }).filter(data => data.count > 0);

    // Stati pipeline
    const pipelineData = dealStates.map(state => {
      const dealsByState = deals.filter(d => d.stato === state.id);
      const volume = dealsByState.reduce((sum, deal) => sum + (deal.totale || 0), 0);
      const colorName = state.color.replace('bg-', '').replace('-500', '');
      
      return {
        stato: state.name,
        count: dealsByState.length,
        volume,
        color: tailwindColorNameToHex(colorName) // Colore HEX effettivo
      };
    }).filter(data => data.count > 0);

    // Trend mensile (ultimi 12 mesi)
    const monthlyTrends = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('it-IT', { month: 'short', year: '2-digit' });
      
      const monthDeals = deals.filter(deal => {
        const dealDate = new Date(deal.dataCreazione);
        return dealDate.getMonth() === date.getMonth() && dealDate.getFullYear() === date.getFullYear();
      });
      
      const acquisite = monthDeals.filter(d => d.stato === 'acquisita');
      const volume = acquisite.reduce((sum, deal) => sum + (deal.totale || 0), 0);
      
      monthlyTrends.push({
        mese: monthName,
        trattative: monthDeals.length,
        acquisite: acquisite.length,
        volume,
        tasso: monthDeals.length > 0 ? parseFloat(((acquisite.length / monthDeals.length) * 100).toFixed(1)) : 0
      });
    }

    // Funnel conversione
    const funnelStagesMap = {
      'Da Visitare': 'da_visitare', 'Visionato': 'visionato', 'In Trattativa': 'in_trattativa',
      'Da Quotare': 'da_quotare', 'Quotato': 'quotato', 'Acquisita': 'acquisita'
    };
    const funnelData = Object.entries(funnelStagesMap).map(([stageName, stageId]) => {
        const stateConfig = dealStates.find(ds => ds.id === stageId);
        const colorName = stateConfig ? stateConfig.color.replace('bg-', '').replace('-500', '') : 'gray';
        return {
            stage: stageName,
            count: deals.filter(d => d.stato === stageId).length,
            color: stateConfig ? tailwindColorNameToHex(colorName) : tailwindColorNameToHex('gray')
        };
    }).filter(stage => stage.count > 0);


    // Performance radar per top commerciali
    const topCommercials = [...salesData].sort((a, b) => b.volume - a.volume).slice(0, 5);
    const radarData = topCommercials.map(commercial => ({
      commerciale: commercial.commerciale.split(' ')[0], // Solo nome
      volume: Math.max(...topCommercials.map(c => c.volume)) > 0 ? Math.round((commercial.volume / Math.max(...topCommercials.map(c => c.volume))) * 100) : 0,
      trattative: Math.max(...topCommercials.map(c => c.trattative)) > 0 ? Math.round((commercial.trattative / Math.max(...topCommercials.map(c => c.trattative))) * 100) : 0,
      tasso: commercial.tasso,
      acquisite: Math.max(...topCommercials.map(c => c.acquisite)) > 0 ? Math.round((commercial.acquisite / Math.max(...topCommercials.map(c => c.acquisite))) * 100) : 0,
    }));

    return { salesData, ramiData, pipelineData, monthlyTrends, funnelData, radarData };
  }, [deals]); // dealStates è costante, non serve qui

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
    volume: filteredDeals.filter(deal => deal.stato === state.id).reduce((sum, deal) => sum + (deal.totale || 0), 0)
  }));

  // Utility functions
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(value || 0); // Aggiunto fallback per undefined/NaN
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('it-IT');
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg text-sm">
          <p className="font-medium text-gray-800">{label}</p>
          {payload.map((entry, index) => {
            const isCurrency = entry.dataKey === 'volume' || 
                               entry.dataKey === 'totale' ||
                               entry.name?.toLowerCase().includes('volume'); // entry.name è il 'name' prop del Bar/Line etc.
            const valueSuffix = entry.dataKey === 'tasso' ? '%' : '';
            return (
              <p key={`tooltip-${index}-${entry.name}`} style={{ color: entry.color }} className="text-gray-700">
                {entry.name}: {isCurrency ? formatCurrency(entry.value) : entry.value}{valueSuffix}
              </p>
            );
          })}
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
    return (marzo || 0) + (giugno || 0) + (settembre || 0) + (dicembre || 0);
  };

  const handleSubmit = () => {
    if (!formData.ragioneSociale.trim() || !formData.commerciale || !formData.ramo) {
      alert('Compila tutti i campi obbligatori: Ragione Sociale, Commerciale, Ramo.');
      return;
    }

    const newDeal = {
      id: selectedDeal ? selectedDeal.id : uuidv4(), // Usa uuid per nuovi deal
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
      premi: deal.premi || { marzo: 0, giugno: 0, settembre: 0, dicembre: 0 }, // Fallback per premi
      note: deal.note || '',
      compagnia: deal.compagnia || ''
    });
    setShowForm(true);
  };

  const deleteDeal = (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questa trattativa? L\'azione è irreversibile.')) {
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

  // Funzioni Export/Import
  const exportData = () => {
    const dataToExport = {
      deals,
      exportDate: new Date().toISOString(),
      version: '1.1', // Incrementata versione per via delle modifiche (es. ID)
      appName: 'Sales Pipeline Manager',
      totalDeals: deals.length,
      statistics: stats
    };
    
    console.log('📤 Esportando dati:', dataToExport);
    
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `sales-pipeline-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert(`✅ Esportati ${deals.length} deals con successo!`);
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    console.log('📥 Importando file:', file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        console.log('📄 Dati importati:', importedData);
        
        if (importedData.deals && Array.isArray(importedData.deals)) {
          const dealsWithDates = importedData.deals.map(deal => ({
            ...deal,
            id: deal.id || uuidv4(), // Assicura ID unico, preferibilmente uuid
            dataCreazione: new Date(deal.dataCreazione),
            ultimaModifica: new Date(deal.ultimaModifica),
            premi: deal.premi || { marzo: 0, giugno: 0, settembre: 0, dicembre: 0 } // Fallback
          }));
          
          const confirmMessage = `📥 Importare ${dealsWithDates.length} trattative?\n\n` +
            `File: ${importedData.appName || 'Sales Pipeline'}\n` +
            `Data export: ${importedData.exportDate ? new Date(importedData.exportDate).toLocaleDateString('it-IT') : 'N/A'}\n` +
            `Versione: ${importedData.version || 'N/A'}\n\n` +
            `⚠️ I dati attuali (${deals.length} deals) verranno SOSTITUITI. Si consiglia un backup prima di procedere.`;
            
          if (window.confirm(confirmMessage)) {
            setDeals(dealsWithDates);
            setIsLoaded(true); // Assicura che il salvataggio automatico possa partire
            console.log(`✅ Importati ${dealsWithDates.length} deals`);
            alert(`✅ ${dealsWithDates.length} trattative importate con successo!`);
          }
        } else {
          alert('❌ File non valido. Assicurati di importare un backup JSON esportato da questa applicazione contenente un array "deals".');
        }
      } catch (error) {
        alert('❌ Errore nella lettura del file. Verifica che sia un file JSON valido e ben formattato.');
        console.error('Errore import:', error);
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  const clearAllData = () => {
    const confirmMessage = `🗑️ SEI ASSOLUTAMENTE SICURO di voler cancellare TUTTI i dati?\n\n` +
      `Questo cancellerà PERMANENTEMENTE:\n` +
      `• ${deals.length} trattative\n` +
      `• Tutte le statistiche e i dati di localStorage\n\n` +
      `💡 CONSIGLIO VIVAMENTE: fai prima un EXPORT come backup!\n\n` +
      `❌ QUESTA AZIONE È IRREVERSIBILE E NON PUÒ ESSERE ANNULLATA.`;
      
    if (window.confirm(confirmMessage)) {
      if (window.confirm("ULTIMA CONFERMA: Procedere con la cancellazione di tutti i dati?")) {
        localStorage.removeItem('salesPipeline_deals');
        setDeals([]);
        setFilterState('all');
        setFilterCommercial('all');
        // Potresti voler resettare altri stati qui se necessario
        alert('🗑️ Tutti i dati sono stati cancellati con successo.');
      } else {
        alert('Cancellazione annullata.');
      }
    } else {
        alert('Cancellazione annullata.');
    }
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
          <p className="text-gray-500 mb-6">Inizia creando la tua prima trattativa per vedere le analytics avanzate</p>
          <button
            onClick={() => {
              setCurrentView('pipeline'); // O direttamente 'deals' e poi setShowForm(true)
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
      )}
      
      {deals.length > 0 && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-white p-6 rounded-2xl shadow-lg" style={{background: 'linear-gradient(135deg, #667eea 0%, #5a6fd8 100%)'}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Volume Totale Pipeline</p>
                  <p className="text-3xl font-bold">{formatCurrency(stats.volumeTotale)}</p>
                </div>
                <Euro size={48} className="text-blue-200 opacity-75" />
              </div>
            </div>

            <div className="text-white p-6 rounded-2xl shadow-lg" style={{background: 'linear-gradient(135deg, #28a745 0%, #218838 100%)'}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Trattative Acquisite</p>
                  <p className="text-3xl font-bold">{stats.acquisite}</p>
                  <p className="text-sm mt-1">{stats.conversionRate}% di conversione</p>
                </div>
                <Award size={48} className="text-green-200 opacity-75" />
              </div>
            </div>

            <div className="text-white p-6 rounded-2xl shadow-lg" style={{background: 'linear-gradient(135deg, #764ba2 0%, #8b5cf6 100%)'}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Trattative Totali</p>
                  <p className="text-3xl font-bold">{stats.totale}</p>
                  <p className="text-sm mt-1">{stats.inCorso} in corso</p>
                </div>
                <Activity size={48} className="text-purple-200 opacity-75" />
              </div>
            </div>

            <div className="text-white p-6 rounded-2xl shadow-lg" style={{background: 'linear-gradient(135deg, #ff8c00 0%, #cc7000 100%)'}}> {/* Cambiato colore per distinguerlo */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Volume Acquisito</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.volumeAcquisito)}</p>
                  <p className="text-sm mt-1">Fatturato confermato</p>
                </div>
                <TrendingUp size={48} className="text-orange-200 opacity-75" />
              </div>
            </div>
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
                  <XAxis 
                    dataKey="commerciale" 
                    angle={-45}
                    textAnchor="end"
                    interval={0}
                    height={80} // Regolata altezza per etichette
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={value => selectedMetric === 'volume' ? formatCurrency(value) : (selectedMetric === 'tasso' ? `${value}%` : value)} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey={selectedMetric} 
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                    name={selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Stati Pipeline (Conteggio)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.pipelineData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="count" // Mostra il conteggio per stato
                    nameKey="stato"
                    labelLine={false}
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
                 {/* Ordinato per conteggio e mostra i primi 8 */}
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
              <h3 className="text-xl font-bold text-gray-900 mb-4">Radar Top 5 Commerciali (Performance Relativa)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={analyticsData.radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="commerciale" tick={{ fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} tick={{ fontSize: 10 }}/>
                  <Radar name="Volume Rel. (%)" dataKey="volume" stroke="#8884d8" fill="#8884d8" fillOpacity={0.4}/>
                  <Radar name="Trattative Rel. (%)" dataKey="trattative" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.4}/>
                  <Radar name="Acquisite Rel. (%)" dataKey="acquisite" stroke="#ffc658" fill="#ffc658" fillOpacity={0.4}/>
                  <Radar name="Tasso Conv. Abs." dataKey="tasso" stroke="#ff7300" fill="#ff7300" fillOpacity={0.4}/>
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
                  {[...analyticsData.salesData] // Crea una copia per non mutare l'originale
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
                {/* I pulsanti Export/Import/Reset sono già nell'header, qui solo un riepilogo */}
                 <span className="text-xs text-gray-500">Backup automatico locale. Export/Import disponibili nell'header.</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  // Pipeline Kanban View
  const PipelineView = () => (
    <div className="space-y-6">
      {deals.length === 0 && !showForm && ( // Nascondi empty state se il form è aperto
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="text-gray-400 mb-4"><Target size={64} className="mx-auto" /></div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Pipeline Vuota</h3>
          <p className="text-gray-500 mb-6">Inizia aggiungendo la tua prima trattativa per gestire il tuo sales pipeline.</p>
          <button
            onClick={() => setShowForm(true)}
            className="text-white px-6 py-2 rounded-lg inline-flex items-center gap-2 transform hover:scale-105 transition-all"
            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)' }}
          >
            <PlusCircle size={16} /> Aggiungi Trattativa
          </button>
        </div>
      )}

      {(deals.length > 0 || showForm) && ( // Mostra filtri e pipeline se ci sono deal o se il form è aperto (per coerenza UI)
        <>
          {/* Filtri e Pulsante Aggiungi */}
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-gray-600" />
                <span className="font-medium text-gray-700">Filtri:</span>
              </div>
              <select
                value={filterState}
                onChange={(e) => setFilterState(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">Tutti gli stati</option>
                {dealStates.map(state => (
                  <option key={`filter-state-${state.id}`} value={state.id}>{state.name}</option>
                ))}
              </select>
              <select
                value={filterCommercial}
                onChange={(e) => setFilterCommercial(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">Tutti i commerciali</option>
                {commerciali.map(commercial => (
                  <option key={`filter-commercial-${commercial}`} value={commercial}>{commercial}</option>
                ))}
              </select>
            </div>
             {!showForm && ( // Mostra "Nuova Trattativa" solo se il form non è già aperto
                <button
                  onClick={() => setShowForm(true)}
                  className="text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors transform hover:scale-105 text-sm"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.2)'
                  }}
                >
                  <PlusCircle size={16} />
                  Nuova Trattativa
                </button>
              )}
          </div>

          {/* Pipeline Kanban */}
          {deals.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"> {/* Aggiunto md:grid-cols-2 */}
              {dealsByState.map(state => (
                <div key={`state-col-${state.id}`} className="bg-white rounded-xl shadow-lg flex flex-col">
                  <div className={`${state.color} text-white p-4 rounded-t-xl`}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-base">{state.name}</h3>
                      <span className="bg-white bg-opacity-25 text-xs px-2 py-1 rounded-full">
                        {state.count}
                      </span>
                    </div>
                    {state.volume > 0 && (
                      <p className="text-xs opacity-90 mt-1">{formatCurrency(state.volume)}</p>
                    )}
                  </div>
                  
                  <div className="p-4 flex-grow max-h-[30rem] overflow-y-auto space-y-3"> {/* Aumentato max-h */}
                    {state.deals.map(deal => (
                      <div key={`deal-card-${deal.id}`} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow bg-white">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm text-gray-900 truncate flex-1 pr-2" title={deal.ragioneSociale}>
                            {deal.ragioneSociale}
                          </h4>
                          <div className="flex gap-1 ml-1 flex-shrink-0">
                            <button
                              onClick={() => editDeal(deal)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Modifica Trattativa"
                              aria-label="Modifica Trattativa"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => deleteDeal(deal.id)}
                              className="text-red-600 hover:text-red-800"
                              title="Elimina Trattativa"
                              aria-label="Elimina Trattativa"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="space-y-1 text-xs text-gray-600">
                          <div className="flex items-center gap-1.5" title={deal.commerciale}><User size={12} /><span className="truncate">{deal.commerciale}</span></div>
                          <div className="flex items-center gap-1.5"><Building2 size={12} /><span>{deal.ramo}</span></div>
                          {deal.totale > 0 && (
                            <div className="flex items-center gap-1.5"><Euro size={12} /><span className="font-medium text-green-700">{formatCurrency(deal.totale)}</span></div>
                          )}
                          <div className="flex items-center gap-1.5"><Calendar size={12} /><span>{formatDate(deal.ultimaModifica)}</span></div>
                        </div>
                        
                        {deal.note && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-xs border border-gray-100">
                            <div className="flex items-start gap-1.5">
                              <FileText size={12} className="text-gray-400 mt-0.5 flex-shrink-0" />
                              <p className="text-gray-600 line-clamp-2 hover:line-clamp-none" title={deal.note}>{deal.note}</p>
                            </div>
                          </div>
                        )}

                        {/* Quick Status Change */}
                        <div className="mt-3 pt-2 border-t border-gray-100">
                          <label className="text-xs text-gray-500 mb-1 block">Sposta a:</label>
                          <div className="flex flex-wrap gap-1">
                          {dealStates
                            .filter(s => s.id !== deal.stato && !['persa', 'senza_seguito', 'acquisita'].includes(s.id)) // Non mostrare stati finali se non è già lì
                            .slice(0, 3) // Mostra fino a 3 opzioni rapide
                            .map(newState => (
                            <button
                              key={`${deal.id}-quickmove-${newState.id}`}
                              onClick={() => updateDealState(deal.id, newState.id)}
                              className={`text-xs px-2 py-1 rounded transition-colors ${
                                tailwindColorNameToHex(newState.color.replace('bg-','').replace('-500','')) === '#EF4444' || tailwindColorNameToHex(newState.color.replace('bg-','').replace('-500','')) === '#6B7280'
                                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                                : 'text-white hover:opacity-80'
                              }`}
                              style={{backgroundColor: tailwindColorNameToHex(newState.color.replace('bg-','').replace('-500',''))}}
                              title={`Sposta a ${newState.name}`}
                            >
                              {newState.name}
                            </button>
                          ))}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {state.deals.length === 0 && (
                      <div className="text-center text-gray-400 py-8">
                        <p className="text-sm">Nessuna trattativa in questo stato.</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );

  // Deals List View
  const DealsView = () => (
    <div className="space-y-6">
      {deals.length === 0 && !showForm && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="text-gray-400 mb-4"><Building2 size={64} className="mx-auto" /></div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Nessuna Trattativa Registrata</h3>
          <p className="text-gray-500 mb-6">Non ci sono ancora trattative nel sistema. Creane una!</p>
          <button
            onClick={() => setShowForm(true)}
            className="text-white px-6 py-2 rounded-lg inline-flex items-center gap-2 transform hover:scale-105 transition-all"
            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)' }}
          >
            <PlusCircle size={16} /> Crea Trattativa
          </button>
        </div>
      )}

      {(deals.length > 0 || showForm) && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-900">Elenco Trattative ({filteredDeals.length})</h3>
            {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors transform hover:scale-105 text-sm"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.2)'
                  }}
                >
                  <PlusCircle size={16} />
                  Nuova Trattativa
                </button>
              )}
          </div>
          {deals.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Cliente / Compagnia</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Commerciale</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Ramo</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Stato</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider text-right">Volume (€)</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Ult. Mod.</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Azioni</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredDeals
                    .sort((a,b) => new Date(b.ultimaModifica) - new Date(a.ultimaModifica)) // Ordina per data ultima modifica
                    .map(deal => {
                    const state = dealStates.find(s => s.id === deal.stato);
                    return (
                      <tr key={`table-deal-${deal.id}`} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{deal.ragioneSociale}</div>
                          {deal.compagnia && (<div className="text-xs text-gray-500">{deal.compagnia}</div>)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-800">{deal.commerciale}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-800">{deal.ramo}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold text-white ${state?.color || 'bg-gray-500'}`}>
                            {state?.name || 'N/D'}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-800 text-right">
                          {deal.totale > 0 ? formatCurrency(deal.totale) : <span className="text-gray-400">-</span>}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-500 text-xs">
                          {formatDate(deal.ultimaModifica)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap font-medium">
                          <button
                            onClick={() => editDeal(deal)}
                            className="text-blue-600 hover:text-blue-800 mr-3"
                            title="Modifica" aria-label="Modifica Trattativa"
                          ><Edit size={16} /></button>
                          <button
                            onClick={() => deleteDeal(deal.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Elimina" aria-label="Elimina Trattativa"
                          ><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredDeals.length === 0 && (
                <p className="p-6 text-center text-gray-500">Nessuna trattativa corrisponde ai filtri selezionati.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex" style={{background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'}}> {/* Sfondo più neutro per il corpo */}
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:flex lg:flex-col`}
        style={{borderRight: '1px solid #e5e7eb'}}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h2 className="text-xl font-bold" style={{background: 'linear-gradient(45deg, #667eea, #764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Sales CRM</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
            aria-label="Chiudi sidebar"
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="mt-6 flex-grow">
          {navigationItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={`nav-${item.id}`}
                onClick={() => {
                  setCurrentView(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-6 py-3.5 text-left text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-white border-r-4' // Stile attivo più evidente
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                style={isActive ? {
                  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)', // Gradiente per attivo
                  borderColor: '#764ba2'
                } : {}}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'text-gray-500'}/>
                <span className={isActive ? 'text-white' : 'text-gray-700'}>{item.name}</span>
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-200 text-xs text-center text-gray-400">
            Versione 1.1.0
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden"> {/* Per header fisso e contenuto scrollabile */}
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200"> {/* Ridotto z-index */}
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
                aria-label="Apri menu"
              >
                <Menu size={24} />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">
                {navigationItems.find(item => item.id === currentView)?.name || 'Sales Dashboard'}
              </h1>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Pulsanti Export/Import/Reset sempre visibili se ci sono dati o per importare */}
                {deals.length > 0 && (
                  <button
                    onClick={exportData}
                    className="text-white px-3 py-2 rounded-lg flex items-center gap-1.5 text-xs sm:text-sm transition-colors transform hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #28a745 0%, #218838 100%)', boxShadow: '0 2px 8px rgba(40, 167, 69, 0.2)'}}
                    title="Esporta tutti i dati (Backup)"
                  >
                    <Download size={14} /> <span className="hidden sm:inline">Export</span>
                  </button>
                )}
                
                <label 
                  className="text-white px-3 py-2 rounded-lg flex items-center gap-1.5 text-xs sm:text-sm transition-colors cursor-pointer transform hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #ffc107 0%, #e0a800 100%)', boxShadow: '0 2px 8px rgba(255, 193, 7, 0.2)'}}
                  title="Importa dati da file JSON"
                >
                  <RefreshCw size={14} /> <span className="hidden sm:inline">Import</span>
                  <input type="file" accept=".json" onChange={importData} className="hidden" />
                </label>
                
                {deals.length > 0 && (
                  <button
                    onClick={clearAllData}
                    className="text-white px-3 py-2 rounded-lg flex items-center gap-1.5 text-xs sm:text-sm transition-colors transform hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)', boxShadow: '0 2px 8px rgba(220, 53, 69, 0.2)'}}
                    title="ATTENZIONE: Cancella tutti i dati"
                  >
                    <Trash2 size={14} /> <span className="hidden sm:inline">Reset</span>
                  </button>
                )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6"> {/* Sfondo per l'area contenuto */}
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'pipeline' && <PipelineView />}
          {currentView === 'deals' && <DealsView />}
        </main>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-scaleUp">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedDeal ? 'Modifica Trattativa' : 'Nuova Trattativa'}
              </h2>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="p-6 space-y-5 overflow-y-auto"> {/* Aumentato space-y */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="ragioneSociale" className="block text-sm font-medium text-gray-700 mb-1">Ragione Sociale *</label>
                  <input id="ragioneSociale" type="text" required value={formData.ragioneSociale} onChange={(e) => handleInputChange('ragioneSociale', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm" placeholder="Es. Acme Corp"/>
                </div>
                <div>
                  <label htmlFor="commerciale" className="block text-sm font-medium text-gray-700 mb-1">Commerciale *</label>
                  <select id="commerciale" required value={formData.commerciale} onChange={(e) => handleInputChange('commerciale', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm bg-white">
                    <option value="">-- Seleziona --</option>
                    {commerciali.map(c => (<option key={`form-comm-${c}`} value={c}>{c}</option>))}
                  </select>
                </div>
                <div>
                  <label htmlFor="ramo" className="block text-sm font-medium text-gray-700 mb-1">Ramo Assicurativo *</label>
                  <select id="ramo" required value={formData.ramo} onChange={(e) => handleInputChange('ramo', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm bg-white">
                    <option value="">-- Seleziona --</option>
                    {ramiAssicurativi.map(r => (<option key={`form-ramo-${r}`} value={r}>{r}</option>))}
                  </select>
                </div>
                <div>
                  <label htmlFor="stato" className="block text-sm font-medium text-gray-700 mb-1">Stato Trattativa</label>
                  <select id="stato" value={formData.stato} onChange={(e) => handleInputChange('stato', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm bg-white">
                    {dealStates.map(s => (<option key={`form-state-${s.id}`} value={s.id}>{s.name}</option>))}
                  </select>
                </div>
                <div className="md:col-span-2"> {/* Compagnia su tutta la larghezza se necessario */}
                  <label htmlFor="compagnia" className="block text-sm font-medium text-gray-700 mb-1">Compagnia (Opzionale)</label>
                  <input id="compagnia" type="text" value={formData.compagnia} onChange={(e) => handleInputChange('compagnia', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm" placeholder="Es. Generali S.p.A."/>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Premi Trimestrali (€)</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.keys(formData.premi).map(trimestre => (
                    <div key={`premio-input-${trimestre}`}>
                      <label htmlFor={`premio-${trimestre}`} className="block text-xs text-gray-600 mb-1 capitalize">{trimestre}</label>
                      <input id={`premio-${trimestre}`} type="number" min="0" step="0.01" value={formData.premi[trimestre]} onChange={(e) => handlePremioChange(trimestre, e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"/>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-sm text-gray-700 font-semibold">
                  Totale Annuo Stimato: {formatCurrency(calculateTotal())}
                </div>
              </div>

              <div>
                <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">Note (Opzionale)</label>
                <textarea id="note" value={formData.note} onChange={(e) => handleInputChange('note', e.target.value)} rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm" placeholder="Dettagli, appuntamenti, prossimi passi..."/>
              </div>
            
              <div className="flex gap-3 pt-3 border-t border-gray-200 mt-auto"> {/* Pulsanti in fondo */}
                <button
                  type="submit"
                  className="flex-1 text-white py-2.5 px-4 rounded-lg transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
                  style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', boxShadow: '0 4px 10px rgba(102, 126, 234, 0.3)'}}
                >
                  {selectedDeal ? 'Aggiorna Trattativa' : 'Crea Trattativa'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Annulla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Per animazioni semplici del modale
const GlobalStyles = () => (
  <style jsx global>{`
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes scaleUp {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
    .animate-scaleUp { animation: scaleUp 0.3s ease-out forwards; }
  `}</style>
);


export default function App() {
  return (
    <>
      <GlobalStyles />
      <UnifiedSalesPipeline />
    </>
  );
}