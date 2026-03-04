import { FIELD_CONFIG } from '../utils/config'
import { formatCurrency, formatCpm } from '../utils/calculations'

export function CalculatorForm({ values, onChange, onReveal, revealed }) {
  return (
    <div className="ps-card p-6 sm:p-8">
      <div className="text-xs tracking-[0.18em] font-bold text-[var(--ps-muted)] uppercase mb-6">
        Your Current Spend
      </div>

      {/* Budget */}
      <div className="mb-8">
        <div className="flex items-baseline justify-between mb-3">
          <label className="ps-label mb-0">{FIELD_CONFIG.budget.label}</label>
          <span className="text-2xl font-bold text-white tabular-nums">
            {formatCurrency(Number(values.budget) || 0)}
          </span>
        </div>
        <input
          type="range"
          className="ps-range ps-range--lg"
          value={values.budget}
          min={FIELD_CONFIG.budget.min}
          max={FIELD_CONFIG.budget.max}
          step={FIELD_CONFIG.budget.step}
          onChange={(e) => onChange('budget', Number(e.target.value))}
        />
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-[var(--ps-muted)]">$25K</span>
          <span className="text-[10px] text-[var(--ps-muted)]">$2M</span>
        </div>
      </div>

      {/* Vendor CPM */}
      <div className={revealed ? 'mb-4' : 'mb-8'}>
        <div className="flex items-baseline justify-between mb-3">
          <label className="ps-label mb-0">{FIELD_CONFIG.vendorCpm.label}</label>
          <span className="text-2xl font-bold text-white tabular-nums">
            {formatCpm(Number(values.vendorCpm) || 0)}
          </span>
        </div>
        <input
          type="range"
          className="ps-range ps-range--lg"
          value={values.vendorCpm}
          min={FIELD_CONFIG.vendorCpm.min}
          max={FIELD_CONFIG.vendorCpm.max}
          step={FIELD_CONFIG.vendorCpm.step}
          onChange={(e) => onChange('vendorCpm', Number(e.target.value))}
        />
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-[var(--ps-muted)]">$5</span>
          <span className="text-[10px] text-[var(--ps-muted)]">$50</span>
        </div>
      </div>

      {/* Reveal CTA */}
      {!revealed && (
        <button
          type="button"
          onClick={onReveal}
          className="ps-btn ps-btn--reveal w-full"
        >
          Show My Efficiency
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  )
}

export default CalculatorForm
