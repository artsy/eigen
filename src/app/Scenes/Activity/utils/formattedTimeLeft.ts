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
    copy = `${parsedDays}d ${parsedHours}h`
  } else if (parsedDays >= 1) {
    copy = `${parsedDays}d`
  } else if (parsedDays < 1 && parsedHours >= 1 && parsedMinutes >= 1) {
    copy = `${parsedHours}h ${parsedMinutes}m`
  } else if (parsedDays < 1 && parsedHours >= 1) {
    copy = `${parsedHours}h`
  } else if (parsedHours < 1 && parsedMinutes >= 1 && parsedSeconds >= 1) {
    copy = `${parsedMinutes}m ${parsedSeconds}s`
    textColor = "orange100"
  } else if (parsedHours < 1 && parsedMinutes >= 1) {
    copy = `${parsedMinutes}m`
    textColor = "orange100"
  } else if (parsedMinutes < 1) {
    copy = `${parsedSeconds}s`
    textColor = "orange100"
  }

  return { timerCopy: copy, textColor }
}
