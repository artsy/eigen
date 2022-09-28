import { DateTime } from "luxon"

export const getDateLabel = (timestamp: string) => {
  const date = DateTime.fromISO(timestamp)

  if (isToday(date)) {
    return "Today"
  }

  const days = daysAgo(date)
  const label = days > 1 ? "days" : "day"

  return `${days} ${label} ago`
}

const isToday = (date: DateTime) => {
  return date.toISODate() === DateTime.now().toISODate()
}

const daysAgo = (date: DateTime) => {
  return Math.floor(DateTime.now().diff(date, "days").days)
}
