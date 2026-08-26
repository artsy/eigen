import {
  Itinerary,
  ItineraryStop,
} from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"

export interface FlattenedStop {
  stop: ItineraryStop
  sectionId: string
  number: number
}

export interface ItineraryFeature {
  type: "Feature"
  geometry: { type: "Point"; coordinates: [number, number] }
  properties: { id: string; title: string; sectionId: string; number: string }
}

export interface ItineraryFeatureCollection {
  type: "FeatureCollection"
  features: ItineraryFeature[]
}

/** Single source of truth for stop numbering: position in the flattened list. */
export const flattenItineraryStops = (itinerary: Itinerary): FlattenedStop[] => {
  const flattened: FlattenedStop[] = []

  itinerary.sections.forEach((section) => {
    section.stops.forEach((stop) => {
      flattened.push({ stop, sectionId: section.id, number: flattened.length + 1 })
    })
  })

  return flattened
}

/**
 * Numbers pins by their position in the list it is given, not by the stop's position in
 * the whole itinerary. So passing every stop numbers them 1..N, while passing one
 * section's stops numbers that section 1..N — filtering the map to day two shows its
 * stops as 1 and 2 rather than 4 and 5. The list view numbers separately and does keep
 * running totals across sections.
 */
export const itineraryStopsToGeoJSON = (
  flattened: FlattenedStop[]
): ItineraryFeatureCollection => ({
  type: "FeatureCollection",
  features: flattened.map(({ stop, sectionId }, index) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [stop.coordinates.lng, stop.coordinates.lat],
    },
    properties: {
      id: stop.id,
      title: stop.title,
      sectionId,
      // Mapbox textField expects a FormattedString; stamping avoids a to-string wrapper in layer style.
      number: String(index + 1),
    },
  })),
})

export interface ItineraryRouteCollection {
  type: "FeatureCollection"
  features: {
    type: "Feature"
    geometry: { type: "LineString"; coordinates: [number, number][] }
    properties: Record<string, never>
  }[]
}

/**
 * The path through a section's stops, in order, for drawing a route on the map. Returns
 * no features for fewer than two stops, since a line needs two ends.
 */
export const itineraryStopsToRouteGeoJSON = (
  flattened: FlattenedStop[]
): ItineraryRouteCollection => {
  if (flattened.length < 2) {
    return { type: "FeatureCollection", features: [] }
  }

  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: flattened.map(({ stop }) => [stop.coordinates.lng, stop.coordinates.lat]),
        },
        properties: {},
      },
    ],
  }
}
