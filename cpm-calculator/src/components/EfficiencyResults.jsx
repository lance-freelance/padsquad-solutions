import { formatNumber, formatCurrency, formatMultiplier, formatCompact, formatCpm } from '../utils/calculations'
import { useCountUp } from '../hooks/useCountUp'

function HeroStat({ value, label, accent, prefix = '', delay = 0 }) {
  const animated = useCountUp(value)
  const colorClass =
    accent === 'pink' ? 'text-[var(--ps-pink)]' :
    accent === 'teal' ? 'text-[var(--ps-teal)]' : 'text-white'

  let displayVal
  if (label.includes('Multiplier')) {
    displayVal = formatMultiplier(animated)
  } else if (prefix === '$') {
    displayVal = formatCurrency(animated)
  } else {
    displayVal = (prefix || '') + formatNumber(animated)
  }

  return (
    <div className={`ps-card p-5 text-center ps-reveal`} style={{ animationDelay: `${delay}ms` }}>
      <div className={`ps-hero-value ${colorClass}`}>{displayVal}</div>
      <div className="ps-hero-label">{label}</div>
    </div>
  )
}

function ComparisonBar({ label, value, maxValue, variant, delay = 0 }) {
  const pct = Math.max(4, (value / Math.max(maxValue, 1)) * 100)

  return (
    <div className="flex items-center gap-3 ps-reveal" style={{ animationDelay: `${delay}ms` }}>
      <div className={`w-28 text-[10px] font-bold tracking-[0.1em] uppercase text-right shrink-0 ${
        variant === 'padsquad' ? 'text-[var(--ps-pink)]' : 'text-[var(--ps-muted)]'
      }`}>
        {label}
      </div>
      <div className="flex-1">
        <div
          className={`ps-bar ${variant === 'padsquad' ? 'ps-bar--padsquad' : 'ps-bar--traditional'}`}
          style={{ width: `${pct}%` }}
        >
          {formatCompact(value)}
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
    vendorCpm,
  } = results

  const maxImps = Math.max(traditionalImpressions, padsquadImpressions, 1)
  const budgetDisplay = formatCurrency(Number(budget) || 0)

  return (
    <div className="space-y-5">
      {/* What you get now — minimized baseline */}
      <div className="text-center py-3 ps-reveal" style={{ animationDelay: '0ms' }}>
        <div className="text-[10px] font-bold tracking-[0.14em] text-[var(--ps-muted)] uppercase mb-1">
          Your Current Plan
        </div>
        <div className="text-sm text-[var(--ps-textSoft)]">
          <span className="font-semibold text-white">{formatCompact(traditionalImpressions)}</span>{' '}
          impressions at{' '}
          <span className="font-semibold text-white">{formatCpm(vendorCpm)}</span> CPM
        </div>
      </div>

      {/* Hero stat cards — what you unlock */}
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-4 sm:col-span-2">
          <HeroStat value={incrementalImpressions} label="Impressions Unlocked" accent="pink" prefix="+" delay={50} />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <HeroStat value={reachMultiplier} label="Investment Multiplier" accent="teal" delay={150} />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <HeroStat value={valueUnlocked} label="Value Unlocked" accent="pink" prefix="$" delay={250} />
        </div>
      </div>

      {/* Comparison bars */}
      <div className="ps-card p-5 ps-reveal" style={{ animationDelay: '300ms' }}>
        <div className="ps-col-header ps-col-header--gray mb-4">Impression Comparison</div>
        <div className="space-y-3">
          <ComparisonBar label="Traditional" value={traditionalImpressions} maxValue={maxImps} variant="traditional" delay={350} />
          <ComparisonBar label="AdCanvas" value={padsquadImpressions} maxValue={maxImps} variant="padsquad" delay={400} />
        </div>
      </div>

      {/* Prominent scenario summary */}
      <div className="ps-card p-6 text-center ps-reveal" style={{ animationDelay: '450ms' }}>
        <p className="text-base sm:text-lg text-[var(--ps-textSoft)] leading-relaxed">
          With a {budgetDisplay} budget, AdCanvas delivers{' '}
          <span className="text-white font-bold">{formatCompact(padsquadImpressions)}</span>{' '}
          impressions vs.{' '}
          <span className="text-white font-bold">{formatCompact(traditionalImpressions)}</span>{' '}
          with a traditional vendor —{' '}
          <span className="text-[var(--ps-teal)] font-bold text-xl">{formatMultiplier(reachMultiplier)}</span>{' '}
          the reach for the same investment.
        </p>
      </div>
    </div>
  )
}

export default EfficiencyResults
