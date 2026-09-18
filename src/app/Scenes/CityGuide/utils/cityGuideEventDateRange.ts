import { DateTime } from "luxon"

/** "October 14-18, 2026", condensing the month/year when start and end share them. */
export const cityGuideEventDateRange = (startAt: string, endAt: string) => {
  const start = DateTime.fromISO(startAt, { zone: "utc" })
  const end = DateTime.fromISO(endAt, { zone: "utc" })

  if (!start.isValid || !end.isValid) {
    return ""
  }

  if (start.hasSame(end, "day")) {
    return start.toFormat("MMMM d, yyyy")
  }

  if (start.hasSame(end, "month") && start.hasSame(end, "year")) {
    return `${start.toFormat("MMMM d")}-${end.toFormat("d, yyyy")}`
  }

  if (start.hasSame(end, "year")) {
    return `${start.toFormat("MMMM d")} - ${end.toFormat("MMMM d, yyyy")}`
  }

  return `${start.toFormat("MMMM d, yyyy")} - ${end.toFormat("MMMM d, yyyy")}`
}
