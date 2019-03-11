import { GlobalMap_viewer } from "__generated__/GlobalMap_viewer.graphql"
import moment from "moment"

export const bucketCityResults = (viewer: GlobalMap_viewer) => {
  const saved = viewer.city.shows.edges.filter(e => e.node.is_followed === true).map(n => n.node)
  const thirtyDaysFromNow = moment(new Date()).add(30, "days")
  const fairs = viewer.city.fairs.edges.map(n => n.node)
  const galleries = viewer.city.shows.edges.filter(e => e.node.partner.type === "Gallery").map(n => n.node)
  const museums = viewer.city.shows.edges
    .filter(e => e.node.partner.type === "Institution" || e.node.partner.type === "InstitutionSeller")
    .map(n => n.node)

  // FIXME: This needs to be sorted by start_at_asc
  const opening = viewer.city.shows.edges
    .filter(e => {
      if (e.node.start_at) {
        const momentToUse = moment(e.node.start_at)
        return momentToUse <= thirtyDaysFromNow
      }
    })
    .map(n => n.node)

  // FIXME: This needs to be sorted by end_at_asc
  const closing = viewer.city.shows.edges
    .filter(e => {
      if (e.node.end_at) {
        const momentToUse = moment(e.node.end_at)
        return momentToUse <= thirtyDaysFromNow
      }
    })
    .map(n => n.node)

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
