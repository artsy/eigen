import { MapTab } from "../Map/types"

export const cityTabs: MapTab[] = [
  {
    id: "all",
    text: "All",
    getShows: bucket => bucket.museums.concat(bucket.galleries),
    getFairs: bucket => bucket.fairs,
  },
  {
    id: "saved",
    text: "Saved",
    getShows: bucket => bucket.saved,
    getFairs: _ => [],
  },
  {
    id: "fairs",
    text: "Fairs",
    getShows: _ => [],
    getFairs: bucket => bucket.fairs,
  },
  {
    id: "galleries",
    text: "Galleries",
    getShows: bucket => bucket.galleries,
    getFairs: _ => [],
  },
  {
    id: "museums",
    text: "Museums",
    getShows: bucket => bucket.museums,
    getFairs: _ => [],
  },
]
