import { BucketResults } from "app/Scenes/CityGuide/utils/bucketCityResults"
import { MapTab } from "app/Scenes/CityGuide/utils/types"

export const tabHasResults = (tab: MapTab, bucketResults: BucketResults) =>
  tab.getShows(bucketResults).length > 0 || tab.getFairs(bucketResults).length > 0

export const cityTabs: MapTab[] = [
  {
    id: "all",
    text: "All",
    getShows: (bucket) =>
      bucket?.museums ? bucket.museums.concat(bucket.galleries) : bucket.galleries,
    getFairs: (bucket) => bucket.fairs,
  },
  {
    id: "saved",
    text: "Saved",
    getShows: (bucket) => bucket.saved,
    getFairs: (_) => [],
  },
  {
    id: "fairs",
    text: "Fairs",
    getShows: (_) => [],
    getFairs: (bucket) => bucket.fairs,
  },
  {
    id: "galleries",
    text: "Galleries",
    getShows: (bucket) => bucket.galleries,
    getFairs: (_) => [],
  },
  {
    id: "museums",
    text: "Museums",
    getShows: (bucket) => bucket.museums,
    getFairs: (_) => [],
  },
]
