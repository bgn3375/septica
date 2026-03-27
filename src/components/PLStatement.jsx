import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, BarChart3, ChevronDown, ChevronUp, Upload } from 'lucide-react';
import { monthLabels, budgetData2025, categories } from '../data/mockData';
import { formatAmount, parseAmount, getVenituriForYear } from '../data/utils';

export default function PLStatement({ expenses, venituri, onVenituriChange }) {
  const [activeTab, setActiveTab] = useState('realizat');
  const [currency, setCurrency] = useState('EUR');
  const [year, setYear] = useState(2025);
  const [cheltuieliExpanded, setCheltuieliExpanded] = useState(false);

  // Get venituri for selected year (12 values)
  const yearVenituri = useMemo(() => getVenituriForYear(venituri, year), [venituri, year]);

  // Calculate cheltuieli per month from expenses
  const cheltuieliPerMonth = useMemo(() => {
    const monthly = new Array(12).fill(0);
    (expenses || []).forEach((exp) => {
      const d = new Date(exp.date);
      if (d.getFullYear() === year) {
        const monthIdx = d.getMonth();
        let amt = exp.amount;
        if (currency === 'EUR' && exp.currency === 'RON') {
          amt = amt / 5;
        } else if (currency === 'RON' && exp.currency === 'EUR') {
          amt = amt * 5;
        }
        monthly[monthIdx] += amt;
      }
    });
    return monthly;
  }, [expenses, year, currency]);

  // Cheltuieli grouped by parent category per month
  const cheltuieliByCategory = useMemo(() => {
    const grouped = {};
    categories.forEach((cat) => {
      grouped[cat.id] = { name: cat.name, months: new Array(12).fill(0) };
    });
    (expenses || []).forEach((exp) => {
      const d = new Date(exp.date);
      if (d.getFullYear() === year) {
        const monthIdx = d.getMonth();
        const parentId = exp.type ? exp.type.split('.')[0] : null;
        if (parentId && grouped[parentId]) {
          let amt = exp.amount;
          if (currency === 'EUR' && exp.currency === 'RON') {
            amt = amt / 5;
          } else if (currency === 'RON' && exp.currency === 'EUR') {
            amt = amt * 5;
          }
          grouped[parentId].months[monthIdx] += amt;
        }
      }
    });
    return Object.entries(grouped)
      .filter(([, val]) => val.months.some((m) => m > 0))
      .map(([id, val]) => ({ id, name: val.name, months: val.months }));
  }, [expenses, year, currency]);

  // Budget data
  const budgetVenituri = budgetData2025;

  // Conversion factor for display
  const conversionRate = currency === 'RON' ? 5 : 1;

  // Displayable venituri (converted)
  const displayVenituri = yearVenituri.map((v) => Math.round(v * conversionRate));
  const displayBudget = budgetVenituri.map((v) => Math.round(v * conversionRate));

  // Profit per month
  const profitPerMonth = displayVenituri.map((v, i) => v - cheltuieliPerMonth[i]);

  // Delta values
  const deltaPerMonth = displayVenituri.map((v, i) => v - displayBudget[i]);

  // YTD calculations
  const ytdVenituri = displayVenituri.reduce((s, v) => s + v, 0);
  const ytdCheltuieli = cheltuieliPerMonth.reduce((s, v) => s + v, 0);
  const ytdProfit = ytdVenituri - ytdCheltuieli;
  const ytdBudget = displayBudget.reduce((s, v) => s + v, 0);
  const ytdDelta = ytdVenituri - ytdBudget;

  // Handle inline edit of venituri
  const handleVenituriChange = (monthIdx, rawValue) => {
    const parsed = parseAmount(rawValue);
    const actualValue = currency === 'RON' ? parsed / 5 : parsed;
    const newVenituri = [...venituri];
    const baseIdx = year === 2024 ? monthIdx : 12 + monthIdx;
    newVenituri[baseIdx] = actualValue;
    onVenituriChange(newVenituri);
  };

  // Currency flag mini component
  const CurrencyFlag = ({ cur }) => {
    if (cur === 'EUR') {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              display: 'inline-block',
              width: '18px',
              height: '12px',
              borderRadius: '2px',
              overflow: 'hidden',
              flexShrink: 0,
              background: 'linear-gradient(to bottom, #003399 50%, #FFCC00 50%)',
            }}
          />
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', letterSpacing: '0.05em' }}>EUR</span>
        </span>
      );
    }
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ display: 'inline-flex', width: '18px', height: '12px', borderRadius: '2px', overflow: 'hidden', flexShrink: 0 }}>
          <span style={{ width: '33.33%', height: '100%', background: '#002B7F' }} />
          <span style={{ width: '33.33%', height: '100%', background: '#FCD116' }} />
          <span style={{ width: '33.33%', height: '100%', background: '#CE1126' }} />
        </span>
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', letterSpacing: '0.05em' }}>RON</span>
      </span>
    );
  };

  const profitColor = (val) => (val >= 0 ? '#15803D' : '#B91C1C');

  const tabs = [
    { key: 'realizat', label: 'P&L Realizat' },
    { key: 'buget', label: 'Buget' },
    { key: 'delta', label: 'Delta' },
  ];

  // Shared styles
  const stickyLabelCell = {
    position: 'sticky',
    left: 0,
    zIndex: 10,
    backgroundColor: '#FFFFFF',
    width: '200px',
    minWidth: '200px',
    padding: '10px 16px',
    fontWeight: 500,
    color: '#0F172A',
    borderBottom: '1px solid #F1F5F9',
  };

  const valueCell = {
    padding: '10px 8px',
    textAlign: 'right',
    fontSize: '14px',
    color: '#0F172A',
    borderBottom: '1px solid #F1F5F9',
    minWidth: '90px',
  };

  const ytdCellBase = {
    padding: '10px 8px',
    textAlign: 'right',
    fontWeight: 700,
    fontSize: '14px',
    borderBottom: '1px solid #F1F5F9',
    background: 'rgba(34,197,94,0.08)',
    minWidth: '100px',
  };

  const headerCell = {
    fontSize: '11px',
    fontWeight: 600,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    textAlign: 'center',
    minWidth: '90px',
    padding: '12px 8px',
    borderBottom: '1px solid #E2E8F0',
    backgroundColor: '#F8FAFC',
  };

  return (
    <div
      className="flex-1 flex flex-col"
      style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
    >
      {/* Controls Row */}
      <div
        className="flex items-center gap-4"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '16px 24px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          flexWrap: 'wrap',
        }}
      >
        {/* P&L Tabs */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: '#F1F5F9',
            borderRadius: '6px',
            padding: '4px',
            gap: '2px',
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                height: '32px',
                padding: '0 16px',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                backgroundColor: activeTab === tab.key ? '#FFFFFF' : 'transparent',
                color: activeTab === tab.key ? '#0F172A' : '#64748B',
                boxShadow: activeTab === tab.key ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Currency Toggle */}
        {activeTab !== 'delta' && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: '#F1F5F9',
              borderRadius: '6px',
              padding: '4px',
              gap: '2px',
            }}
          >
            {['EUR', 'RON'].map((cur) => (
              <button
                key={cur}
                onClick={() => setCurrency(cur)}
                style={{
                  height: '32px',
                  padding: '0 16px',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: 500,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  backgroundColor: currency === cur ? '#FFFFFF' : 'transparent',
                  color: currency === cur ? '#0F172A' : '#64748B',
                  boxShadow: currency === cur ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                }}
              >
                {cur}
              </button>
            ))}
          </div>
        )}

        {/* Year Selector */}
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          style={{
            height: '40px',
            border: '1px solid #E2E8F0',
            borderRadius: '6px',
            padding: '0 12px',
            fontSize: '14px',
            fontWeight: 500,
            color: '#0F172A',
            backgroundColor: '#FFFFFF',
            cursor: 'pointer',
            outline: 'none',
            appearance: 'auto',
          }}
        >
          <option value={2023}>2023</option>
          <option value={2024}>2024</option>
          <option value={2025}>2025</option>
        </select>

        {/* Budget Upload Button */}
        {activeTab === 'buget' && (
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              height: '40px',
              padding: '0 16px',
              border: '1px solid #E2E8F0',
              borderRadius: '6px',
              backgroundColor: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 500,
              color: '#0F172A',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
          >
            <Upload size={16} />
            Incarca buget {year}
          </button>
        )}
      </div>

      {/* Table Card */}
      <div
        style={{
          margin: '16px 24px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          overflowX: 'auto',
          flex: 1,
        }}
      >
        <table style={{ width: '100%', minWidth: '1200px', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {/* First header cell - currency flag */}
              <th
                style={{
                  ...headerCell,
                  position: 'sticky',
                  left: 0,
                  zIndex: 10,
                  width: '200px',
                  minWidth: '200px',
                  textAlign: 'left',
                  padding: '12px 16px',
                }}
              >
                <CurrencyFlag cur={currency} />
              </th>
              {/* Month headers */}
              {monthLabels.map((m) => (
                <th key={m} style={headerCell}>
                  {m}
                </th>
              ))}
              {/* YTD header */}
              <th
                style={{
                  ...headerCell,
                  minWidth: '100px',
                  background: 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(34,197,94,0.15))',
                  color: '#15803D',
                }}
              >
                YTD
              </th>
            </tr>
          </thead>
          <tbody>
            {/* === REALIZAT TAB === */}
            {activeTab === 'realizat' && (
              <>
                {/* Venituri Row */}
                <tr
                  style={{ transition: 'background-color 0.1s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={stickyLabelCell}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <TrendingUp size={16} style={{ color: '#22C55E' }} />
                      <span style={{ fontWeight: 500 }}>Venituri</span>
                    </span>
                  </td>
                  {displayVenituri.map((val, i) => (
                    <td key={i} style={valueCell}>
                      <input
                        type="text"
                        value={formatAmount(val)}
                        onChange={(e) => handleVenituriChange(i, e.target.value)}
                        onFocus={(e) => {
                          e.target.select();
                          e.target.style.backgroundColor = 'rgba(37,99,235,0.05)';
                        }}
                        onBlur={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                        }}
                        style={{
                          border: 'none',
                          backgroundColor: 'transparent',
                          textAlign: 'right',
                          width: '100%',
                          outline: 'none',
                          fontSize: '14px',
                          fontWeight: 500,
                          color: '#2563EB',
                          padding: '2px 4px',
                          borderRadius: '4px',
                        }}
                      />
                    </td>
                  ))}
                  <td style={{ ...ytdCellBase, color: '#0F172A' }}>
                    {formatAmount(ytdVenituri)}
                  </td>
                </tr>

                {/* Cheltuieli Row */}
                <tr
                  style={{ cursor: 'pointer', transition: 'background-color 0.1s' }}
                  onClick={() => setCheltuieliExpanded(!cheltuieliExpanded)}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={stickyLabelCell}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <TrendingDown size={16} style={{ color: '#EF4444' }} />
                      <span style={{ fontWeight: 500 }}>Cheltuieli</span>
                      {cheltuieliExpanded ? (
                        <ChevronUp size={14} style={{ color: '#64748B', marginLeft: '2px' }} />
                      ) : (
                        <ChevronDown size={14} style={{ color: '#64748B', marginLeft: '2px' }} />
                      )}
                    </span>
                  </td>
                  {cheltuieliPerMonth.map((val, i) => (
                    <td key={i} style={valueCell}>
                      {formatAmount(Math.round(val))}
                    </td>
                  ))}
                  <td style={{ ...ytdCellBase, color: '#0F172A' }}>
                    {formatAmount(Math.round(ytdCheltuieli))}
                  </td>
                </tr>

                {/* Expanded Category Rows */}
                {cheltuieliExpanded &&
                  cheltuieliByCategory.map((cat) => (
                    <tr
                      key={cat.id}
                      style={{ transition: 'background-color 0.1s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td
                        style={{
                          ...stickyLabelCell,
                          paddingLeft: '32px',
                          fontSize: '13px',
                          fontStyle: 'italic',
                          color: '#64748B',
                          fontWeight: 400,
                        }}
                      >
                        {cat.name}
                      </td>
                      {cat.months.map((val, i) => (
                        <td
                          key={i}
                          style={{
                            ...valueCell,
                            fontSize: '13px',
                            color: '#64748B',
                          }}
                        >
                          {val > 0 ? formatAmount(Math.round(val)) : '-'}
                        </td>
                      ))}
                      <td
                        style={{
                          ...ytdCellBase,
                          fontSize: '13px',
                          color: '#64748B',
                          fontWeight: 500,
                        }}
                      >
                        {formatAmount(Math.round(cat.months.reduce((s, v) => s + v, 0)))}
                      </td>
                    </tr>
                  ))}

                {/* Profit Row */}
                <tr
                  style={{ transition: 'background-color 0.1s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td
                    style={{
                      ...stickyLabelCell,
                      borderTop: '2px solid #E2E8F0',
                      fontWeight: 700,
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <BarChart3 size={16} style={{ color: '#3B82F6' }} />
                      <span>Profit</span>
                    </span>
                  </td>
                  {profitPerMonth.map((val, i) => (
                    <td
                      key={i}
                      style={{
                        ...valueCell,
                        fontWeight: 700,
                        color: profitColor(val),
                        borderTop: '2px solid #E2E8F0',
                      }}
                    >
                      {formatAmount(Math.round(val))}
                    </td>
                  ))}
                  <td
                    style={{
                      ...ytdCellBase,
                      color: profitColor(ytdProfit),
                      borderTop: '2px solid #E2E8F0',
                    }}
                  >
                    {formatAmount(Math.round(ytdProfit))}
                  </td>
                </tr>
              </>
            )}

            {/* === BUGET TAB === */}
            {activeTab === 'buget' && (
              <>
                <tr
                  style={{ transition: 'background-color 0.1s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={stickyLabelCell}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <TrendingUp size={16} style={{ color: '#22C55E' }} />
                      <span style={{ fontWeight: 500 }}>Venituri (Buget)</span>
                    </span>
                  </td>
                  {displayBudget.map((val, i) => (
                    <td key={i} style={valueCell}>
                      {formatAmount(val)}
                    </td>
                  ))}
                  <td style={{ ...ytdCellBase, color: '#0F172A' }}>
                    {formatAmount(ytdBudget)}
                  </td>
                </tr>
              </>
            )}

            {/* === DELTA TAB === */}
            {activeTab === 'delta' && (
              <>
                {/* Realizat Row */}
                <tr
                  style={{ transition: 'background-color 0.1s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={stickyLabelCell}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <TrendingUp size={16} style={{ color: '#22C55E' }} />
                      <span style={{ fontWeight: 500 }}>Realizat</span>
                    </span>
                  </td>
                  {displayVenituri.map((val, i) => (
                    <td key={i} style={valueCell}>
                      {formatAmount(val)}
                    </td>
                  ))}
                  <td style={{ ...ytdCellBase, color: '#0F172A' }}>
                    {formatAmount(ytdVenituri)}
                  </td>
                </tr>

                {/* Buget Row */}
                <tr
                  style={{ transition: 'background-color 0.1s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={stickyLabelCell}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <TrendingDown size={16} style={{ color: '#64748B' }} />
                      <span style={{ fontWeight: 500 }}>Buget</span>
                    </span>
                  </td>
                  {displayBudget.map((val, i) => (
                    <td key={i} style={{ ...valueCell, color: '#64748B' }}>
                      {formatAmount(val)}
                    </td>
                  ))}
                  <td style={{ ...ytdCellBase, color: '#64748B' }}>
                    {formatAmount(ytdBudget)}
                  </td>
                </tr>

                {/* Delta Row */}
                <tr
                  style={{ transition: 'background-color 0.1s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td
                    style={{
                      ...stickyLabelCell,
                      borderTop: '2px solid #E2E8F0',
                      fontWeight: 700,
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <BarChart3 size={16} style={{ color: '#3B82F6' }} />
                      <span>Delta</span>
                    </span>
                  </td>
                  {deltaPerMonth.map((val, i) => (
                    <td
                      key={i}
                      style={{
                        ...valueCell,
                        fontWeight: 700,
                        color: profitColor(val),
                        borderTop: '2px solid #E2E8F0',
                      }}
                    >
                      {val > 0 ? '+' : ''}{formatAmount(Math.round(val))}
                    </td>
                  ))}
                  <td
                    style={{
                      ...ytdCellBase,
                      color: profitColor(ytdDelta),
                      borderTop: '2px solid #E2E8F0',
                    }}
                  >
                    {ytdDelta > 0 ? '+' : ''}{formatAmount(Math.round(ytdDelta))}
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
