import { DateTime } from "luxon"

export const exhibitionDates = (dateRange: string, endDate: string) => {
  const oneYearFromToday = DateTime.now().plus({ years: 2 }).toUTC()
  const exhibitionEndDate = DateTime.fromISO(endDate).toUTC()
  const shouldDisplayOngoing = exhibitionEndDate >= oneYearFromToday

  if (shouldDisplayOngoing) {
    return "Ongoing"
  }
  return dateRange
}
