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
