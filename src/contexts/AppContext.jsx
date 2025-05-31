import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DEAL_STATES, COMMERCIALI, RAMI_ASSICURATIVI, INITIAL_FORM_DATA, createNewDealObject } from '../constants/salesConstants';
import { tailwindColorNameToHex, stringToHslColor } from '../utils/colors';
// Per le notifiche, si dovrebbe installare una libreria come react-toastify
// import { toast } from 'react-toastify';
// Esempio di chiamate toast (commentate):
// toast.success('Azione completata!');
// toast.error('Errore!');
// window.confirm va sostituito con un modale di conferma custom o una libreria.

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [deals, setDeals] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [showForm, setShowForm] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  
  const [filterState, setFilterState] = useState('all');
  const [filterCommercial, setFilterCommercial] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('volume'); // Per il grafico performance commerciali

  // Carica dati all'avvio
  useEffect(() => {
    try {
      const savedDeals = localStorage.getItem('salesPipeline_deals');
      if (savedDeals) {
        const parsedDeals = JSON.parse(savedDeals);
        if (parsedDeals.length > 0) {
          const dealsWithDates = parsedDeals.map(deal => ({
            ...deal,
            id: deal.id || uuidv4(),
            dataCreazione: new Date(deal.dataCreazione),
            ultimaModifica: new Date(deal.ultimaModifica),
            premi: deal.premi || { marzo: 0, giugno: 0, settembre: 0, dicembre: 0 }
          }));
          setDeals(dealsWithDates);
        }
      }
    } catch (error) {
      console.error('Errore nel caricare i dati:', error);
      // toast.error('Errore nel caricare i dati dal localStorage.');
    }
    setIsLoaded(true);
  }, []);

  // Salva deals automaticamente
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('salesPipeline_deals', JSON.stringify(deals));
        console.log(`💾 Salvati ${deals.length} deals nel localStorage`);
      } catch (error) {
        console.error('Errore nel salvare i dati:', error);
        // toast.error('Errore nel salvare i dati nel localStorage.');
      }
    }
  }, [deals, isLoaded]);

  const addDeal = useCallback((formData) => {
    const newDeal = createNewDealObject(formData, null);
    setDeals(prev => [...prev, newDeal]);
    // toast.success(`Trattativa "${newDeal.ragioneSociale}" creata!`);
  }, []);

  const updateDeal = useCallback((formData, dealToUpdate) => {
    const updatedDeal = createNewDealObject(formData, dealToUpdate);
    setDeals(prev => prev.map(deal => deal.id === dealToUpdate.id ? updatedDeal : deal));
    // toast.success(`Trattativa "${updatedDeal.ragioneSociale}" aggiornata!`);
  }, []);
  
  const deleteDeal = useCallback((id, dealName) => {
    // Sostituire con un modale di conferma
    if (window.confirm(`Sei sicuro di voler eliminare la trattativa "${dealName}"? L'azione è irreversibile.`)) {
      setDeals(prev => prev.filter(deal => deal.id !== id));
      // toast.success(`Trattativa "${dealName}" eliminata.`);
    }
  }, []);

  const updateDealState = useCallback((dealId, newState, dealName) => {
    setDeals(prev => prev.map(deal => 
      deal.id === dealId 
        ? { ...deal, stato: newState, ultimaModifica: new Date() }
        : deal
    ));
    const stateName = DEAL_STATES.find(s => s.id === newState)?.name || newState;
    // toast.info(`Trattativa "${dealName}" spostata a "${stateName}".`);
  }, []);

  const exportData = useCallback(() => {
    const dataToExport = {
      deals,
      exportDate: new Date().toISOString(),
      version: '1.2.0', // Versione aggiornata per riflettere refactoring
      appName: 'Sales Pipeline Manager',
      totalDeals: deals.length,
    };
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
    // toast.success(`Esportati ${deals.length} deals con successo!`);
    alert(`✅ Esportati ${deals.length} deals con successo!`); // Temporaneo
  }, [deals]);

  const importData = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        if (importedData.deals && Array.isArray(importedData.deals)) {
          const dealsWithDates = importedData.deals.map(deal => ({
            ...deal,
            id: deal.id || uuidv4(),
            dataCreazione: new Date(deal.dataCreazione),
            ultimaModifica: new Date(deal.ultimaModifica),
            premi: deal.premi || { marzo: 0, giugno: 0, settembre: 0, dicembre: 0 }
          }));
          
          const confirmMessage = `📥 Importare ${dealsWithDates.length} trattative?\n` +
            `File: ${importedData.appName || 'Sales Pipeline'}\n` +
            `Data export: ${importedData.exportDate ? new Date(importedData.exportDate).toLocaleDateString('it-IT') : 'N/A'}\n` +
            `Versione: ${importedData.version || 'N/A'}\n\n` +
            `⚠️ I dati attuali (${deals.length} deals) verranno SOSTITUITI. Si consiglia un backup prima di procedere.`;
            
          // Sostituire con un modale di conferma
          if (window.confirm(confirmMessage)) {
            setDeals(dealsWithDates);
            setIsLoaded(true); 
            // toast.success(`${dealsWithDates.length} trattative importate con successo!`);
            alert(`✅ ${dealsWithDates.length} trattative importate con successo!`); // Temporaneo
          }
        } else {
          // toast.error('File non valido. Array "deals" mancante.');
          alert('❌ File non valido. Assicurati di importare un backup JSON esportato da questa applicazione contenente un array "deals".'); // Temporaneo
        }
      } catch (error) {
        // toast.error('Errore nella lettura del file JSON.');
        alert('❌ Errore nella lettura del file. Verifica che sia un file JSON valido e ben formattato.'); // Temporaneo
        console.error('Errore import:', error);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }, [deals.length]);

  const clearAllData = useCallback(() => {
    const confirmMessage = `🗑️ SEI ASSOLUTAMENTE SICURO di voler cancellare TUTTI i dati?\n\n` +
      `Questo cancellerà PERMANENTEMENTE:\n` +
      `• ${deals.length} trattative\n` +
      `• Tutte le statistiche e i dati di localStorage\n\n` +
      `💡 CONSIGLIO VIVAMENTE: fai prima un EXPORT come backup!\n\n` +
      `❌ QUESTA AZIONE È IRREVERSIBILE E NON PUÒ ESSERE ANNULLATA.`;
      
    // Sostituire con un modale di conferma
    if (window.confirm(confirmMessage)) {
      if (window.confirm("ULTIMA CONFERMA: Procedere con la cancellazione di tutti i dati?")) {
        localStorage.removeItem('salesPipeline_deals');
        setDeals([]);
        setFilterState('all');
        setFilterCommercial('all');
        setCurrentView('dashboard'); // Torna alla dashboard
        // toast.warn('Tutti i dati sono stati cancellati con successo.');
        alert('🗑️ Tutti i dati sono stati cancellati con successo.'); // Temporaneo
      } else {
        // toast.info('Cancellazione annullata.');
         alert('Cancellazione annullata.'); // Temporaneo
      }
    } else {
        // toast.info('Cancellazione annullata.');
        alert('Cancellazione annullata.'); // Temporaneo
    }
  }, [deals.length]);

  // Calcola statistiche principali
  const stats = useMemo(() => {
    const totale = deals.length;
    const acquisite = deals.filter(d => d.stato === 'acquisita').length;
    const inCorso = deals.filter(d => DEAL_STATES.find(s => s.id === d.stato && !s.isFinal)).length;
    const volumeTotale = deals.reduce((sum, deal) => sum + (deal.totale || 0), 0);
    const volumeAcquisito = deals.filter(d => d.stato === 'acquisita').reduce((sum, deal) => sum + (deal.totale || 0), 0);
    const conversionRate = totale > 0 ? ((acquisite / totale) * 100).toFixed(1) : 0;
    
    return { totale, acquisite, inCorso, volumeTotale, volumeAcquisito, conversionRate };
  }, [deals]);

  // Dati per analytics avanzate
  const analyticsData = useMemo(() => {
    const salesData = COMMERCIALI.map(commerciale => {
      const dealsByCommercial = deals.filter(d => d.commerciale === commerciale);
      const acquisite = dealsByCommercial.filter(d => d.stato === 'acquisita');
      const volume = acquisite.reduce((sum, deal) => sum + (deal.totale || 0), 0);
      const tasso = dealsByCommercial.length > 0 ? ((acquisite.length / dealsByCommercial.length) * 100) : 0;
      return { commerciale, trattative: dealsByCommercial.length, volume, acquisite: acquisite.length, tasso: parseFloat(tasso.toFixed(1)) };
    }).filter(data => data.trattative > 0);

    const ramiData = RAMI_ASSICURATIVI.map(ramo => {
      const dealsByRamo = deals.filter(d => d.ramo === ramo);
      const acquisite = dealsByRamo.filter(d => d.stato === 'acquisita');
      const volume = acquisite.reduce((sum, deal) => sum + (deal.totale || 0), 0);
      return { ramo, count: dealsByRamo.length, acquisite: acquisite.length, volume, tasso: dealsByRamo.length > 0 ? parseFloat(((acquisite.length / dealsByRamo.length) * 100).toFixed(1)) : 0, color: stringToHslColor(ramo) };
    }).filter(data => data.count > 0);

    const pipelineData = DEAL_STATES.map(state => {
      const dealsByState = deals.filter(d => d.stato === state.id);
      const volume = dealsByState.reduce((sum, deal) => sum + (deal.totale || 0), 0);
      const colorName = state.color.replace('bg-', '').replace('-500', '');
      return { stato: state.name, count: dealsByState.length, volume, color: tailwindColorNameToHex(colorName) };
    }).filter(data => data.count > 0);

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
      monthlyTrends.push({ mese: monthName, trattative: monthDeals.length, acquisite: acquisite.length, volume, tasso: monthDeals.length > 0 ? parseFloat(((acquisite.length / monthDeals.length) * 100).toFixed(1)) : 0 });
    }

    const funnelStagesMap = { 'Da Visitare': 'da_visitare', 'Visionato': 'visionato', 'In Trattativa': 'in_trattativa', 'Da Quotare': 'da_quotare', 'Quotato': 'quotato', 'Acquisita': 'acquisita' };
    const funnelData = Object.entries(funnelStagesMap).map(([stageName, stageId]) => {
        const stateConfig = DEAL_STATES.find(ds => ds.id === stageId);
        const colorName = stateConfig ? stateConfig.color.replace('bg-', '').replace('-500', '') : 'gray';
        return { stage: stageName, count: deals.filter(d => d.stato === stageId).length, color: stateConfig ? tailwindColorNameToHex(colorName) : tailwindColorNameToHex('gray') };
    }).filter(stage => stage.count > 0);

    const topCommercials = [...salesData].sort((a, b) => b.volume - a.volume).slice(0, 5);
    const maxMetrics = {
      volume: Math.max(...topCommercials.map(c => c.volume), 1), // Evita divisione per 0
      trattative: Math.max(...topCommercials.map(c => c.trattative), 1),
      acquisite: Math.max(...topCommercials.map(c => c.acquisite), 1),
    };
    const radarData = topCommercials.map(commercial => ({
      commerciale: commercial.commerciale.split(' ')[0],
      volume: Math.round((commercial.volume / maxMetrics.volume) * 100),
      trattative: Math.round((commercial.trattative / maxMetrics.trattative) * 100),
      tasso: commercial.tasso,
      acquisite: Math.round((commercial.acquisite / maxMetrics.acquisite) * 100),
    }));

    return { salesData, ramiData, pipelineData, monthlyTrends, funnelData, radarData };
  }, [deals]);

  const filteredDeals = useMemo(() => {
    return deals.filter(deal => {
      const stateMatch = filterState === 'all' || deal.stato === filterState;
      const commercialMatch = filterCommercial === 'all' || deal.commerciale === filterCommercial;
      return stateMatch && commercialMatch;
    });
  }, [deals, filterState, filterCommercial]);

  const dealsByStateForKanban = useMemo(() => {
    return DEAL_STATES.map(state => ({
      ...state,
      deals: filteredDeals.filter(deal => deal.stato === state.id),
      count: filteredDeals.filter(deal => deal.stato === state.id).length,
      volume: filteredDeals.filter(deal => deal.stato === state.id).reduce((sum, deal) => sum + (deal.totale || 0), 0)
    }));
  }, [filteredDeals]);


  const value = {
    deals,
    setDeals, // Potrebbe non essere esposto direttamente se si usa add/update/delete
    addDeal,
    updateDeal,
    deleteDeal,
    updateDealState,
    exportData,
    importData,
    clearAllData,
    currentView,
    setCurrentView,
    sidebarOpen,
    setSidebarOpen,
    showForm,
    setShowForm,
    selectedDeal,
    setSelectedDeal,
    filterState,
    setFilterState,
    filterCommercial,
    setFilterCommercial,
    selectedMetric,
    setSelectedMetric,
    stats,
    analyticsData,
    filteredDeals,
    dealsByStateForKanban,
    // Costanti (per comodità, così i componenti non devono importarle di nuovo)
    DEAL_STATES,
    COMMERCIALI,
    RAMI_ASSICURATIVI,
    INITIAL_FORM_DATA,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};