import { FIELD_CONFIG } from '../utils/config'
import { formatCpm } from '../utils/calculations'

export function EcpmTuner({ values, onChange, showAdvanced, onToggleAdvanced }) {
  return (
    <div className="ps-card p-6 ps-reveal" style={{ animationDelay: '500ms' }}>
      <div className="text-xs tracking-[0.18em] font-bold text-[var(--ps-teal)] uppercase mb-6">
        Fine-Tune Your AdCanvas Model
      </div>

      {/* Programmatic eCPM */}
      <div className="mb-6">
        <div className="flex items-baseline justify-between mb-3">
          <label className="ps-label mb-0">{FIELD_CONFIG.programmaticEcpm.label}</label>
          <span className="text-xl font-bold text-white tabular-nums">
            {formatCpm(Number(values.programmaticEcpm) || 0)}
          </span>
        </div>
        <input
          type="range"
          className="ps-range ps-range--teal"
          value={values.programmaticEcpm}
          min={FIELD_CONFIG.programmaticEcpm.min}
          max={FIELD_CONFIG.programmaticEcpm.max}
          step={FIELD_CONFIG.programmaticEcpm.step}
          onChange={(e) => onChange('programmaticEcpm', Number(e.target.value))}
        />
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-[var(--ps-muted)]">$1</span>
          <span className="text-[10px] text-[var(--ps-muted)]">$25</span>
        </div>
      </div>

      {/* CaaS Fee — fixed by default */}
      <div className="pt-4 border-t border-[var(--ps-divider)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--ps-textSoft)]">{FIELD_CONFIG.caasCpm.label}</span>
            {!showAdvanced && (
              <span className="text-[10px] text-[var(--ps-muted)] tracking-[0.08em] flex items-center gap-1">
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="opacity-50">
                  <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                FIXED
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-white tabular-nums">
              {formatCpm(Number(values.caasCpm) || 0)}
            </span>
            <button
              type="button"
              onClick={onToggleAdvanced}
              className="text-[10px] tracking-[0.08em] text-[var(--ps-muted)] hover:text-[var(--ps-pink)] transition-colors uppercase"
            >
              {showAdvanced ? '← Lock' : 'Advanced'}
            </button>
          </div>
        </div>

        {showAdvanced && (
          <div className="mt-3">
            <input
              type="range"
              className="ps-range ps-range--teal"
              value={values.caasCpm}
              min={FIELD_CONFIG.caasCpm.min}
              max={FIELD_CONFIG.caasCpm.max}
              step={FIELD_CONFIG.caasCpm.step}
              onChange={(e) => onChange('caasCpm', Number(e.target.value))}
            />
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-[var(--ps-muted)]">$0.50</span>
              <span className="text-[10px] text-[var(--ps-muted)]">$5.00</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EcpmTuner
