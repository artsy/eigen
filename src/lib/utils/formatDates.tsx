import moment from "moment"

/**
 * Helper functions to format datetimes
 */

export const formatDateTime = (date: string) => {
  const now = moment().tz(moment.tz.guess(true))
  const dateInMoment = moment(date).tz(moment.tz.guess(true))
  if (now.year() !== dateInMoment.year()) {
    return `${dateInMoment.format("MMM D, YYYY")}, ${dateInMoment.format("h:mma")}`
  } else {
    return `${dateInMoment.format("MMM D")}, ${dateInMoment.format("h:mma")}`
  }
}

export const formatDate = (date: string) => {
  const now = moment().tz(moment.tz.guess(true))
  const dateInMoment = moment(date).tz(moment.tz.guess(true))
  if (now.year() !== dateInMoment.year()) {
    return `${dateInMoment.format("MMM D, YYYY")}`
  } else {
    return `${dateInMoment.format("MMM D")}`
  }
}
