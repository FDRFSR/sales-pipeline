import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Building2, PlusCircle, Edit, Trash2 } from 'lucide-react';
// import { toast } from 'react-toastify'; // Per notifiche

const DealsView = () => {
  const { 
    deals,
    filteredDeals,
    showForm,
    setShowForm, 
    setSelectedDeal, 
    deleteDeal,
    DEAL_STATES
  } = useContext(AppContext);

  const handleEdit = (deal) => {
    setSelectedDeal(deal);
    setShowForm(true);
  };

  const handleDelete = (deal) => {
    deleteDeal(deal.id, deal.ragioneSociale);
  };

  if (deals.length === 0 && !showForm) {
    return (
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
    );
  }

  return (
    <div className="space-y-6">
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
                  .sort((a,b) => new Date(b.ultimaModifica) - new Date(a.ultimaModifica))
                  .map(deal => {
                  const stateInfo = DEAL_STATES.find(s => s.id === deal.stato);
                  return (
                    <tr key={`table-deal-${deal.id}`} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{deal.ragioneSociale}</div>
                        {deal.compagnia && (<div className="text-xs text-gray-500">{deal.compagnia}</div>)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-800">{deal.commerciale}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-800">{deal.ramo}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold text-white ${stateInfo?.color || 'bg-gray-500'}`}>
                          {stateInfo?.name || 'N/D'}
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
                          onClick={() => handleEdit(deal)}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                          title="Modifica" aria-label="Modifica Trattativa"
                        ><Edit size={16} /></button>
                        <button
                          onClick={() => handleDelete(deal)}
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
    </div>
  );
};

export default DealsView;