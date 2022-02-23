import moment from "moment-timezone"

export const saleTime = (sale: {
  startAt: string | null
  liveStartAt: string | null
  endAt: string | null
  timeZone: string | null
}): { absolute: string | null; relative: string | null } => {
  if (!sale.timeZone) {
    return { absolute: null, relative: null }
  }
  const startDate = sale.liveStartAt || sale.startAt
  const endDate = sale.endAt

  const saleType = sale.liveStartAt != null ? "live" : "timed"
  const userTimeZone = moment.tz.guess()
  const startDateMoment =
    startDate !== null
      ? moment.tz(startDate, moment.ISO_8601, sale.timeZone).tz(userTimeZone)
      : null
  const endDateMoment =
    endDate !== null ? moment.tz(endDate, moment.ISO_8601, sale.timeZone).tz(userTimeZone) : null
  const now = moment()

  return {
    absolute: absolute(now, startDateMoment, endDateMoment, userTimeZone, saleType),
    relative: relative(now.utc(), startDateMoment?.utc() ?? null, endDateMoment?.utc() ?? null),
  }
}

const absolute = (
  now: moment.Moment,
  startDateMoment: moment.Moment | null,
  endDateMoment: moment.Moment | null,
  userTimeZone: string,
  saleType: "live" | "timed"
): string | null => {
  // definitely not open yet
  if (startDateMoment !== null && now.isBefore(startDateMoment)) {
    return begins(startDateMoment, userTimeZone, saleType)
  }

  // definitely already closed
  if (endDateMoment !== null && now.isAfter(endDateMoment)) {
    return closed(endDateMoment)
  }

  // if we have both start and end and we're in between them
  if (
    startDateMoment !== null &&
    now.isAfter(startDateMoment) &&
    endDateMoment !== null &&
    now.isBefore(endDateMoment)
  ) {
    return closes(endDateMoment, userTimeZone, saleType)
  }

  // otherwise don't display anything
  return null
}

const begins = (
  startDate: moment.Moment,
  userTimeZone: string,
  saleType: "live" | "timed"
): string =>
  `${saleType === "live" ? "Live bidding" : "Bidding"} ` +
  `begins ${startDate.format("MMM D")} ` +
  `at ${startDate.format("h:mma")} ` +
  moment.tz(userTimeZone).format("z")

const closes = (endDate: moment.Moment, userTimeZone: string, saleType: "live" | "timed"): string =>
  `${saleType === "live" ? "Live bidding" : "Bidding"} ` +
  `closes ${endDate.format("MMM D")} ` +
  `at ${endDate.format("h:mma")} ` +
  moment.tz(userTimeZone).format("z")

const closed = (endDate: moment.Moment): string => `Closed on ${endDate.format("MMM D")}`

// UTC FROM HERE AND DOWN
const relative = (
  now: moment.Moment,
  startDateMoment: moment.Moment | null,
  endDateMoment: moment.Moment | null
): string | null => {
  // definitely not open yet
  if (startDateMoment !== null && now.isBefore(startDateMoment)) {
    return starts(now, startDateMoment)
  }

  // we are currently open
  if (
    startDateMoment !== null &&
    now.isAfter(startDateMoment) &&
    endDateMoment !== null &&
    now.isBefore(endDateMoment)
  ) {
    return ends(now, endDateMoment)
  }

  // otherwise don't display anything
  return null
}

const maybePluralise = (word: string, unit: number) => word + (unit === 1 ? "" : "s")
const maybeAddMinutes = (minutesUntilSale: number) =>
  minutesUntilSale % 60 === 0
    ? ""
    : ` ${minutesUntilSale % 60} ${maybePluralise("minute", minutesUntilSale)}`

const starts = (now: moment.Moment, startDate: moment.Moment): string | null => {
  const hours = startDate.diff(now, "hours")
  const minutes = startDate.diff(now, "minutes")
  const days = startDate.startOf("day").diff(now.startOf("day"), "days")
  if (minutes < 60) {
    return `Starts in ${minutes} ${maybePluralise("minute", minutes)}`
  } else if (hours < 24) {
    return `Starts in ${hours} ${maybePluralise("hour", hours)}` + maybeAddMinutes(minutes)
  } else if (days < 7) {
    return `Starts in ${days} ${maybePluralise("day", days)}`
  } else {
    return null
  }
}

const ends = (now: moment.Moment, endDate: moment.Moment): string | null => {
  const hours = endDate.diff(now, "hours")
  const days = endDate.startOf("day").diff(now.startOf("day"), "days")
  if (days < 1) {
    return `Ends in ${hours} ${maybePluralise("hour", hours)}`
  } else if (days < 7) {
    return `Ends in ${days} ${maybePluralise("day", days)}`
  } else {
    return null
  }
}
