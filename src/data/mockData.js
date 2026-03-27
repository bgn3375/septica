// Categorii ierarhice
export const categories = [
  { id: '1', name: 'Echipa', subcategories: [
    { id: '1.1', name: 'Salarii' },
    { id: '1.2', name: 'Bonusuri' },
    { id: '1.3', name: 'Beneficii' },
  ]},
  { id: '2', name: 'Operațional', subcategories: [
    { id: '2.1', name: 'Chirie birou' },
    { id: '2.2', name: 'Utilități' },
    { id: '2.3', name: 'Internet & Telefonie' },
  ]},
  { id: '3', name: 'Marketing', subcategories: [
    { id: '3.1', name: 'Advertising' },
    { id: '3.2', name: 'Social Media' },
    { id: '3.3', name: 'Events' },
  ]},
  { id: '4', name: 'Software & Tools', subcategories: [
    { id: '4.1', name: 'Licențe' },
    { id: '4.2', name: 'Cloud / Hosting' },
    { id: '4.3', name: 'SaaS Subscriptions' },
  ]},
  { id: '5', name: 'Legal & Contabilitate', subcategories: [
    { id: '5.1', name: 'Contabilitate' },
    { id: '5.2', name: 'Juridic' },
    { id: '5.3', name: 'Audit' },
  ]},
  { id: '6', name: 'Travel & Transport', subcategories: [
    { id: '6.1', name: 'Deplasări' },
    { id: '6.2', name: 'Cazare' },
    { id: '6.3', name: 'Transport local' },
  ]},
];

// Flatten categories for dropdown
export const flatCategories = categories.flatMap(cat =>
  cat.subcategories.map(sub => ({
    id: sub.id,
    name: `${cat.name} > ${sub.name}`,
    parentId: cat.id,
    parentName: cat.name,
    subName: sub.name,
  }))
);

// Furnizori
export const suppliers = [
  'CloudFlare SRL', 'Google Romania', 'Amazon Web Services', 'Adobe Systems',
  'Telekom Romania', 'Dedeman SRL', 'Enel Energie', 'Vodafone Romania',
  'ING Bank', 'BCR', 'Slack Technologies', 'Figma Inc', 'Vercel Inc',
  'DigitalOcean', 'Stripe Inc', 'Notion Labs', 'Linear App',
  'WeWork Romania', 'Regus Business', 'ANAF', 'Camera de Comerț',
];

