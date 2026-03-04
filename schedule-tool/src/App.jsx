import { useState, useRef, useMemo } from 'react'
import { format } from 'date-fns'
import { DatePicker } from './components/DatePicker'
import { DesignToggle } from './components/DesignToggle'
import { Timeline } from './components/Timeline'
import { ExportButton } from './components/ExportButton'
import { PADSQUAD_DESIGN_MILESTONES, CLIENT_DESIGN_MILESTONES, PADSQUAD_ASSETS_MILESTONES, CLIENT_ASSETS_MILESTONES } from './config/milestones'
import {
  getMilestoneDatesFromKickOff,
  getMilestoneDatesFromGoLive,
} from './utils/businessDays'

const TIMELINE_EXPORT_ID = 'campaign-timeline-export'

function App() {
  const [date, setDate] = useState(null)
  const [dateType, setDateType] = useState('kick-off')
  const [designMode, setDesignMode] = useState('padSquad')
  const [assetsReady, setAssetsReady] = useState(false)
  const [activeTarget, setActiveTarget] = useState('kick-off')
  const timelineRef = useRef(null)

  // 2×2 matrix: design ownership × asset readiness
  const milestonesConfig = designMode === 'padSquad'
    ? (assetsReady ? PADSQUAD_ASSETS_MILESTONES : PADSQUAD_DESIGN_MILESTONES)
    : (assetsReady ? CLIENT_ASSETS_MILESTONES   : CLIENT_DESIGN_MILESTONES)

  const milestones = useMemo(() => {
    if (!date) return []
    if (dateType === 'kick-off') {
      return getMilestoneDatesFromKickOff(date, milestonesConfig)
    }
    const totalBD = milestonesConfig[milestonesConfig.length - 1]?.bdOffset ?? 21
    return getMilestoneDatesFromGoLive(date, totalBD, milestonesConfig)
  }, [date, dateType, designMode, assetsReady, milestonesConfig])

  const kickOffDate = milestones?.[0]?.date
  const goLiveDate = milestones?.[milestones.length - 1]?.date
  const anchorDate = date

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
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
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
              Campaign Timelines & Schedule
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

        {/* ASSETS CONFIRMATION */}
        <div className="mb-8">
          <label className="inline-flex items-center gap-3 cursor-pointer select-none group">
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
        </div>

        {/* TIMELINE */}
        <section className="grid grid-cols-1 gap-6">
          <Timeline ref={timelineRef} id={TIMELINE_EXPORT_ID} milestones={milestones} />
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
            />
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
