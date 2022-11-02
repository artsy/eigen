import { DateTime } from "luxon"

// TODO: Clarify format
export const formateLotDateTime = (endAt: string) => {
  const date = DateTime.fromISO(endAt)

  return date.toFormat("MMM dd, h:mma")
}
