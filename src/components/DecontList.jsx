import { useState } from 'react';
import { Plus, Search, Pencil, Trash2, FileText } from 'lucide-react';

const STATUS_FILTERS = [
  { key: 'all', label: 'Toate' },
  { key: 'D', label: 'Draft' },
  { key: 'F', label: 'Final' },
  { key: 'R', label: 'Recurent' },
];

const STATUS_CONFIG = {
  D: { label: 'D', bg: '#FEF9C3', color: '#854D0E' },
  F: { label: 'F', bg: '#DCFCE7', color: '#166534' },
  R: { label: 'R', bg: '#F1F5F9', color: '#475569' },
};

const TIP_CONFIG = {
  'Factură': { bg: '#EFF6FF', color: '#1E40AF' },
  'Bon': { bg: '#FFF7ED', color: '#9A3412' },
  'Chitanță': { bg: '#F0FDF4', color: '#166534' },
};

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  const months = ['ian', 'feb', 'mar', 'apr', 'mai', 'iun', 'iul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const day = String(d.getDate()).padStart(2, '0');
  const mon = months[d.getMonth()];
  const year = String(d.getFullYear()).slice(2);
  return `${day}.${mon}.${year}`;
}

function formatAmount(amount) {
  if (amount == null) return '—';
  return Number(amount).toLocaleString('ro-RO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const styles = {
  page: {
    minHeight: '100%',
    background: '#F8FAFC',
    padding: '24px',
    fontFamily: 'Inter, sans-serif',
  },
  headerBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  title: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#0F172A',
    margin: 0,
    lineHeight: '28px',
  },
  tabs: {
    display: 'flex',
    gap: '4px',
  },
  tabActive: {
    padding: '4px 12px',
    fontSize: '13px',
    fontWeight: 600,
    color: '#0F172A',
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '6px',
    cursor: 'default',
  },
  tabInactive: {
    padding: '4px 12px',
    fontSize: '13px',
    fontWeight: 500,
    color: '#64748B',
    background: 'transparent',
    border: '1px solid transparent',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  gradientBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    height: '40px',
    padding: '0 20px',
    background: 'linear-gradient(135deg, #EC4899, #EE4379, #86198F)',
    color: '#FFFFFF',
    fontSize: '14px',
    fontWeight: 500,
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)',
    whiteSpace: 'nowrap',
  },
  filtersRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    marginBottom: '16px',
  },
  pillGroup: {
    display: 'flex',
    gap: '4px',
    background: '#F1F5F9',
    borderRadius: '6px',
    padding: '4px',
  },
  pillActive: {
    padding: '6px 14px',
    fontSize: '13px',
    fontWeight: 600,
    color: '#0F172A',
    background: '#FFFFFF',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
  },
  pillInactive: {
    padding: '6px 14px',
    fontSize: '13px',
    fontWeight: 500,
    color: '#64748B',
    background: 'transparent',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  searchWrap: {
    position: 'relative',
    width: '280px',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#94A3B8',
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    height: '40px',
    padding: '0 12px 0 38px',
    fontSize: '14px',
    fontWeight: 400,
    color: '#0F172A',
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '6px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  card: {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '6px',
    boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    tableLayout: 'fixed',
  },
  th: {
    background: '#F8FAFC',
    padding: '10px 12px',
    fontSize: '11px',
    fontWeight: 600,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    textAlign: 'left',
    borderBottom: '1px solid #E2E8F0',
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '12px',
    fontSize: '14px',
    fontWeight: 400,
    color: '#0F172A',
    borderBottom: '1px solid #F1F5F9',
    verticalAlign: 'middle',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  idCell: {
    fontWeight: 600,
    fontSize: '13px',
    color: '#0F172A',
  },
  badge: {
    display: 'inline-block',
    padding: '2px 8px',
    fontSize: '12px',
    fontWeight: 500,
    borderRadius: '4px',
    whiteSpace: 'nowrap',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    fontSize: '11px',
    fontWeight: 700,
    borderRadius: '50%',
  },
  paidDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    display: 'inline-block',
  },
  actionBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    color: '#64748B',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '64px 24px',
    textAlign: 'center',
  },
  emptyIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: '#F1F5F9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
    color: '#94A3B8',
  },
  emptyTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#0F172A',
    margin: '0 0 4px 0',
  },
  emptySub: {
    fontSize: '14px',
    fontWeight: 400,
    color: '#64748B',
    margin: '0 0 24px 0',
  },
};

const COL_WIDTHS = {
  id: '120px',
  data: '100px',
  furnizor: 'auto',
  tip: '80px',
  cont: '120px',
  suma: '120px',
  status: '80px',
  platit: '60px',
  actiuni: '80px',
};

