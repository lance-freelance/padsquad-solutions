import { formatCurrency, formatNumber } from '../utils/calculations'

export function InvestmentSummary({ results }) {
  if (!results) return null

  const rows = [
    { label: 'Contracted Impressions', value: formatNumber(results.padsquadImpressions) },
    { label: 'AdCanvas Serving Fee', value: formatCurrency(results.caasServingFee) },
    { label: 'Production Fee', value: formatCurrency(results.padsquadProdFee) },
  ]

  return (
    <div className="ps-card overflow-hidden">
      <div className="px-6 pt-5 pb-3">
        <div className="text-xs tracking-[0.18em] font-semibold text-[var(--ps-pink)] uppercase">
          Your AdCanvas Investment
        </div>
      </div>
      <div className="px-6 pb-6 space-y-3">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between">
            <span className="text-sm text-[var(--ps-textSoft)]">{r.label}</span>
            <span className="text-sm font-semibold text-white tabular-nums">{r.value}</span>
          </div>
        ))}

        <div className="border-t border-[var(--ps-divider)] pt-4 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--ps-muted)]">
            Total Client Commitment
          </span>
          <span className="text-xl font-bold text-[var(--ps-pink)] tabular-nums">
            {formatCurrency(results.totalClientCommitment)}
          </span>
        </div>

        <p className="text-[10px] text-[var(--ps-muted)] tracking-[0.04em] mt-2">
          Media buy is managed independently at standard market rates.
        </p>
      </div>
    </div>
  )
}

export default InvestmentSummary
