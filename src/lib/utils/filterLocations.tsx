/**
 * Helper function to filter out blank and duplicate location names
 * @param locations collection of location objects to filter
 */
export const filterLocations = (locations: ReadonlyArray<{ city: string }>) => {
  if (!locations || locations.length < 1) {
    return null
  }
  const locationCities = locations.map((location, index) => {
    return location.city
  })
  const filteredForDuplicatesAndBlanks = locationCities.filter((city, pos) => {
    return city && locationCities.indexOf(city) === pos && city.length > 0
  })
  return filteredForDuplicatesAndBlanks
}
