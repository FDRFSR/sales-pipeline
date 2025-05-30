# 📊 Sales Pipeline Manager

Un sistema completo per la gestione delle trattative assicurative con dashboard analytics avanzata, costruito con tecnologie moderne.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?logo=vite&logoColor=white) ![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white) ![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)

## ✨ Caratteristiche Principali

### 📈 **Dashboard Analytics Avanzata**
- **6 Grafici Professionali**: Bar, Pie, Line, Radar, Funnel, ComposedChart
- **KPI in Tempo Reale**: Volume, conversioni, performance
- **Trend Temporali**: Analisi ultimi 12 mesi
- **Top Performers**: Classifica commerciali

### 🎯 **Gestione Pipeline Completa**
- **Vista Kanban**: 8 stati trattativa (Da Visitare → Acquisita)
- **Form Avanzato**: Validazione, premi trimestrali, note
- **Quick Actions**: Cambio stato rapido
- **Filtri Dinamici**: Per stato e commerciale

### 💾 **Sistema Dati Robusto**
- **Salvataggio Automatico**: LocalStorage sicuro
- **Export/Import**: Backup JSON professionale
- **Zero Perdite**: Protezione anti-crash
- **Debug Logs**: Console dettagliata

### 🎨 **UI/UX Moderna**
- **Design Responsive**: Mobile-first
- **Tema Professionale**: Gradienti e animazioni
- **Sidebar Navigation**: Dashboard/Pipeline/Trattative
- **Dark Mode Ready**: Preparato per tema scuro

## 🚀 Installazione

### Prerequisiti
- **Node.js** >= 16.0.0
- **npm** >= 8.0.0

### Setup Rapido

```bash
# 1. Clona il repository
git clone https://github.com/yourusername/sales-pipeline-manager.git
cd sales-pipeline-manager

# 2. Installa dipendenze
npm install

# 3. Avvia server di sviluppo
npm run dev

# 4. Apri nel browser
# http://localhost:5173
```

### Build per Produzione

```bash
# Build ottimizzata
npm run build

# Preview build locale
npm run preview

# Deploy su Vercel/Netlify
npm run build && upload dist/
```

## 🛠️ Stack Tecnologico

### **Core Framework**
- **React 18** - UI Library moderna
- **Vite** - Build tool velocissimo
- **TypeScript** - Type safety

### **Styling & UI**
- **Tailwind CSS 3.4** - Utility-first CSS
- **Lucide React** - Icon library moderna
- **Responsive Design** - Mobile-first

### **Charts & Analytics**
- **Recharts** - Grafici React nativi
- **ComposedChart** - Grafici combinati
- **RadarChart** - Analisi multidimensionale

### **State & Storage**
- **React Hooks** - State management
- **LocalStorage** - Persistenza dati
- **JSON Export/Import** - Backup portatili

## 📊 Funzionalità Dettagliate

### **Dashboard Analytics**
```
✅ 4 KPI Cards dinamiche
✅ Performance commerciali (Bar Chart)
✅ Stati pipeline (Pie Chart)  
✅ Trend 12 mesi (Line + Bar)
✅ Performance per ramo (Horizontal Bar)
✅ Funnel conversione (Staged Bar)
✅ Radar top 5 commerciali (Radar Chart)
✅ Top performers table
```

### **Pipeline Management**
```
✅ 8 Stati trattativa configurabili
✅ Drag-free Kanban board
✅ Quick state transitions
✅ Volume tracking per stato
✅ Filtri real-time
✅ Empty states informativi
```

### **Gestione Dati**
```
✅ Form completo validazione
✅ Premi trimestrali
✅ Note e commenti
✅ Timestamp automatici
✅ Export JSON con metadati
✅ Import con validazione
✅ Reset sicuro dati
```

## 📱 Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x400/667eea/ffffff?text=Dashboard+Analytics)