// Cheltuieli mock
export const initialExpenses = [
  { id: 1, date: new Date(2025, 0, 5), supplier: 'WeWork Romania', invoiceNumber: 'FAC-2025-001', description: 'Chirie birou Ianuarie 2025', amount: 8500, type: '2.1', currency: 'EUR', status: 'Plătit', operator: 'Bogdan' },
  { id: 2, date: new Date(2025, 0, 10), supplier: 'Telekom Romania', invoiceNumber: 'FAC-2025-002', description: 'Internet dedicat birou', amount: 450, type: '2.3', currency: 'RON', status: 'Plătit', operator: 'Bogdan' },
  { id: 3, date: new Date(2025, 0, 15), supplier: 'Google Romania', invoiceNumber: 'FAC-2025-003', description: 'Google Workspace Business licențe echipa', amount: 1200, type: '4.1', currency: 'EUR', status: 'Plătit', operator: 'Ana' },
  { id: 4, date: new Date(2025, 0, 20), supplier: 'Adobe Systems', invoiceNumber: 'FAC-2025-004', description: 'Creative Cloud Team', amount: 2800, type: '4.3', currency: 'EUR', status: 'Neplătit', operator: 'Bogdan' },
  { id: 5, date: new Date(2025, 1, 3), supplier: 'WeWork Romania', invoiceNumber: 'FAC-2025-005', description: 'Chirie birou Februarie 2025', amount: 8500, type: '2.1', currency: 'EUR', status: 'Plătit', operator: 'Bogdan' },
  { id: 6, date: new Date(2025, 1, 8), supplier: 'Figma Inc', invoiceNumber: 'FAC-2025-006', description: 'Figma Organization plan', amount: 960, type: '4.3', currency: 'EUR', status: 'Plătit', operator: 'Ana' },
  { id: 7, date: new Date(2025, 1, 14), supplier: 'Slack Technologies', invoiceNumber: 'FAC-2025-007', description: 'Slack Pro annual', amount: 1680, type: '4.3', currency: 'EUR', status: 'Plătit', operator: 'Bogdan' },
  { id: 8, date: new Date(2025, 1, 20), supplier: 'Amazon Web Services', invoiceNumber: 'FAC-2025-008', description: 'AWS infrastructure Feb', amount: 3200, type: '4.2', currency: 'EUR', status: 'Neplătit', operator: 'Ana' },
  { id: 9, date: new Date(2025, 2, 1), supplier: 'ANAF', invoiceNumber: 'FAC-2025-009', description: 'Impozite și taxe Q1', amount: 15600, type: '5.1', currency: 'RON', status: 'Plătit', operator: 'Bogdan' },
  { id: 10, date: new Date(2025, 2, 5), supplier: 'WeWork Romania', invoiceNumber: 'FAC-2025-010', description: 'Chirie birou Martie 2025', amount: 8500, type: '2.1', currency: 'EUR', status: 'Plătit', operator: 'Bogdan' },
  { id: 11, date: new Date(2025, 2, 12), supplier: 'Enel Energie', invoiceNumber: 'FAC-2025-011', description: 'Utilități electrice birou', amount: 1890, type: '2.2', currency: 'RON', status: 'Neplătit', operator: 'Ana' },
  { id: 12, date: new Date(2025, 2, 18), supplier: 'Linear App', invoiceNumber: 'FAC-2025-012', description: 'Linear project management', amount: 480, type: '4.3', currency: 'EUR', status: 'Plătit', operator: 'Bogdan' },
  { id: 13, date: new Date(2025, 2, 22), supplier: 'Vercel Inc', invoiceNumber: 'FAC-2025-013', description: 'Vercel Pro hosting', amount: 240, type: '4.2', currency: 'EUR', status: 'Plătit', operator: 'Ana' },
  { id: 14, date: new Date(2025, 2, 28), supplier: 'Camera de Comerț', invoiceNumber: 'FAC-2025-014', description: 'Taxa anuală registru comerț', amount: 320, type: '5.2', currency: 'RON', status: 'Plătit', operator: 'Bogdan' },
  { id: 15, date: new Date(2025, 3, 2), supplier: 'WeWork Romania', invoiceNumber: 'FAC-2025-015', description: 'Chirie birou Aprilie 2025', amount: 8500, type: '2.1', currency: 'EUR', status: 'Neplătit', operator: 'Bogdan' },
];

// Deconturi recurente
export const initialRecurring = [
  { id: 1, name: 'Chirie birou', supplier: 'WeWork Romania', description: 'Chirie lunară birou central', amount: 8500, currency: 'EUR', paymentDay: 5, category: '2.1', isActive: true, tipDecont: 'Recurent' },
  { id: 2, name: 'Internet birou', supplier: 'Telekom Romania', description: 'Conexiune internet dedicată', amount: 450, currency: 'RON', paymentDay: 10, category: '2.3', isActive: true, tipDecont: 'Recurent' },
  { id: 3, name: 'Google Workspace', supplier: 'Google Romania', description: 'Licențe Google Workspace Business', amount: 1200, currency: 'EUR', paymentDay: 15, category: '4.1', isActive: true, tipDecont: 'Recurent' },
  { id: 4, name: 'Adobe Creative Cloud', supplier: 'Adobe Systems', description: 'Creative Cloud Team licenses', amount: 2800, currency: 'EUR', paymentDay: 20, category: '4.3', isActive: false, tipDecont: 'Final' },
  { id: 5, name: 'AWS Infrastructure', supplier: 'Amazon Web Services', description: 'Cloud infrastructure hosting', amount: 3200, currency: 'EUR', paymentDay: 1, category: '4.2', isActive: true, tipDecont: 'Recurent' },
  { id: 6, name: 'Slack Pro', supplier: 'Slack Technologies', description: 'Slack Pro annual plan, facturare lunară', amount: 140, currency: 'EUR', paymentDay: 14, category: '4.3', isActive: true, tipDecont: 'Recurent' },
  { id: 7, name: 'Contabilitate', supplier: 'ANAF', description: 'Servicii contabilitate lunare', amount: 3500, currency: 'RON', paymentDay: 25, category: '5.1', isActive: true, tipDecont: 'Recurent' },
];

