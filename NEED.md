# Need: P&L Expense Management Module (bono-pl)
Date: 2026-03-23

## Problem
Modulul de Expense Management (P&L) pentru platforma bono trebuie reconstruit folosind Edge Design System. Sursa: Figma Make V1330.

## Target
Companii mici/mijlocii din România, echipe financiare, manageri P&L.

## Funcționalități Documentate

### ECRAN 1: EXPENSES (Cheltuieli)
- Tabel cu 9 coloane: DATA, FURNIZOR, NR. FACTURĂ, DESCRIERE, CATEGORIE, SUMĂ, MONEDĂ, STATUS, ACȚIUNI
- Sub-tabs: Expenses / Recurring
- Filtre: Plătit/Neplătit (toggle), Date Range (calendar), Furnizor (dropdown), Categorie (dropdown)
- Acțiuni: Refresh, Download CSV, Edit (modal), Delete (modal cu confirmare)
- Format românesc (23.637), EUR cu steag UE, RON cu tricolor
- Empty state, hover effects, toast notifications

### ECRAN 2: RECURRING EXPENSES (Deconturi Recurente)
- Tabel cu toggle activ/inactiv (Apple switch), denumire, furnizor, zi plată, sumă, monedă, status
- Add/Edit recurring modal cu câmpuri: Denumire, Zi Plată (1-28), Tip Decont (Recurent/Final)
- Inactivare cu confirmare, activare fără confirmare
- Next Payment Date calculation

### ECRAN 3: P&L STATEMENT (Profit & Loss)
- 3 tabs: P&L Realizat, Buget, Delta
- Year selector (2023-2025), Currency selector (EUR/RON)
- Budget upload (.xlsx), cu card verde când există
- Tabel scrollable: 13 luni (Aug-Aug cross-year) + YTD column
- Venituri editabile inline, Cheltuieli expandable cu categorii tree
- Profit = Venituri - Cheltuieli, color coded (green/red)
- Column highlighting: luna curentă (orange), an trecut (blue)

### SIDEBAR
- Logo bono, navigare: Cheltuieli, Recurring, P&L, Companii, Profil
- Company selector

## Chosen Solution
React + Vite + Tailwind CSS v4 + Edge Design System + Lucide React + localStorage

## Out of Scope
- Backend real, Auth real, Mobile-specific views (first iteration desktop)
