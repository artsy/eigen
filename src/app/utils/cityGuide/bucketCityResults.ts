import { GlobalMap_viewer$data } from "__generated__/GlobalMap_viewer.graphql"
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

export const bucketCityResults = (viewer: GlobalMap_viewer$data): BucketResults => {
  // The saved shows needs to be sorted by end_date_asc
  const now = DateTime.now()
  const oneWeekFromNow = DateTime.now().plus({ days: 7 })
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  const savedShows = viewer.city.shows.edges.filter((e) => e.node.is_followed === true)
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  const savedUpcomingShows = viewer.city.upcomingShows.edges.filter(
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    (e) => e.node.is_followed === true
  )
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  const savedFiltered = uniq(savedShows.concat(savedUpcomingShows)).map((n) => n.node)
  const saved = sortBy(savedFiltered, (event) => {
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    return event.end_at
  })
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  const fairs = viewer.city.fairs.edges.map((n) => n.node)
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  const galleries = viewer.city.shows.edges
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    .filter((e) => e.node.partner.type === "Gallery")
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    .map((n) => n.node)
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  const museums = viewer.city.shows.edges
    .filter(
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      (e) => e.node.partner.type === "Institution" || e.node.partner.type === "InstitutionalSeller"
    )
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    .map((n) => n.node)

  // Opening shows need to be sorted by start_at_asc
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  const opening = viewer.city.upcomingShows.edges.map((n) => n.node)
  // Closing needs to be sorted by end_at_asc
  // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
  const closingFiltered = viewer.city.shows.edges
    .filter((e) => {
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      if (e.node.end_at) {
        // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
        const showClosingTime = DateTime.fromISO(e.node.end_at)
        return showClosingTime <= oneWeekFromNow && showClosingTime >= now
      }
    })
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    .map((n) => n.node)
  const closing = sortBy(closingFiltered, (event) => {
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    return DateTime.fromISO(event.end_at).toMillis()
  })

  // Note: the individual `@ts-expect-error`s above are pre-existing legacy debt around
  // `viewer.city` nullability; we assert the overall shape here so consumers get a reliable
  // `BucketResults` contract instead of the `any` this function previously returned.
  return {
    saved,
    fairs,
    galleries,
    museums,
    closing,
    opening,
  } as BucketResults
}

export const emptyBucketResults: BucketResults = {
  saved: [],
  fairs: [],
  galleries: [],
  museums: [],
  closing: [],
  opening: [],
}
