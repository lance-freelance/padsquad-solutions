import { formatCurrency } from '../utils/calculations';

export default function InvestmentSummary({ results }) {
  if (!results) return null;

  const rows = [
    { label: 'CaaS Serving Fee', value: formatCurrency(results.caasServingFee) },
    { label: 'Production Fee', value: formatCurrency(results.productionFee) },
  ];

  return (
    <div className="ps-card overflow-hidden">
      <div className="ps-ds-panel-header flex items-center gap-2">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
        AdCanvas Investment Summary
      </div>
      <div className="p-6 space-y-4">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between">
            <span className="text-sm text-[var(--ps-textSoft)]">{r.label}</span>
            <span className="text-sm font-semibold text-white">{r.value}</span>
          </div>
        ))}

        <div className="border-t border-[var(--ps-divider)] pt-4 flex items-center justify-between">
          <span className="text-sm font-bold uppercase tracking-wider text-[var(--ps-muted)]">
            Total Client Commitment (IO Anchor)
          </span>
          <span className="text-xl font-bold text-[var(--ps-pink)]">
            {formatCurrency(results.totalClientCommitment)}
          </span>
        </div>
      </div>
    </div>
  );
}
