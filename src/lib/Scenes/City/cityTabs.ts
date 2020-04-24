import { MapTab } from "../Map/types"

export const cityTabs: MapTab[] = [
  {
    id: "all",
    text: "All",
    // @ts-ignore STRICTNESS_MIGRATION
    getShows: bucket => (bucket!.museums ? bucket.museums.concat(bucket.galleries) : bucket.galleries),
    // @ts-ignore STRICTNESS_MIGRATION
    getFairs: bucket => bucket.fairs,
  },
  {
    id: "saved",
    text: "Saved",
    // @ts-ignore STRICTNESS_MIGRATION
    getShows: bucket => bucket.saved,
    getFairs: _ => [],
  },
  {
    id: "fairs",
    text: "Fairs",
    getShows: _ => [],
    // @ts-ignore STRICTNESS_MIGRATION
    getFairs: bucket => bucket.fairs,
  },
  {
    id: "galleries",
    text: "Galleries",
    // @ts-ignore STRICTNESS_MIGRATION
    getShows: bucket => bucket.galleries,
    getFairs: _ => [],
  },
  {
    id: "museums",
    text: "Museums",
    // @ts-ignore STRICTNESS_MIGRATION
    getShows: bucket => bucket.museums,
    getFairs: _ => [],
  },
]
