import { addDays, subDays, isWeekend, format } from 'date-fns'

/**
 * US federal holidays with names.
 * Format: { date: 'YYYY-MM-DD', name: string }
 */
const HOLIDAY_ENTRIES = [
  // ── 2025 ──
  { date: '2025-01-01', name: "New Year's Day" },
  { date: '2025-01-20', name: 'MLK Day' },
  { date: '2025-02-17', name: "Presidents' Day" },
  { date: '2025-05-26', name: 'Memorial Day' },
  { date: '2025-06-19', name: 'Juneteenth' },
  { date: '2025-07-04', name: 'Independence Day' },
  { date: '2025-09-01', name: 'Labor Day' },
  { date: '2025-10-13', name: 'Columbus Day' },
  { date: '2025-11-11', name: 'Veterans Day' },
  { date: '2025-11-27', name: 'Thanksgiving' },
  { date: '2025-12-25', name: 'Christmas' },

  // ── 2026 ──
  { date: '2026-01-01', name: "New Year's Day" },
  { date: '2026-01-19', name: 'MLK Day' },
  { date: '2026-02-16', name: "Presidents' Day" },
  { date: '2026-05-25', name: 'Memorial Day' },
  { date: '2026-06-19', name: 'Juneteenth' },
  { date: '2026-07-03', name: 'Independence Day (observed)' },
  { date: '2026-09-07', name: 'Labor Day' },
  { date: '2026-10-12', name: 'Columbus Day' },
  { date: '2026-11-11', name: 'Veterans Day' },
  { date: '2026-11-26', name: 'Thanksgiving' },
  { date: '2026-12-25', name: 'Christmas' },

  // ── 2027 ──
  { date: '2027-01-01', name: "New Year's Day" },
  { date: '2027-01-18', name: 'MLK Day' },
  { date: '2027-02-15', name: "Presidents' Day" },
  { date: '2027-05-31', name: 'Memorial Day' },
  { date: '2027-06-18', name: 'Juneteenth (observed)' },
  { date: '2027-07-05', name: 'Independence Day (observed)' },
  { date: '2027-09-06', name: 'Labor Day' },
  { date: '2027-10-11', name: 'Columbus Day' },
  { date: '2027-11-11', name: 'Veterans Day' },
  { date: '2027-11-25', name: 'Thanksgiving' },
  { date: '2027-12-24', name: 'Christmas (observed)' },
]

/** Map of 'YYYY-MM-DD' → holiday name, for quick lookups */
export const HOLIDAY_NAME_MAP = Object.fromEntries(
  HOLIDAY_ENTRIES.map(({ date, name }) => [date, name]),
)

/** Array of Date objects for all known holidays (used by the calendar) */
export const HOLIDAY_DATES = HOLIDAY_ENTRIES.map(({ date }) => {
  const [y, m, d] = date.split('-').map(Number)
  return new Date(y, m - 1, d)
})

const holidaySet = new Set(HOLIDAY_ENTRIES.map((e) => e.date))

/**
 * @param {Date} date
 * @returns {boolean}
 */
function isHoliday(date) {
  return holidaySet.has(format(date, 'yyyy-MM-dd'))
}

/**
 * @param {Date} date
 * @returns {boolean}
 */
export function isBusinessDay(date) {
  return !isWeekend(date) && !isHoliday(date)
}

/**
 * Add n business days from date, skipping weekends and holidays.
 * @param {Date} date
 * @param {number} n
 * @returns {Date}
 */
export function addBD(date, n) {
  if (n <= 0) return new Date(date)
  let d = new Date(date)
  let count = 0
  while (count < n) {
    d = addDays(d, 1)
    if (isBusinessDay(d)) count++
  }
  return d
}

/**
 * Subtract n business days from date (e.g. for go-live → kick-off).
 * @param {Date} date
 * @param {number} n
 * @returns {Date}
 */
export function subBD(date, n) {
  if (n <= 0) return new Date(date)
  let d = new Date(date)
  let count = 0
  while (count < n) {
    d = subDays(d, 1)
    if (isBusinessDay(d)) count++
  }
  return d
}

/**
 * Count business days between two dates (exclusive of start, inclusive of end).
 * Returns 0 if start >= end.
 * @param {Date} start
 * @param {Date} end
 * @returns {number}
 */
export function businessDaysBetween(start, end) {
  let count = 0
  let d = new Date(start)
  const target = new Date(end)
  target.setHours(0, 0, 0, 0)
  d.setHours(0, 0, 0, 0)
  if (d >= target) return 0
  while (d < target) {
    d = addDays(d, 1)
    if (isBusinessDay(d)) count++
  }
  return count
}

/**
 * Return holidays that fall within [startDate, endDate] inclusive.
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {{ date: Date, name: string }[]}
 */
export function getHolidaysInRange(startDate, endDate) {
  const s = new Date(startDate); s.setHours(0, 0, 0, 0)
  const e = new Date(endDate);   e.setHours(0, 0, 0, 0)
  return HOLIDAY_ENTRIES
    .filter(({ date }) => {
      const [y, m, d] = date.split('-').map(Number)
      const t = new Date(y, m - 1, d)
      return t >= s && t <= e
    })
    .map(({ date, name }) => {
      const [y, m, d] = date.split('-').map(Number)
      return { date: new Date(y, m - 1, d), name }
    })
}

/**
 * Compute milestone dates from kick-off. Uses date-fns addBusinessDays
 * and then skips any day that lands on a holiday.
 * @param {Date} kickOffDate
 * @param {{ label: string, bdOffset: number }[]} milestones
 * @returns {{ label: string, date: Date, bdOffset: number }[]}
 */
export function getMilestoneDatesFromKickOff(kickOffDate, milestones) {
  const kickOff = new Date(kickOffDate)
  return milestones.map(({ label, bdOffset, isClientAction }) => ({
    label,
    bdOffset,
    isClientAction,
    date: addBD(kickOff, bdOffset),
  }))
}

/**
 * Given a go-live date and total project length in BD, derive kick-off
 * and then milestone dates.
 * @param {Date} goLiveDate
 * @param {number} totalBD
 * @param {{ label: string, bdOffset: number }[]} milestones
 * @returns {{ label: string, date: Date, bdOffset: number }[]}
 */
export function getMilestoneDatesFromGoLive(goLiveDate, totalBD, milestones) {
  const goLive = new Date(goLiveDate)
  const kickOff = subBD(goLive, totalBD)
  return getMilestoneDatesFromKickOff(kickOff, milestones)
}
