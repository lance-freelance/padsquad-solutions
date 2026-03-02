import { forwardRef } from 'react'
import { format } from 'date-fns'

/**
 * Visual timeline of milestones with dates.
 * Receives computed milestone entries { label, date, bdOffset }.
 */
export const Timeline = forwardRef(function Timeline({ milestones, id: timelineId }, ref) {
  if (!milestones || milestones.length === 0) {
    return (
      <div
        ref={ref}
        id={timelineId}
        className="ps-card p-8 text-center text-[var(--ps-muted)] text-sm"
      >
        Select a date to see the timeline.
      </div>
    )
  }

  const lastIndex = milestones.length - 1
  const left = milestones.slice(0, 8)
  const right = milestones.slice(8)

  const renderItem = (m, globalIndex, localIndex, isFirst) => {
    const isLaunch = globalIndex === lastIndex
    return (
      <li
        key={`${m.label}-${m.bdOffset}`}
        className={`flex items-center gap-4 px-4 py-3 ${
          localIndex % 2 === 0 ? 'bg-[rgba(255,255,255,0.02)]' : 'bg-transparent'
        } ${isFirst ? '' : 'border-t border-[var(--ps-divider)]'}`}
      >
        <div className="flex-shrink-0">
          <div className={isLaunch ? 'ps-dateBadge ps-dateBadge--teal' : 'ps-dateBadge'}>
            {format(m.date, 'd MMM').toUpperCase()}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white font-medium">{m.label}</div>
        </div>
      </li>
    )
  }

  return (
    <div
      ref={ref}
      id={timelineId}
      className="ps-card overflow-hidden"
      style={{ minWidth: 320 }}
    >
      <div className="px-6 pt-6 pb-4">
        <div className="text-xs tracking-[0.18em] font-semibold text-[var(--ps-pink)] uppercase">
          CAMPAIGN TIMELINE
        </div>
      </div>
      <div className="px-2 pb-2">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <ul className="space-y-0">
            {left.map((m, i) => renderItem(m, i, i, i === 0))}
          </ul>
          <ul className="space-y-0 md:border-l md:border-[var(--ps-divider)]">
            {right.map((m, i) => renderItem(m, i + 8, i, i === 0))}
          </ul>
        </div>
      </div>
    </div>
  )
})

export default Timeline
