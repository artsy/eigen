import { GlobalMap_viewer } from "__generated__/GlobalMap_viewer.graphql"

export interface Coordinates {
  lat: number
  lng: number
}

export interface City {
  name: string
  epicenter: Coordinates
}

export interface MapTab {
  id: string
  text: string
}

export type Show = GlobalMap_viewer["city"]["shows"]["edges"][0]["node"]

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
  type: string
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
