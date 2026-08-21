import { GlobalMap_viewer$data } from "__generated__/GlobalMap_viewer.graphql"
import Supercluster from "supercluster"
import type { BucketKey, BucketResults } from "./bucketCityResults"

/**
 * Types and helpers shared by the `Map` and `City` scenes (the "city guide" feature).
 * Kept here (rather than in either scene) per our convention of extracting cross-scene
 * code to `app/utils` instead of importing scene-to-scene.
 */

export interface Coordinates {
  lat: number
  lng: number
}

export interface City {
  name: string
  epicenter: Coordinates
}

export type Show = NonNullable<
  NonNullable<
    NonNullable<NonNullable<NonNullable<GlobalMap_viewer$data["city"]>["shows"]>["edges"]>[0]
  >["node"]
>
export type Fair = NonNullable<
  NonNullable<
    NonNullable<NonNullable<NonNullable<GlobalMap_viewer$data["city"]>["fairs"]>["edges"]>[0]
  >["node"]
> & { type?: string }

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
  clusterEngine: Supercluster
}

/** Position of the City Guide bottom sheet drawer, shared between `GlobalMap` and `CityBottomSheet`. */
export enum DrawerPosition {
  open = "open",
  closed = "closed",
  collapsed = "collapsed",
  partiallyRevealed = "partiallyRevealed",
}
