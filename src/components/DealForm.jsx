import React, { useContext, useEffect, useState } from 'react';
// Per usare react-hook-form: npm install react-hook-form
// import { useForm } from 'react-hook-form';
import { AppContext } from '../contexts/AppContext';
import { formatCurrency } from '../utils/formatters';
// import { toast } from 'react-toastify'; // Per le notifiche

const DealForm = () => {
  const { 
    setShowForm, 
    selectedDeal, 
    setSelectedDeal, 
    addDeal, 
    updateDeal,
    COMMERCIALI, 
    RAMI_ASSICURATIVI, 
    DEAL_STATES,
    INITIAL_FORM_DATA
  } = useContext(AppContext);

  // State locale per il form, se non si usa react-hook-form
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  useEffect(() => {
    if (selectedDeal) {
      setFormData({
        ragioneSociale: selectedDeal.ragioneSociale,
        commerciale: selectedDeal.commerciale,
        ramo: selectedDeal.ramo,
        stato: selectedDeal.stato,
        premi: selectedDeal.premi || { marzo: 0, giugno: 0, settembre: 0, dicembre: 0 },
        note: selectedDeal.note || '',
        compagnia: selectedDeal.compagnia || ''
      });
    } else {
      setFormData(INITIAL_FORM_DATA);
    }
  }, [selectedDeal, INITIAL_FORM_DATA]);

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
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.ragioneSociale.trim() || !formData.commerciale || !formData.ramo) {
      // toast.error('Compila Ragione Sociale, Commerciale e Ramo.');
      alert('Compila tutti i campi obbligatori: Ragione Sociale, Commerciale, Ramo.'); // Temporaneo
      return;
    }

    if (selectedDeal) {
      updateDeal(formData, selectedDeal);
    } else {
      addDeal(formData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setShowForm(false);
    setSelectedDeal(null);
  };

  // Esempio con react-hook-form (commentato):
  // const { register, handleSubmit: handleRHFSubmit, formState: { errors }, reset, setValue, watch } = useForm({
  //   defaultValues: INITIAL_FORM_DATA
  // });
  // useEffect(() => {
  //   if (selectedDeal) {
  //     reset({
  //       ...selectedDeal,
  //       premi: selectedDeal.premi || { marzo: 0, giugno: 0, settembre: 0, dicembre: 0 },
  //       note: selectedDeal.note || '',
  //       compagnia: selectedDeal.compagnia || ''
  //     });
  //   } else {
  //     reset(INITIAL_FORM_DATA);
  //   }
  // }, [selectedDeal, reset]);
  // const watchedPremi = watch("premi");
  // const calculateTotalRHF = () => {
  //   if (!watchedPremi) return 0;
  //   return (watchedPremi.marzo || 0) + (watchedPremi.giugno || 0) + (watchedPremi.settembre || 0) + (watchedPremi.dicembre || 0);
  // };
  // const onSubmitRHF = (data) => {
  //   if (selectedDeal) {
  //     updateDeal(data, selectedDeal);
  //   } else {
  //     addDeal(data);
  //   }
  //   closeForm();
  // };
  // const closeForm = () => {
  //   reset(INITIAL_FORM_DATA);
  //   setShowForm(false);
  //   setSelectedDeal(null);
  // }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-scaleUp">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {selectedDeal ? 'Modifica Trattativa' : 'Nuova Trattativa'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="ragioneSociale" className="block text-sm font-medium text-gray-700 mb-1">Ragione Sociale *</label>
              <input id="ragioneSociale" type="text" required value={formData.ragioneSociale} onChange={(e) => handleInputChange('ragioneSociale', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm" placeholder="Es. Acme Corp"/>
                {/* {errors.ragioneSociale && <span className="text-red-500 text-xs">Campo obbligatorio</span>} */}
            </div>
            <div>
              <label htmlFor="commerciale" className="block text-sm font-medium text-gray-700 mb-1">Commerciale *</label>
              <select id="commerciale" required value={formData.commerciale} onChange={(e) => handleInputChange('commerciale', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm bg-white">
                <option value="">-- Seleziona --</option>
                {COMMERCIALI.map(c => (<option key={`form-comm-${c}`} value={c}>{c}</option>))}
              </select>
              {/* {errors.commerciale && <span className="text-red-500 text-xs">Campo obbligatorio</span>} */}
            </div>
            <div>
              <label htmlFor="ramo" className="block text-sm font-medium text-gray-700 mb-1">Ramo Assicurativo *</label>
              <select id="ramo" required value={formData.ramo} onChange={(e) => handleInputChange('ramo', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm bg-white">
                <option value="">-- Seleziona --</option>
                {RAMI_ASSICURATIVI.map(r => (<option key={`form-ramo-${r}`} value={r}>{r}</option>))}
              </select>
              {/* {errors.ramo && <span className="text-red-500 text-xs">Campo obbligatorio</span>} */}
            </div>
            <div>
              <label htmlFor="stato" className="block text-sm font-medium text-gray-700 mb-1">Stato Trattativa</label>
              <select id="stato" value={formData.stato} onChange={(e) => handleInputChange('stato', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm bg-white">
                {DEAL_STATES.map(s => (<option key={`form-state-${s.id}`} value={s.id}>{s.name}</option>))}
              </select>
            </div>
            <div className="md:col-span-2">
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
        
          <div className="flex gap-3 pt-3 border-t border-gray-200 mt-auto">
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
  );
};

export default DealForm;