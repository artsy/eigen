export interface MapPlace {
  id: string
  title: string
  coordinates: { lat: number; lng: number }
  href?: string | null
  /** Injected, so the card holds no Relay or context dependency. */
  detail?: React.ReactNode
  saveControl?: React.ReactNode
  /**
   * Name of a pin sprite in the Artsy Mapbox style, e.g. "pin", "pin-saved", "pin-fair".
   * Defaults to "pin" when absent. Event maps set this; the itinerary ignores it, since it
   * draws numbered circles instead (see `MapPins`'s `numbered` option).
   */
  icon?: string
}

export interface MapSection {
  /** Stable identity. Used for keys, lookups, and map filters. */
  id: string
  /** Opaque display string. Never used as identity. */
  title: string
  places: MapPlace[]
}

export interface FlattenedMapPlace {
  place: MapPlace
  sectionId: string
}

export interface MapFeature {
  type: "Feature"
  geometry: { type: "Point"; coordinates: [number, number] }
  properties: { id: string; icon: string; number?: string }
}

export interface MapFeatureCollection {
  type: "FeatureCollection"
  features: MapFeature[]
}

/** Flattens sections into one list, tagging each place with the section it came from. */
export const flattenMapSections = (sections: MapSection[]): FlattenedMapPlace[] => {
  const flattened: FlattenedMapPlace[] = []

  sections.forEach((section) => {
    section.places.forEach((place) => {
      flattened.push({ place, sectionId: section.id })
    })
  })

  return flattened
}

export interface MapPlacesToGeoJSONOptions {
  /**
   * Stamps a 1-based "number" property, computed from position in the list given here —
   * never baked onto a place ahead of filtering. So filtering the map to one section
   * numbers that section 1..N, not by its position across the whole map. Off by default:
   * only the itinerary map numbers pins.
   */
  numbered?: boolean
}

/**
 * Numbers pins (when asked to) by their position in the list it is given, not by a place's
 * position in some larger, unfiltered set. Passing every place numbers them 1..N, while
 * passing one section's places numbers that section 1..N on its own — filtering the map to
 * day two shows its stops as 1 and 2 rather than 4 and 5.
 */
export const mapPlacesToGeoJSON = (
  flattened: FlattenedMapPlace[],
  { numbered = false }: MapPlacesToGeoJSONOptions = {}
): MapFeatureCollection => ({
  type: "FeatureCollection",
  features: flattened.map(({ place }, index) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [place.coordinates.lng, place.coordinates.lat],
    },
    properties: {
      id: place.id,
      // Defaults to the plain pin sprite; event adapters set a more specific icon (a save
      // state or a fair marker). The itinerary never sets one, since it draws numbered
      // circles instead and ignores this property entirely.
      icon: place.icon ?? "pin",
      // Mapbox textField expects a FormattedString; stamping avoids a to-string wrapper in layer style.
      ...(numbered ? { number: String(index + 1) } : {}),
    },
  })),
})

export interface MapRouteCollection {
  type: "FeatureCollection"
  features: {
    type: "Feature"
    geometry: { type: "LineString"; coordinates: [number, number][] }
    properties: Record<string, never>
  }[]
}

/**
 * The path through a list of places, in order, for drawing a route on the map. Returns no
 * features for fewer than two places, since a line needs two ends. Itinerary-only today —
 * the event maps never pass a non-empty list here.
 */
export const mapPlacesToRouteGeoJSON = (flattened: FlattenedMapPlace[]): MapRouteCollection => {
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
          coordinates: flattened.map(({ place }) => [place.coordinates.lng, place.coordinates.lat]),
        },
        properties: {},
      },
    ],
  }
}
