import { addDays, subDays, isWeekend, format } from 'date-fns'

/**
 * US federal holidays (no weekends) — add more as needed.
 * Format: 'YYYY-MM-DD'
 */
const HOLIDAYS = [
  '2025-01-01', // New Year's Day
  '2025-01-20', // MLK
  '2025-02-17', // Presidents
  '2025-05-26', // Memorial
  '2025-07-04', // Independence
  '2025-09-01', // Labor
  '2025-11-27', // Thanksgiving
  '2025-12-25', // Christmas
  '2026-01-01',
  '2026-01-19',
  '2026-02-16',
  '2026-05-25',
  '2026-07-03',
  '2026-09-07',
  '2026-11-26',
  '2026-12-25',
]

const holidaySet = new Set(HOLIDAYS)

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
 * Compute milestone dates from kick-off. Uses date-fns addBusinessDays
 * and then skips any day that lands on a holiday.
 * @param {Date} kickOffDate
 * @param {{ label: string, bdOffset: number }[]} milestones
 * @returns {{ label: string, date: Date, bdOffset: number }[]}
 */
export function getMilestoneDatesFromKickOff(kickOffDate, milestones) {
  const kickOff = new Date(kickOffDate)
  return milestones.map(({ label, bdOffset }) => ({
    label,
    bdOffset,
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
