import moment from "moment-timezone"

export const saleTime = (sale?: { liveStartAt?: string | null; endAt?: string | null }) => {
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
    return `Live bidding begins ${formattedDate}`
  } else {
    return `Closes ${formattedDate}`
  }
}
