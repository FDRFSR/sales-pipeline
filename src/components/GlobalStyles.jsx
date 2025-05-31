import React from 'react';

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

export default GlobalStyles;