export default function DecontList({
  deconturi = [],
  onNewDecont,
  onEditDecont,
  onDeleteDecont,
  onSwitchToExpenses,
}) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [hoveredRow, setHoveredRow] = useState(null);

  const filtered = deconturi.filter((d) => {
    if (statusFilter !== 'all' && d.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchId = d.idBono && d.idBono.toLowerCase().includes(q);
      const matchFurnizor = d.furnizorNume && d.furnizorNume.toLowerCase().includes(q);
      if (!matchId && !matchFurnizor) return false;
    }
    return true;
  });

  const isEmpty = filtered.length === 0;

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.headerBar}>
        <div style={styles.headerLeft}>
          <h1 style={styles.title}>Deconturi</h1>
          <div style={styles.tabs}>
            <span style={styles.tabActive}>Deconturi</span>
            <span
              style={styles.tabInactive}
              onClick={onSwitchToExpenses}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onSwitchToExpenses?.()}
            >
              Expenses
            </span>
          </div>
        </div>
        <button style={styles.gradientBtn} onClick={onNewDecont}>
          <Plus size={16} strokeWidth={2.5} />
          Decont Nou
        </button>
      </div>

      {/* Filters */}
      <div style={styles.filtersRow}>
        <div style={styles.pillGroup}>
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.key}
              style={statusFilter === f.key ? styles.pillActive : styles.pillInactive}
              onClick={() => setStatusFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div style={styles.searchWrap}>
          <Search size={16} style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Caută furnizor sau ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      {/* Table Card */}
      <div style={styles.card}>
        {isEmpty ? (
          <div style={styles.emptyWrap}>
            <div style={styles.emptyIcon}>
              <FileText size={24} />
            </div>
            <p style={styles.emptyTitle}>Niciun decont</p>
            <p style={styles.emptySub}>Adaugă primul decont</p>
            <button style={styles.gradientBtn} onClick={onNewDecont}>
              <Plus size={16} strokeWidth={2.5} />
              Decont Nou
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <colgroup>
                <col style={{ width: COL_WIDTHS.id }} />
                <col style={{ width: COL_WIDTHS.data }} />
                <col style={{ width: COL_WIDTHS.furnizor }} />
                <col style={{ width: COL_WIDTHS.tip }} />
                <col style={{ width: COL_WIDTHS.cont }} />
                <col style={{ width: COL_WIDTHS.suma }} />
                <col style={{ width: COL_WIDTHS.status }} />
                <col style={{ width: COL_WIDTHS.platit }} />
                <col style={{ width: COL_WIDTHS.actiuni }} />
              </colgroup>
              <thead>
                <tr>
                  <th style={styles.th}>ID Bono</th>
                  <th style={styles.th}>Data</th>
                  <th style={styles.th}>Furnizor</th>
                  <th style={styles.th}>Tip</th>
                  <th style={styles.th}>Cont</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Sumă</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>Status</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>Plătit</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>Acțiuni</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d, idx) => {
                  const tipCfg = TIP_CONFIG[d.tip] || { bg: '#F1F5F9', color: '#475569' };
                  const statusCfg = STATUS_CONFIG[d.status] || STATUS_CONFIG.D;
                  const isHovered = hoveredRow === idx;

                  return (
                    <tr
                      key={d.idBono || idx}
                      style={{
                        background: isHovered ? '#F8FAFC' : 'transparent',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={() => setHoveredRow(idx)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td style={{ ...styles.td, ...styles.idCell }}>{d.idBono}</td>
                      <td style={styles.td}>{formatDate(d.dataDocument || d.dataIncarcarii)}</td>
                      <td style={{ ...styles.td, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {d.furnizorNume}
                      </td>
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.badge,
                            background: tipCfg.bg,
                            color: tipCfg.color,
                          }}
                        >
                          {d.tip}
                        </span>
                      </td>
                      <td style={{ ...styles.td, fontSize: '13px', color: '#475569' }}>{d.cont}</td>
                      <td style={{ ...styles.td, textAlign: 'right', fontWeight: 500 }}>
                        {formatAmount(d.sumaCuTVA)} Lei
                      </td>
                      <td style={{ ...styles.td, textAlign: 'center' }}>
                        <span
                          style={{
                            ...styles.statusBadge,
                            background: statusCfg.bg,
                            color: statusCfg.color,
                          }}
                        >
                          {statusCfg.label}
                        </span>
                      </td>
                      <td style={{ ...styles.td, textAlign: 'center' }}>
                        <span
                          style={{
                            ...styles.paidDot,
                            background: d.platit ? '#22C55E' : '#CBD5E1',
                          }}
                        />
                      </td>
                      <td style={{ ...styles.td, textAlign: 'center' }}>
                        <button
                          style={styles.actionBtn}
                          title="Editează"
                          onClick={() => onEditDecont?.(d)}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#0F172A')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          style={{ ...styles.actionBtn, marginLeft: '4px' }}
                          title="Șterge"
                          onClick={() => onDeleteDecont?.(d)}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
