import { DateTime } from "luxon"

export const getDateLabel = (timestamp: string) => {
  const date = DateTime.fromISO(timestamp)

  if (isToday(date)) {
    return "Today"
  }

  const days = daysAgo(date)

  // It's NOT today and it's been less than 2 days
  if (days <= 1) {
    return "Yesterday"
  }

  const label = days > 1 ? "days" : "day"

  return `${days} ${label} ago`
}

const isToday = (date: DateTime) => {
  return date.toISODate() === DateTime.now().toISODate()
}

const daysAgo = (date: DateTime) => {
  return DateTime.now().diff(date, ["days", "hours"]).days
}
