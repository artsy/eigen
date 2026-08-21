/**
 * `city.coordinates` is nullable in the schema and location updates can arrive without coordinates,
 * so make sure we actually have numbers before handing them over to the map.
 */
export const isValidLatLng = (location: any): location is { lat: number; lng: number } => {
  return typeof location?.lat === "number" && typeof location?.lng === "number"
}
