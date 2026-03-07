import { useState, useRef, useMemo } from 'react'
import { format } from 'date-fns'
import { DatePicker } from './components/DatePicker'
import { DesignToggle } from './components/DesignToggle'
import { Timeline } from './components/Timeline'
import { ExportButton } from './components/ExportButton'
import {
  getPadSquadDesignMilestones,
  getClientDesignMilestones,
  getPadSquadAssetsMilestones,
  getClientAssetsMilestones,
  DEFAULT_CREATIVE_DAYS,
  DEFAULT_DEMO_DAYS,
  AD_COMMERCE_DEMO_DAYS,
} from './config/milestones'
import {
  getMilestoneDatesFromKickOff,
  getMilestoneDatesFromGoLive,
  businessDaysBetween,
} from './utils/businessDays'

const TIMELINE_EXPORT_ID = 'campaign-timeline-export'

function DaysStepper({ label, value, onChange, min = 1, max = 20 }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] tracking-[0.16em] font-semibold text-[var(--ps-muted)] uppercase">
        {label}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-7 h-7 rounded-md flex items-center justify-center text-sm font-bold text-[var(--ps-textSoft)] bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.1)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors select-none"
          aria-label={`Decrease ${label}`}
        >−</button>
        <span className="tabular-nums text-sm font-semibold text-white w-14 text-center">
          {value} {value === 1 ? 'day' : 'days'}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-7 h-7 rounded-md flex items-center justify-center text-sm font-bold text-[var(--ps-textSoft)] bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.1)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors select-none"
          aria-label={`Increase ${label}`}
        >+</button>
      </div>
    </div>
  )
}

