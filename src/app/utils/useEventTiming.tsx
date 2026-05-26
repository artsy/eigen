import { DateTime, Duration } from "luxon"
import { useMemo } from "react"

const NBSP = " "
const SEPARATOR = `${NBSP}:${NBSP}`

const padWithZero = (n: number) => {
  return n.toString().padStart(2, "0")
}

interface UseEventTiming {
  startAt?: string
  endAt?: string
  currentTime?: string
}

export const useEventTiming = ({
  currentTime = DateTime.local().toString(),
  startAt = DateTime.local().toString(),
  endAt = DateTime.local().toString(),
}: UseEventTiming) => {
  const durationTilEnd = Duration.fromISO(
    DateTime.fromISO(endAt).diff(DateTime.fromISO(currentTime)).toString()
  )
  const daysTilEnd = durationTilEnd.as("days")
  const hoursTillEnd = durationTilEnd.as("hours")
  const secondsTilEnd = durationTilEnd.as("seconds")

  const hasStarted =
    Duration.fromISO(DateTime.fromISO(startAt).diff(DateTime.fromISO(currentTime)).toString())
      .seconds < 0

  const hasEnded = Math.floor(secondsTilEnd) <= 0
  const closesSoon = daysTilEnd <= 3 && daysTilEnd >= 1
  const closesToday = daysTilEnd < 1 && !hasEnded

  const hours = padWithZero(Math.max(0, Math.floor(durationTilEnd.as("hours") % 24)))
  const minutes = padWithZero(Math.max(0, Math.floor(durationTilEnd.as("minutes") % 60)))
  const seconds = padWithZero(Math.max(0, Math.floor(secondsTilEnd % 60)))

  const formattedTime = useMemo(() => {
    if (hasEnded) {
      return "Closed"
    }

    if (!hasStarted) {
      return "Opening Soon"
    }

    if (closesSoon) {
      return `Closes in ${Math.ceil(daysTilEnd)} day${Math.ceil(daysTilEnd) === 1 ? "" : "s"}`
    }

    if (closesToday) {
      return `Closes in ${[hours, minutes, seconds].join(SEPARATOR)}`
    }

    return null
  }, [closesSoon, closesToday, daysTilEnd, hasEnded, hasStarted, hours, minutes, seconds])

  return {
    formattedTime,
    durationTilEnd: durationTilEnd.toString(),
    daysTilEnd,
    hoursTillEnd,
    secondsTilEnd,
    hasStarted,
    hasEnded,
    closesSoon,
    closesToday,
    hours,
    minutes,
    seconds,
  }
}
