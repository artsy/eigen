import { pluralize } from "app/utils/pluralize"

export const formattedTimeLeft = (time: {
  days: string
  hours: string
  minutes: string
  seconds: string
}) => {
  const parsedDays = parseInt(time.days, 10)
  const parsedHours = parseInt(time.hours, 10)
  const parsedMinutes = parseInt(time.minutes, 10)
  const parsedSeconds = parseInt(time.seconds, 10)

  let textColor = "blue100"
  let copy

  if (parsedDays >= 1 && parsedHours >= 1) {
    copy = `${parsedDays} ${pluralize("day", parsedDays)} ${parsedHours} ${pluralize(
      "hour",
      parsedHours
    )}`
  } else if (parsedDays >= 1) {
    copy = `${parsedDays} ${pluralize("day", parsedDays)}`
  } else if (parsedDays < 1 && parsedHours >= 1) {
    copy = `${parsedHours} ${pluralize("hour", parsedHours)}`
  } else if (parsedHours < 1 && parsedMinutes >= 1) {
    copy = `${parsedMinutes} ${pluralize("minute", parsedMinutes)}`
    textColor = "red100"
  } else if (parsedMinutes < 1) {
    copy = `${parsedSeconds} ${pluralize("second", parsedSeconds)}`
    textColor = "red100"
  }

  return { timerCopy: copy, textColor }
}