function App() {
  const [date, setDate] = useState(null)
  const [dateType, setDateType] = useState('kick-off')
  const [designMode, setDesignMode] = useState('padSquad')
  const [assetsReady, setAssetsReady] = useState(false)
  const [activeTarget, setActiveTarget] = useState('kick-off')
  const [creativeDays, setCreativeDays] = useState(DEFAULT_CREATIVE_DAYS)
  const [demoDays, setDemoDays] = useState(DEFAULT_DEMO_DAYS)
  const [adCommerce, setAdCommerce] = useState(false)
  const [smartCommerce, setSmartCommerce] = useState(false)
  const [showBuildSettings, setShowBuildSettings] = useState(false)
  const timelineRef = useRef(null)

  const handleAdCommerceToggle = (checked) => {
    setAdCommerce(checked)
    setDemoDays(checked ? AD_COMMERCE_DEMO_DAYS : DEFAULT_DEMO_DAYS)
  }

  // 2×2 matrix: design ownership × asset readiness
  const milestonesConfig = useMemo(() => {
    if (designMode === 'padSquad') {
      return assetsReady
        ? getPadSquadAssetsMilestones(demoDays, smartCommerce)
        : getPadSquadDesignMilestones(creativeDays, demoDays, smartCommerce)
    }
    return assetsReady
      ? getClientAssetsMilestones(demoDays, smartCommerce)
      : getClientDesignMilestones(demoDays, smartCommerce)
  }, [designMode, assetsReady, creativeDays, demoDays, smartCommerce])

  const milestones = useMemo(() => {
    if (!date) return []
    if (dateType === 'kick-off') {
      return getMilestoneDatesFromKickOff(date, milestonesConfig)
    }
    const totalBD = milestonesConfig[milestonesConfig.length - 1]?.bdOffset ?? 21
    return getMilestoneDatesFromGoLive(date, totalBD, milestonesConfig)
  }, [date, dateType, milestonesConfig])

  const kickOffDate = milestones?.[0]?.date
  const goLiveDate = milestones?.[milestones.length - 1]?.date
  const anchorDate = date

  // Past-date warning: check if the first milestone is in the past or within 3 BD
  const timelineWarning = useMemo(() => {
    if (!kickOffDate) return null
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const kick = new Date(kickOffDate)
    kick.setHours(0, 0, 0, 0)
    if (kick < today) return 'past'
    const bdAway = businessDaysBetween(today, kick)
    if (bdAway <= 3) return 'caution'
    return null
  }, [kickOffDate])

  const onSelectCalendarDate = (d) => {
    if (!d) return
    if (activeTarget === 'go-live') {
      setDateType('go-live')
      setDate(d)
      return
    }
    setDateType('kick-off')
    setDate(d)
  }

  const DateBadge = ({ type, label, colorVar, dateValue }) => {
    const isActive = activeTarget === type
    const day = dateValue ? format(dateValue, 'd') : '—'
    const month = dateValue ? format(dateValue, 'MMMM') : ''
    return (
      <button
        type="button"
        onClick={() => setActiveTarget(type)}
        className={`ps-card w-full text-left overflow-hidden transition-all flex-1 ${
          isActive
            ? 'shadow-[0_0_0_1px_rgba(132,214,226,0.3),0_8px_32px_rgba(0,0,0,0.5),0_2px_8px_rgba(132,214,226,0.15)] -translate-y-0.5'
            : 'shadow-[0_10px_30px_rgba(0,0,0,0.18)]'
        }`}
      >
        <div
          className="px-5 py-5 border-l-[3px] h-full flex flex-col justify-center"
          style={{ borderColor: `var(${colorVar})` }}
        >
          <div
            className="text-[11px] tracking-[0.22em] font-semibold uppercase"
            style={{ color: `var(${colorVar})` }}
          >
            {label}
          </div>
          <div className="mt-2">
            <div className="text-white font-bold tabular-nums leading-none" style={{ fontSize: 48 }}>
              {day}
            </div>
            {month && (
              <div className="text-[var(--ps-textSoft)] text-lg font-medium mt-1">{month}</div>
            )}
          </div>
          {isActive && !dateValue && (
            <div className="text-[var(--ps-muted)] text-[10px] tracking-[0.1em] uppercase mt-3 opacity-60">
              Select a date on the calendar
            </div>
          )}
        </div>
      </button>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--ps-bg)]">
      <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6">
        <a href="/" className="inline-flex items-center gap-1.5 text-xs text-[var(--ps-muted)] hover:text-[var(--ps-pink)] transition-colors mb-4">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M11 7H3M7 3L3 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Solutions Hub
        </a>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4 min-w-0">
            <svg width="36" height="34" viewBox="0 0 43 47" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="PadSquad" className="flex-shrink-0">
              <defs>
                <linearGradient id="ps-logo-grad" x2="1" y1=".5" y2=".5" gradientUnits="objectBoundingBox">
                  <stop offset="0" stopColor="#9f6bad"/>
                  <stop offset="1" stopColor="#ed609d"/>
                </linearGradient>
              </defs>
              <path d="M38.17 0H24.75a4.68 4.68 0 0 0-4.68 4.67V42.1a.85.85 0 0 1-.86.86H4.7a.86.86 0 0 1-.85-.85V14.75a.86.86 0 0 1 .85-.85H16.2a1.9 1.9 0 0 0 1.93-1.92v-1.9H4.68A4.68 4.68 0 0 0 0 14.73V42.1a4.68 4.68 0 0 0 4.68 4.68h14.54a4.68 4.68 0 0 0 4.68-4.67V4.68a.86.86 0 0 1 .86-.86h13.42a.86.86 0 0 1 .85.87v26.57a.85.85 0 0 1-.85.84H27.76A1.92 1.92 0 0 0 25.84 34v1.9h12.33a4.68 4.68 0 0 0 4.68-4.65V4.66A4.68 4.68 0 0 0 38.18 0z" fill="url(#ps-logo-grad)"/>
            </svg>
            <h1 className="text-2xl sm:text-3xl font-semibold text-white">
              Campaign<br className="sm:hidden" /> Timelines & Schedule
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <DesignToggle
              designMode={designMode}
              onDesignChange={setDesignMode}
            />
          </div>
        </div>

        {/* HERO: calendar + date badges – stacked below lg, side-by-side at lg+ */}
        <section className="mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6 items-start lg:items-stretch">
            <div className="min-w-0 overflow-x-auto">
              <p className="mb-2 text-[11px] text-[var(--ps-muted)] tracking-[0.04em]">
                Select a campaign kick-off or campaign launch date, weekends excluded.
              </p>
              <DatePicker
                kickOffDate={kickOffDate}
                goLiveDate={goLiveDate}
                activeTarget={activeTarget}
                onSelectDate={onSelectCalendarDate}
              />
            </div>
            <div className="flex flex-row lg:flex-col gap-4">
              <DateBadge type="kick-off" label="Campaign Kick-Off" colorVar="--ps-pink" dateValue={kickOffDate} />
              <DateBadge type="go-live" label="Campaign Launch" colorVar="--ps-teal" dateValue={goLiveDate} />
            </div>
          </div>
        </section>

        {/* ASSETS CONFIRMATION + BUILD TIMELINE CONTROLS */}
        <div className="mb-8 space-y-5">
          {/* Checkboxes row */}
          <div className="flex flex-wrap gap-x-8 gap-y-3">
          {/* Assets checkbox */}
          <label className="flex items-center gap-3 cursor-pointer select-none group">
            <span className="relative flex-shrink-0">
              <input
                type="checkbox"
                checked={assetsReady}
                onChange={(e) => setAssetsReady(e.target.checked)}
                className="ps-checkbox"
              />
              <svg
                className={`absolute inset-0 w-5 h-5 pointer-events-none transition-opacity ${assetsReady ? 'opacity-100' : 'opacity-0'}`}
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden
              >
                <path d="M6 10l3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span className="text-[12px] tracking-[0.12em] font-semibold text-[var(--ps-muted)] uppercase group-hover:text-[var(--ps-textSoft)] transition-colors">
              Assets received by PadSquad
            </span>
          </label>

          {/* Smart Commerce checkbox */}
          <label className="flex items-center gap-3 cursor-pointer select-none group">
            <span className="relative flex-shrink-0">
              <input
                type="checkbox"
                checked={smartCommerce}
                onChange={(e) => setSmartCommerce(e.target.checked)}
                className="ps-checkbox"
              />
              <svg
                className={`absolute inset-0 w-5 h-5 pointer-events-none transition-opacity ${smartCommerce ? 'opacity-100' : 'opacity-0'}`}
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden
              >
                <path d="M6 10l3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="text-[12px] tracking-[0.12em] font-semibold text-[var(--ps-muted)] uppercase group-hover:text-[var(--ps-textSoft)] transition-colors">
                Smart Commerce
              </span>
              <span className="text-[10px] text-[var(--ps-muted)] opacity-60">
                Adds 7 BD lead time for retailer data requirements
              </span>
            </span>
          </label>
          </div>{/* end checkboxes row */}

          {/* Build timeline day controls — collapsed by default */}
          <div className="ps-card overflow-hidden">
            <button
              type="button"
              onClick={() => setShowBuildSettings((v) => !v)}
              className="w-full flex items-center justify-between px-5 py-4 text-left group"
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] tracking-[0.18em] font-bold text-[var(--ps-muted)] uppercase">
                  Build Timeline
                </span>
                {!showBuildSettings && (
                  <span className="text-[10px] text-[var(--ps-muted)] opacity-60 tabular-nums">
                    {designMode === 'padSquad' && !assetsReady ? `Creative ${creativeDays}d · ` : ''}Demo {demoDays}d{adCommerce ? ' · Ad Commerce' : ''}
                  </span>
                )}
              </div>
              <span className="text-[var(--ps-muted)] group-hover:text-[var(--ps-textSoft)] transition-colors text-xs font-semibold">
                {showBuildSettings ? 'Done' : 'Adjust'}
              </span>
            </button>
            {showBuildSettings && (
              <div className="px-5 pb-5 border-t border-[var(--ps-divider)]">
                <div className="flex flex-wrap gap-x-8 gap-y-4 items-end pt-4">
                  {/* Creative dev days — only applies when PadSquad designs and no assets yet */}
                  {designMode === 'padSquad' && !assetsReady && (
                    <DaysStepper
                      label="Creative Development"
                      value={creativeDays}
                      onChange={setCreativeDays}
                    />
                  )}
                  {/* Demo dev days — always relevant */}
                  <DaysStepper
                    label="Demo Development"
                    value={demoDays}
                    onChange={(v) => {
                      setDemoDays(v)
                      if (adCommerce && v !== AD_COMMERCE_DEMO_DAYS) setAdCommerce(false)
                    }}
                  />
                  {/* Ad Commerce toggle */}
                  <label className="inline-flex items-center gap-2.5 cursor-pointer select-none group self-end pb-0.5">
                    <span className="relative flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={adCommerce}
                        onChange={(e) => handleAdCommerceToggle(e.target.checked)}
                        className="ps-checkbox"
                      />
                      <svg
                        className={`absolute inset-0 w-5 h-5 pointer-events-none transition-opacity ${adCommerce ? 'opacity-100' : 'opacity-0'}`}
                        viewBox="0 0 20 20"
                        fill="none"
                        aria-hidden
                      >
                        <path d="M6 10l3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <span className="flex flex-col gap-0.5">
                      <span className="text-[11px] tracking-[0.1em] font-semibold text-[var(--ps-muted)] uppercase group-hover:text-[var(--ps-textSoft)] transition-colors">
                        Ad Commerce / Game Build
                      </span>
                      <span className="text-[10px] text-[var(--ps-muted)] opacity-60">
                        Presets demo dev to {AD_COMMERCE_DEMO_DAYS} days
                      </span>
                    </span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* TIMELINE WARNING */}
        {timelineWarning === 'past' && (
          <div className="mb-4 px-5 py-3 rounded-xl bg-[rgba(239,68,68,0.12)] border border-[rgba(239,68,68,0.3)] text-[#F87171] text-sm font-medium flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M10 6v4m0 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            The kick-off date has passed — please select a future date to build an accurate timeline.
          </div>
        )}
        {timelineWarning === 'caution' && (
          <div className="mb-4 px-5 py-3 rounded-xl bg-[rgba(251,191,36,0.12)] border border-[rgba(251,191,36,0.3)] text-[#FBBF24] text-sm font-medium flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M10 6v4m0 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Heads up — kick-off is within 3 business days. Confirm this timeline is still on track.
          </div>
        )}

        {/* TIMELINE */}
        <section className="grid grid-cols-1 gap-6">
          <Timeline ref={timelineRef} id={TIMELINE_EXPORT_ID} milestones={milestones} timelineWarning={timelineWarning} />
          <div
            className="flex items-center justify-between px-5 py-4 rounded-xl"
            style={{
              background: 'rgba(255,255,255,0.03)',
              borderTop: '1px solid var(--ps-divider)',
            }}
          >
            <div className="text-[11px] tracking-[0.14em] font-semibold text-[var(--ps-muted)] uppercase">
              Campaign Timeline
            </div>
            <ExportButton
              timelineRef={timelineRef}
              milestones={milestones}
              anchorDate={anchorDate}
              dateType={dateType}
              designMode={designMode}
              smartCommerce={smartCommerce}
            />
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
