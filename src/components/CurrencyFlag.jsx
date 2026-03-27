export default function CurrencyFlag({ currency, size = 'sm' }) {
  const h = size === 'sm' ? 'h-3' : 'h-4';
  const w = size === 'sm' ? 'w-5' : 'w-6';

  if (currency === 'EUR') {
    return (
      <span className={`inline-flex ${w} ${h} rounded-[2px] overflow-hidden border border-gray-200/50`}>
        <span className="w-1/2 bg-[#003399]" />
        <span className="w-1/2 bg-[#FFCC00]" />
      </span>
    );
  }

  // RON - Romanian tricolor
  return (
    <span className={`inline-flex ${w} ${h} rounded-[2px] overflow-hidden border border-gray-200/50`}>
      <span className="w-1/3 bg-[#002B7F]" />
      <span className="w-1/3 bg-[#FCD116]" />
      <span className="w-1/3 bg-[#CE1126]" />
    </span>
  );
}
