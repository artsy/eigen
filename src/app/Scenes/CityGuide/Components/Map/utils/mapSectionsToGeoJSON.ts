import { StopCardFields } from "app/Scenes/CityGuide/Screens/Itinerary/utils/stopCardFields"

export interface MapPlace {
  id: string
  title: string
  coordinates: { lat: number; lng: number }
  href?: string | null
  /**
   * The same card content shown in the itinerary list — see `StopCard`. Set by the itinerary
   * adapter; the plain city-events adapter has no equivalent and uses `detail` instead.
   */
  card?: StopCardFields
  image?: { url: string; blurhash?: string | null } | null
  /** Injected, so the card holds no Relay or context dependency. Ignored once `card` is set. */
  detail?: React.ReactNode
  saveControl?: React.ReactNode
  /**
   * Name of a pin sprite in the Artsy Mapbox style, e.g. "pin", "pin-saved", "pin-fair".
   * Defaults to "pin"; the itinerary ignores it since it draws numbered circles instead.
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
   * Stamps a 1-based "number" from position in the list given here, so filtering to one
   * section numbers it 1..N rather than by position across the whole map. Off by default.
   */
  numbered?: boolean
}

/**
 * Numbers pins by position in the list given, not in some larger unfiltered set — filtering
 * to day two shows its stops as 1 and 2 rather than 4 and 5.
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
      // Defaults to the plain pin sprite; event adapters set a more specific one. The
      // itinerary never sets this — it draws numbered circles instead.
      icon: place.icon ?? "pin",
      // Mapbox textField expects a FormattedString; stamping avoids a to-string wrapper in layer style.
      ...(numbered ? { number: String(index + 1) } : {}),
    },
  })),
})
