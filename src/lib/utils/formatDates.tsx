import { DateTime } from "luxon"

/**
 * Helper functions to format datetimes
 */
export const formatDateTime = (date: string) => {
  const now = DateTime.local()
  const luxonDate = DateTime.fromISO(date)
  if (now.year !== luxonDate.year) {
    return `${luxonDate.toFormat("MMM d, y, h:mm")}${luxonDate.toFormat("a").toLowerCase()} ${luxonDate.toFormat(
      "ZZZZ"
    )}`
  } else {
    return `${luxonDate.toFormat("MMM d, h:mm")}${luxonDate.toFormat("a").toLowerCase()} ${luxonDate.toFormat("ZZZZ")}`
  }
}

// export const formatDateTime = date => {
//   const today = DateTime.local()
//   const dateTime = DateTime.fromISO(date)
//   const isThisYear = today.hasSame(dateTime, "year")
//   const amPm = dateTime.hour >= 12 ? "pm" : "am"
//   const minutes = dateTime.minute < 10 ? "0" + dateTime.minute : dateTime.minute
//   const timeZone = dateTime.offsetNameShort
//   let hour
//   if (dateTime.hour > 12) {
//     hour = dateTime.hour - 12
//   } else if (dateTime.hour === 0) {
//     hour = 12
//   } else {
//     hour = dateTime.hour
//   }
//   const time = `${hour}:${minutes}${amPm}`

//   console.log("dateTime", dateTime.zoneName)

//   if (isThisYear) {
//     return `${dateTime.monthShort} ${dateTime.day}, ${time} ${timeZone}`
//   } else {
//     return `${dateTime.monthShort} ${dateTime.day}, ${dateTime.year}, ${time} ${timeZone}`
//   }
// }

export const formatDate = (date: string) => {
  const now = DateTime.local()
  const luxonDate = DateTime.fromISO(date)
  if (now.year !== luxonDate.year) {
    return `${luxonDate.toFormat("MMM d, y")}`
  } else {
    return `${luxonDate.toFormat("MMM d")}`
  }
}
