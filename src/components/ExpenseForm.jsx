import { useState, useEffect } from 'react';
import { flatCategories, suppliers } from '../data/mockData';
import CurrencyFlag from './CurrencyFlag';
import { parseAmount } from '../data/utils';

const inputStyle = {
  width: '100%', height: 40, padding: '8px 12px',
  border: '1px solid #E2E8F0', borderRadius: 6,
  fontSize: 14, color: '#0F172A', background: '#FFFFFF',
  outline: 'none', fontFamily: 'inherit',
  transition: 'border-color 0.15s, box-shadow 0.15s',
};
const inputFocus = { borderColor: '#18181B', boxShadow: '0 0 0 2px rgba(24,24,27,0.1)' };
const labelStyle = { display: 'block', fontSize: 14, fontWeight: 500, color: '#0F172A', marginBottom: 6 };
const errorStyle = { fontSize: 12, color: '#EF4444', marginTop: 4 };

export default function ExpenseForm({ expense, isRecurring, onSave, onCancel }) {
  const [form, setForm] = useState({
    date: '', supplier: '', invoiceNumber: '', description: '',
    category: '', amount: '', currency: 'EUR', status: 'Neplătit',
    name: '', paymentDay: '', tipDecont: 'Recurent',
  });
  const [errors, setErrors] = useState({});
  const [supplierSuggestions, setSupplierSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (expense) setForm({
      date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : '',
      supplier: expense.supplier || '', invoiceNumber: expense.invoiceNumber || '',
      description: expense.description || '', category: expense.type || expense.category || '',
      amount: expense.amount ? expense.amount.toString() : '', currency: expense.currency || 'EUR',
      status: expense.status || 'Neplătit', name: expense.name || '',
      paymentDay: expense.paymentDay ? expense.paymentDay.toString() : '',
      tipDecont: expense.tipDecont || 'Recurent',
    });
  }, [expense]);

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
    if (field === 'supplier' && value.length >= 2) {
      const matches = suppliers.filter(s => s.toLowerCase().includes(value.toLowerCase()));
      setSupplierSuggestions(matches);
      setShowSuggestions(matches.length > 0);
    } else if (field === 'supplier') setShowSuggestions(false);
  }

  function validate() {
    const e = {};
    if (!form.supplier || form.supplier.length < 2) e.supplier = 'Furnizor obligatoriu';
    if (!form.amount || parseAmount(form.amount) <= 0) e.amount = 'Suma trebuie > 0';
    if (!form.category) e.category = 'Categorie obligatorie';
    if (isRecurring) {
      if (!form.name || form.name.length < 3) e.name = 'Denumire obligatorie (min 3 caractere)';
      const day = parseInt(form.paymentDay);
      if (!day || day < 1 || day > 28) e.paymentDay = 'Zi plată între 1 și 28';
    } else { if (!form.date) e.date = 'Data obligatorie'; }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    onSave({ ...form, amount: parseAmount(form.amount), paymentDay: parseInt(form.paymentDay) || undefined, date: form.date ? new Date(form.date) : undefined, type: form.category });
  }

  function Input({ value, onChange, type = 'text', placeholder, style: extra }) {
    return (
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ ...inputStyle, ...extra }}
        onFocus={e => Object.assign(e.target.style, inputFocus)}
        onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
        {isRecurring && (
          <div style={{ gridColumn: 'span 2' }}>
            <label style={labelStyle}>Denumire decont</label>
            <Input value={form.name} onChange={v => handleChange('name', v)} placeholder="ex: Chirie birou" />
            {errors.name && <p style={errorStyle}>{errors.name}</p>}
          </div>
        )}

        {!isRecurring && (
          <div>
            <label style={labelStyle}>Data</label>
            <Input type="date" value={form.date} onChange={v => handleChange('date', v)} />
            {errors.date && <p style={errorStyle}>{errors.date}</p>}
          </div>
        )}

        {isRecurring && (
          <div>
            <label style={labelStyle}>Zi plată (1-28)</label>
            <Input type="number" value={form.paymentDay} onChange={v => handleChange('paymentDay', v)} placeholder="15" />
            {errors.paymentDay && <p style={errorStyle}>{errors.paymentDay}</p>}
          </div>
        )}

        <div style={{ position: 'relative' }}>
          <label style={labelStyle}>Furnizor</label>
          <Input value={form.supplier} onChange={v => handleChange('supplier', v)} placeholder="Introduce numele furnizor" />
          {showSuggestions && (
            <div style={{ position: 'absolute', zIndex: 10, width: '100%', marginTop: 4, background: 'white', border: '1px solid #E2E8F0', borderRadius: 8, boxShadow: '0 4px 6px rgba(0,0,0,0.1)', maxHeight: 160, overflowY: 'auto' }}>
              {supplierSuggestions.map((s, i) => (
                <div key={i} onClick={() => { handleChange('supplier', s); setShowSuggestions(false); }}
                  style={{ padding: '8px 12px', fontSize: 14, cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'}
                  onMouseLeave={e => e.currentTarget.style.background = 'white'}
                >{s}</div>
              ))}
            </div>
          )}
          {errors.supplier && <p style={errorStyle}>{errors.supplier}</p>}
        </div>

        {!isRecurring && (
          <div>
            <label style={labelStyle}>Nr. Factură</label>
            <Input value={form.invoiceNumber} onChange={v => handleChange('invoiceNumber', v)} placeholder="ex: FAC-2024-001" />
          </div>
        )}

        <div>
          <label style={labelStyle}>Categorie</label>
          <select value={form.category} onChange={e => handleChange('category', e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer', appearance: 'auto' }}
            onFocus={e => Object.assign(e.target.style, inputFocus)}
            onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }}
          >
            <option value="">Selectează categorie</option>
            {flatCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {errors.category && <p style={errorStyle}>{errors.category}</p>}
        </div>

        <div>
          <label style={labelStyle}>Sumă</label>
          <div style={{ position: 'relative' }}>
            <Input value={form.amount} onChange={v => handleChange('amount', v)} placeholder="0" style={{ paddingRight: 40 }} />
            <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>
              <CurrencyFlag currency={form.currency} />
            </div>
          </div>
          {errors.amount && <p style={errorStyle}>{errors.amount}</p>}
        </div>

        <div>
          <label style={labelStyle}>Monedă</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {['EUR', 'RON'].map(cur => (
              <button key={cur} type="button" onClick={() => handleChange('currency', cur)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  height: 40, padding: '0 16px',
                  border: form.currency === cur ? '2px solid #2563EB' : '1px solid #E2E8F0',
                  borderRadius: 6, background: form.currency === cur ? '#EFF6FF' : 'white',
                  color: form.currency === cur ? '#1D4ED8' : '#64748B',
                  fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                }}>
                <CurrencyFlag currency={cur} /> {cur}
              </button>
            ))}
          </div>
        </div>

        {isRecurring && (
          <div>
            <label style={labelStyle}>Tip Decont</label>
            <div style={{ display: 'flex', borderRadius: 6, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              {['Recurent', 'Final'].map(tip => (
                <button key={tip} type="button" onClick={() => handleChange('tipDecont', tip)}
                  style={{
                    flex: 1, height: 40, border: 'none',
                    background: form.tipDecont === tip ? '#18181B' : 'white',
                    color: form.tipDecont === tip ? 'white' : '#64748B',
                    fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                  }}>{tip}</button>
              ))}
            </div>
          </div>
        )}

        <div style={{ gridColumn: 'span 2' }}>
          <label style={labelStyle}>Descriere</label>
          <textarea value={form.description} onChange={e => handleChange('description', e.target.value)}
            placeholder="Descriere opțională" rows={3} maxLength={500}
            style={{ ...inputStyle, height: 'auto', padding: 12, resize: 'none', fontFamily: 'inherit' }}
            onFocus={e => Object.assign(e.target.style, inputFocus)}
            onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }}
          />
          <p style={{ fontSize: 12, color: '#94A3B8', textAlign: 'right', marginTop: 4 }}>{form.description.length}/500</p>
        </div>

        {!isRecurring && (
          <div style={{ gridColumn: 'span 2' }}>
            <label style={labelStyle}>Status</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Plătit', 'Neplătit'].map(s => (
                <button key={s} type="button" onClick={() => handleChange('status', s)}
                  style={{
                    height: 36, padding: '0 16px', borderRadius: 20,
                    border: '1px solid',
                    borderColor: form.status === s ? (s === 'Plătit' ? '#BBF7D0' : '#FECACA') : '#E2E8F0',
                    background: form.status === s ? (s === 'Plătit' ? '#F0FDF4' : '#FEF2F2') : 'white',
                    color: form.status === s ? (s === 'Plătit' ? '#15803D' : '#B91C1C') : '#64748B',
                    fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                  }}>{s}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 32, paddingTop: 24, borderTop: '1px solid #E2E8F0' }}>
        <button type="button" onClick={onCancel}
          style={{ height: 40, padding: '0 16px', borderRadius: 6, border: '1px solid #E2E8F0', background: 'white', fontSize: 14, fontWeight: 500, color: '#64748B', cursor: 'pointer', fontFamily: 'inherit' }}>
          Anulează
        </button>
        <button type="submit"
          style={{ height: 40, padding: '0 16px', borderRadius: 6, border: 'none', background: '#18181B', color: '#FAFAFA', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
          {expense ? 'Salvează modificările' : isRecurring ? 'Adaugă decont' : 'Adaugă cheltuială'}
        </button>
      </div>
    </form>
  );
}
