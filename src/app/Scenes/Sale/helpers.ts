import moment from "moment"

export type SaleStatus = "notYetOpen" | "active" | "closed"

export const saleStatus = (
  startAt: string | null,
  endAt: string | null,
  registrationEndsAt: string | null
): SaleStatus => {
  const now = moment()
  if (registrationEndsAt && moment(registrationEndsAt).isBefore(now)) {
    return "closed"
  }

  if (startAt === null || endAt === null) {
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
