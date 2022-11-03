import { DateTime } from "luxon"

export const formateLotDateTime = (endAt: string) => {
  const date = DateTime.fromISO(endAt)
  const monthDay = date.toFormat("MMM dd")
  const hoursMinutes = date.toFormat(date.get("minute") === 0 ? "h" : "h:mm")
  const amPm = date.toFormat("a").toLowerCase()
  const timeZone = date.toFormat("ZZ")

  return `${monthDay}, ${hoursMinutes}${amPm} (${timeZone})`
}
