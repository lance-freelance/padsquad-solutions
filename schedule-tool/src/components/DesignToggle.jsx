/**
 * Two independent toggles:
 *   1. "Provide design?" No / Yes
 *      No  → PadSquad designs (21 BDs, full creative + demo cycle)
 *      Yes → Client provides approved design (13 BDs, demo build only)
 *
 *   2. "Assets ready?" No / Yes
 *      Yes → Overrides design toggle; uses asset-production workflow (12 BDs)
 *            Design toggle is dimmed when assets are ready.
 */
export function DesignToggle({ designMode, onDesignChange, assetsReady, onAssetsChange }) {
  const isClientDesign = designMode === 'client'

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">

      {/* Toggle 1 — Will the client provide the design? */}
      <div className={`flex items-center gap-3 transition-opacity duration-200 ${assetsReady ? 'opacity-35 pointer-events-none select-none' : ''}`}>
        <div className="text-[11px] tracking-[0.14em] font-semibold text-[var(--ps-muted)] uppercase whitespace-nowrap">
          Provide design?
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

      {/* Divider */}
      <div className="hidden sm:block w-px h-5 bg-[var(--ps-divider)]" />

      {/* Toggle 2 — Are assets already in hand? */}
      <div className="flex items-center gap-3">
        <div className="text-[11px] tracking-[0.14em] font-semibold text-[var(--ps-muted)] uppercase whitespace-nowrap">
          Assets ready?
        </div>
        <button
          type="button"
          onClick={() => onAssetsChange(!assetsReady)}
          className="ps-toggle"
          aria-pressed={assetsReady}
        >
          <span className="ps-toggle__track" aria-hidden>
            <span className={`ps-toggle__thumb ${assetsReady ? 'ps-toggle__thumb--right' : ''}`} />
          </span>
          <span className="ps-toggle__labels">
            <span className={`ps-toggle__label ${!assetsReady ? 'ps-toggle__label--active' : ''}`}>No</span>
            <span className={`ps-toggle__label ${assetsReady ? 'ps-toggle__label--active' : ''}`}>Yes</span>
          </span>
        </button>
      </div>

    </div>
  )
}

export default DesignToggle
