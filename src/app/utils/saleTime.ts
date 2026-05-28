import { DateTime } from "luxon"
import { useState } from "react"
import useInterval from "react-use/lib/useInterval"
import { Time, getTimer } from "./getTimer"

interface TimerInfo {
  copy: string
  color: string
}

export interface SaleTimeFeature {
  startAt: string | null | undefined
  endAt: string | null | undefined
  endedAt: string | null | undefined
  timeZone: string | null | undefined
}

export const getTimerInfo = (
  time: Time,
  options: {
    hasStarted?: boolean
    lotsAreClosing?: boolean
    isSaleInfo?: boolean
    saleHasEnded?: boolean
    urgencyIntervalMinutes?: number | null
    isExtended?: boolean
  }
): TimerInfo => {
  const { days, hours, minutes, seconds } = time
  const { hasStarted, isSaleInfo, saleHasEnded, isExtended } = options

  const parsedDays = parseInt(days, 10)
  const parsedHours = parseInt(hours, 10)
  const parsedMinutes = parseInt(minutes, 10)
  const parsedSeconds = parseInt(seconds, 10)

  let copy = ""
  let color = "blue100"

  // Sale has not yet started
  if (!hasStarted) {
    if (parsedDays < 1) {
      if (parsedHours >= 1) {
        copy = `${parsedHours}h ${parsedMinutes}m Until Bidding Starts`
      } else {
        copy = `${parsedMinutes}m ${parsedSeconds}s Until Bidding Starts`
      }
    } else {
      copy = `${parsedDays} Day${parsedDays > 1 ? "s" : ""} Until Bidding Starts`
    }
  } else if (isExtended) {
    copy = `Extended: ${parsedMinutes}m ${parsedSeconds}s`
    color = "red100"
  } else {
    // When the time is on the sale:
    if (isSaleInfo) {
      if (saleHasEnded) {
        copy = "Lots are closing"
        color = "red100"
        // More than 24 hours until close
      } else if (parsedDays >= 1) {
        copy = `${parsedDays} Day${parsedDays > 1 ? "s" : ""} Until Lots Start Closing`
      }
      // 1-24 hours until close
      else if (parsedDays < 1 && parsedHours >= 1) {
        copy = `${parsedHours}h ${parsedMinutes}m Until Lots Start Closing`
        color = "red100"
      }

      // <60 mins until close
      else if (parsedDays < 1 && parsedHours < 1) {
        copy = `${parsedMinutes}m ${parsedSeconds}s Until Lots Start Closing`
        color = "red100"
      }

      // When the timer is on the lot:
    } else {
      // More than 24 hours until close
      if (parsedDays >= 1) {
        copy = `${parsedDays}d ${parsedHours}h`
      }

      // 1-24 hours until close
      else if (parsedDays < 1 && parsedHours >= 1) {
        copy = `${parsedHours}h ${parsedMinutes}m`
      }

      // <60 mins until close
      else if (parsedDays < 1 && parsedHours < 1) {
        copy = `${parsedMinutes}m ${parsedSeconds}s`
        color = "red100"
      }
    }
  }

  return { copy, color }
}

export const saleTime = (sale: {
  startAt: string | null | undefined
  liveStartAt: string | null | undefined
  endAt: string | null | undefined
  timeZone: string | null | undefined
}): { absolute: string | null; relative: string | null } => {
  if (!sale.timeZone) {
    return { absolute: null, relative: null }
  }
  const startDate = sale.liveStartAt || sale.startAt
  const endDate = sale.endAt

  const saleType = sale.liveStartAt != null ? "live" : "timed"
  const userTimeZone = DateTime.now().zoneName
  const startDateLuxon = startDate
    ? DateTime.fromISO(startDate, { zone: sale.timeZone }).setZone(userTimeZone)
    : null
  const endDateLuxon = endDate
    ? DateTime.fromISO(endDate, { zone: sale.timeZone }).setZone(userTimeZone)
    : null
  const now = DateTime.now()

  return {
    absolute: absolute(now, startDateLuxon, endDateLuxon, saleType),
    relative: relative(now.toUTC(), startDateLuxon?.toUTC() ?? null, endDateLuxon?.toUTC() ?? null),
  }
}

// Produce "3:00pm" style — luxon's `a` token is uppercase in some locales
const formatMeridiem = (dt: DateTime): string => dt.toFormat("h:mm") + (dt.hour >= 12 ? "pm" : "am")

const absolute = (
  now: DateTime,
  startDateLuxon: DateTime | null,
  endDateLuxon: DateTime | null,
  saleType: "live" | "timed"
): string | null => {
  // definitely not open yet
  if (startDateLuxon !== null && now < startDateLuxon) {
    return begins(startDateLuxon, saleType)
  }

  // definitely already closed
  if (endDateLuxon !== null && now > endDateLuxon) {
    return closed(endDateLuxon)
  }

  // if we have both start and end and we're in between them
  if (
    startDateLuxon !== null &&
    now > startDateLuxon &&
    endDateLuxon !== null &&
    now < endDateLuxon
  ) {
    return closes(endDateLuxon, saleType)
  }

  // otherwise don't display anything
  return null
}

