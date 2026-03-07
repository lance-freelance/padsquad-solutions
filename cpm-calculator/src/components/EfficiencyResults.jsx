import { formatNumber, formatCurrency, formatMultiplier, formatCompact, formatCpm } from '../utils/calculations'
import { useCountUp } from '../hooks/useCountUp'

function HeroStat({ value, label, tag, accent, prefix = '', delay = 0 }) {
  const animated = useCountUp(value)
  const colorClass =
    accent === 'pink' ? 'text-[var(--ps-pink)]' :
    accent === 'purple' ? 'text-[var(--ps-purple)]' : 'text-white'

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
      {tag && (
        <div className="text-[9px] font-bold tracking-[0.1em] text-[var(--ps-muted)] uppercase mb-1">{tag}</div>
      )}
      <div className={`ps-hero-value ${colorClass}`}>{displayVal}</div>
      <div className="ps-hero-label">{label}</div>
    </div>
  )
}

function ComparisonBar({ label, value, maxValue, variant, delay = 0 }) {
  const pct = Math.max(4, (value / Math.max(maxValue, 1)) * 100)

  return (
    <div className="flex items-center gap-3 ps-reveal" style={{ animationDelay: `${delay}ms` }}>
      <div className={`w-20 sm:w-28 text-[10px] font-bold tracking-[0.1em] uppercase text-right shrink-0 ${
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
    padsquadAllInCpm,
    cpmSavings,
  } = results

  const maxImps = Math.max(traditionalImpressions, padsquadImpressions, 1)
  const budgetDisplay = formatCurrency(Number(budget) || 0)

  return (
    <div className="space-y-5">
      {/* What you get now — minimized baseline */}
      <div className="text-center py-3 ps-reveal" style={{ animationDelay: '0ms' }}>
        <div className="text-[10px] font-bold tracking-[0.14em] text-[var(--ps-muted)] uppercase mb-1">
          Under the Legacy Media Model
        </div>
        <div className="text-sm text-[var(--ps-textSoft)]">
          Your{' '}
          <span className="font-semibold text-white">{budgetDisplay}</span>{' '}
          buys{' '}
          <span className="font-semibold text-white">{formatCompact(traditionalImpressions)}</span>{' '}
          impressions at{' '}
          <span className="font-semibold text-white">{formatCpm(vendorCpm)}</span> CPM{' '}
          <span className="text-[var(--ps-muted)]">— because you're paying for creative and media in the same line item.</span>
        </div>
      </div>

      {/* Hero stat cards — what you unlock */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <HeroStat value={incrementalImpressions} label="Additional Impressions" accent="pink" prefix="+" delay={50} />
        <HeroStat value={reachMultiplier} label="Media Efficiency Multiplier" delay={150} />
        <HeroStat
          value={valueUnlocked}
          label="Reinvested as Working Media"
          tag="Savings"
          accent="pink"
          prefix="$"
          delay={250}
        />
      </div>

      {/* CPM savings callout */}
      <div className="text-center ps-reveal" style={{ animationDelay: '280ms' }}>
        <span className="inline-flex items-center gap-2 text-xs text-[var(--ps-muted)] bg-[rgba(255,255,255,0.04)] rounded-full px-4 py-2">
          Legacy CPM {formatCpm(vendorCpm)} → Decoupled Creative CPM {formatCpm(padsquadAllInCpm)} — saving {formatCpm(cpmSavings)} per thousand
        </span>
      </div>

      {/* Comparison bars */}
      <div className="ps-card p-5 ps-reveal" style={{ animationDelay: '300ms' }}>
        <div className="ps-col-header ps-col-header--gray mb-4">Impression Comparison</div>
        <div className="space-y-3">
          <ComparisonBar label="Legacy Media Model" value={traditionalImpressions} maxValue={maxImps} variant="traditional" delay={350} />
          <ComparisonBar label="Decoupled Creative (AdCanvas)" value={padsquadImpressions} maxValue={maxImps} variant="padsquad" delay={400} />
        </div>
      </div>

      {/* Prominent scenario summary — savings → working media narrative */}
      <div className="ps-card p-6 text-center ps-reveal" style={{ animationDelay: '450ms' }}>
        <div className="text-[10px] font-bold tracking-[0.18em] text-[var(--ps-pink)] uppercase mb-3">
          The Decoupling Dividend
        </div>
        <p className="text-base sm:text-lg text-[var(--ps-textSoft)] leading-relaxed">
          With a {budgetDisplay} budget, separating creative delivery from your media buy reduces your effective CPM from{' '}
          <span className="text-white font-bold">{formatCpm(vendorCpm)}</span> to{' '}
          <span className="text-[var(--ps-pink)] font-bold">{formatCpm(padsquadAllInCpm)}</span>{' '}
          — freeing{' '}
          <span className="text-[var(--ps-pink)] font-bold">{formatCurrency(valueUnlocked)}</span>{' '}
          that gets reinvested as working media.{' '}
          <span className="text-white font-semibold">Result:</span>{' '}
          <span className="text-white font-bold">{formatCompact(padsquadImpressions)}</span>{' '}
          impressions vs.{' '}
          <span className="text-white font-bold">{formatCompact(traditionalImpressions)}</span>.
        </p>
      </div>
    </div>
  )
}

export default EfficiencyResults
