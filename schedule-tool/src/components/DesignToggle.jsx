/**
 * Design workflow toggle:
 *   "Client provided design" No / Yes
 *   No  → PadSquad designs (21 BDs, full creative + demo cycle)
 *   Yes → Client provides approved design (13 BDs, demo build only)
 *
 * The "Assets ready?" control has been moved to a checkbox in App.jsx
 * to reduce upfront cognitive load.
 */
export function DesignToggle({ designMode, onDesignChange, assetsReady }) {
  const isClientDesign = designMode === 'client'

  return (
    <div className={`flex items-center gap-3 transition-opacity duration-200 ${assetsReady ? 'opacity-35 pointer-events-none select-none' : ''}`}>
      <div className="text-[11px] tracking-[0.14em] font-semibold text-[var(--ps-muted)] uppercase whitespace-nowrap">
        Client provided design
      </div>
      <button
        type="button"
        onClick={() => onDesignChange(isClientDesign ? 'padSquad' : 'client')}
        className="ps-toggle"
        aria-pressed={isClientDesign}
        tabIndex={assetsReady ? -1 : 0}
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
