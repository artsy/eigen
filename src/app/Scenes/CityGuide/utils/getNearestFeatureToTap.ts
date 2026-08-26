/**
 * A tap reports every feature within its touch target, so two adjacent clusters (or a cluster and a
 * neighbouring pin) can both come back, in no particular order. Pick whichever sits closest to where
 * the user actually tapped.
 */
export const getNearestFeatureToTap = (
  features: GeoJSON.Feature[],
  tap?: { latitude: number; longitude: number }
): GeoJSON.Feature | undefined => {
  if (features.length <= 1 || !tap) {
    return features[0]
  }

  // Lines of longitude converge towards the poles, so scale them before comparing the two axes.
  const longitudeScale = Math.cos((tap.latitude * Math.PI) / 180)

  let nearest = features[0]
  let nearestDistance = Infinity

  features.forEach((feature) => {
    const coordinates = (feature.geometry as GeoJSON.Point)?.coordinates

    if (!coordinates) {
      return
    }

    const deltaLongitude = (coordinates[0] - tap.longitude) * longitudeScale
    const deltaLatitude = coordinates[1] - tap.latitude
    // Squared distance is enough to rank them, so the square root is skipped.
    const distance = deltaLongitude * deltaLongitude + deltaLatitude * deltaLatitude

    if (distance < nearestDistance) {
      nearestDistance = distance
      nearest = feature
    }
  })

  return nearest
}
