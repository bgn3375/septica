import React, { useState } from 'react';
import { Plus, Pencil, Trash2, PauseCircle, Check, X } from 'lucide-react';
import { formatAmount, formatDate, getNextPaymentDate, getCategoryName } from '../data/utils';
import { flatCategories } from '../data/mockData';

function CurrencyFlag({ currency }) {
  if (currency === 'EUR') {
    return (
      <span style={{ display: 'inline-flex', gap: 1, marginRight: 6 }}>
        <span style={{ width: 4, height: 12, borderRadius: 1, backgroundColor: '#003399' }} />
        <span style={{ width: 4, height: 12, borderRadius: 1, backgroundColor: '#FFCC00' }} />
      </span>
    );
  }
  return (
    <span style={{ display: 'inline-flex', gap: 1, marginRight: 6 }}>
      <span style={{ width: 4, height: 12, borderRadius: 1, backgroundColor: '#002B7F' }} />
      <span style={{ width: 4, height: 12, borderRadius: 1, backgroundColor: '#FCD116' }} />
      <span style={{ width: 4, height: 12, borderRadius: 1, backgroundColor: '#CE1126' }} />
    </span>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        flexShrink: 0,
        cursor: 'pointer',
        borderRadius: 9999,
        width: 44,
        height: 24,
        border: 'none',
        padding: 0,
        transition: 'background-color 200ms ease-in-out',
        backgroundColor: checked ? '#22C55E' : '#D1D5DB',
        outline: 'none',
      }}
    >
      <span
        style={{
          pointerEvents: 'none',
          display: 'inline-block',
          width: 20,
          height: 20,
          borderRadius: 9999,
          backgroundColor: '#FFFFFF',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          transition: 'transform 200ms ease-in-out',
          transform: checked ? 'translateX(22px)' : 'translateX(2px)',
        }}
      />
    </button>
  );
}

const emptyForm = {
  name: '',
  supplier: '',
  description: '',
  paymentDay: 1,
  amount: '',
  currency: 'RON',
  category: '',
  tipDecont: 'Recurent',
};

/* ─── Shared style objects ─── */
const inputStyle = {
  width: '100%',
  height: 40,
  padding: '8px 12px',
  border: '1px solid #E2E8F0',
  borderRadius: 6,
  fontSize: 14,
  backgroundColor: '#FFFFFF',
  color: '#0F172A',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 150ms, box-shadow 150ms',
};

const labelStyle = {
  display: 'block',
  fontSize: 14,
  fontWeight: 500,
  color: '#0F172A',
  marginBottom: 6,
};

const modalBackdropStyle = {
  position: 'fixed',
  inset: 0,
  zIndex: 50,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const modalOverlayStyle = {
  position: 'absolute',
  inset: 0,
  backgroundColor: 'rgba(0,0,0,0.4)',
  backdropFilter: 'blur(4px)',
  WebkitBackdropFilter: 'blur(4px)',
};

const modalCardBase = {
  position: 'relative',
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
  boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
  width: '100%',
  marginLeft: 16,
  marginRight: 16,
};

const modalHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 24px',
  borderBottom: '1px solid #E2E8F0',
};

const modalTitleStyle = {
  fontSize: 18,
  fontWeight: 600,
  color: '#0F172A',
  margin: 0,
};

const modalCloseStyle = {
  width: 32,
  height: 32,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 6,
  border: 'none',
  backgroundColor: 'transparent',
  color: '#94A3B8',
  cursor: 'pointer',
  transition: 'background-color 150ms, color 150ms',
};

const modalBodyStyle = {
  padding: '24px 24px',
};

const modalFooterStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: 12,
  padding: '16px 24px',
  borderTop: '1px solid #E2E8F0',
};

const cancelBtnStyle = {
  height: 40,
  padding: '0 16px',
  fontSize: 14,
  fontWeight: 500,
  color: '#64748B',
  border: '1px solid #E2E8F0',
  backgroundColor: '#FFFFFF',
  borderRadius: 6,
  cursor: 'pointer',
  transition: 'background-color 150ms',
};

