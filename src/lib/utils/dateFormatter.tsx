import moment from "moment"

export const dateRange = (startAt, endAt) => {
  const momentStartAt = moment(startAt)
  const momentEndAt = moment(endAt)
  const now = moment(new Date())
  if (momentStartAt.dayOfYear() === momentEndAt.dayOfYear() && momentStartAt.year() === momentEndAt.year()) {
    // duration is a time range within a single day
    if (now.year() === momentStartAt.year()) {
      // duration is the same year as now
      return `${momentStartAt.format("MMM D")}`
    } else {
      return `${momentStartAt.format("MMM D YYYY")}`
    }
  } else if (momentStartAt.month() === momentEndAt.month() && momentStartAt.year() === momentEndAt.year()) {
    // duration is a time range within same month and year
    return `${momentStartAt.format("MMM D")} – ` + momentEndAt.format("D")
  } else {
    // duration spans more than one day
    if (now.year() === momentStartAt.year() && now.year() === momentEndAt.year()) {
      // if duration is within the same year as now
      return `${momentStartAt.format("MMM D")} – ` + momentEndAt.format("MMM D")
    } else if (momentStartAt.year() === momentEndAt.year()) {
      // if duration is not within the same year as now but start and end date are the same year
      return `${momentStartAt.format("MMM D")} – ` + momentEndAt.format("MMM D YYYY")
    } else {
      // if duration start and end dates are within different years
      return `${momentStartAt.format("MMM D YYYY")} – ` + momentEndAt.format("MMM D YYYY")
    }
  }
}

// YYYY
