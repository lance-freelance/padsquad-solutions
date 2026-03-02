/**
 * Toggle: PadSquad design vs Client design.
 * Switches between the two milestone/asset configs.
 */
export function DesignToggle({ value, onChange }) {
  // Label in UI is phrased from the client's POV:
  // "Will you provide the design?" -> Yes === client design
  const isClientDesign = value === 'client'

  return (
    <div className="flex items-center gap-3">
      <div className="text-[11px] tracking-[0.14em] font-semibold text-[var(--ps-muted)] uppercase whitespace-nowrap">
        Provide design?
      </div>
      <button
        type="button"
        onClick={() => onChange(isClientDesign ? 'padSquad' : 'client')}
        className="ps-toggle"
        aria-pressed={isClientDesign}
      >
        <span className="ps-toggle__track" aria-hidden>
          <span
            className={`ps-toggle__thumb ${isClientDesign ? 'ps-toggle__thumb--right' : ''}`}
          />
        </span>
        <span className="ps-toggle__labels">
          <span className={`ps-toggle__label ${!isClientDesign ? 'ps-toggle__label--active' : ''}`}>
            No
          </span>
          <span className={`ps-toggle__label ${isClientDesign ? 'ps-toggle__label--active' : ''}`}>
            Yes
          </span>
        </span>
      </button>
    </div>
  )
}

export default DesignToggle
