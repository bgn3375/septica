import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import { flatCategories } from './mockData';

// Format amount românesc: 23.637 (no decimals, dot as thousands separator)
export function formatAmount(amount) {
  if (amount == null || isNaN(amount)) return '0';
  const rounded = Math.round(amount);
  return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Parse amount from romanian format input
export function parseAmount(str) {
  if (!str) return 0;
  const cleaned = str.toString().replace(/\./g, '').replace(',', '.');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

// Format date
export function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return format(d, 'dd.MM.yyyy');
}

// Get category display name
export function getCategoryName(typeId) {
  const cat = flatCategories.find(c => c.id === typeId);
  return cat ? cat.subName : typeId;
}

// Get category parent name
export function getCategoryParent(typeId) {
  const cat = flatCategories.find(c => c.id === typeId);
  return cat ? cat.parentName : '';
}

// Currency flag component data
export function getCurrencyFlag(currency) {
  if (currency === 'EUR') {
    return { colors: ['#003399', '#FFCC00'], label: 'EUR' };
  }
  return { colors: ['#002B7F', '#FCD116', '#CE1126'], label: 'RON' };
}

// Calculate next payment date for recurring
export function getNextPaymentDate(paymentDay) {
  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  if (paymentDay < currentDay) {
    // Next month
    const nextMonth = currentMonth + 1;
    if (nextMonth > 11) {
      return new Date(currentYear + 1, 0, paymentDay);
    }
    return new Date(currentYear, nextMonth, paymentDay);
  }
  return new Date(currentYear, currentMonth, paymentDay);
}

// Generate unique ID
let idCounter = 100;
export function generateId() {
  return ++idCounter;
}

// Get fiscal year index mapping
// For FY2025: display Aug2024-Aug2025
// Index 0 (AUG) → venituri[7] (Aug 2024 = month index 7 in 2024 array)
export function getFYIndex(displayIndex, year) {
  // displayIndex 0-4 = Aug-Dec of previous year
  // displayIndex 5-12 = Jan-Aug of current year
  if (displayIndex <= 4) {
    return (year - 1) * 12 + (7 + displayIndex); // maps to prev year months
  }
  return year * 12 + (displayIndex - 5); // maps to current year months
}

// Export expenses as CSV
export function exportCSV(expenses) {
  const headers = ['Data', 'Furnizor', 'Nr. Factură', 'Descriere', 'Categorie', 'Sumă', 'Monedă', 'Status'];
  const rows = expenses.map(e => [
    formatDate(e.date),
    `"${(e.supplier || '').replace(/"/g, '""')}"`,
    e.invoiceNumber || '',
    `"${(e.description || '').replace(/"/g, '""')}"`,
    getCategoryName(e.type),
    e.amount || 0,
    e.currency || 'EUR',
    e.status || '',
  ]);
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cheltuieli_${formatDate(new Date()).replace(/\./g, '-')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// For simple calendar year mapping (Jan-Dec)
export function getVenituriForYear(venituri, year) {
  if (year === 2024) return venituri.slice(0, 12);
  if (year === 2025) return venituri.slice(12, 24);
  return new Array(12).fill(0);
}
