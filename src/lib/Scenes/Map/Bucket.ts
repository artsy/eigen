import { GlobalMap_viewer } from "__generated__/GlobalMap_viewer.graphql"
import { filter } from "lodash"
import { Tab } from "./types"

export type BucketKey = "saved" | "fairs" | "galleries" | "museums"
export type BucketResults = { [key in BucketKey]: any[] }

export const bucketCityResults = (viewer: GlobalMap_viewer): BucketResults => {
  // TODO: Saved isn't supported yet, so we'll return nothing.
  const saved = []

  const fairs = (viewer.city.fairs as unknown) as Tab[]
  const galleries = filter(viewer.city.shows.edges, e => e.node.partner.type === "Gallery")
  const museums = filter(viewer.city.shows.edges, e => e.node.partner.type === "Institution")

  return {
    saved,
    fairs,
    galleries,
    museums,
  }
}
