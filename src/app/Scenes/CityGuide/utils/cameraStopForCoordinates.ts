import { CameraStop } from "@rnmapbox/maps"

/** Roughly 200m. Below this, fitting bounds over-zooms rather than framing a place. */
const MIN_BOUNDS_SPAN = 0.002
const SINGLE_PLACE_ZOOM = 14

interface Padding {
  paddingTop: number
  paddingBottom: number
  paddingLeft: number
  paddingRight: number
}

/**
 * A camera stop that frames every coordinate given, or `undefined` when there are none.
 */
export const cameraStopForCoordinates = (
  coordinates: Array<{ lat: number; lng: number }>,
  padding: Padding
): CameraStop | undefined => {
  if (!coordinates.length) return undefined

  const lngs = coordinates.map((coordinate) => coordinate.lng)
  const lats = coordinates.map((coordinate) => coordinate.lat)
  const minLng = Math.min(...lngs)
  const maxLng = Math.max(...lngs)
  const minLat = Math.min(...lats)
  const maxLat = Math.max(...lats)

  // One place — or several at the same address — gives a zero-size box, and fitting to
  // that zooms Mapbox all the way in on a rooftop. Centre at a readable zoom instead.
  if (maxLng - minLng < MIN_BOUNDS_SPAN && maxLat - minLat < MIN_BOUNDS_SPAN) {
    return {
      centerCoordinate: [(minLng + maxLng) / 2, (minLat + maxLat) / 2],
      zoomLevel: SINGLE_PLACE_ZOOM,
    }
  }

  return {
    bounds: {
      ne: [maxLng, maxLat],
      sw: [minLng, minLat],
      ...padding,
    },
  }
}
