import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import DealCard from '../components/DealCard';
import { formatCurrency } from '../utils/formatters';
import { Filter, PlusCircle, Target } from 'lucide-react';

const PipelineView = () => {
  const { 
    deals,
    showForm,
    setShowForm, 
    filterState, 
    setFilterState, 
    filterCommercial, 
    setFilterCommercial,
    dealsByStateForKanban,
    DEAL_STATES,
    COMMERCIALI
  } = useContext(AppContext);

  if (deals.length === 0 && !showForm) {
    return (
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
    );
  }
  
  return (
    <div className="space-y-6">
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
            {DEAL_STATES.map(state => (
              <option key={`filter-state-${state.id}`} value={state.id}>{state.name}</option>
            ))}
          </select>
          <select
            value={filterCommercial}
            onChange={(e) => setFilterCommercial(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="all">Tutti i commerciali</option>
            {COMMERCIALI.map(commercial => (
              <option key={`filter-commercial-${commercial}`} value={commercial}>{commercial}</option>
            ))}
          </select>
        </div>
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

      {/* Pipeline Kanban */}
      {deals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dealsByStateForKanban.map(state => (
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
              
              <div className="p-4 flex-grow max-h-[30rem] overflow-y-auto space-y-3">
                {state.deals.map(deal => (
                  <DealCard key={`deal-card-${deal.id}`} deal={deal} />
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
    </div>
  );
};

export default PipelineView;