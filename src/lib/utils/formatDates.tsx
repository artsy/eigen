import { DateTime } from "luxon"

/**
 * Helper functions to format datetimes
 */
export const formatDateTime = (date: string) => {
  const now = DateTime.local()
  const luxonDate = DateTime.fromISO(date)
  if (now.hasSame(luxonDate, "year")) {
    return `${luxonDate.toFormat("MMM d, h:mm")}${luxonDate.toFormat("a").toLowerCase()} ${luxonDate.offsetNameShort}`
  } else {
    return `${luxonDate.toFormat("MMM d, y, h:mm")}${luxonDate.toFormat("a").toLowerCase()} ${
      luxonDate.offsetNameShort
    }`
  }
}

export const formatDate = (date: string) => {
  const now = DateTime.local()
  const luxonDate = DateTime.fromISO(date)
  if (now.hasSame(luxonDate, "year")) {
    return `${luxonDate.toFormat("MMM d")}`
  } else {
    return `${luxonDate.toFormat("MMM d, y")}`
  }
}
