import { addDays, subDays, isWeekend, format } from 'date-fns'

/**
 * US federal holidays — add more as needed.
 * Format: 'YYYY-MM-DD'
 * Includes: New Year's, MLK, Presidents', Memorial, Juneteenth,
 * Independence, Labor, Columbus, Veterans, Thanksgiving, Christmas.
 */
const HOLIDAYS = [
  // ── 2025 ──
  '2025-01-01', // New Year's Day
  '2025-01-20', // MLK Day
  '2025-02-17', // Presidents' Day
  '2025-05-26', // Memorial Day
  '2025-06-19', // Juneteenth
  '2025-07-04', // Independence Day
  '2025-09-01', // Labor Day
  '2025-10-13', // Columbus Day
  '2025-11-11', // Veterans Day
  '2025-11-27', // Thanksgiving
  '2025-12-25', // Christmas

  // ── 2026 ──
  '2026-01-01', // New Year's Day
  '2026-01-19', // MLK Day
  '2026-02-16', // Presidents' Day
  '2026-05-25', // Memorial Day
  '2026-06-19', // Juneteenth
  '2026-07-03', // Independence Day (observed)
  '2026-09-07', // Labor Day
  '2026-10-12', // Columbus Day
  '2026-11-11', // Veterans Day
  '2026-11-26', // Thanksgiving
  '2026-12-25', // Christmas

  // ── 2027 ──
  '2027-01-01', // New Year's Day
  '2027-01-18', // MLK Day
  '2027-02-15', // Presidents' Day
  '2027-05-31', // Memorial Day
  '2027-06-18', // Juneteenth (observed — Jun 19 is Sat)
  '2027-07-05', // Independence Day (observed — Jul 4 is Sun)
  '2027-09-06', // Labor Day
  '2027-10-11', // Columbus Day
  '2027-11-11', // Veterans Day
  '2027-11-25', // Thanksgiving
  '2027-12-24', // Christmas (observed — Dec 25 is Sat)
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