### Pipeline Kanban
![Pipeline](https://via.placeholder.com/800x400/10b981/ffffff?text=Pipeline+Kanban)

### Grafici Avanzati
![Charts](https://via.placeholder.com/800x400/8b5cf6/ffffff?text=Advanced+Charts)

## 🔧 Configurazione

### **Personalizzazione Commerciali**
```javascript
// src/App.jsx - linea 45
const commerciali = [
  'TUO NOME',
  'COLLEGA 1', 
  'COLLEGA 2',
  // ... aggiungi i tuoi commerciali
];
```

### **Rami Assicurativi**
```javascript
// src/App.jsx - linea 52  
const ramiAssicurativi = [
  'INCENDIO',
  'MULTIRISCHI', 
  'TUO RAMO',
  // ... personalizza i rami
];
```

### **Stati Pipeline**
```javascript
// src/App.jsx - linea 28
const dealStates = [
  { id: 'tuo_stato', name: 'Tuo Stato', color: 'bg-blue-500' },
  // ... aggiungi stati personalizzati
];
```

## 📈 Metriche e KPI

### **KPI Tracciati**
- **Volume Totale**: Somma premi acquisiti
- **Trattative Acquisite**: Count deals chiuse
- **Conversion Rate**: % acquisite/totali
- **Volume Acquisito**: Fatturato confermato

### **Analytics Disponibili**
- **Performance per Commerciale**: Volume, trattative, tasso
- **Distribuzione per Ramo**: Count e acquisite per settore
- **Trend Temporale**: Andamento mensile ultimi 12 mesi
- **Funnel Conversione**: Percorso cliente step-by-step

## 💾 Gestione Dati

### **Export Dati**
```json
{
  "deals": [...],
  "exportDate": "2025-05-30T...",
  "version": "1.0",
  "appName": "Sales Pipeline Manager",
  "totalDeals": 42,
  "statistics": {...}
}
```

### **Import Sicuro**
- ✅ Validazione formato JSON
- ✅ Preview pre-import
- ✅ Backup automatico
- ✅ Rollback in caso errore

### **LocalStorage Schema**
```javascript
salesPipeline_deals: Deal[]
salesPipeline_filters: FilterState  
salesPipeline_currentView: ViewName
```

## 🧪 Testing

```bash
# Test componenti
npm run test

# Test coverage
npm run test:coverage

# Test E2E
npm run test:e2e
```

## 🚀 Deploy

### **Vercel (Raccomandato)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

### **Netlify**
```bash
# Build
npm run build

# Upload dist/ folder to Netlify
```

### **GitHub Pages**
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json
"scripts": {
  "deploy": "gh-pages -d dist"
}

# Deploy
npm run build && npm run deploy
```

## 🤝 Contribuire

### **Setup Sviluppo**
```bash
git clone https://github.com/yourusername/sales-pipeline-manager.git
cd sales-pipeline-manager
npm install
npm run dev
```

### **Guidelines**
- **Code Style**: Prettier + ESLint
- **Commits**: Conventional Commits
- **Branches**: feature/nome-feature
- **PR**: Template disponibile

### **Roadmap**
- [ ] Dark Mode
- [ ] PWA Support  
- [ ] Multi-language (i18n)
- [ ] Real-time sync
- [ ] Mobile App (React Native)
- [ ] AI Insights
- [ ] Team Collaboration
- [ ] Calendar Integration

## 📄 Licenza

Questo progetto è distribuito sotto licenza **MIT**. Vedi [LICENSE](LICENSE) per maggiori dettagli.

## 👨‍💻 Autore

**Sviluppato con ❤️ per il settore assicurativo**

- 📧 Email: iscrizioni.fusarri at gmail.com
- 🐙 GitHub: [@yourusername](https://github.com/FDRFSR)
- 💼 LinkedIn: [Il Tuo Profilo](https://linkedin.com/in/federico-fusarri)

## 🙏 Ringraziamenti

- **React Team** - Per il framework eccezionale
- **Tailwind Labs** - Per il CSS framework
- **Recharts Team** - Per i grafici React
- **Vite Team** - Per il build tool velocissimo

---

⭐ **Se questo progetto ti è stato utile, lascia una stella!** ⭐

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/sales-pipeline-manager?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/sales-pipeline-manager?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/sales-pipeline-manager)
![GitHub license](https://img.shields.io/github/license/yourusername/sales-pipeline-manager)

---

**🚀 Sales Pipeline Manager - Trasforma il tuo business assicurativo** 🚀