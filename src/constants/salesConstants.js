import { v4 as uuidv4 } from 'uuid'; // Assicurarsi che uuid sia installato

export const DEAL_STATES = [
  { id: 'da_visitare', name: 'Da Visitare', color: 'bg-blue-500', description: 'Cliente da incontrare ancora', isPositiveOutcome: false, isFinal: false },
  { id: 'visionato', name: 'Visionato', color: 'bg-yellow-500', description: 'Primo incontro fatto. Valutare possibili sviluppi', isPositiveOutcome: false, isFinal: false },
  { id: 'in_trattativa', name: 'In Trattativa', color: 'bg-orange-500', description: 'Cliente incontrato, in attesa documentazione', isPositiveOutcome: false, isFinal: false },
  { id: 'da_quotare', name: 'Da Quotare', color: 'bg-purple-500', description: 'Documentazione ricevuta, da preparare quotazione', isPositiveOutcome: false, isFinal: false },
  { id: 'quotato', name: 'Quotato', color: 'bg-indigo-500', description: 'Quotazioni presentate al cliente', isPositiveOutcome: false, isFinal: false },
  { id: 'acquisita', name: 'Acquisita', color: 'bg-green-500', description: 'Trattativa conclusa con successo', isPositiveOutcome: true, isFinal: true },
  { id: 'persa', name: 'Persa', color: 'bg-red-500', description: 'Trattativa non conclusa', isPositiveOutcome: false, isFinal: true },
  { id: 'senza_seguito', name: 'Senza Seguito', color: 'bg-gray-500', description: 'Cliente non interessato', isPositiveOutcome: false, isFinal: true }
];

export const COMMERCIALI = [
  'POLI MAURO', 'FUSARRI FEDERICO', 'CAMPAGNARO LEONARDO', 'DURANTE LUCA',
  'CORRADI VALERIA', 'LAZZAROTTO GIAMPAOLO', 'MARIGA LUCIO', 'MANFRIN CHRISTIAN',
  'PESCE MATTIA', 'RASIA RODOLFO', 'MAZZOLA LORENA', 'TONIOLO MAURIZIO',
  'ROMANO SIMONE', 'BASEGGIO LEONARDO'
];

export const RAMI_ASSICURATIVI = [
  'INCENDIO', 'INFORTUNI', 'ELETTRONICA', 'D&O', 'RCTO', 'SANITARIA',
  'PROFESSIONALE', 'TUTELA LEGALE', 'MULTIRISCHI', 'CONSULENZA', 'RCP',
  'FOTOVOLTAICO', 'DEO', 'CAR', 'POSTUMA', 'RCPRODOTTI', 'CONDOMINIO'
];

export const INITIAL_FORM_DATA = {
  ragioneSociale: '',
  commerciale: '',
  ramo: '',
  stato: 'da_visitare',
  premi: { marzo: 0, giugno: 0, settembre: 0, dicembre: 0 },
  note: '',
  compagnia: ''
};

export const createNewDealObject = (formData, selectedDeal) => ({
  id: selectedDeal ? selectedDeal.id : uuidv4(),
  ...formData,
  totale: (formData.premi.marzo || 0) + (formData.premi.giugno || 0) + (formData.premi.settembre || 0) + (formData.premi.dicembre || 0),
  dataCreazione: selectedDeal ? selectedDeal.dataCreazione : new Date(),
  ultimaModifica: new Date()
});