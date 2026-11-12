/** A city with a City Guide, as listed by Metaphysics' `cityGuideCities` */
export type CityData = {
  slug: string
  name: string
  coordinates: {
    lat: number
    lng: number
  }
}
