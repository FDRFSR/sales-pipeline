import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { BarChart3, Target, Building2, X } from 'lucide-react';

const navigationItems = [
  { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
  { id: 'pipeline', name: 'Pipeline', icon: Target },
  { id: 'deals', name: 'Trattative', icon: Building2 },
];

const Sidebar = () => {
  const { currentView, setCurrentView, sidebarOpen, setSidebarOpen } = useContext(AppContext);

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:flex lg:flex-col`}
      style={{ borderRight: '1px solid #e5e7eb' }}
    >
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <h2 className="text-xl font-bold" style={{ background: 'linear-gradient(45deg, #667eea, #764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Sales CRM</h2>
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
                setSidebarOpen(false); // Chiude la sidebar su mobile quando si clicca un item
              }}
              className={`w-full flex items-center gap-3 px-6 py-3.5 text-left text-sm font-medium transition-colors ${
                isActive
                  ? 'text-white border-r-4'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
              style={isActive ? {
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                borderColor: '#764ba2'
              } : {}}
            >
              <Icon size={20} className={isActive ? 'text-white' : 'text-gray-500'} />
              <span className={isActive ? 'text-white' : 'text-gray-700'}>{item.name}</span>
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-200 text-xs text-center text-gray-400">
        Versione 1.2.0
      </div>
    </div>
  );
};

export default Sidebar;