// Venituri mock data — 24 luni (12 pentru 2024, 12 pentru 2025)
// Pierderi în Mar, Oct, Nov (cheltuieli > venituri)
export const initialVenituri = [
  // 2024: Ian-Dec
  45000, 48000, 45000, 58000, 62000, 65000, 70000, 62000, 64000, 75000, 50000, 72000,
  // 2025: Ian-Dec
  48600, 52488, 48000, 63478, 68510, 70785, 76650, 66199, 67968, 80000, 55000, 78000,
];

// Budget mock (doar 2025)
export const budgetData2025 = [
  50000, 55000, 52000, 60000, 65000, 70000, 75000, 68000, 70000, 82000, 58000, 80000,
];

// Month labels
export const monthLabels = ['IAN', 'FEB', 'MAR', 'APR', 'MAI', 'IUN', 'IUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

// Fiscal year month labels (Aug-Aug for FY display)
export const fyMonthLabels = ['AUG', 'SEP', 'OCT', 'NOV', 'DEC', 'IAN', 'FEB', 'MAR', 'APR', 'MAI', 'IUN', 'IUL', 'AUG'];

// ─── Decont Form Data ───

// Furnizori autocomplete (din Figma brief)
export const decontSuppliers = [
  { name: 'Engie Romania', cui: 'RO13469527' },
  { name: 'Enel Energie', cui: 'RO14558837' },
  { name: 'Orange Romania', cui: 'RO9010105' },
  { name: 'Slack Technologies', cui: '' },
  { name: 'Vodafone Romania', cui: 'RO11635310' },
  { name: 'Telekom Romania', cui: 'RO427320' },
  { name: 'Microsoft Romania', cui: 'RO11898005' },
  { name: 'Google Ireland Limited', cui: 'IE6388047V' },
  { name: 'Adobe Systems Software', cui: '' },
  { name: 'Dropbox International', cui: '' },
  { name: 'Zoom Video Communications', cui: '' },
  { name: 'eMag SRL', cui: 'RO14399840' },
  { name: 'Kaufland Romania', cui: 'RO18014862' },
  { name: 'Mega Image SRL', cui: 'RO6719278' },
  { name: 'Carrefour Romania', cui: 'RO11588780' },
  { name: 'Expert Conta SRL', cui: 'RO32145678' },
  { name: 'OpenAI OpCo LLC', cui: '' },
  { name: 'IKEA Business Romania', cui: 'RO17685498' },
  { name: 'Construct & Renovate SRL', cui: 'RO41234567' },
  { name: 'Trattoria Il Calcio', cui: 'RO18765432' },
  { name: 'Office Depot Romania', cui: 'RO15432198' },
  { name: 'Fan Courier SA', cui: 'RO15452783' },
  { name: 'Starbucks Romania', cui: 'RO22334455' },
];

// Conturi P&L
export const conturiPL = [
  { id: '601', name: '601 - Cheltuieli cu materiile prime', subconturi: [
    'Materii prime', 'Materiale auxiliare', 'Combustibil', 'Piese schimb',
  ]},
  { id: '605', name: '605 - Cheltuieli cu energia și apa', subconturi: [
    'Energie electrică', 'Gaze naturale', 'Apă și canalizare', 'Energie termică',
  ]},
  { id: '641', name: '641 - Cheltuieli cu personalul', subconturi: [
    'Salarii', 'Bonusuri', 'Contribuții sociale', 'Tichete de masă',
  ]},
  { id: '628', name: '628 - Cheltuieli administrative', subconturi: [
    'Papetărie', 'Curățenie', 'Poștă și curierat', 'Asigurări', 'Abonamente',
  ]},
  { id: '611', name: '611 - Cheltuieli cu serviciile', subconturi: [
    'Consultanță', 'IT & Software', 'Contabilitate', 'Juridic', 'Marketing',
  ]},
  { id: '625', name: '625 - Cheltuieli cu deplasările', subconturi: [
    'Transport', 'Cazare', 'Diurnă', 'Bilete avion', 'Taxi & rideshare',
  ]},
];

// Luna P&L options
export const luniPL = [
  'Ianuarie 2025', 'Februarie 2025', 'Martie 2025', 'Aprilie 2025',
  'Mai 2025', 'Iunie 2025', 'Iulie 2025', 'August 2025',
  'Septembrie 2025', 'Octombrie 2025', 'Noiembrie 2025', 'Decembrie 2025',
  'Ianuarie 2026', 'Februarie 2026', 'Martie 2026',
];

// ─── Mock Deconturi (submitted expense reports) ───
export const initialDeconturi = [
  {
    id: 1, idBono: 'BN-2026-001', dataIncarcarii: '2026-01-15T10:00:00',
    tip: 'Factură', platit: true, aprobat: true, status: 'F',
    furnizorNume: 'Expert Conta SRL', furnizorCUI: 'RO32145678',
    numarDocument: 'FAC-2026-001', dataDocument: '2026-01-10',
    descriere: 'Servicii contabilitate - Trimestrul 4 2025',
    cont: '611', subcont: 'Contabilitate', lunaPL: 'Ianuarie 2026',
    tvaDeductibil: true, sumaCuTVA: 4165, sumaFaraTVA: 3500, tvaRate: 19, tvaAmount: 665,
    valuta: 'RON', tags: '#contabilitate #Q4',
  },
  {
    id: 2, idBono: 'BN-2026-002', dataIncarcarii: '2026-01-20T14:30:00',
    tip: 'Factură', platit: true, aprobat: true, status: 'F',
    furnizorNume: 'Engie Romania', furnizorCUI: 'RO13469527',
    numarDocument: 'FAC-2026-002', dataDocument: '2026-01-18',
    descriere: 'Gaze naturale birou - Ianuarie 2026',
    cont: '605', subcont: 'Gaze naturale', lunaPL: 'Ianuarie 2026',
    tvaDeductibil: true, sumaCuTVA: 1785, sumaFaraTVA: 1500, tvaRate: 19, tvaAmount: 285,
    valuta: 'RON', tags: '#utilități',
  },
  {
    id: 3, idBono: 'BN-2026-003', dataIncarcarii: '2026-02-05T09:15:00',
    tip: 'Bon', platit: true, aprobat: false, status: 'D',
    furnizorNume: 'Starbucks Romania', furnizorCUI: 'RO22334455',
    numarDocument: 'BON-0045', dataDocument: '2026-02-04',
    descriere: 'Protocol meeting echipa',
    cont: '628', subcont: 'Abonamente', lunaPL: 'Februarie 2026',
    tvaDeductibil: false, sumaCuTVA: 245, sumaFaraTVA: null, tvaRate: null, tvaAmount: null,
    valuta: 'RON', tags: '#protocol',
  },
  {
    id: 4, idBono: 'BN-2026-004', dataIncarcarii: '2026-02-12T11:00:00',
    tip: 'Factură', platit: false, aprobat: false, status: 'D',
    furnizorNume: 'Fan Courier SA', furnizorCUI: 'RO15452783',
    numarDocument: 'FAC-2026-089', dataDocument: '2026-02-10',
    descriere: 'Servicii curierat luna Februarie',
    cont: '628', subcont: 'Poștă și curierat', lunaPL: 'Februarie 2026',
    tvaDeductibil: true, sumaCuTVA: 595, sumaFaraTVA: 500, tvaRate: 19, tvaAmount: 95,
    valuta: 'RON', tags: '#curierat',
  },
  {
    id: 5, idBono: 'BN-2026-005', dataIncarcarii: '2026-03-01T08:45:00',
    tip: 'Factură', platit: false, aprobat: false, status: 'R',
    furnizorNume: 'Google Ireland Limited', furnizorCUI: 'IE6388047V',
    numarDocument: 'INV-2026-MAR', dataDocument: '2026-03-01',
    descriere: 'Google Workspace Business - Martie 2026',
    cont: '611', subcont: 'IT & Software', lunaPL: 'Martie 2026',
    tvaDeductibil: false, sumaCuTVA: 1200, sumaFaraTVA: null, tvaRate: null, tvaAmount: null,
    valuta: 'EUR', tags: '#software #google',
  },
  {
    id: 6, idBono: 'BN-2026-006', dataIncarcarii: '2026-03-10T16:20:00',
    tip: 'Chitanță', platit: true, aprobat: true, status: 'F',
    furnizorNume: 'Trattoria Il Calcio', furnizorCUI: 'RO18765432',
    numarDocument: 'CHT-0012', dataDocument: '2026-03-08',
    descriere: 'Masa echipa - Team building Q1',
    cont: '625', subcont: 'Diurnă', lunaPL: 'Martie 2026',
    tvaDeductibil: true, sumaCuTVA: 2380, sumaFaraTVA: 2000, tvaRate: 19, tvaAmount: 380,
    valuta: 'RON', tags: '#teambuilding',
  },
];
