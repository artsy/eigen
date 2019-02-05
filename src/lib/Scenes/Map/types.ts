export interface Coordinates {
  lat: number
  lng: number
}

export interface City {
  name: string
  epicenter: Coordinates
}

export interface Tab {
  id: string
  text: string
}
