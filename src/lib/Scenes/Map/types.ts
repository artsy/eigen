import { GlobalMap_viewer } from "__generated__/GlobalMap_viewer.graphql"
import { BucketKey, BucketResults } from "./bucketCityResults"

export interface Coordinates {
  lat: number
  lng: number
}

export interface City {
  name: string
  epicenter: Coordinates
}

export type Show = GlobalMap_viewer["city"]["shows"]["edges"][0]["node"]
export type Fair = GlobalMap_viewer["city"]["fairs"]["edges"][0]["node"] & { type?: string }

export interface MapTab {
  /** UUID for the tab */
  id: BucketKey | "all" | "BMW Art Guide"
  /** Display string */
  text: string
  /** A func to grab the right shows for this tab on the map */
  getShows: (buckets: BucketResults) => Show[]
  /** A func to grab the right ffairs for this tab on the map */
  getFairs: (buckets: BucketResults) => Fair[]
}

/** A GeoJSON feature used by MapBox internally */
export interface MapGeoFeature {
  geometry: {
    type: string
    coordinates?: [number, number] | undefined
  }
  properties: {
    zoomLevel: number
    isUserInteraction: boolean
    visibleBounds?: Array<number[] | null> | null
    heading: number
    pitch: number
    animated: boolean
    cluster: boolean
    type: string | any
    cluster_id: number
    point_count: number | string
  }
  type: string | any
}

/** Interface for the current state of Relay queries/errors. */
export interface RelayErrorState {
  isRetrying: boolean
  retry: () => void
  error: Error
}

export interface MapGeoFeatureCollection {
  type: "FeatureCollection"
  features: MapGeoFeature[]
}

/** Comes in from the OS via the MapBox onUserLocationUpdate */
export interface OSCoordsUpdate {
  timestamp: number
  coords: {
    accuracy: number
    speed: number
    latitude: number
    longitude: number
    heading: number
    altitude: number
  }
}

export interface SafeAreaInsets {
  top: number
  bottom: number
  left: number
  right: number
}
