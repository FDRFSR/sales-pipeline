import React, { useContext } from 'react';
import { AppProvider, AppContext } from './contexts/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DealForm from './components/DealForm';
import GlobalStyles from './components/GlobalStyles';

import DashboardView from './views/DashboardView';
import PipelineView from './views/PipelineView';
import DealsView from './views/DealsView';

// Potrebbe essere necessario installare:
// npm install uuid
// yarn add uuid
// npm install lucide-react recharts
// yarn add lucide-react recharts
// Per notifiche migliori (opzionale):
// npm install react-toastify
// yarn add react-toastify
// Per form handling avanzato (opzionale, per DealForm.jsx):
// npm install react-hook-form
// yarn add react-hook-form


const AppContent = () => {
  const { currentView, showForm } = useContext(AppContext);

  return (
    <div className="min-h-screen flex" style={{background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'}}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'pipeline' && <PipelineView />}
          {currentView === 'deals' && <DealsView />}
        </main>
      </div>
      {showForm && <DealForm />}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <GlobalStyles />
      {/* Per le notifiche toast, si aggiungerebbe <ToastContainer /> qui, dopo averla importata */}
      <AppContent />
    </AppProvider>
  );
}