import { GlobalMap_viewer } from "__generated__/GlobalMap_viewer.graphql"
import { filter } from "lodash"

export type BucketKey = "all" | "saved" | "fairs" | "galleries" | "museums"
export type BucketResults = { [key in BucketKey]: GlobalMap_viewer }

export const bucketCityResults = (viewer: GlobalMap_viewer): BucketResults => {
  // TODO: Saved isn't supported yet, so we'll return nothing.
  const saved = {
    ...viewer,
    city: {
      ...viewer.city,
      shows: { edges: [] },
      fairs: [],
    },
  }
  const fairs = {
    ...viewer,
    city: {
      ...viewer.city,
      shows: { edges: [] },
      // Leave fairs as-is
    },
  }
  const galleries = {
    ...viewer,
    city: {
      ...viewer.city,
      shows: { edges: filter(viewer.city.shows.edges, e => e.node.partner.type === "Gallery") },
      fairs: [],
    },
  }
  const museums = {
    ...viewer,
    city: {
      ...viewer.city,
      shows: { edges: filter(viewer.city.shows.edges, e => e.node.partner.type === "Institution") },
      fairs: [],
    },
  }

  return {
    all: viewer,
    saved,
    fairs,
    galleries,
    museums,
  }
}
