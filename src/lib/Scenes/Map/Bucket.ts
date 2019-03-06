import { GlobalMap_viewer } from "__generated__/GlobalMap_viewer.graphql"
import { filter } from "lodash"
import moment from "moment"
import { MapTab } from "./types"

export type BucketKey = "saved" | "fairs" | "galleries" | "museums" | "closing" | "opening"
export type BucketResults = { [key in BucketKey]: any[] }

export const bucketCityResults = (viewer: GlobalMap_viewer): BucketResults => {
  const saved = filter(viewer.city.shows.edges, e => e.node.is_followed === true)
  const oneWeekFromNow = moment(new Date()).add(1, "week")
  const fairs = (viewer.city.fairs.edges as unknown) as MapTab[]
  const galleries = filter(viewer.city.shows.edges, e => e.node.partner.type === "Gallery")
  const museums = filter(
    viewer.city.shows.edges,
    e => e.node.partner.type === "Institution" || e.node.partner.type === "InstitutionSeller"
  )
  const opening = filter(viewer.city.shows.edges, e => {
    if (e.node.start_at) {
      const momentToUse = moment(e.node.start_at)
      return momentToUse <= oneWeekFromNow
    }
  })
  const closing = filter(viewer.city.shows.edges, e => {
    if (e.node.end_at) {
      const momentToUse = moment(e.node.end_at)
      return momentToUse <= oneWeekFromNow
    }
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
