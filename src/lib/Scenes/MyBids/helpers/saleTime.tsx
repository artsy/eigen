import moment from "moment-timezone"

import { MyBids_sales } from "__generated__/MyBids_sales.graphql"

type Sale = NonNullable<NonNullable<MyBids_sales["edges"]>[number]>["node"]

export const saleTime = (sale?: Sale) => {
  const datetime = (sale?.liveStartAt || sale?.endAt) as string
  const dateInMoment = moment(datetime, moment.ISO_8601).tz(moment.tz.guess(true))
  const now = moment()

  let formattedDate
  if (now.day() === dateInMoment.day()) {
    formattedDate = `today at ${dateInMoment.format("h:mma")}`
  } else if (now.add(1, "day").day() === dateInMoment.day()) {
    formattedDate = `tomorrow at ${dateInMoment.format("h:mma")}`
  } else {
    formattedDate = `at ${dateInMoment.format("h:mma")} on ${dateInMoment.format("M/D")}`
  }

  if (sale?.liveStartAt) {
    return `Live sale opens ${formattedDate}`
  } else {
    return `Closes ${formattedDate}`
  }
}
