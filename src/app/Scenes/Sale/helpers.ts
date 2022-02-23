import { capitalize } from "lodash"
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

export const formatDisplayTimelyAt = (displayTimelyAt: string | null) => {
  return capitalize(
    displayTimelyAt
      ?.replace(/M$/, "mo")
      // We are getting a line break from metaphysics that is used in viewing rooms
      // See https://www.notion.so/artsy/Seeing-register-by-in-time-field-on-Auction-cards-9e2e742a85e5457db62607a1655507cd
      .replace("\n", " ")
  ).replace(/(jan|feb|mar|apr|may|jun|jul|aug|sept|oct|nov|dec)/, (s) => capitalize(s))
}
