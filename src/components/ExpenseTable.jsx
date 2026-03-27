import { useState, useMemo } from 'react';
import { Check, RefreshCw, Download, Pencil, Trash2, FileX, Plus } from 'lucide-react';
import { formatAmount, formatDate, getCategoryName, exportCSV } from '../data/utils';

function CurrencyFlag({ currency }) {
  if (currency === 'EUR') {
    return (
      <span style={{ display: 'inline-flex', gap: '1px' }}>
        <span style={{ width: 5, height: 12, borderRadius: 1, background: '#003399' }} />
        <span style={{ width: 5, height: 12, borderRadius: 1, background: '#FFCC00' }} />
      </span>
    );
  }
  return (
    <span style={{ display: 'inline-flex', gap: '1px' }}>
      <span style={{ width: 4, height: 12, borderRadius: 1, background: '#002B7F' }} />
      <span style={{ width: 4, height: 12, borderRadius: 1, background: '#FCD116' }} />
      <span style={{ width: 4, height: 12, borderRadius: 1, background: '#CE1126' }} />
    </span>
  );
}

export default function ExpenseTable({ expenses = [], onEdit, onDelete, onNewExpense, onSwitchToRecurring }) {
  const [statusFilter, setStatusFilter] = useState(null);
  const [supplierFilter, setSupplierFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const usedSuppliers = useMemo(() => [...new Set(expenses.map(e => e.supplier))].sort(), [expenses]);
  const usedCategories = useMemo(() => [...new Set(expenses.map(e => e.type))].sort(), [expenses]);

  const filtered = useMemo(() => {
    let result = expenses;
    if (statusFilter) result = result.filter(e => e.status === statusFilter);
    if (supplierFilter) result = result.filter(e => e.supplier === supplierFilter);
    if (categoryFilter) result = result.filter(e => e.type === categoryFilter);
    return result;
  }, [expenses, statusFilter, supplierFilter, categoryFilter]);

  const totalSum = useMemo(() => filtered.reduce((s, e) => s + (e.amount || 0), 0), [filtered]);

  const dateRange = useMemo(() => {
    if (filtered.length === 0) return '';
    const dates = filtered.map(e => new Date(e.date).getTime()).sort((a, b) => a - b);
    return `${formatDate(new Date(dates[0]))} — ${formatDate(new Date(dates[dates.length - 1]))}`;
  }, [filtered]);

  return (
    <div className="flex-1 flex flex-col" style={{ minHeight: 0 }}>

      {/* ── Sub-header: tabs + CTA ── */}
      <div
        className="flex items-center"
        style={{
          height: 56,
          background: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          padding: '0 24px',
        }}
      >
        {/* Tabs */}
        <div style={{ display: 'flex', height: '100%' }}>
          <button
            style={{
              position: 'relative',
              padding: '0 16px',
              height: '100%',
              fontSize: 14,
              fontWeight: 500,
              color: '#0F172A',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Cheltuieli
            <span
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 2,
                background: 'linear-gradient(135deg, #EC4899, #86198F)',
                borderRadius: '2px 2px 0 0',
              }}
            />
          </button>
          <button
            onClick={onSwitchToRecurring}
            style={{
              padding: '0 16px',
              height: '100%',
              fontSize: 14,
              fontWeight: 500,
              color: '#64748B',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#0F172A')}
            onMouseLeave={e => (e.currentTarget.style.color = '#64748B')}
          >
            Deconturi Recurente
          </button>
        </div>

        <div style={{ flex: 1 }} />

        {/* CTA */}
        <button
          onClick={onNewExpense}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            height: 40,
            padding: '0 16px',
            background: 'linear-gradient(135deg, #EC4899, #EE4379, #86198F)',
            color: '#FFFFFF',
            fontSize: 14,
            fontWeight: 500,
            border: 'none',
            borderRadius: 6,
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            cursor: 'pointer',
            transition: 'box-shadow 0.15s, transform 0.1s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(236,72,153,0.35)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <Plus style={{ width: 16, height: 16 }} />
          Adaugă cheltuială
        </button>
      </div>

      {/* ── Filter row ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 24px',
          background: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
        }}
      >
        {/* Status toggle: Plătit */}
        <button
          onClick={() => setStatusFilter(statusFilter === 'Plătit' ? null : 'Plătit')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            height: 32,
            padding: '0 12px',
            fontSize: 14,
            fontWeight: 500,
            borderRadius: 6,
            border: statusFilter === 'Plătit' ? '1px solid #BBF7D0' : '1px solid #E2E8F0',
            background: statusFilter === 'Plătit' ? '#F0FDF4' : '#FFFFFF',
            color: statusFilter === 'Plătit' ? '#15803D' : '#64748B',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            if (statusFilter !== 'Plătit') e.currentTarget.style.background = '#F8FAFC';
          }}
          onMouseLeave={e => {
            if (statusFilter !== 'Plătit') e.currentTarget.style.background = '#FFFFFF';
          }}
        >
          <Check style={{ width: 14, height: 14 }} />
          Plătit
        </button>

        {/* Status toggle: Neplătit */}
        <button
          onClick={() => setStatusFilter(statusFilter === 'Neplătit' ? null : 'Neplătit')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            height: 32,
            padding: '0 12px',
            fontSize: 14,
            fontWeight: 500,
            borderRadius: 6,
            border: statusFilter === 'Neplătit' ? '1px solid #FECACA' : '1px solid #E2E8F0',
            background: statusFilter === 'Neplătit' ? '#FEF2F2' : '#FFFFFF',
            color: statusFilter === 'Neplătit' ? '#B91C1C' : '#64748B',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            if (statusFilter !== 'Neplătit') e.currentTarget.style.background = '#F8FAFC';
          }}
          onMouseLeave={e => {
            if (statusFilter !== 'Neplătit') e.currentTarget.style.background = '#FFFFFF';
          }}
        >
          <Check style={{ width: 14, height: 14 }} />
          Neplătit
        </button>

        {/* Divider */}
        <div style={{ width: 1, height: 20, background: '#E2E8F0' }} />

        {/* Refresh */}
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: 6,
            border: '1px solid #E2E8F0',
            background: '#FFFFFF',
            color: '#64748B',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          title="Reîmprospătare"
          onMouseEnter={e => {
            e.currentTarget.style.color = '#0F172A';
            e.currentTarget.style.background = '#F1F5F9';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = '#64748B';
            e.currentTarget.style.background = '#FFFFFF';
          }}
        >
          <RefreshCw style={{ width: 15, height: 15 }} />
        </button>

        {/* Download */}
        <button
          onClick={() => exportCSV(filtered)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: 6,
            border: '1px solid #E2E8F0',
            background: '#FFFFFF',
            color: '#64748B',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          title="Descarcă CSV"
          onMouseEnter={e => {
            e.currentTarget.style.color = '#0F172A';
            e.currentTarget.style.background = '#F1F5F9';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = '#64748B';
            e.currentTarget.style.background = '#FFFFFF';
          }}
        >
          <Download style={{ width: 15, height: 15 }} />
        </button>

        <div style={{ flex: 1 }} />

        {/* Date range */}
        {dateRange && (
          <span style={{ fontSize: 12, color: '#64748B', fontVariantNumeric: 'tabular-nums' }}>
            {dateRange}
          </span>
        )}

        {/* Supplier dropdown */}
        <select
          value={supplierFilter}
          onChange={e => setSupplierFilter(e.target.value)}
          style={{
            height: 32,
            padding: '0 12px',
            fontSize: 14,
            border: '1px solid #E2E8F0',
            borderRadius: 6,
            color: '#0F172A',
            background: '#FFFFFF',
            outline: 'none',
            cursor: 'pointer',
            appearance: 'auto',
          }}
        >
          <option value="">Toți furnizorii</option>
          {usedSuppliers.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* Category dropdown */}
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          style={{
            height: 32,
            padding: '0 12px',
            fontSize: 14,
            border: '1px solid #E2E8F0',
            borderRadius: 6,
            color: '#0F172A',
            background: '#FFFFFF',
            outline: 'none',
            cursor: 'pointer',
            appearance: 'auto',
          }}
        >
          <option value="">Toate categoriile</option>
          {usedCategories.map(c => (
            <option key={c} value={c}>{getCategoryName(c)}</option>
          ))}
        </select>
      </div>

      {/* ── Table area ── */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px 24px' }}>
        {filtered.length === 0 ? (
          /* Empty state */
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px 24px',
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 8,
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            }}
          >
            <FileX style={{ width: 48, height: 48, color: '#CBD5E1', marginBottom: 16 }} />
            <p style={{ fontSize: 16, fontWeight: 500, color: '#0F172A', margin: '0 0 4px' }}>
              Nu există cheltuieli înregistrate
            </p>
            <p style={{ fontSize: 14, color: '#94A3B8', margin: 0 }}>
              Adaugă prima cheltuială sau ajustează filtrele.
            </p>
          </div>
        ) : (
          /* Table card */
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 8,
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              overflow: 'hidden',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1100 }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', width: 100 }}>
                    Data
                  </th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', minWidth: 150 }}>
                    Furnizor
                  </th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', width: 120 }}>
                    Nr. Factură
                  </th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', minWidth: 180 }}>
                    Descriere
                  </th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', width: 140 }}>
                    Categorie
                  </th>
                  <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', width: 110 }}>
                    Sumă
                  </th>
                  <th style={{ textAlign: 'center', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', width: 80 }}>
                    Monedă
                  </th>
                  <th style={{ textAlign: 'center', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', width: 100 }}>
                    Status
                  </th>
                  <th style={{ textAlign: 'center', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', width: 80 }}>
                    Acțiuni
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(expense => (
                  <tr
                    key={expense.id}
                    style={{
                      borderBottom: '1px solid #F1F5F9',
                      transition: 'background 0.12s',
                      cursor: 'default',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* Data */}
                    <td style={{ padding: '12px 16px', fontSize: 14, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>
                      {formatDate(expense.date)}
                    </td>

                    {/* Furnizor */}
                    <td style={{ padding: '12px 16px', fontSize: 14, color: '#0F172A', fontWeight: 500 }}>
                      {expense.supplier}
                    </td>

                    {/* Nr. Factură */}
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#64748B', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
                      {expense.invoiceNumber}
                    </td>

                    {/* Descriere */}
                    <td style={{ padding: '12px 16px', fontSize: 14, color: '#0F172A', maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {expense.description}
                    </td>

                    {/* Categorie badge */}
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          background: '#EFF6FF',
                          color: '#1D4ED8',
                          border: '1px solid #BFDBFE',
                          borderRadius: 4,
                          padding: '2px 8px',
                          fontSize: 12,
                          fontWeight: 500,
                          lineHeight: '18px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {getCategoryName(expense.type)}
                      </span>
                    </td>

                    {/* Sumă */}
                    <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 600, color: '#0F172A', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                      {formatAmount(expense.amount)}
                    </td>

                    {/* Monedă */}
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <CurrencyFlag currency={expense.currency} />
                        <span style={{ fontSize: 12, color: '#64748B' }}>{expense.currency}</span>
                      </span>
                    </td>

                    {/* Status badge */}
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          fontSize: 12,
                          fontWeight: 500,
                          borderRadius: 4,
                          padding: '2px 10px',
                          lineHeight: '18px',
                          whiteSpace: 'nowrap',
                          border: expense.status === 'Plătit' ? '1px solid #BBF7D0' : '1px solid #FECACA',
                          background: expense.status === 'Plătit' ? '#F0FDF4' : '#FEF2F2',
                          color: expense.status === 'Plătit' ? '#15803D' : '#B91C1C',
                        }}
                      >
                        {expense.status}
                      </span>
                    </td>

                    {/* Acțiuni */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                        <button
                          onClick={() => onEdit && onEdit(expense)}
                          title="Editează"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 28,
                            height: 28,
                            borderRadius: 6,
                            border: 'none',
                            background: 'transparent',
                            color: '#94A3B8',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.color = '#3B82F6';
                            e.currentTarget.style.background = '#EFF6FF';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.color = '#94A3B8';
                            e.currentTarget.style.background = 'transparent';
                          }}
                        >
                          <Pencil style={{ width: 14, height: 14 }} />
                        </button>
                        <button
                          onClick={() => onDelete && onDelete(expense)}
                          title="Șterge"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 28,
                            height: 28,
                            borderRadius: 6,
                            border: 'none',
                            background: 'transparent',
                            color: '#94A3B8',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.color = '#EF4444';
                            e.currentTarget.style.background = '#FEF2F2';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.color = '#94A3B8';
                            e.currentTarget.style.background = 'transparent';
                          }}
                        >
                          <Trash2 style={{ width: 14, height: 14 }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      {filtered.length > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 24px',
            background: '#F8FAFC',
            borderTop: '1px solid #E2E8F0',
          }}
        >
          <span style={{ fontSize: 13, color: '#64748B' }}>
            {filtered.length} {filtered.length === 1 ? 'cheltuială' : 'cheltuieli'}
          </span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', fontVariantNumeric: 'tabular-nums' }}>
            Total: {formatAmount(totalSum)}
          </span>
        </div>
      )}
    </div>
  );
}
