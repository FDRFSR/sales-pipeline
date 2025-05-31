import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { tailwindColorNameToHex } from '../utils/colors';
import { User, Building2, Euro, Calendar, FileText, Edit, Trash2 } from 'lucide-react';

const DealCard = ({ deal }) => {
  const { 
    DEAL_STATES, 
    setSelectedDeal, 
    setShowForm, 
    deleteDeal, 
    updateDealState 
  } = useContext(AppContext);

  const handleEdit = () => {
    setSelectedDeal(deal);
    setShowForm(true);
  };

  const handleDelete = () => {
    deleteDeal(deal.id, deal.ragioneSociale);
  };

  const handleQuickMove = (newStateId) => {
    updateDealState(deal.id, newStateId, deal.ragioneSociale);
  };

  const quickMoveOptions = DEAL_STATES
    .filter(s => s.id !== deal.stato && !s.isFinal) // Non mostrare stati finali se non è già lì
    .slice(0, 3);

  return (
    <div className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow bg-white">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-sm text-gray-900 truncate flex-1 pr-2" title={deal.ragioneSociale}>
          {deal.ragioneSociale}
        </h4>
        <div className="flex gap-1 ml-1 flex-shrink-0">
          <button
            onClick={handleEdit}
            className="text-blue-600 hover:text-blue-800"
            title="Modifica Trattativa"
            aria-label="Modifica Trattativa"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={handleDelete}
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

      {quickMoveOptions.length > 0 && (
        <div className="mt-3 pt-2 border-t border-gray-100">
          <label className="text-xs text-gray-500 mb-1 block">Sposta a:</label>
          <div className="flex flex-wrap gap-1">
            {quickMoveOptions.map(newState => {
                const colorHex = tailwindColorNameToHex(newState.color.replace('bg-','').replace('-500',''));
                const isNegativeOutcomeColor = ['#EF4444', '#6B7280'].includes(colorHex); // Red or Gray
                return (
                    <button
                        key={`${deal.id}-quickmove-${newState.id}`}
                        onClick={() => handleQuickMove(newState.id)}
                        className={`text-xs px-2 py-1 rounded transition-colors ${
                        isNegativeOutcomeColor
                            ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                            : 'text-white hover:opacity-80'
                        }`}
                        style={{backgroundColor: !isNegativeOutcomeColor ? colorHex : undefined }}
                        title={`Sposta a ${newState.name}`}
                    >
                        {newState.name}
                    </button>
                );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DealCard;