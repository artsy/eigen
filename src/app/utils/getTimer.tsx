import { DateTime, Duration } from "luxon"

export interface Time {
  days: string
  hours: string
  minutes: string
  seconds: string
}

export interface Timer {
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

export const getTimer = (endDate: string, startAt = ""): Timer => {
  const currentTime = DateTime.now().toISO()

  const timeBeforeEnd = Duration.fromISO(
    DateTime.fromISO(endDate).diff(DateTime.fromISO(currentTime)).toISO()
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
