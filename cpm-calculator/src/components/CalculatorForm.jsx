import { FIELD_CONFIG } from '../utils/config'
import { formatCpm } from '../utils/calculations'

function InputField({ field, value, onChange, accent, disabled }) {
  const cfg = FIELD_CONFIG[field]
  const numVal = value === '' ? '' : Number(value)

  return (
    <div className="mb-4">
      <label className="ps-label">{cfg.label}</label>
      <input
        type="number"
        className="ps-input"
        value={value}
        min={cfg.min}
        max={cfg.max}
        step={cfg.step}
        disabled={disabled}
        placeholder={String(cfg.min)}
        onChange={(e) => onChange(field, e.target.value === '' ? '' : Number(e.target.value))}
      />
      <input
        type="range"
        className={`ps-range ${accent === 'teal' ? 'ps-range--teal' : ''}`}
        value={numVal === '' ? cfg.min : numVal}
        min={cfg.min}
        max={cfg.max}
        step={cfg.step}
        disabled={disabled}
        onChange={(e) => onChange(field, Number(e.target.value))}
      />
    </div>
  )
}

export function CalculatorForm({ values, onChange, showAdvanced, onToggleAdvanced }) {
  const tradAllIn = (Number(values.competitorServingCpm) || 0) + (Number(values.traditionalMediaCpm) || 0)
  const psAllIn = (Number(values.caasCpm) || 0) + (Number(values.independentMediaCpm) || 0)

  return (
    <div className="ps-card overflow-hidden">
      {/* Budget — full width */}
      <div className="px-6 pt-6 pb-4">
        <InputField field="budget" value={values.budget} onChange={onChange} />
      </div>

      {/* Two-column comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Traditional column */}
        <div className="px-6 pb-6 border-t border-[var(--ps-divider)]">
          <div className="ps-col-header ps-col-header--gray pt-4">Traditional Vendor</div>
          <InputField field="competitorServingCpm" value={values.competitorServingCpm} onChange={onChange} />
          <InputField field="competitorProdFee" value={values.competitorProdFee} onChange={onChange} />
          <InputField field="traditionalMediaCpm" value={values.traditionalMediaCpm} onChange={onChange} />
          <div className="ps-allin">
            <div className="ps-allin__label">All-In CPM</div>
            <div className="ps-allin__value">{formatCpm(tradAllIn)}</div>
          </div>
        </div>

        {/* PadSquad column */}
        <div className="px-6 pb-6 border-t border-[var(--ps-divider)] md:border-l">
          <div className="ps-col-header ps-col-header--pink pt-4">PadSquad AdCanvas</div>

          {/* CaaS fee — locked by default */}
          <div className="mb-4">
            <label className="ps-label">{FIELD_CONFIG.caasCpm.label}</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="ps-input"
                value={values.caasCpm}
                min={FIELD_CONFIG.caasCpm.min}
                max={FIELD_CONFIG.caasCpm.max}
                step={FIELD_CONFIG.caasCpm.step}
                disabled={!showAdvanced}
                onChange={(e) => onChange('caasCpm', e.target.value === '' ? '' : Number(e.target.value))}
              />
              {!showAdvanced && (
                <span className="text-[10px] text-[var(--ps-muted)] tracking-[0.08em] whitespace-nowrap flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="opacity-50">
                    <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  FIXED
                </span>
              )}
            </div>
            {showAdvanced && (
              <input
                type="range"
                className="ps-range ps-range--teal"
                value={values.caasCpm}
                min={FIELD_CONFIG.caasCpm.min}
                max={FIELD_CONFIG.caasCpm.max}
                step={FIELD_CONFIG.caasCpm.step}
                onChange={(e) => onChange('caasCpm', Number(e.target.value))}
              />
            )}
            <button
              type="button"
              onClick={onToggleAdvanced}
              className="mt-1 text-[10px] tracking-[0.08em] text-[var(--ps-muted)] hover:text-[var(--ps-pink)] transition-colors uppercase"
            >
              {showAdvanced ? '← Standard' : 'Advanced'}
            </button>
          </div>

          <InputField field="independentMediaCpm" value={values.independentMediaCpm} onChange={onChange} accent="teal" />
          <InputField field="padsquadProdFee" value={values.padsquadProdFee} onChange={onChange} accent="teal" />
          <div className="ps-allin">
            <div className="ps-allin__label">All-In CPM</div>
            <div className="ps-allin__value ps-allin__value--pink">{formatCpm(psAllIn)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalculatorForm
