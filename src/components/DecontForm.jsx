import { useState, useEffect, useCallback } from 'react';
import { X, Trash2, ArrowUp, ChevronDown, Check, Calendar } from 'lucide-react';

const MONTHS_RO = ['ian', 'feb', 'mar', 'apr', 'mai', 'iun', 'iul', 'aug', 'sep', 'oct', 'nov', 'dec'];

function generateIdBono() {
  const year = new Date().getFullYear();
  const rand = String(Math.floor(Math.random() * 900) + 100);
  return `BN-${year}-${rand}`;
}

function formatDateRo(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const mon = MONTHS_RO[d.getMonth()];
  const year = String(d.getFullYear()).slice(-2);
  return `${day}.${mon}.${year}`;
}

const formatAmount = (val) => {
  if (val === '' || val === null || val === undefined) return '';
  const num = parseFloat(val);
  if (isNaN(num)) return '';
  return new Intl.NumberFormat('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
};

const parseAmount = (str) => {
  if (!str) return '';
  const cleaned = str.replace(/\./g, '').replace(',', '.');
  const num = parseFloat(cleaned);
  return isNaN(num) ? '' : num;
};

// ---- Shared style tokens ----
const DS = {
  bg: '#F8FAFC',
  cardBg: '#FFFFFF',
  border: '#E2E8F0',
  textPrimary: '#0F172A',
  textMuted: '#64748B',
  gradient: 'linear-gradient(135deg, #EC4899, #EE4379, #86198F)',
  pink: '#EC4899',
  pinkLight: '#FDF2F8',
  green: '#22C55E',
  greenLight: '#F0FDF4',
  yellow: '#EAB308',
  yellowLight: '#FEFCE8',
  red: '#EF4444',
  badgeBg: '#F1F5F9',
  shadowSm: '0 1px 2px rgba(0,0,0,0.05)',
  shadowBtn: '0 4px 15px rgba(236,72,153,0.3)',
  shadowBtnHover: '0 6px 20px rgba(236,72,153,0.45)',
  radius: 14,
  radiusMd: 6,
  radiusLg: 8,
  radiusXl: 12,
};

const inputBase = {
  background: DS.cardBg,
  border: `1px solid ${DS.border}`,
  borderRadius: DS.radius,
  padding: '10px 16px',
  fontFamily: 'inherit',
  fontSize: 14,
  color: DS.textPrimary,
  height: 40,
  boxSizing: 'border-box',
  outline: 'none',
  width: '100%',
  transition: 'border-color 0.15s ease',
};

const labelStyle = {
  fontSize: 12,
  color: DS.textMuted,
  fontWeight: 500,
  marginBottom: 4,
  display: 'block',
};

const fieldRowLabel = {
  width: 120,
  flexShrink: 0,
  fontSize: 13,
  color: DS.textMuted,
  fontWeight: 500,
  paddingTop: 10,
};

export default function DecontForm({
  onClose,
  onSave,
  decontSuppliers = [],
  conturiPL = [],
  luniPL = [],
  editingDecont = null,
}) {
  // ---- State ----
  const [idBono] = useState(() => editingDecont?.idBono || generateIdBono());
  const [dataIncarcarii] = useState(() => editingDecont?.dataIncarcarii || new Date().toISOString());
  const [tip, setTip] = useState(editingDecont?.tip || 'Factură');
  const [platit, setPlatit] = useState(editingDecont?.platit || false);
  const [aprobat, setAprobat] = useState(editingDecont?.aprobat || false);
  const [status, setStatus] = useState(editingDecont?.status || 'D');

  // Supplier
  const [furnizorNume, setFurnizorNume] = useState(editingDecont?.furnizorNume || '');
  const [furnizorCUI, setFurnizorCUI] = useState(editingDecont?.furnizorCUI || '');
  const [supplierSearch, setSupplierSearch] = useState('');
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [addSupplierMode, setAddSupplierMode] = useState(false);
  const [newSupplierName, setNewSupplierName] = useState('');
  const [newSupplierCUI, setNewSupplierCUI] = useState('');
  const [newSupplierTara, setNewSupplierTara] = useState('România');

  // Document
  const [numarDocument, setNumarDocument] = useState(editingDecont?.numarDocument || '');
  const [dataDocument, setDataDocument] = useState(editingDecont?.dataDocument || '');

  // Description
  const [descriere, setDescriere] = useState(editingDecont?.descriere || '');

  // P&L fields
  const [tags, setTags] = useState(editingDecont?.tags || '');
  const [selectedCont, setSelectedCont] = useState(editingDecont?.cont || '');
  const [selectedSubcont, setSelectedSubcont] = useState(editingDecont?.subcont || '');
  const [lunaPL, setLunaPL] = useState(editingDecont?.lunaPL || '');
  const [tvaDeductibil, setTvaDeductibil] = useState(editingDecont?.tvaDeductibil || false);

  // Amounts
  const [sumaCuTVA, setSumaCuTVA] = useState(editingDecont?.sumaCuTVA ?? '');
  const [sumaFaraTVA, setSumaFaraTVA] = useState(editingDecont?.sumaFaraTVA ?? '');
  const [tvaRate, setTvaRate] = useState(editingDecont?.tvaRate ?? 21);
  const [tvaAmount, setTvaAmount] = useState(editingDecont?.tvaAmount ?? '');
  const [lastEditedField, setLastEditedField] = useState('cuTVA');

  // Hover states
  const [hoverSave, setHoverSave] = useState(false);
  const [hoverClose, setHoverClose] = useState(false);
  const [hoverDelete, setHoverDelete] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // ---- Supplier autocomplete ----
  const filteredSuppliers = supplierSearch.length >= 3
    ? decontSuppliers.filter(s => s.name.toLowerCase().includes(supplierSearch.toLowerCase()))
    : [];

  const handleSupplierSelect = (supplier) => {
    setFurnizorNume(supplier.name);
    setFurnizorCUI(supplier.cui);
    setSupplierSearch(supplier.name);
    setShowSupplierDropdown(false);
  };

  const handleSupplierInputChange = (val) => {
    setSupplierSearch(val);
    setFurnizorNume(val);
    setFurnizorCUI('');
    setShowSupplierDropdown(val.length >= 3);
    setAddSupplierMode(false);
  };

  const handleAddSupplierClick = () => {
    setAddSupplierMode(true);
    setNewSupplierName(supplierSearch);
    setNewSupplierCUI('');
    setNewSupplierTara('România');
    setShowSupplierDropdown(false);
  };

  const handleSaveNewSupplier = () => {
    setFurnizorNume(newSupplierName);
    setFurnizorCUI(newSupplierCUI);
    setSupplierSearch(newSupplierName);
    setAddSupplierMode(false);
  };

  // ---- Subcont options ----
  const currentCont = conturiPL.find(c => c.id === selectedCont);
  const subconturi = currentCont?.subconturi || [];

  // ---- TVA auto-calc ----
  const recalculate = useCallback((field, cuTVA, faraTVA, rate) => {
    const r = rate / 100;
    if (field === 'cuTVA' && cuTVA !== '') {
      const cu = parseFloat(cuTVA);
      if (!isNaN(cu)) {
        const fara = cu / (1 + r);
        const tva = cu - fara;
        setSumaFaraTVA(Math.round(fara * 100) / 100);
        setTvaAmount(Math.round(tva * 100) / 100);
      }
    } else if (field === 'faraTVA' && faraTVA !== '') {
      const fara = parseFloat(faraTVA);
      if (!isNaN(fara)) {
        const cu = fara * (1 + r);
        const tva = cu - fara;
        setSumaCuTVA(Math.round(cu * 100) / 100);
        setTvaAmount(Math.round(tva * 100) / 100);
      }
    }
  }, []);

  useEffect(() => {
    if (tvaDeductibil) {
      recalculate(lastEditedField, sumaCuTVA, sumaFaraTVA, tvaRate);
    }
  }, [tvaRate, tvaDeductibil, recalculate, lastEditedField, sumaCuTVA, sumaFaraTVA]);

  // ---- Save ----
  const handleSave = () => {
    const data = {
      idBono,
      dataIncarcarii,
      tip,
      platit,
      aprobat,
      status,
      furnizorNume,
      furnizorCUI,
      numarDocument,
      dataDocument,
      descriere,
      tags,
      cont: selectedCont,
      subcont: selectedSubcont,
      lunaPL,
      tvaDeductibil,
      sumaCuTVA: sumaCuTVA !== '' ? parseFloat(sumaCuTVA) : 0,
      sumaFaraTVA: tvaDeductibil && sumaFaraTVA !== '' ? parseFloat(sumaFaraTVA) : null,
      tvaRate: tvaDeductibil ? tvaRate : null,
      tvaAmount: tvaDeductibil && tvaAmount !== '' ? parseFloat(tvaAmount) : null,
      linii: 1,
    };
    onSave(data);
  };

  // ---- Status cycling ----
  const cycleStatus = () => {
    const order = ['D', 'F', 'R'];
    const idx = order.indexOf(status);
    setStatus(order[(idx + 1) % order.length]);
  };

  const statusConfig = {
    D: { label: 'D', bg: DS.yellowLight, color: DS.yellow, title: 'Draft' },
    F: { label: 'F', bg: DS.greenLight, color: DS.green, title: 'Final' },
    R: { label: 'R', bg: DS.badgeBg, color: DS.textMuted, title: 'Recurent' },
  };

  const getInputStyle = (fieldName) => ({
    ...inputBase,
    borderColor: focusedField === fieldName ? DS.pink : DS.border,
  });

  const selectWrapperStyle = { position: 'relative', width: '100%' };

  const selectStyle = (fieldName) => ({
    ...inputBase,
    borderColor: focusedField === fieldName ? DS.pink : DS.border,
    appearance: 'none',
    WebkitAppearance: 'none',
    paddingRight: 40,
    cursor: 'pointer',
    background: DS.cardBg,
  });

  const chevronStyle = {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
    color: DS.textMuted,
  };

  // ---- Render ----
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: DS.bg,
      fontFamily: 'inherit',
    }}>
      {/* Vertical label on left */}
      <div style={{
        width: 50,
        minHeight: '100vh',
        background: DS.gradient,
        borderRadius: '12px 0 0 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        alignSelf: 'flex-start',
        height: '100vh',
      }}>
        <span style={{
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          color: '#FFFFFF',
          fontWeight: 700,
          fontSize: 14,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}>
          Formular decont
        </span>
      </div>

      {/* Main content area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Info Bar */}
        <div style={{
          background: DS.cardBg,
          borderBottom: `1px solid ${DS.border}`,
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          position: 'sticky',
          top: 0,
          zIndex: 20,
          flexWrap: 'wrap',
        }}>
          {/* Close button */}
          <button
            onClick={onClose}
            onMouseEnter={() => setHoverClose(true)}
            onMouseLeave={() => setHoverClose(false)}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: DS.gradient,
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              opacity: hoverClose ? 0.85 : 1,
              transition: 'opacity 0.15s ease',
            }}
          >
            <X size={18} color="#FFFFFF" strokeWidth={2.5} />
          </button>

          {/* IdBono */}
          <div style={{ flexShrink: 0 }}>
            <div style={labelStyle}>IdBono</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: DS.textPrimary }}>{idBono}</div>
          </div>

          {/* Data incarcarii */}
          <div style={{ flexShrink: 0 }}>
            <div style={labelStyle}>Data încărcării</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: DS.textPrimary }}>
              {formatDateRo(dataIncarcarii)}
            </div>
          </div>

          {/* Adaugat de */}
          <div style={{ flexShrink: 0 }}>
            <div style={labelStyle}>Adăugat de</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: DS.textPrimary }}>Bogdan</div>
          </div>

          {/* Tip */}
          <div style={{ flexShrink: 0 }}>
            <div style={labelStyle}>Tip</div>
            <select
              value={tip}
              onChange={e => setTip(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: `1px solid ${DS.textMuted}`,
                fontSize: 13,
                fontWeight: 500,
                color: DS.textPrimary,
                fontFamily: 'inherit',
                cursor: 'pointer',
                outline: 'none',
                padding: '2px 4px',
              }}
            >
              <option value="Factură">Factură</option>
              <option value="Bon">Bon</option>
              <option value="Chitanță">Chitanță</option>
            </select>
          </div>

          {/* Valuta */}
          <div style={{
            background: DS.badgeBg,
            borderRadius: 4,
            padding: '4px 10px',
            fontSize: 12,
            fontWeight: 600,
            color: DS.textPrimary,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}>
            <span style={{ fontSize: 11 }}>🇷🇴</span> RON
          </div>

          {/* Linii */}
          <div style={{ flexShrink: 0 }}>
            <div style={labelStyle}>Linii</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: DS.textPrimary }}>1</div>
          </div>

          {/* Platit toggle */}
          <div
            style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, cursor: 'pointer' }}
            onClick={() => setPlatit(!platit)}
          >
            <div style={labelStyle}>Plătit</div>
            <div style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: platit ? DS.green : '#D1D5DB',
              transition: 'background 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {platit && <Check size={13} color="#FFF" strokeWidth={3} />}
            </div>
          </div>

          {/* Aprobat toggle */}
          <div
            style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, cursor: 'pointer' }}
            onClick={() => setAprobat(!aprobat)}
          >
            <div style={labelStyle}>Aprobat</div>
            <div style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: aprobat ? DS.green : '#D1D5DB',
              transition: 'background 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {aprobat && <Check size={13} color="#FFF" strokeWidth={3} />}
            </div>
          </div>

          {/* Status badge */}
          <div
            onClick={cycleStatus}
            title={statusConfig[status].title}
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: statusConfig[status].bg,
              color: statusConfig[status].color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              border: `1.5px solid ${statusConfig[status].color}`,
              flexShrink: 0,
              transition: 'all 0.15s ease',
            }}
          >
            {statusConfig[status].label}
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Delete */}
          <button
            onMouseEnter={() => setHoverDelete(true)}
            onMouseLeave={() => setHoverDelete(false)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.15s ease',
            }}
            title="Șterge"
          >
            <Trash2 size={18} color={hoverDelete ? DS.red : DS.textMuted} />
          </button>
        </div>

        {/* Form content — scrollable */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '32px 48px 48px',
          maxWidth: 820,
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box',
        }}>
          {/* 4.1 Supplier & Document Card */}
          <div style={{
            background: DS.cardBg,
            border: `1px solid ${DS.border}`,
            borderRadius: 14,
            padding: 24,
            boxShadow: DS.shadowSm,
            marginBottom: 24,
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 16,
            }}>
              {/* Furnizor Nume */}
              <div style={{ position: 'relative' }}>
                <label style={labelStyle}>Furnizor Nume</label>
                <input
                  type="text"
                  value={supplierSearch || furnizorNume}
                  onChange={e => handleSupplierInputChange(e.target.value)}
                  onFocus={() => {
                    setFocusedField('furnizorNume');
                    if (supplierSearch.length >= 3) setShowSupplierDropdown(true);
                  }}
                  onBlur={() => {
                    setFocusedField(null);
                    setTimeout(() => setShowSupplierDropdown(false), 200);
                  }}
                  placeholder="Caută furnizor..."
                  style={getInputStyle('furnizorNume')}
                />
                {showSupplierDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: DS.cardBg,
                    border: `1px solid ${DS.border}`,
                    borderRadius: 8,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    zIndex: 30,
                    maxHeight: 180,
                    overflowY: 'auto',
                    marginTop: 4,
                  }}>
                    {filteredSuppliers.map((s, i) => (
                      <div
                        key={i}
                        onMouseDown={() => handleSupplierSelect(s)}
                        style={{
                          padding: '10px 14px',
                          fontSize: 13,
                          cursor: 'pointer',
                          borderBottom: i < filteredSuppliers.length - 1 ? `1px solid ${DS.border}` : 'none',
                          color: DS.textPrimary,
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = DS.badgeBg}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{ fontWeight: 500 }}>{s.name}</div>
                        <div style={{ fontSize: 11, color: DS.textMuted }}>{s.cui}</div>
                      </div>
                    ))}
                    {filteredSuppliers.length === 0 && (
                      <div
                        onMouseDown={handleAddSupplierClick}
                        style={{
                          padding: '10px 14px',
                          fontSize: 13,
                          cursor: 'pointer',
                          color: DS.pink,
                          fontWeight: 500,
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = DS.pinkLight}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        + Adaugă furnizor
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Furnizor CUI */}
              <div>
                <label style={labelStyle}>Furnizor CUI</label>
                <input
                  type="text"
                  value={furnizorCUI}
                  onChange={e => setFurnizorCUI(e.target.value)}
                  onFocus={() => setFocusedField('furnizorCUI')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="CUI..."
                  style={getInputStyle('furnizorCUI')}
                />
              </div>

              {/* Numar Document */}
              <div>
                <label style={labelStyle}>Număr Document</label>
                <input
                  type="text"
                  value={numarDocument}
                  onChange={e => setNumarDocument(e.target.value)}
                  onFocus={() => setFocusedField('numarDocument')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Număr..."
                  style={getInputStyle('numarDocument')}
                />
              </div>

              {/* Data Document */}
              <div style={{ position: 'relative' }}>
                <label style={labelStyle}>Data Document</label>
                <input
                  type="date"
                  value={dataDocument}
                  onChange={e => setDataDocument(e.target.value)}
                  onFocus={() => setFocusedField('dataDocument')}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    ...getInputStyle('dataDocument'),
                    colorScheme: 'light',
                  }}
                />
              </div>
            </div>

            {/* Add Supplier Popup */}
            {addSupplierMode && (
              <div style={{
                marginTop: 16,
                padding: 20,
                background: DS.badgeBg,
                borderRadius: 12,
                border: `1px solid ${DS.border}`,
              }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: DS.textPrimary, marginBottom: 12 }}>
                  Furnizor nou
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={labelStyle}>Nume firmă</label>
                    <input
                      type="text"
                      value={newSupplierName}
                      onChange={e => setNewSupplierName(e.target.value)}
                      onFocus={() => setFocusedField('newSupplierName')}
                      onBlur={() => setFocusedField(null)}
                      style={getInputStyle('newSupplierName')}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>CUI</label>
                    <input
                      type="text"
                      value={newSupplierCUI}
                      onChange={e => setNewSupplierCUI(e.target.value)}
                      onFocus={() => setFocusedField('newSupplierCUI')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="RO12345678"
                      style={getInputStyle('newSupplierCUI')}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Țara</label>
                    <div style={selectWrapperStyle}>
                      <select
                        value={newSupplierTara}
                        onChange={e => setNewSupplierTara(e.target.value)}
                        onFocus={() => setFocusedField('newSupplierTara')}
                        onBlur={() => setFocusedField(null)}
                        style={selectStyle('newSupplierTara')}
                      >
                        <option value="România">România</option>
                        <option value="Bulgaria">Bulgaria</option>
                        <option value="Ungaria">Ungaria</option>
                        <option value="Germania">Germania</option>
                        <option value="Altul">Altul</option>
                      </select>
                      <ChevronDown size={16} style={chevronStyle} />
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 14, justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => setAddSupplierMode(false)}
                    style={{
                      background: 'transparent',
                      border: `1px solid ${DS.border}`,
                      borderRadius: 9999,
                      padding: '8px 20px',
                      fontSize: 13,
                      fontWeight: 500,
                      color: DS.textMuted,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    Anulează
                  </button>
                  <button
                    onClick={handleSaveNewSupplier}
                    style={{
                      background: DS.gradient,
                      border: 'none',
                      borderRadius: 9999,
                      padding: '8px 20px',
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    Salvează furnizor
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 4.2 Description + Upload */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '3fr 2fr',
            gap: 16,
            marginBottom: 24,
          }}>
            {/* Description */}
            <div>
              <label style={labelStyle}>Descriere</label>
              <textarea
                rows={3}
                value={descriere}
                onChange={e => setDescriere(e.target.value)}
                onFocus={() => setFocusedField('descriere')}
                onBlur={() => setFocusedField(null)}
                placeholder="Servicii contabilitate - Trimestrul 1"
                style={{
                  ...inputBase,
                  height: 'auto',
                  resize: 'vertical',
                  borderColor: focusedField === 'descriere' ? DS.pink : DS.border,
                }}
              />
            </div>

            {/* Upload placeholder */}
            <div>
              <label style={labelStyle}>Document</label>
              <div style={{
                border: `2px dashed ${DS.border}`,
                borderRadius: 14,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                cursor: 'pointer',
                height: 80,
                transition: 'border-color 0.15s ease',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = DS.pink}
                onMouseLeave={e => e.currentTarget.style.borderColor = DS.border}
              >
                <ArrowUp size={20} color={DS.textMuted} />
                <span style={{ fontSize: 13, color: DS.textMuted, fontWeight: 500 }}>Încarcă document</span>
              </div>
            </div>
          </div>

          {/* 4.3 Vertical Fields */}
          <div style={{
            background: DS.cardBg,
            border: `1px solid ${DS.border}`,
            borderRadius: 14,
            padding: 24,
            boxShadow: DS.shadowSm,
            marginBottom: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}>
            {/* Tags */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={fieldRowLabel}>Tags</div>
              <input
                type="text"
                value={tags}
                onChange={e => setTags(e.target.value)}
                onFocus={() => setFocusedField('tags')}
                onBlur={() => setFocusedField(null)}
                placeholder="#tags"
                style={getInputStyle('tags')}
              />
            </div>

            {/* Cont */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={fieldRowLabel}>Cont</div>
              <div style={selectWrapperStyle}>
                <select
                  value={selectedCont}
                  onChange={e => {
                    setSelectedCont(e.target.value);
                    setSelectedSubcont('');
                  }}
                  onFocus={() => setFocusedField('cont')}
                  onBlur={() => setFocusedField(null)}
                  style={selectStyle('cont')}
                >
                  <option value="">Selectează cont...</option>
                  {conturiPL.map(c => (
                    <option key={c.id} value={c.id}>{c.id} — {c.name}</option>
                  ))}
                </select>
                <ChevronDown size={16} style={chevronStyle} />
              </div>
            </div>

            {/* Subcont */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={fieldRowLabel}>Subcont</div>
              <div style={selectWrapperStyle}>
                <select
                  value={selectedSubcont}
                  onChange={e => setSelectedSubcont(e.target.value)}
                  onFocus={() => setFocusedField('subcont')}
                  onBlur={() => setFocusedField(null)}
                  disabled={subconturi.length === 0}
                  style={{
                    ...selectStyle('subcont'),
                    opacity: subconturi.length === 0 ? 0.5 : 1,
                    cursor: subconturi.length === 0 ? 'not-allowed' : 'pointer',
                  }}
                >
                  <option value="">{subconturi.length === 0 ? 'Selectează cont mai întâi' : 'Selectează subcont...'}</option>
                  {subconturi.map((s, i) => (
                    <option key={i} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown size={16} style={chevronStyle} />
              </div>
            </div>

            {/* Luna P&L */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={fieldRowLabel}>Luna P&L</div>
              <div style={selectWrapperStyle}>
                <select
                  value={lunaPL}
                  onChange={e => setLunaPL(e.target.value)}
                  onFocus={() => setFocusedField('lunaPL')}
                  onBlur={() => setFocusedField(null)}
                  style={selectStyle('lunaPL')}
                >
                  <option value="">Selectează luna...</option>
                  {luniPL.map((l, i) => (
                    <option key={i} value={l}>{l}</option>
                  ))}
                </select>
                <ChevronDown size={16} style={chevronStyle} />
              </div>
            </div>

            {/* TVA Deductibil segmented control */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={fieldRowLabel}>TVA Deductibil</div>
              <div style={{
                display: 'flex',
                border: `1px solid ${DS.border}`,
                borderRadius: 9999,
                overflow: 'hidden',
                height: 40,
              }}>
                <button
                  onClick={() => setTvaDeductibil(true)}
                  style={{
                    padding: '0 20px',
                    border: 'none',
                    background: tvaDeductibil ? DS.pinkLight : DS.cardBg,
                    color: tvaDeductibil ? DS.pink : DS.textMuted,
                    fontWeight: tvaDeductibil ? 600 : 400,
                    fontSize: 13,
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tvaDeductibil && <Check size={14} />}
                  Da
                </button>
                <button
                  onClick={() => setTvaDeductibil(false)}
                  style={{
                    padding: '0 20px',
                    border: 'none',
                    borderLeft: `1px solid ${DS.border}`,
                    background: !tvaDeductibil ? DS.pinkLight : DS.cardBg,
                    color: !tvaDeductibil ? DS.pink : DS.textMuted,
                    fontWeight: !tvaDeductibil ? 600 : 400,
                    fontSize: 13,
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.15s ease',
                  }}
                >
                  {!tvaDeductibil && <X size={14} />}
                  Nu
                </button>
              </div>
            </div>

            {/* Suma cu TVA (always visible) */}
            {!tvaDeductibil && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={fieldRowLabel}>Suma cu TVA</div>
                <div style={{ flex: 1, position: 'relative' }}>
                  <input
                    type="text"
                    value={sumaCuTVA}
                    onChange={e => {
                      const raw = e.target.value.replace(/[^0-9.,]/g, '');
                      setSumaCuTVA(raw);
                    }}
                    onFocus={() => setFocusedField('sumaCuTVASimple')}
                    onBlur={() => {
                      setFocusedField(null);
                      const parsed = parseAmount(sumaCuTVA);
                      if (parsed !== '') setSumaCuTVA(parsed);
                    }}
                    placeholder="0,00"
                    style={{
                      ...getInputStyle('sumaCuTVASimple'),
                      paddingRight: 70,
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    right: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: DS.badgeBg,
                    borderRadius: 4,
                    padding: '3px 8px',
                    fontSize: 11,
                    fontWeight: 600,
                    color: DS.textPrimary,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                  }}>
                    <span style={{ fontSize: 10 }}>🇷🇴</span> Lei
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4.4 TVA Conditional Section */}
          <div style={{
            overflow: 'hidden',
            maxHeight: tvaDeductibil ? 400 : 0,
            opacity: tvaDeductibil ? 1 : 0,
            transition: 'max-height 0.35s ease, opacity 0.25s ease',
            marginBottom: tvaDeductibil ? 24 : 0,
          }}>
            <div style={{
              background: DS.cardBg,
              border: `1px solid ${DS.border}`,
              borderRadius: 14,
              padding: 24,
              boxShadow: DS.shadowSm,
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}>
              {/* Suma cu TVA */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={fieldRowLabel}>Suma cu TVA</div>
                <div style={{ flex: 1, position: 'relative' }}>
                  <input
                    type="text"
                    value={sumaCuTVA}
                    onChange={e => {
                      const raw = e.target.value.replace(/[^0-9.,]/g, '');
                      setSumaCuTVA(raw);
                      setLastEditedField('cuTVA');
                      const parsed = parseAmount(raw);
                      if (parsed !== '') {
                        recalculate('cuTVA', parsed, sumaFaraTVA, tvaRate);
                      }
                    }}
                    onFocus={() => setFocusedField('sumaCuTVA')}
                    onBlur={() => {
                      setFocusedField(null);
                      const parsed = parseAmount(sumaCuTVA);
                      if (parsed !== '') setSumaCuTVA(parsed);
                    }}
                    placeholder="0,00"
                    style={{
                      ...getInputStyle('sumaCuTVA'),
                      paddingRight: 70,
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    right: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: DS.badgeBg,
                    borderRadius: 4,
                    padding: '3px 8px',
                    fontSize: 11,
                    fontWeight: 600,
                    color: DS.textPrimary,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                  }}>
                    <span style={{ fontSize: 10 }}>🇷🇴</span> Lei
                  </div>
                </div>
              </div>

              {/* Suma fara TVA */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={fieldRowLabel}>Suma fără TVA</div>
                <div style={{ flex: 1, position: 'relative' }}>
                  <input
                    type="text"
                    value={sumaFaraTVA !== '' ? sumaFaraTVA : ''}
                    onChange={e => {
                      const raw = e.target.value.replace(/[^0-9.,]/g, '');
                      setSumaFaraTVA(raw);
                      setLastEditedField('faraTVA');
                      const parsed = parseAmount(raw);
                      if (parsed !== '') {
                        recalculate('faraTVA', sumaCuTVA, parsed, tvaRate);
                      }
                    }}
                    onFocus={() => setFocusedField('sumaFaraTVA')}
                    onBlur={() => {
                      setFocusedField(null);
                      const parsed = parseAmount(sumaFaraTVA);
                      if (parsed !== '') setSumaFaraTVA(parsed);
                    }}
                    placeholder="0,00"
                    style={{
                      ...getInputStyle('sumaFaraTVA'),
                      paddingRight: 70,
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    right: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: DS.badgeBg,
                    borderRadius: 4,
                    padding: '3px 8px',
                    fontSize: 11,
                    fontWeight: 600,
                    color: DS.textPrimary,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                  }}>
                    <span style={{ fontSize: 10 }}>🇷🇴</span> Lei
                  </div>
                </div>
              </div>

              {/* TVA rate + amount */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={fieldRowLabel}>TVA</div>
                <div style={{ display: 'flex', gap: 12, flex: 1 }}>
                  {/* Rate dropdown */}
                  <div style={{ ...selectWrapperStyle, width: 120, flexShrink: 0 }}>
                    <select
                      value={tvaRate}
                      onChange={e => setTvaRate(Number(e.target.value))}
                      onFocus={() => setFocusedField('tvaRate')}
                      onBlur={() => setFocusedField(null)}
                      style={selectStyle('tvaRate')}
                    >
                      <option value={0}>0%</option>
                      <option value={19}>19%</option>
                      <option value={21}>21%</option>
                    </select>
                    <ChevronDown size={16} style={chevronStyle} />
                  </div>
                  {/* TVA amount (readonly) */}
                  <div style={{ flex: 1, position: 'relative' }}>
                    <input
                      type="text"
                      value={tvaAmount !== '' ? formatAmount(tvaAmount) : ''}
                      readOnly
                      style={{
                        ...inputBase,
                        background: DS.badgeBg,
                        paddingRight: 70,
                        cursor: 'default',
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      right: 10,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: DS.border,
                      borderRadius: 4,
                      padding: '3px 8px',
                      fontSize: 11,
                      fontWeight: 600,
                      color: DS.textPrimary,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3,
                    }}>
                      <span style={{ fontSize: 10 }}>🇷🇴</span> Lei
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4.5 Save Button */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
            <button
              onClick={handleSave}
              onMouseEnter={() => setHoverSave(true)}
              onMouseLeave={() => setHoverSave(false)}
              style={{
                background: DS.gradient,
                border: 'none',
                borderRadius: 9999,
                padding: '12px 52px',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: 15,
                fontFamily: 'inherit',
                cursor: 'pointer',
                boxShadow: hoverSave ? DS.shadowBtnHover : DS.shadowBtn,
                transition: 'box-shadow 0.2s ease',
              }}
            >
              Salvează
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
