import { useState, useEffect } from 'react'
import { DayPicker } from 'react-day-picker'
import { isAfter, isBefore, startOfMonth } from 'date-fns'
import { HOLIDAY_DATES } from '../utils/businessDays'
import 'react-day-picker/src/style.css'

const MOBILE_QUERY = '(max-width: 639px)'

/**
 * Always-visible calendar month grid.
 * - Weekends are disabled (non-clickable).
 * - Kick-off and Go-live are shown as pink filled circles.
 * - Range between them is highlighted.
 * - Shows 1 month on mobile, 2 on wider screens.
 */
export function DatePicker({
  kickOffDate,
  goLiveDate,
  activeTarget,
  onSelectDate,
}) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(MOBILE_QUERY).matches : false,
  )

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY)
    const handler = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const baseMonth = startOfMonth(today)
  const hasBoth = !!kickOffDate && !!goLiveDate
  const start = hasBoth
    ? isBefore(kickOffDate, goLiveDate)
      ? kickOffDate
      : goLiveDate
    : undefined
  const end = hasBoth
    ? isAfter(kickOffDate, goLiveDate)
      ? kickOffDate
      : goLiveDate
    : undefined

  return (
    <div className="ps-card ps-card--calendar">
      <DayPicker
        mode="single"
        defaultMonth={baseMonth}
        numberOfMonths={isMobile ? 1 : 2}
        pagedNavigation
        showOutsideDays
        disabled={[{ dayOfWeek: [0, 6] }, { before: today }, ...HOLIDAY_DATES]}
        formatters={{
          formatWeekdayName: (weekdayDate) => {
            // Exactly 2 characters, never truncated.
            // Date.getDay(): 0=Su ... 6=Sa
            const map = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
            return map[weekdayDate.getDay()]
          },
        }}
        onDayClick={(day, modifiers) => {
          if (modifiers?.disabled) return
          onSelectDate?.(day)
        }}
        modifiers={{
          kickOff: kickOffDate ? [kickOffDate] : [],
          goLive: goLiveDate ? [goLiveDate] : [],
          inRange: start && end ? { after: start, before: end } : undefined,
          today: new Date(),
          holiday: HOLIDAY_DATES,
        }}
        modifiersClassNames={{
          kickOff: activeTarget === 'kick-off' ? 'ps-kickoff ps-active-end' : 'ps-kickoff',
          goLive: activeTarget === 'go-live' ? 'ps-golive ps-active-end' : 'ps-golive',
          inRange: 'ps-range',
          disabled: 'ps-disabled',
          today: 'ps-today',
          holiday: 'ps-holiday',
        }}
        classNames={{
          root: 'ps-rdp',
          months: 'ps-rdp__months',
          month: 'ps-rdp__month',
          caption: 'ps-rdp__caption',
          caption_label: 'ps-rdp__captionLabel',
          nav: 'ps-rdp__nav',
          button_previous: 'ps-rdp__navButton',
          button_next: 'ps-rdp__navButton',
          month_grid: 'ps-rdp__grid',
          weekdays: 'ps-rdp__weekdays',
          weekday: 'ps-rdp__weekday',
          week: 'ps-rdp__week',
          day: 'ps-rdp__day',
          day_button: 'ps-rdp__dayButton',
          outside: 'ps-rdp__outside',
        }}
      />
      <div className="flex justify-end px-4 pb-3 pt-1">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#F59E0B', opacity: 0.7 }} />
          <span className="text-[10px] tracking-[0.08em] text-[var(--ps-muted)] opacity-70">
            Federal holiday — office closed
          </span>
        </div>
      </div>
    </div>
  )
}

export default DatePicker
