import { GlobalMap_viewer } from "__generated__/GlobalMap_viewer.graphql"
import { sortBy, uniq } from "lodash"
import moment from "moment"

export const bucketCityResults = (viewer: GlobalMap_viewer) => {
  // The saved shows needs to be sorted by end_date_asc
  const now = moment()
  const oneWeekFromNow = moment(new Date()).add(7, "days")
  // @ts-ignore STRICTNESS_MIGRATION
  const savedShows = viewer.city.shows.edges.filter(e => e.node.is_followed === true)
  // @ts-ignore STRICTNESS_MIGRATION
  const savedUpcomingShows = viewer.city.upcomingShows.edges.filter(e => e.node.is_followed === true)
  // @ts-ignore STRICTNESS_MIGRATION
  const savedFiltered = uniq(savedShows.concat(savedUpcomingShows)).map(n => n.node)
  const saved = sortBy(savedFiltered, event => {
    // @ts-ignore STRICTNESS_MIGRATION
    return event.end_at
  })
  // @ts-ignore STRICTNESS_MIGRATION
  const fairs = viewer.city.fairs.edges.map(n => n.node)
  // @ts-ignore STRICTNESS_MIGRATION
  const galleries = viewer.city.shows.edges.filter(e => e.node.partner.type === "Gallery").map(n => n.node)
  // @ts-ignore STRICTNESS_MIGRATION
  const museums = viewer.city.shows.edges
    // @ts-ignore STRICTNESS_MIGRATION
    .filter(e => e.node.partner.type === "Institution" || e.node.partner.type === "InstitutionalSeller")
    // @ts-ignore STRICTNESS_MIGRATION
    .map(n => n.node)

  // Opening shows need to be sorted by start_at_asc
  // @ts-ignore STRICTNESS_MIGRATION
  const opening = viewer.city.upcomingShows.edges.map(n => n.node)
  // Closing needs to be sorted by end_at_asc
  // @ts-ignore STRICTNESS_MIGRATION
  const closingFiltered = viewer.city.shows.edges
    .filter(e => {
      // @ts-ignore STRICTNESS_MIGRATION
      if (e.node.end_at) {
        // @ts-ignore STRICTNESS_MIGRATION
        const showClosingTime = moment(e.node.end_at)
        return showClosingTime <= oneWeekFromNow && showClosingTime >= now
      }
    })
    // @ts-ignore STRICTNESS_MIGRATION
    .map(n => n.node)
  const closing = sortBy(closingFiltered, event => {
    // @ts-ignore STRICTNESS_MIGRATION
    return moment(event.end_at)
  })

  return {
    saved,
    fairs,
    galleries,
    museums,
    closing,
    opening,
  }
}

export type BucketKey = keyof ReturnType<typeof bucketCityResults>
export type BucketResults = ReturnType<typeof bucketCityResults>

export const emptyBucketResults: BucketResults = {
  saved: [],
  fairs: [],
  galleries: [],
  museums: [],
  closing: [],
  opening: [],
}
