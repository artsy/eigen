import { DateTime } from "luxon"

export type SaleStatus = "notYetOpen" | "active" | "closed"

export const saleStatus = (
  startAt: string | null | undefined,
  endAt: string | null | undefined,
  registrationEndsAt: string | null | undefined
): SaleStatus => {
  const now = DateTime.now()
  if (registrationEndsAt && DateTime.fromISO(registrationEndsAt) < now) {
    return "closed"
  }

  if (!startAt || !endAt) {
    return "notYetOpen"
  }

  if (DateTime.fromISO(startAt) > now) {
    return "notYetOpen"
  }

  if (DateTime.fromISO(startAt) < now && now < DateTime.fromISO(endAt)) {
    return "active"
  }

  return "closed"
}
