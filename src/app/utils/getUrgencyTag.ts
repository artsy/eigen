import moment from "moment"

const getCurrentTime = () => (!__TEST__ ? new Date().toISOString() : "2020-08-20T02:50:09+00:00")

/**
 * Get sale ending urgency tag
 * @example
 * 1 minute left, 2 days left, 12 hours left
 * Auction closed
 */

export const getUrgencyTag = (endAt: string | null | undefined): string | null => {
  const currentTime = getCurrentTime()
  if (!endAt || moment(endAt).isSameOrBefore(moment(currentTime))) {
    return null
  }

  const timeUntilSaleEnd = getTimeUntil({ endAt, currentTime })

  // We only want to show the urgency tag if a sale ends in less than 5 days
  if (timeUntilSaleEnd.duration > 5 && timeUntilSaleEnd.unit === TIME_UNITS.Days) {
    return null
  }

  const unit =
    timeUntilSaleEnd.duration === 1 ? timeUntilSaleEnd.unit.slice(0, -1) : timeUntilSaleEnd.unit

  return `${timeUntilSaleEnd.duration} ${unit} left`
}

export enum TIME_UNITS {
  Days = "days",
  Hours = "hours",
  Minutes = "minutes",
}

export const UNITS = [TIME_UNITS.Days, TIME_UNITS.Hours, TIME_UNITS.Minutes]

/**
 * Get time until a given date
 * @example
 * { duration: 3, unit: days }
 */
export const getTimeUntil = ({
  currentTime,
  endAt,
  unit = TIME_UNITS.Days,
}: {
  currentTime: string
  endAt: string
  unit?: TIME_UNITS
}): { duration: number; unit: TIME_UNITS } => {
  const duration = moment(endAt).diff(moment(currentTime), unit)

  if (duration >= 1 || unit === "minutes") {
    return { duration, unit }
  }

  return getTimeUntil({
    currentTime,
    endAt,
    unit: UNITS[UNITS.indexOf(unit) + 1],
  })
}
