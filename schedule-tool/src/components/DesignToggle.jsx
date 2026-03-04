/**
 * Design workflow toggle:
 *   "Client provided design" No / Yes
 *   No  → PadSquad designs
 *   Yes → Client provides approved design
 *
 * Always active — the toggle works alongside the "Assets received"
 * checkbox to select one of four workflow variants.
 */
export function DesignToggle({ designMode, onDesignChange }) {
  const isClientDesign = designMode === 'client'

  return (
    <div className="flex items-center gap-3">
      <div className="text-[11px] tracking-[0.14em] font-semibold text-[var(--ps-muted)] uppercase whitespace-nowrap">
        Client provided design
      </div>
      <button
        type="button"
        onClick={() => onDesignChange(isClientDesign ? 'padSquad' : 'client')}
        className="ps-toggle"
        aria-pressed={isClientDesign}
      >
        <span className="ps-toggle__track" aria-hidden>
          <span className={`ps-toggle__thumb ${isClientDesign ? 'ps-toggle__thumb--right' : ''}`} />
        </span>
        <span className="ps-toggle__labels">
          <span className={`ps-toggle__label ${!isClientDesign ? 'ps-toggle__label--active' : ''}`}>No</span>
          <span className={`ps-toggle__label ${isClientDesign ? 'ps-toggle__label--active' : ''}`}>Yes</span>
        </span>
      </button>
    </div>
  )
}

export default DesignToggle
