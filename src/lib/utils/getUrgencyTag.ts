import moment from "moment"

const getCurrentTime = () => (!__TEST__ ? new Date().toISOString() : "2020-08-20T02:50:09+00:00")

/**
 * Get sale ending urgency tag
 * @example
 * 2 days left, 12 hours left
 * Auction closed
 */

export const getUrgencyTag = (endAt: string | null | undefined): string | null => {
  const currentTime = getCurrentTime()
  if (!endAt || moment(endAt).isSameOrBefore(moment(currentTime))) {
    return null
  }

  const timeUntilSaleEnd = getTimeUntil({ endAt, currentTime })

  // We only want to show the urgency tag if a sale ends in less than 5 days
  if (timeUntilSaleEnd.timeUntilByByUnit > 5 && timeUntilSaleEnd.unit === TIME_UNITS.Days) {
    return null
  }

  return `${timeUntilSaleEnd.timeUntilByByUnit} ${timeUntilSaleEnd.unit} left`
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
 * { timeUntilByByUnit: 3, unit: days }
 */
export const getTimeUntil = ({
  currentTime,
  endAt,
  unit = TIME_UNITS.Days,
}: {
  currentTime: string
  endAt: string
  unit?: TIME_UNITS
}): { timeUntilByByUnit: number; unit: TIME_UNITS } => {
  const timeUntilByByUnit = moment(endAt).diff(moment(currentTime), unit)

  if (timeUntilByByUnit > 1 || unit === "minutes") {
    return { timeUntilByByUnit, unit }
  }

  return getTimeUntil({
    currentTime,
    endAt,
    unit: UNITS[UNITS.indexOf(unit) + 1],
  })
}
