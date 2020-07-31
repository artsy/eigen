import moment from "moment-timezone"

import { REGISTERED_SALES } from "./fixtures"

// TODO: Add test coverage for this function
export const saleTime = (sale: typeof REGISTERED_SALES[0]["node"]) => {
  const datetime = (sale.liveStartAt || sale.endAt) as string
  const dateInMoment = moment(datetime, moment.ISO_8601).tz(moment.tz.guess(true))
  const now = moment()

  let formattedDate
  if (now.day() === dateInMoment.day()) {
    formattedDate = `today at ${dateInMoment.format("LT")}`
  } else if (now.add(1, "day").day() === dateInMoment.day()) {
    formattedDate = `tomorrow at ${dateInMoment.format("LT")}`
  } else {
    formattedDate = `at ${dateInMoment.format("h:mma")} on ${dateInMoment.format("M/D")}`
  }

  if (sale.liveStartAt) {
    return `Live sale opens ${formattedDate}`
  } else {
    return `Closes ${formattedDate}`
  }
}
