import { useState, useRef, useMemo } from 'react'
import { format } from 'date-fns'
import { DatePicker } from './components/DatePicker'
import { DesignToggle } from './components/DesignToggle'
import { Timeline } from './components/Timeline'
import { ExportButton } from './components/ExportButton'
import { PADSQUAD_DESIGN_MILESTONES, CLIENT_DESIGN_MILESTONES, ASSET_PRODUCTION_MILESTONES } from './config/milestones'
import {
  getMilestoneDatesFromKickOff,
  getMilestoneDatesFromGoLive,
} from './utils/businessDays'

const TIMELINE_EXPORT_ID = 'campaign-timeline-export'

function App() {
  const [date, setDate] = useState(() => {
    const d = new Date()
    if (d.getDay() === 0) d.setDate(d.getDate() + 1)
    if (d.getDay() === 6) d.setDate(d.getDate() + 2)
    return d
  })
  const [dateType, setDateType] = useState('kick-off')
  const [designMode, setDesignMode] = useState('padSquad')
  const [activeTarget, setActiveTarget] = useState('kick-off')
  const timelineRef = useRef(null)

  const milestonesConfig =
    designMode === 'padSquad'        ? PADSQUAD_DESIGN_MILESTONES :
    designMode === 'assetProduction' ? ASSET_PRODUCTION_MILESTONES :
                                       CLIENT_DESIGN_MILESTONES

  const milestones = useMemo(() => {
    if (!date) return []
    if (dateType === 'kick-off') {
      return getMilestoneDatesFromKickOff(date, milestonesConfig)
    }
    const totalBD = milestonesConfig[milestonesConfig.length - 1]?.bdOffset ?? 28
    return getMilestoneDatesFromGoLive(date, totalBD, milestonesConfig)
  }, [date, dateType, designMode, milestonesConfig])

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
    const month = dateValue ? format(dateValue, 'MMMM') : '—'
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
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-white font-bold tabular-nums leading-none" style={{ fontSize: 48 }}>
              {day}
            </span>
            <span className="text-[var(--ps-textSoft)] text-lg font-medium">{month}</span>
          </div>
          {isActive && (
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
          <div>
            <div className="text-xs tracking-[0.18em] font-semibold text-[var(--ps-muted)] uppercase">
              PadSquad
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-white mt-1">
              Campaign Timelines & Schedule
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <DesignToggle value={designMode} onChange={setDesignMode} />
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

        {/* TIMELINE */}
        <section className="grid grid-cols-1 gap-6">
          <Timeline ref={timelineRef} id={TIMELINE_EXPORT_ID} milestones={milestones} />
          <div className="flex items-center justify-end">
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
