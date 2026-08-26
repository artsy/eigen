import { CityGuideFair_fair$data } from "__generated__/CityGuideFair_fair.graphql"
import { CityGuideShow_show$data } from "__generated__/CityGuideShow_show.graphql"
import type { BucketKey, BucketResults } from "./bucketCityResults"

/**
 * Types and helpers shared by the `Map` and `City` scenes (the "city guide" feature).
 * Kept here (rather than in either scene) per our convention of extracting cross-scene
 * code to `app/utils` instead of importing scene-to-scene.
 *
 * `Show`/`Fair` are derived from the `CityGuideShow_show`/`CityGuideFair_fair` fragments
 * (see `./CityGuideShow` and `./CityGuideFair`) instead of being hand-derived from any one
 * consumer's query shape.
 */

export interface Coordinates {
  lat: number
  lng: number
}

export interface City {
  name: string
  epicenter: Coordinates
}

export type Show = CityGuideShow_show$data[0]
/** `type` is a client-only marker stamped on map-clustered fairs (see `extractShowAndFairMaps`), not a schema field. */
export type Fair = CityGuideFair_fair$data[0] & { type?: string }

export interface MapTab {
  /** UUID for the tab */
  id: BucketKey | "all"
  /** Display string */
  text: string
  /** A func to grab the right shows for this tab on the map */
  getShows: (buckets: BucketResults) => Show[]
  /** A func to grab the right ffairs for this tab on the map */
  getFairs: (buckets: BucketResults) => Fair[]
}

/** Interface for the current state of Relay queries/errors. */
export interface RelayErrorState {
  isRetrying: boolean
  retry: () => void
  error: Error
}

export interface FilterData {
  filter: string
  featureCollection: GeoJSON.FeatureCollection
}

/** Position of the City Guide bottom sheet drawer, shared between `CityGuideMap` and `CityGuideBottomSheet`. */
export enum DrawerPosition {
  open = "open",
  closed = "closed",
  collapsed = "collapsed",
  partiallyRevealed = "partiallyRevealed",
}
