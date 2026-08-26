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

export const itineraryStopsToGeoJSON = (
  flattened: FlattenedStop[]
): ItineraryFeatureCollection => ({
  type: "FeatureCollection",
  features: flattened.map(({ stop, sectionId, number }) => ({
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
      number: String(number),
    },
  })),
})
