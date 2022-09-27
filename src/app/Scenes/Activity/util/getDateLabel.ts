import { DateTime } from "luxon"

export const getDateLabel = (dateInISO: string) => {
  const past = DateTime.fromISO(dateInISO)
  const now = DateTime.utc()
  const diff = now.diff(past, "days")
  const days = Math.floor(diff.days)

  if (days === 0) {
    return "Today"
  }

  return `${days} days ago`
}
