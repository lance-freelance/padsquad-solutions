/**
 * Segmented 3-way control for selecting the production workflow mode.
 * Values: 'padSquad' | 'client' | 'assetProduction'
 */

const OPTIONS = [
  { value: 'padSquad',        label: 'PadSquad Design' },
  { value: 'client',          label: 'Client Design'   },
  { value: 'assetProduction', label: 'Assets In Hand'  },
]

export function DesignToggle({ value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-[11px] tracking-[0.14em] font-semibold text-[var(--ps-muted)] uppercase whitespace-nowrap">
        Workflow
      </div>
      <div
        className="flex rounded-lg overflow-hidden border border-[var(--ps-divider)] bg-[rgba(255,255,255,0.04)]"
        role="group"
        aria-label="Workflow mode"
      >
        {OPTIONS.map((opt, i) => {
          const isActive = value === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              aria-pressed={isActive}
              className={[
                'px-3 py-1.5 text-[11px] font-semibold tracking-[0.1em] uppercase whitespace-nowrap transition-all',
                i > 0 ? 'border-l border-[var(--ps-divider)]' : '',
                isActive
                  ? 'bg-[var(--ps-teal)] text-[var(--ps-bg)] shadow-inner'
                  : 'text-[var(--ps-muted)] hover:text-white hover:bg-[rgba(255,255,255,0.07)]',
              ].join(' ')}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default DesignToggle
