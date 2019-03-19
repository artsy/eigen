import moment from "moment"

export const ExhibitionDates = (dateRange: string, endDate: string) => {
  const twoYearsFromToday = moment()
    .add(2, "years")
    .utc()
  const exhibitionEndDate = moment(endDate).utc()
  const shouldDisplayOngoing = moment(exhibitionEndDate).isSameOrAfter(twoYearsFromToday)

  if (shouldDisplayOngoing) {
    return "Ongoing"
  }
  return dateRange
}
