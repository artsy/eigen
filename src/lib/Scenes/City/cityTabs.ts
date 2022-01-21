import { MapTab } from "../Map/types"

export const cityTabs: MapTab[] = [
  {
    id: "all",
    text: "All",
    getShows: (bucket) =>
      // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
      bucket!.museums ? bucket.museums.concat(bucket.galleries) : bucket.galleries,
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    getFairs: (bucket) => bucket.fairs,
  },
  {
    id: "saved",
    text: "Saved",
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    getShows: (bucket) => bucket.saved,
    getFairs: (_) => [],
  },
  {
    id: "fairs",
    text: "Fairs",
    getShows: (_) => [],
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    getFairs: (bucket) => bucket.fairs,
  },
  {
    id: "galleries",
    text: "Galleries",
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    getShows: (bucket) => bucket.galleries,
    getFairs: (_) => [],
  },
  {
    id: "museums",
    text: "Museums",
    // @ts-expect-error STRICTNESS_MIGRATION --- 🚨 Unsafe legacy code 🚨 Please delete this and fix any type errors if you have time 🙏
    getShows: (bucket) => bucket.museums,
    getFairs: (_) => [],
  },
]
