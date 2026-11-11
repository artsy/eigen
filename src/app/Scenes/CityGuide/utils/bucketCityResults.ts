import { sortBy, uniq } from "lodash"
import { DateTime } from "luxon"
import type { Fair, Show } from "./types"

export interface BucketResults {
  saved: Show[]
  /** Only filled when saves mean itineraries — the legacy follow-based "saved" has no fairs. */
  savedFairs: Fair[]
  fairs: Fair[]
  galleries: Show[]
  museums: Show[]
  closing: Show[]
  opening: Show[]
}

export type BucketKey = keyof BucketResults

export interface SavedOptions {
  /**
   * With itineraries on, "saved" means what the City Guide's own + button saves — anything
   * on one of your itineraries — rather than shows you've followed.
   */
  savedMeansOnItineraries?: boolean
}

/**
 * Whether a show counts as saved. Shared by the Saved filter and the saved pin icon, so the two
 * always agree on which shows are saved.
 */
export const isSavedShow = (show: Show, { savedMeansOnItineraries = false }: SavedOptions = {}) =>
  savedMeansOnItineraries ? !!show.isOnMyItineraries : show.is_followed === true

export const bucketCityResults = (
  shows: readonly Show[],
  upcomingShows: readonly Show[],
  fairs: readonly Fair[],
  options: SavedOptions = {}
): BucketResults => {
  const { savedMeansOnItineraries = false } = options
  // The saved shows needs to be sorted by end_date_asc
  const now = DateTime.now()
  const oneWeekFromNow = DateTime.now().plus({ days: 7 })

  const savedShows = shows.filter((show) => isSavedShow(show, options))
  const savedUpcomingShows = upcomingShows.filter((show) => isSavedShow(show, options))
  const saved = sortBy(uniq(savedShows.concat(savedUpcomingShows)), (show) => show.end_at)
  const savedFairs = savedMeansOnItineraries ? fairs.filter((fair) => !!fair.isOnMyItineraries) : []

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
    savedFairs,
    fairs: [...fairs],
    galleries,
    museums,
    closing,
    opening: [...opening],
  }
}

export const emptyBucketResults: BucketResults = {
  saved: [],
  savedFairs: [],
  fairs: [],
  galleries: [],
  museums: [],
  closing: [],
  opening: [],
}
