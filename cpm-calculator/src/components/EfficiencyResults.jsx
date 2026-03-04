import { formatNumber, formatCurrency, formatMultiplier, formatCompact } from '../utils/calculations'
import { useCountUp } from '../hooks/useCountUp'

function HeroStat({ value, formattedValue, label, accent, prefix = '', className = '' }) {
  const animated = useCountUp(value)
  const colorClass = accent === 'pink' ? 'text-[var(--ps-pink)]' : accent === 'teal' ? 'text-[var(--ps-teal)]' : 'text-white'

  // Format the animated value the same way as the final
  let displayVal
  if (accent === 'teal' && label.includes('Multiplier')) {
    displayVal = formatMultiplier(animated)
  } else if (prefix === '$') {
    displayVal = formatCurrency(animated)
  } else {
    displayVal = (prefix || '') + formatNumber(animated)
  }

  return (
    <div className={`ps-card p-5 text-center ${className}`}>
      <div className={`ps-hero-value ${colorClass}`}>
        {displayVal}
      </div>
      <div className="ps-hero-label">{label}</div>
    </div>
  )
}

function ComparisonBar({ traditionalImps, padsquadImps }) {
  const maxImps = Math.max(traditionalImps, padsquadImps, 1)
  const tradPct = Math.max(4, (traditionalImps / maxImps) * 100)
  const psPct = Math.max(4, (padsquadImps / maxImps) * 100)

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-24 text-[10px] font-bold text-[var(--ps-muted)] tracking-[0.1em] uppercase text-right shrink-0">
          Traditional
        </div>
        <div className="flex-1">
          <div
            className="ps-bar ps-bar--traditional"
            style={{ width: `${tradPct}%` }}
          >
            {formatCompact(traditionalImps)}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-24 text-[10px] font-bold text-[var(--ps-pink)] tracking-[0.1em] uppercase text-right shrink-0">
          PadSquad
        </div>
        <div className="flex-1">
          <div
            className="ps-bar ps-bar--padsquad"
            style={{ width: `${psPct}%` }}
          >
            {formatCompact(padsquadImps)}
          </div>
        </div>
      </div>
    </div>
  )
}

export function EfficiencyResults({ results, budget }) {
  if (!results) return null

  const {
    incrementalImpressions,
    reachMultiplier,
    valueUnlocked,
    traditionalImpressions,
    padsquadImpressions,
  } = results

  const budgetDisplay = formatCurrency(Number(budget) || 0)

  return (
    <div className="space-y-5 ps-animate-in">
      {/* Hero stat cards */}
      <div className="grid grid-cols-4 gap-4">
        <HeroStat
          value={incrementalImpressions}
          label="Impressions Unlocked"
          accent="pink"
          prefix="+"
          className="col-span-4 sm:col-span-2"
        />
        <HeroStat
          value={reachMultiplier}
          label="Reach Multiplier"
          accent="teal"
          className="col-span-2 sm:col-span-1"
        />
        <HeroStat
          value={valueUnlocked}
          label="Value Unlocked"
          accent="pink"
          prefix="$"
          className="col-span-2 sm:col-span-1"
        />
      </div>

      {/* Comparison bars */}
      <div className="ps-card p-5">
        <div className="ps-col-header ps-col-header--gray mb-4">Impression Comparison</div>
        <ComparisonBar
          traditionalImps={traditionalImpressions}
          padsquadImps={padsquadImpressions}
        />
      </div>

      {/* Scenario summary */}
      <p className="text-sm text-[var(--ps-muted)] leading-relaxed text-center px-4">
        With a {budgetDisplay} budget, PadSquad AdCanvas delivers{' '}
        <span className="text-white font-semibold">{formatCompact(padsquadImpressions)}</span>{' '}
        impressions vs.{' '}
        <span className="text-white font-semibold">{formatCompact(traditionalImpressions)}</span>{' '}
        with a traditional vendor —{' '}
        <span className="text-[var(--ps-teal)] font-semibold">{formatMultiplier(reachMultiplier)}</span>{' '}
        the reach for the same investment.
      </p>
    </div>
  )
}

export default EfficiencyResults
