// Helper per mappare i nomi dei colori Tailwind a codici HEX
export const tailwindColorNameToHex = (colorName) => {
  const map = {
    blue: '#3B82F6', yellow: '#EAB308', orange: '#F97316',
    purple: '#8B5CF6', indigo: '#6366F1', green: '#10B981',
    red: '#EF4444', gray: '#6B7280',
    // Aggiungi altri colori se necessario
  };
  return map[colorName.toLowerCase()] || '#CCCCCC'; // Default grigio se non trovato
};

// Helper per generare un colore HSL deterministico da una stringa
export const stringToHslColor = (str, s = 70, l = 50) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash % 360); // Assicura h positivo
  return `hsl(${h}, ${s}%, ${l}%)`;
};