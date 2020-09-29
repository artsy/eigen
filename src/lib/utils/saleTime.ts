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

  const absoluteSaleTime = absolute(now, startDateMoment, endDateMoment, userTimeZone, isLive)

  return {
    /**
     * Returns an object containing the headline and date of a sale
     * @example
     * {
     *  headline: "Bidding closes",
     *  label: "July 6th"
     * }
     */
    absolute: absoluteSaleTime,
    absoluteConcatenated: `${absoluteSaleTime.headline} ${absoluteSaleTime.date}`,
    /**
     * Returns an object containing the headline and date of a sale
     * @example
     * "Starts in 1 day"
     */
    relative: relative(now, startDateMoment, endDateMoment),
  }
}

const absolute = (now: any, startDateMoment: any, endDateMoment: any, userTimeZone: string, isLive: boolean) => {
  if (now.diff(endDateMoment) > 0) {
    return {
      headline: "Closed on",
      date: endDateMoment.format("MMM D"),
    }
  } else {
    const biddingLivePrefix = isLive ? "Live bidding" : "Bidding"
    const biddingStartPrefix = now.diff(startDateMoment) < 0 ? "begins" : "closes"

    if (now.diff(startDateMoment) < 0) {
      return {
        headline: `${biddingLivePrefix} ${biddingStartPrefix}`,
        date: `${startDateMoment.format("MMM D")} at ${startDateMoment.format("h:mma")} ${moment
          .tz(userTimeZone)
          .format("z")}`,
      }
    }
    return {
      headline: `${biddingLivePrefix} ${biddingStartPrefix}`,
      date: `${endDateMoment.format("MMM D")} at ${endDateMoment.format("h:mma")}`,
    }
  }
}

const relative = (now: any, startDateMoment: any, endDateMoment: any) => {
  const nowUtc = now.utc()
  const startUtc = startDateMoment.utc()
  const endUtc = endDateMoment && endDateMoment.utc()
  const pluraliseOrNot = (word: string, unit: number) => word + (unit === 1 ? "" : "s")
  if (nowUtc.diff(startDateMoment) < 0) {
    const hours = startUtc.diff(nowUtc, "hours")
    const days = startUtc.startOf("day").diff(nowUtc.startOf("day"), "days")
    if (days < 1) {
      return `Starts in ${hours} ${pluraliseOrNot("hour", hours)}`
    } else if (days < 7) {
      return `Starts in ${days} ${pluraliseOrNot("day", days)}`
    } else {
      return null
    }
  } else if (nowUtc.diff(startUtc) >= 0 && endUtc && now.diff(endUtc) < 0) {
    const hours = endUtc.diff(nowUtc, "hours")
    const days = endUtc.startOf("day").diff(nowUtc.startOf("day"), "days")
    if (days < 1) {
      return `Ends in ${hours} ${pluraliseOrNot("hour", hours)}`
    } else if (days < 7) {
      return `Ends in ${days} ${pluraliseOrNot("day", days)}`
    } else {
      return null
    }
  }
  return null
}
