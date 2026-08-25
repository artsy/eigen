export const getNearestPointToLatLongInCollection = (
  values: { lat: number; lng: number },
  features: any[]
) => {
  // https://stackoverflow.com/a/21623206
  function distance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const p = 0.017453292519943295 // Math.PI / 180
    const c = Math.cos
    const a =
      0.5 - c((lat2 - lat1) * p) / 2 + (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2

    return 12742 * Math.asin(Math.sqrt(a)) // 2 * R; R = 6371 km
  }

  const distances = features
    .map((feature) => {
      const [featureLat, featureLng] = feature.geometry.coordinates
      return {
        ...feature,
        distance: distance(values.lat, values.lng, featureLat, featureLng),
      }
    })
    .sort((a, b) => a.distance - b.distance)

  return distances[0]
}
