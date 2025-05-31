import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Menu, Download, RefreshCw, Trash2 } from 'lucide-react';

const navigationItemsConf = [ // Solo per il titolo, la navigazione è nella Sidebar
  { id: 'dashboard', name: 'Dashboard' },
  { id: 'pipeline', name: 'Pipeline' },
  { id: 'deals', name: 'Trattative' },
];

const Header = () => {
  const { 
    currentView, 
    setSidebarOpen, 
    deals, 
    exportData, 
    importData, 
    clearAllData 
  } = useContext(AppContext);

  const currentViewName = navigationItemsConf.find(item => item.id === currentView)?.name || 'Sales Dashboard';

  return (
    <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
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
            {currentViewName}
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {deals.length > 0 && (
            <button
              onClick={exportData}
              className="text-white px-3 py-2 rounded-lg flex items-center gap-1.5 text-xs sm:text-sm transition-colors transform hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #28a745 0%, #218838 100%)', boxShadow: '0 2px 8px rgba(40, 167, 69, 0.2)' }}
              title="Esporta tutti i dati (Backup)"
            >
              <Download size={14} /> <span className="hidden sm:inline">Export</span>
            </button>
          )}

          <label
            className="text-white px-3 py-2 rounded-lg flex items-center gap-1.5 text-xs sm:text-sm transition-colors cursor-pointer transform hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #ffc107 0%, #e0a800 100%)', boxShadow: '0 2px 8px rgba(255, 193, 7, 0.2)' }}
            title="Importa dati da file JSON"
          >
            <RefreshCw size={14} /> <span className="hidden sm:inline">Import</span>
            <input type="file" accept=".json" onChange={importData} className="hidden" />
          </label>

          {deals.length > 0 && (
            <button
              onClick={clearAllData}
              className="text-white px-3 py-2 rounded-lg flex items-center gap-1.5 text-xs sm:text-sm transition-colors transform hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)', boxShadow: '0 2px 8px rgba(220, 53, 69, 0.2)' }}
              title="ATTENZIONE: Cancella tutti i dati"
            >
              <Trash2 size={14} /> <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;