const begins = (startDate: DateTime, saleType: "live" | "timed"): string =>
  `${saleType === "live" ? "Live bidding" : "Bidding"} ` +
  `begins ${startDate.toFormat("MMM d")} ` +
  `at ${formatMeridiem(startDate)} ` +
  startDate.toFormat("ZZZZ")

const closes = (endDate: DateTime, saleType: "live" | "timed"): string =>
  `${saleType === "live" ? "Live bidding" : "Bidding"} ` +
  `closes ${endDate.toFormat("MMM d")} ` +
  `at ${formatMeridiem(endDate)} ` +
  endDate.toFormat("ZZZZ")

const closed = (endDate: DateTime): string => `Closed on ${endDate.toFormat("MMM d")}`

// UTC FROM HERE AND DOWN
const relative = (
  now: DateTime,
  startDateLuxon: DateTime | null,
  endDateLuxon: DateTime | null
): string | null => {
  // definitely not open yet
  if (startDateLuxon !== null && now < startDateLuxon) {
    return starts(now, startDateLuxon)
  }

  // we are currently open
  if (
    startDateLuxon !== null &&
    now > startDateLuxon &&
    endDateLuxon !== null &&
    now < endDateLuxon
  ) {
    return ends(now, endDateLuxon)
  }

  // otherwise don't display anything
  return null
}

const maybePluralise = (word: string, unit: number) => word + (unit === 1 ? "" : "s")
const maybeAddMinutes = (minutesUntilSale: number) =>
  minutesUntilSale % 60 === 0
    ? ""
    : ` ${minutesUntilSale % 60} ${maybePluralise("minute", minutesUntilSale)}`

const starts = (now: DateTime, startDate: DateTime): string | null => {
  const hours = Math.floor(startDate.diff(now, "hours").hours)
  const minutes = Math.floor(startDate.diff(now, "minutes").minutes)
  const days = Math.floor(startDate.startOf("day").diff(now.startOf("day"), "days").days)
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

const ends = (now: DateTime, endDate: DateTime): string | null => {
  const hours = Math.floor(endDate.diff(now, "hours").hours)
  const days = Math.floor(endDate.startOf("day").diff(now.startOf("day"), "days").days)
  if (days < 1) {
    return `Ends in ${hours} ${maybePluralise("hour", hours)}`
  } else if (days < 7) {
    return `Ends in ${days} ${maybePluralise("day", days)}`
  } else {
    return null
  }
}

const getDateTimeFor = (date: string, timeZone: string): DateTime => {
  const userTimeZone = DateTime.now().zoneName
  return DateTime.fromISO(date, { zone: timeZone }).setZone(userTimeZone)
}

export const getAbsoluteTimeOfSale = (sale: SaleTimeFeature): string | null | undefined => {
  if (!sale.timeZone) {
    return null
  }
  const startDateLuxon = sale.startAt ? getDateTimeFor(sale.startAt, sale.timeZone) : null
  const endDateLuxon = sale.endAt ? getDateTimeFor(sale.endAt, sale.timeZone) : null
  const endedDateLuxon = sale.endedAt ? getDateTimeFor(sale.endedAt, sale.timeZone) : null
  const thisMoment = DateTime.now()

  if (startDateLuxon && thisMoment < startDateLuxon) {
    return `${startDateLuxon.toFormat("MMM d, yyyy")} • ${formatMeridiem(
      startDateLuxon
    )} ${startDateLuxon.toFormat("ZZZZ")}`
  } else if (endedDateLuxon && thisMoment > endedDateLuxon) {
    return `Closed ${endedDateLuxon.toFormat("MMM d, yyyy")} • ${formatMeridiem(
      endedDateLuxon
    )} ${endedDateLuxon.toFormat("ZZZZ")}`
  } else if (endDateLuxon) {
    return `${endDateLuxon.toFormat("MMM d, yyyy")} • ${formatMeridiem(
      endDateLuxon
    )} ${endDateLuxon.toFormat("ZZZZ")}`
  } else {
    return null
  }
}

export const useRelativeTimeOfSale = (
  sale: SaleTimeFeature,
  /** in millisecs */
  updateDelay = 1000
) => {
  const [relativeTime, setRelativeTime] = useState<TimerInfo | null>(null)

  const saleHasEnded = !!sale.endedAt

  const callback = () => {
    if (saleHasEnded || !(sale.endAt && sale.startAt)) {
      return null
    }

    if (!sale.endAt || !sale.startAt) {
      return
    }

    const { hasEnded, time, hasStarted } = getTimer(sale.endAt, sale.startAt)
    const relativeTimeInfo = getTimerInfo(time, {
      hasStarted,
      saleHasEnded: hasEnded,
      isSaleInfo: true,
    })

    if (relativeTimeInfo?.copy !== relativeTime?.copy) {
      // prevent unnecessary updates
      setRelativeTime(relativeTimeInfo)
    }
  }

  useInterval(callback, updateDelay)

  return relativeTime
}
