import moment from "moment"

export const exhibitionDates = (dateRange: string, endDate: string) => {
  const oneYearFromToday = moment().add(2, "years").utc()
  const exhibitionEndDate = moment(endDate).utc()
  const shouldDisplayOngoing = moment(exhibitionEndDate).isSameOrAfter(oneYearFromToday)

  if (shouldDisplayOngoing) {
    return "Ongoing"
  }
  return abbreviateMonths(dateRange)
}

const abbreviateMonths = (dateRange: string) => {
  const monthMap: Record<string, string> = {
    January: "Jan.",
    February: "Feb.",
    March: "Mar.",
    April: "Apr.",
    May: "May",
    June: "Jun.",
    July: "Jul.",
    August: "Aug.",
    September: "Sept.",
    October: "Oct.",
    November: "Nov.",
    December: "Dec.",
  }
  const monthsLong = Object.keys(monthMap)
  monthsLong.forEach((longMonth) => {
    const shortMonth = monthMap[longMonth]
    dateRange = dateRange.replace(longMonth, shortMonth)
  })
  return dateRange
}
