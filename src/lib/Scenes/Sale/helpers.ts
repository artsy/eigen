import moment from "moment"

export type SaleStatus = "notYetOpen" | "active" | "closed"

export const isCurrentlyActive = (startAt: string, endAt: string) => {
  const now = moment()
  return moment(startAt) < now && now < moment(endAt)
}

export const saleStatus = (startAt: string | null, endAt: string | null): SaleStatus => {
  if (startAt === null || endAt === null) {
    return "notYetOpen"
  }

  if (isCurrentlyActive(startAt, endAt)) {
    return "active"
  }

  const now = moment()
  if (moment(startAt) > now) {
    return "notYetOpen"
  }

  return "closed"
}
