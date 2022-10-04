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

  return `${days} days ago`
}

const isToday = (date: DateTime) => {
  return date.toISODate() === DateTime.now().toISODate()
}

const daysAgo = (date: DateTime) => {
  return Math.floor(DateTime.now().diff(date, "days").days)
}
