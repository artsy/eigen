import { DateTime, Duration } from "luxon"
import { useEffect, useState } from "react"
import { getTimerInfo } from "./saleTime"

export interface Time {
  days: string
  hours: string
  minutes: string
  seconds: string
}

interface Timer {
  hasEnded: boolean
  time: Time
  hasStarted: boolean
}

const padWithZero = (num: number) => {
  return num.toString().padStart(2, "0")
}

const extractTime = (time: number) => {
  return padWithZero(Math.max(0, Math.floor(time)))
}

export const useTimer = (endDate: string, startAt: string = ""): Timer => {
  const currentTime = DateTime.local().toString()

  const timeBeforeEnd = Duration.fromISO(
    DateTime.fromISO(endDate).diff(DateTime.fromISO(currentTime)).toString()
  )
  const hasEnded = Math.floor(timeBeforeEnd.seconds) <= 0

  const timeBeforeStart = Duration.fromISO(
    DateTime.fromISO(startAt).diff(DateTime.fromISO(currentTime)).toString()
  )

  const hasStarted = Math.floor(timeBeforeStart.seconds) <= 0

  // If startAt is passed into this hook and it is in the future,
  // show the time before start. Otherwise show the time before end.
  const duration = hasStarted || startAt === "" ? timeBeforeEnd : timeBeforeStart

  const days = extractTime(duration.as("days"))
  const hours = extractTime(duration.as("hours") % 24)
  const minutes = extractTime(duration.as("minutes") % 60)
  const seconds = extractTime(duration.as("seconds") % 60)

  const time = {
    days,
    hours,
    minutes,
    seconds,
  }

  return { hasEnded, time, hasStarted }
}

export const useSaleEndTimer = (
  sale: {
    startAt: string | null
    endAt: string | null
    endedAt: string | null
    timeZone: string | null
  } | null
) => {
  const [relativeTime, seRelativeTime] = useState({ copy: "", color: "" })

  if (sale?.endedAt) {
    return null
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (sale?.endAt && sale?.startAt) {
        const { hasEnded, time, hasStarted } = useTimer(sale.endAt, sale.startAt)
        const relativeTimeInfo = getTimerInfo(time, hasStarted, hasEnded, true)

        seRelativeTime(relativeTimeInfo)
      } else {
        seRelativeTime({ copy: "", color: "" })
      }
    }, 500)
    return () => clearInterval(intervalId)
  }, [])
  return relativeTime
}