const actionBtnBase = {
  height: 40,
  padding: '0 16px',
  fontSize: 14,
  fontWeight: 500,
  color: '#FFFFFF',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  transition: 'opacity 150ms, box-shadow 150ms',
};

export default function RecurringExpenses({
  recurring = [],
  onUpdate,
  onSwitchToExpenses,
  onCreateExpenseFromRecurring,
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [toast, setToast] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  /* ─── Toggle ─── */
  const handleToggle = (item) => {
    if (item.isActive) {
      setSelectedItem(item);
      setShowDeactivateModal(true);
    } else {
      const updated = recurring.map(r =>
        r.id === item.id ? { ...r, isActive: true } : r
      );
      onUpdate(updated);
      showToast('Decont reactivat');
    }
  };

  const confirmDeactivate = () => {
    const updated = recurring.map(r =>
      r.id === selectedItem.id ? { ...r, isActive: false } : r
    );
    onUpdate(updated);
    setShowDeactivateModal(false);
    setSelectedItem(null);
  };

  /* ─── Add ─── */
  const openAdd = () => {
    setFormData({ ...emptyForm });
    setShowAddModal(true);
  };

  const saveAdd = () => {
    const newItem = {
      id: Date.now(),
      name: formData.name,
      supplier: formData.supplier,
      description: formData.description,
      paymentDay: parseInt(formData.paymentDay) || 1,
      amount: parseFloat(formData.amount) || 0,
      currency: formData.currency,
      category: formData.category,
      tipDecont: formData.tipDecont,
      isActive: true,
    };
    onUpdate([...recurring, newItem]);
    setShowAddModal(false);
  };

  /* ─── Edit ─── */
  const openEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      supplier: item.supplier,
      description: item.description || '',
      paymentDay: item.paymentDay,
      amount: item.amount,
      currency: item.currency,
      category: item.category || '',
      tipDecont: item.tipDecont || 'Recurent',
    });
    setShowEditModal(true);
  };

  const saveEdit = () => {
    const updated = recurring.map(r =>
      r.id === selectedItem.id
        ? {
            ...r,
            name: formData.name,
            supplier: formData.supplier,
            description: formData.description,
            paymentDay: parseInt(formData.paymentDay) || 1,
            amount: parseFloat(formData.amount) || 0,
            currency: formData.currency,
            category: formData.category,
            tipDecont: formData.tipDecont,
          }
        : r
    );
    onUpdate(updated);
    setShowEditModal(false);
    setSelectedItem(null);
  };

  /* ─── Delete ─── */
  const openDelete = (item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    const updated = recurring.filter(r => r.id !== selectedItem.id);
    onUpdate(updated);
    setShowDeleteModal(false);
    setSelectedItem(null);
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  /* ─── Shared form renderer ─── */
  const renderForm = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Denumire */}
      <div>
        <label style={labelStyle}>
          Denumire <span style={{ color: '#EF4444' }}>*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={e => updateField('name', e.target.value)}
          placeholder="ex: Chirie birou"
          style={inputStyle}
          onFocus={e => {
            e.target.style.borderColor = '#18181B';
            e.target.style.boxShadow = '0 0 0 2px rgba(24,24,27,0.1)';
          }}
          onBlur={e => {
            e.target.style.borderColor = '#E2E8F0';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      {/* Furnizor */}
      <div>
        <label style={labelStyle}>Furnizor</label>
        <input
          type="text"
          value={formData.supplier}
          onChange={e => updateField('supplier', e.target.value)}
          placeholder="ex: WeWork Romania"
          style={inputStyle}
          onFocus={e => {
            e.target.style.borderColor = '#18181B';
            e.target.style.boxShadow = '0 0 0 2px rgba(24,24,27,0.1)';
          }}
          onBlur={e => {
            e.target.style.borderColor = '#E2E8F0';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      {/* Descriere */}
      <div>
        <label style={labelStyle}>Descriere</label>
        <textarea
          value={formData.description}
          onChange={e => updateField('description', e.target.value)}
          rows={2}
          placeholder="Descriere optionala..."
          style={{
            ...inputStyle,
            height: 'auto',
            padding: 12,
            resize: 'none',
          }}
          onFocus={e => {
            e.target.style.borderColor = '#18181B';
            e.target.style.boxShadow = '0 0 0 2px rgba(24,24,27,0.1)';
          }}
          onBlur={e => {
            e.target.style.borderColor = '#E2E8F0';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      {/* Zi Plata + Suma */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label style={labelStyle}>Zi plata</label>
          <input
            type="number"
            min={1}
            max={28}
            value={formData.paymentDay}
            onChange={e => updateField('paymentDay', e.target.value)}
            style={inputStyle}
            onFocus={e => {
              e.target.style.borderColor = '#18181B';
              e.target.style.boxShadow = '0 0 0 2px rgba(24,24,27,0.1)';
            }}
            onBlur={e => {
              e.target.style.borderColor = '#E2E8F0';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
        <div>
          <label style={labelStyle}>Suma</label>
          <input
            type="number"
            min={0}
            value={formData.amount}
            onChange={e => updateField('amount', e.target.value)}
            placeholder="0"
            style={inputStyle}
            onFocus={e => {
              e.target.style.borderColor = '#18181B';
              e.target.style.boxShadow = '0 0 0 2px rgba(24,24,27,0.1)';
            }}
            onBlur={e => {
              e.target.style.borderColor = '#E2E8F0';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
      </div>

      {/* Moneda */}
      <div>
        <label style={labelStyle}>Moneda</label>
        <div style={{ display: 'flex', gap: 12 }}>
          {['RON', 'EUR'].map(cur => (
            <button
              key={cur}
              type="button"
              onClick={() => updateField('currency', cur)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                height: 40,
                padding: '0 16px',
                borderRadius: 6,
                border: formData.currency === cur ? '1px solid #18181B' : '1px solid #E2E8F0',
                backgroundColor: formData.currency === cur ? '#18181B' : '#FFFFFF',
                color: formData.currency === cur ? '#FFFFFF' : '#64748B',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 150ms',
              }}
            >
              <CurrencyFlag currency={cur} />
              {cur}
            </button>
          ))}
        </div>
      </div>

      {/* Categorie */}
      <div>
        <label style={labelStyle}>Categorie</label>
        <select
          value={formData.category}
          onChange={e => updateField('category', e.target.value)}
          style={{
            ...inputStyle,
            appearance: 'auto',
          }}
          onFocus={e => {
            e.target.style.borderColor = '#18181B';
            e.target.style.boxShadow = '0 0 0 2px rgba(24,24,27,0.1)';
          }}
          onBlur={e => {
            e.target.style.borderColor = '#E2E8F0';
            e.target.style.boxShadow = 'none';
          }}
        >
          <option value="">Selecteaza categoria</option>
          {flatCategories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Tip Decont */}
      <div>
        <label style={labelStyle}>Tip decont</label>
        <div style={{ display: 'flex', borderRadius: 6, overflow: 'hidden', border: '1px solid #E2E8F0' }}>
          {['Recurent', 'Final'].map(tip => (
            <button
              key={tip}
              type="button"
              onClick={() => updateField('tipDecont', tip)}
              style={{
                flex: 1,
                height: 40,
                padding: '0 16px',
                fontSize: 14,
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 150ms',
                backgroundColor: formData.tipDecont === tip ? '#18181B' : '#FFFFFF',
                color: formData.tipDecont === tip ? '#FFFFFF' : '#64748B',
              }}
            >
              {tip}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  /* ─── Table header cell style ─── */
  const thStyle = (extra = {}) => ({
    padding: '12px 16px',
    fontSize: 11,
    fontWeight: 600,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    whiteSpace: 'nowrap',
    ...extra,
  });

  /* ─── Table data cell style ─── */
  const tdStyle = (active, extra = {}) => ({
    padding: '12px 16px',
    fontSize: 14,
    color: active ? '#0F172A' : '#64748B',
    ...extra,
  });

  return (
    <div className="flex-1 flex flex-col" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>

      {/* ─── Sub-header (56px) ─── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          height: 56,
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          padding: '0 24px',
          flexShrink: 0,
        }}
      >
        {/* Tabs */}
        <div style={{ display: 'flex', height: '100%' }}>
          <button
            onClick={() => onSwitchToExpenses && onSwitchToExpenses()}
            style={{
              padding: '0 20px',
              fontSize: 14,
              fontWeight: 500,
              color: '#64748B',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 150ms',
              position: 'relative',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#0F172A'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#64748B'; }}
          >
            Cheltuieli
          </button>
          <button
            style={{
              padding: '0 20px',
              fontSize: 14,
              fontWeight: 500,
              color: '#0F172A',
              background: 'none',
              border: 'none',
              cursor: 'default',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            Deconturi Recurente
            <span
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 2,
                background: 'linear-gradient(135deg, #EC4899, #EE4379, #86198F)',
                borderRadius: '2px 2px 0 0',
              }}
            />
          </button>
        </div>

        <div style={{ flex: 1 }} />

        {/* CTA button */}
        <button
          onClick={openAdd}
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
            transition: 'box-shadow 200ms, transform 100ms',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(236,72,153,0.35)'; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)'; }}
        >
          <Plus style={{ width: 16, height: 16 }} />
          Adaugă decont recurent
        </button>
      </div>

      {/* ─── Table card ─── */}
      <div
        style={{
          margin: '16px 24px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 8,
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* Scrollable table area */}
        <div style={{ flex: 1, overflowX: 'auto', overflowY: 'auto', minHeight: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC' }}>
                <th style={thStyle({ width: 60, textAlign: 'center' })}>Activ</th>
                <th style={thStyle({ textAlign: 'left' })}>Denumire</th>
                <th style={thStyle({ textAlign: 'left' })}>Furnizor</th>
                <th style={thStyle({ width: 90, textAlign: 'center' })}>Zi plata</th>
                <th style={thStyle({ width: 120, textAlign: 'right' })}>Suma</th>
                <th style={thStyle({ width: 80, textAlign: 'left' })}>Moneda</th>
                <th style={thStyle({ width: 100, textAlign: 'left' })}>Tip</th>
                <th style={thStyle({ width: 140, textAlign: 'left' })}>Urmatoarea plata</th>
                <th style={thStyle({ width: 80, textAlign: 'center' })}>Actiuni</th>
              </tr>
            </thead>
            <tbody>
              {recurring.map(item => {
                const isHovered = hoveredRow === item.id;
                return (
                  <tr
                    key={item.id}
                    onMouseEnter={() => setHoveredRow(item.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{
                      borderBottom: '1px solid #F1F5F9',
                      opacity: item.isActive ? 1 : 0.5,
                      backgroundColor: isHovered && item.isActive ? '#F8FAFC' : 'transparent',
                      transition: 'background-color 150ms',
                    }}
                  >
                    {/* Toggle */}
                    <td style={tdStyle(item.isActive, { textAlign: 'center' })}>
                      <Toggle
                        checked={item.isActive}
                        onChange={() => handleToggle(item)}
                      />
                    </td>

                    {/* Denumire */}
                    <td style={tdStyle(item.isActive, { fontWeight: 600, fontSize: 14 })}>
                      {item.name}
                    </td>

                    {/* Furnizor */}
                    <td style={tdStyle(item.isActive)}>
                      {item.supplier}
                    </td>

                    {/* Zi plata */}
                    <td style={tdStyle(item.isActive, { textAlign: 'center' })}>
                      {item.paymentDay}
                    </td>

                    {/* Suma */}
                    <td style={tdStyle(item.isActive, { fontWeight: 600, textAlign: 'right', fontVariantNumeric: 'tabular-nums' })}>
                      {formatAmount(item.amount)}
                    </td>

                    {/* Moneda */}
                    <td style={tdStyle(item.isActive)}>
                      <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                        <CurrencyFlag currency={item.currency} />
                        {item.currency}
                      </span>
                    </td>

                    {/* Tip */}
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          fontSize: 12,
                          fontWeight: 500,
                          borderRadius: 4,
                          padding: '2px 8px',
                          lineHeight: '20px',
                          ...(item.tipDecont === 'Final'
                            ? {
                                backgroundColor: '#F0FDF4',
                                color: '#15803D',
                                border: '1px solid #BBF7D0',
                              }
                            : {
                                backgroundColor: '#F8FAFC',
                                color: '#64748B',
                                border: '1px solid #E2E8F0',
                              }),
                        }}
                      >
                        {item.tipDecont || 'Recurent'}
                      </span>
                    </td>

                    {/* Urmatoarea plata */}
                    <td style={tdStyle(item.isActive)}>
                      {item.isActive ? formatDate(getNextPaymentDate(item.paymentDay)) : '\u2014'}
                    </td>

                    {/* Actiuni */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                        <ActionButton
                          icon={<Pencil style={{ width: 14, height: 14 }} />}
                          title="Editeaza"
                          hoverColor="#3B82F6"
                          hoverBg="#EFF6FF"
                          onClick={() => openEdit(item)}
                        />
                        <ActionButton
                          icon={<Trash2 style={{ width: 14, height: 14 }} />}
                          title="Sterge"
                          hoverColor="#EF4444"
                          hoverBg="#FEF2F2"
                          onClick={() => openDelete(item)}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ─── Footer ─── */}
        {recurring.length > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 24px',
              backgroundColor: '#F8FAFC',
              borderTop: '1px solid #E2E8F0',
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 14, color: '#64748B' }}>
              {recurring.filter(r => r.isActive).length} active din {recurring.length} deconturi
            </span>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>
              Total lunar: {formatAmount(recurring.filter(r => r.isActive).reduce((s, r) => s + (r.amount || 0), 0))} RON
            </span>
          </div>
        )}
      </div>

      {/* ─── Toast ─── */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 60,
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: 8,
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            fontSize: 14,
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          <Check style={{ width: 16, height: 16, color: '#4ADE80' }} />
          {toast}
        </div>
      )}

      {/* ═══════════════════ ADD MODAL ═══════════════════ */}
      {showAddModal && (
        <div style={modalBackdropStyle}>
          <div style={modalOverlayStyle} onClick={() => setShowAddModal(false)} />
          <div style={{ ...modalCardBase, maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={modalHeaderStyle}>
              <h2 style={modalTitleStyle}>Adaugă decont recurent</h2>
              <button
                onClick={() => setShowAddModal(false)}
                style={modalCloseStyle}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F1F5F9'; e.currentTarget.style.color = '#0F172A'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#94A3B8'; }}
              >
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>
            <div style={modalBodyStyle}>
              {renderForm()}
            </div>
            <div style={modalFooterStyle}>
              <button
                onClick={() => setShowAddModal(false)}
                style={cancelBtnStyle}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F8FAFC'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
              >
                Anuleaza
              </button>
              <button
                onClick={saveAdd}
                disabled={!formData.name.trim()}
                style={{
                  ...actionBtnBase,
                  background: 'linear-gradient(135deg, #EC4899, #EE4379, #86198F)',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  opacity: !formData.name.trim() ? 0.5 : 1,
                  cursor: !formData.name.trim() ? 'not-allowed' : 'pointer',
                }}
              >
                Adauga decont
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════ EDIT MODAL ═══════════════════ */}
      {showEditModal && (
        <div style={modalBackdropStyle}>
          <div style={modalOverlayStyle} onClick={() => setShowEditModal(false)} />
          <div style={{ ...modalCardBase, maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={modalHeaderStyle}>
              <h2 style={modalTitleStyle}>Editeaza decont recurent</h2>
              <button
                onClick={() => setShowEditModal(false)}
                style={modalCloseStyle}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F1F5F9'; e.currentTarget.style.color = '#0F172A'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#94A3B8'; }}
              >
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>
            <div style={modalBodyStyle}>
              {renderForm()}
            </div>
            <div style={modalFooterStyle}>
              <button
                onClick={() => setShowEditModal(false)}
                style={cancelBtnStyle}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F8FAFC'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
              >
                Anuleaza
              </button>
              <button
                onClick={saveEdit}
                disabled={!formData.name.trim()}
                style={{
                  ...actionBtnBase,
                  backgroundColor: '#18181B',
                  opacity: !formData.name.trim() ? 0.5 : 1,
                  cursor: !formData.name.trim() ? 'not-allowed' : 'pointer',
                }}
              >
                Salveaza modificarile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════ DEACTIVATE MODAL ═══════════════════ */}
      {showDeactivateModal && selectedItem && (
        <div style={modalBackdropStyle}>
          <div style={modalOverlayStyle} onClick={() => setShowDeactivateModal(false)} />
          <div style={{ ...modalCardBase, maxWidth: 480 }}>
            <div style={modalHeaderStyle}>
              <h2 style={modalTitleStyle}>Inactiveaza decontul recurent?</h2>
              <button
                onClick={() => setShowDeactivateModal(false)}
                style={modalCloseStyle}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F1F5F9'; e.currentTarget.style.color = '#0F172A'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#94A3B8'; }}
              >
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>
            <div style={modalBodyStyle}>
              <p style={{ fontSize: 14, color: '#64748B', marginBottom: 16, marginTop: 0 }}>
                Decontul nu va mai genera plati automate. Poti sa-l reactivezi oricand.
              </p>
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: 8,
                  padding: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                <InfoRow label="Denumire" value={selectedItem.name} />
                <InfoRow label="Furnizor" value={selectedItem.supplier} />
                <InfoRow label="Suma" value={`${formatAmount(selectedItem.amount)} ${selectedItem.currency}`} bold />
                <InfoRow label="Zi plata" value={selectedItem.paymentDay} />
              </div>
            </div>
            <div style={modalFooterStyle}>
              <button
                onClick={() => setShowDeactivateModal(false)}
                style={cancelBtnStyle}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F8FAFC'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
              >
                Anuleaza
              </button>
              <button
                onClick={confirmDeactivate}
                style={{
                  ...actionBtnBase,
                  backgroundColor: '#F97316',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#EA580C'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#F97316'; }}
              >
                <PauseCircle style={{ width: 16, height: 16 }} />
                Inactiveaza decontul
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════ DELETE MODAL ═══════════════════ */}
      {showDeleteModal && selectedItem && (
        <div style={modalBackdropStyle}>
          <div style={modalOverlayStyle} onClick={() => setShowDeleteModal(false)} />
          <div style={{ ...modalCardBase, maxWidth: 480 }}>
            <div style={modalHeaderStyle}>
              <h2 style={modalTitleStyle}>Sterge decontul recurent?</h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={modalCloseStyle}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F1F5F9'; e.currentTarget.style.color = '#0F172A'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#94A3B8'; }}
              >
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>
            <div style={modalBodyStyle}>
              <p style={{ fontSize: 14, color: '#64748B', marginBottom: 16, marginTop: 0 }}>
                Esti sigur ca vrei sa stergi decontul <span style={{ fontWeight: 600, color: '#0F172A' }}>{selectedItem.name}</span>?
                Aceasta actiune nu poate fi anulata.
              </p>
              <div
                style={{
                  backgroundColor: '#FEF2F2',
                  borderRadius: 8,
                  padding: 16,
                  border: '1px solid #FECACA',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                <InfoRow label="Furnizor" value={selectedItem.supplier} />
                <InfoRow label="Suma" value={`${formatAmount(selectedItem.amount)} ${selectedItem.currency}`} bold />
              </div>
            </div>
            <div style={modalFooterStyle}>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={cancelBtnStyle}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F8FAFC'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
              >
                Anuleaza
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  ...actionBtnBase,
                  backgroundColor: '#DC2626',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#B91C1C'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#DC2626'; }}
              >
                <Trash2 style={{ width: 16, height: 16 }} />
                Sterge decontul
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Small helper components ─── */

function ActionButton({ icon, title, hoverColor, hoverBg, onClick }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 28,
        height: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        border: 'none',
        backgroundColor: hovered ? hoverBg : 'transparent',
        color: hovered ? hoverColor : '#94A3B8',
        cursor: 'pointer',
        transition: 'all 150ms',
        padding: 0,
      }}
    >
      {icon}
    </button>
  );
}

function InfoRow({ label, value, bold }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
      <span style={{ color: '#64748B' }}>{label}</span>
      <span style={{ fontWeight: bold ? 700 : 500, color: '#0F172A' }}>{value}</span>
    </div>
  );
}
