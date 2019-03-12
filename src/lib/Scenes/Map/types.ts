import { GlobalMap_viewer } from "__generated__/GlobalMap_viewer.graphql"
import { BucketResults } from "./bucketCityResults"

export interface Coordinates {
  lat: number
  lng: number
}

export interface City {
  name: string
  epicenter: Coordinates
}

export type Show = GlobalMap_viewer["city"]["shows"]["edges"][0]["node"]
export type Fair = GlobalMap_viewer["city"]["fairs"]["edges"][0]["node"]

export interface MapTab {
  /** UUID for the tab */
  id: BucketKey | "BMW Art Guide"
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
  }
  type: string | any
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
