import moment from "moment-timezone"

export const saleTime = (sale?: {
  liveStartAt?: string | null
  endAt?: string | null
  startAt?: string | null
  timeZone?: string | null
}) => {
  if (!sale || !sale.timeZone) {
    return
  }
  const startDate = (sale?.liveStartAt || sale?.startAt) as string
  const endDate = sale?.endAt as string
  const isLive = !!sale?.liveStartAt
  const userTimeZone = moment.tz.guess()
  const startDateMoment = startDate && moment.tz(startDate, moment.ISO_8601, sale.timeZone).tz(userTimeZone)
  const endDateMoment = endDate && moment.tz(endDate, moment.ISO_8601, sale.timeZone).tz(userTimeZone)
  const now = moment()

  return {
    absolute: absolute(now, startDateMoment, endDateMoment, userTimeZone, isLive),
    relative: relative(now, startDateMoment, endDateMoment, userTimeZone),
  }
}

const absolute = (now: any, startDateMoment: any, endDateMoment: any, userTimeZone: string, isLive: boolean) => {
  if (endDateMoment && now.diff(endDateMoment) > 0) {
    return `Closed on ${endDateMoment.format("MMM D")}`
  } else {
    return (
      `${isLive ? "Live bidding" : "Bidding"} ` +
      (now.diff(startDateMoment) < 0
        ? `begins ${startDateMoment.format("MMM D")} ` +
          `at ${startDateMoment.format("h:mma")} ` +
          moment.tz(userTimeZone).format("z")
        : `closes ${endDateMoment.format("MMM D")} ` + `at ${endDateMoment.format("h:mma")} `)
    )
  }
}

const relative = (now: any, startDateMoment: any, endDateMoment: any, userTimeZone: string) => {
  const nowUtc = now.utc()
  const startUtc = startDateMoment.utc()
  const endUtc = endDateMoment && endDateMoment.utc()
  if (nowUtc.diff(startDateMoment) < 0) {
    const hours = startUtc.diff(nowUtc, "hours")
    const days = startUtc.dayOfYear() - nowUtc.dayOfYear()
    if (days < 1) {
      return `Starts in ${hours} hours`
    } else if (days < 7) {
      return `Starts in ${days} days`
    } else {
      return null
    }
  } else if (nowUtc.diff(startUtc) >= 0 && endUtc && now.diff(endUtc) < 0) {
    console.log(userTimeZone)
    const hours = endUtc.diff(nowUtc, "hours")
    const days = endUtc.dayOfYear() - nowUtc.dayOfYear()
    if (days < 1) {
      return `Ends in ${hours} hours`
    } else if (days < 7) {
      return `Ends in ${days} days`
    } else {
      return null
    }
  }
  return null
}
