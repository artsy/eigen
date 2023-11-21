import moment from "moment"

export type SaleStatus = "notYetOpen" | "active" | "closed"

export const saleStatus = (
  startAt: string | null | undefined,
  endAt: string | null | undefined,
  registrationEndsAt: string | null | undefined
): SaleStatus => {
  const now = moment()
  if (registrationEndsAt && moment(registrationEndsAt).isBefore(now)) {
    return "closed"
  }

  if (!startAt || !endAt) {
    return "notYetOpen"
  }

  if (moment(startAt).isAfter(now)) {
    return "notYetOpen"
  }

  if (moment(startAt).isBefore(now) && now.isBefore(moment(endAt))) {
    return "active"
  }

  return "closed"
}
