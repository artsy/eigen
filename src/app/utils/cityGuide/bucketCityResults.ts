import { sortBy, uniq } from "lodash"
import { DateTime } from "luxon"
import type { Fair, Show } from "./types"

export interface BucketResults {
  saved: Show[]
  fairs: Fair[]
  galleries: Show[]
  museums: Show[]
  closing: Show[]
  opening: Show[]
}

export type BucketKey = keyof BucketResults

export const bucketCityResults = (
  shows: readonly Show[],
  upcomingShows: readonly Show[],
  fairs: readonly Fair[]
): BucketResults => {
  // The saved shows needs to be sorted by end_date_asc
  const now = DateTime.now()
  const oneWeekFromNow = DateTime.now().plus({ days: 7 })

  const savedShows = shows.filter((show) => show.is_followed === true)
  const savedUpcomingShows = upcomingShows.filter((show) => show.is_followed === true)
  const saved = sortBy(uniq(savedShows.concat(savedUpcomingShows)), (show) => show.end_at)

  const galleries = shows.filter((show) => show.partner?.type === "Gallery")
  const museums = shows.filter(
    (show) => show.partner?.type === "Institution" || show.partner?.type === "InstitutionalSeller"
  )

  // Opening shows need to be sorted by start_at_asc
  const opening = upcomingShows

  // Closing needs to be sorted by end_at_asc
  const closingFiltered = shows.filter((show) => {
    if (show.end_at) {
      const showClosingTime = DateTime.fromISO(show.end_at)
      return showClosingTime <= oneWeekFromNow && showClosingTime >= now
    }
    return false
  })
  const closing = sortBy(closingFiltered, (show) => DateTime.fromISO(show.end_at ?? "").toMillis())

  return {
    saved,
    fairs: [...fairs],
    galleries,
    museums,
    closing,
    opening: [...opening],
  }
}

export const emptyBucketResults: BucketResults = {
  saved: [],
  fairs: [],
  galleries: [],
  museums: [],
  closing: [],
  opening: [],
}
