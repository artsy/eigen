import moment from "moment"

export type SaleStatus = "notYetOpen" | "active" | "closed"

export const saleStatus = (startAt: string | null, endAt: string | null): SaleStatus => {
  if (startAt === null || endAt === null) {
    return "notYetOpen"
  }

  const now = moment()
  if (moment(startAt) > now) {
    return "notYetOpen"
  }

  if (moment(startAt) < now && now < moment(endAt)) {
    return "active"
  }

  return "closed"
}
