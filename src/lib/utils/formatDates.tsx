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

export const timeUntil = (startAt: string, liveStartAt: string, endAt: string) => {
  const thisMoment = moment()
  const startMoment = moment(startAt)
  const liveStartMoment = moment(liveStartAt)
  const endMoment = moment(endAt)

  if (thisMoment.isBefore(startMoment)) {
    return `Starts ${formatDateTime(startAt)}`
  } else if (liveStartAt && thisMoment.isBefore(liveStartMoment)) {
    return `Live ${formatDateTime(liveStartAt)}`
  } else if (liveStartAt && thisMoment.isAfter(liveStartMoment) && thisMoment.isBefore(endMoment)) {
    return `In progress`
  } else if (thisMoment.isBefore(endMoment)) {
    return `Ends ${formatDateTime(endAt)}`
  } else if (endAt === null) {
    return null
  } else {
    return `Ended ${formatDate(endAt)}`
  }
}
