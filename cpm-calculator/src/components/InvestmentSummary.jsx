import { formatCurrency, formatNumber } from '../utils/calculations'

export function InvestmentSummary({ results }) {
  if (!results) return null

  return (
    <div className="ps-card overflow-hidden ps-reveal" style={{ animationDelay: '600ms' }}>
      <div className="px-6 pt-5 pb-3">
        <div className="text-xs tracking-[0.18em] font-semibold text-[var(--ps-pink)] uppercase">
          Your Creative Investment
        </div>
      </div>
      <div className="px-6 pb-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--ps-textSoft)]">Contracted Impressions</span>
          <span className="text-sm font-semibold text-white tabular-nums">
            {formatNumber(results.padsquadImpressions)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--ps-textSoft)]">AdCanvas CaaS Fee</span>
          <span className="text-sm font-semibold text-white tabular-nums">
            {formatCurrency(results.caasServingFee)}
          </span>
        </div>

        <div className="border-t border-[var(--ps-divider)] pt-4">
          <div className="mb-2">
            <span className="text-[10px] font-bold tracking-[0.1em] uppercase border border-[var(--ps-pink)] text-[var(--ps-pink)] rounded px-2.5 py-0.5">
              Creative Delivery Only
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--ps-muted)]">
              Total Client Commitment
            </span>
            <span className="text-xl font-bold text-[var(--ps-pink)] tabular-nums">
              {formatCurrency(results.totalClientCommitment)}
            </span>
          </div>
        </div>

        <p className="text-[10px] text-[var(--ps-muted)] tracking-[0.04em] mt-2">
          Your media buy runs independently through your preferred DSP at standard programmatic rates — you maintain full control.
        </p>
      </div>
    </div>
  )
}

export default InvestmentSummary
