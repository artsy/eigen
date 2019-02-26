import { GlobalMap_viewer } from "__generated__/GlobalMap_viewer.graphql"
import { filter } from "lodash"
import moment from "moment"
import { Tab } from "./types"

export type BucketKey = "saved" | "fairs" | "galleries" | "museums" | "closing" | "opening"
export type BucketResults = { [key in BucketKey]: any[] }

export const bucketCityResults = (viewer: GlobalMap_viewer): BucketResults => {
  // TODO: Saved isn't supported yet, so we'll return nothing.
  const saved = []

  const fairs = (viewer.city.fairs as unknown) as Tab[]
  const galleries = filter(viewer.city.shows.edges, e => e.node.partner.type === "Gallery")
  const museums = filter(viewer.city.shows.edges, e => e.node.partner.type === "Institution")
  const opening = filter(viewer.city.shows.edges, e => {
    if (e.node.start_at) {
      const momentToUse = moment(e.node.start_at)
      const oneWeekFromNow = moment(new Date()).add(1, "week")
      return momentToUse <= oneWeekFromNow
    }
  })
  const closing = filter(viewer.city.shows.edges, e => {
    if (e.node.end_at) {
      const momentToUse = moment(e.node.end_at)
      const oneWeekFromNow = moment(new Date()).add(1, "week")
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
