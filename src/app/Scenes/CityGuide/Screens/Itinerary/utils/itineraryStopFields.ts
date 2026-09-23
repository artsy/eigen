import {
  ItinerarySaveTarget,
  ItinerarySection,
  ItineraryStop,
  ItineraryStopCategory,
} from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"

/**
 * Narrows the `Show | Fair | Location` union to the members this client knows. Relay adds a
 * `"%other"` member for anything unselected, so a server-side addition lands here, not a crash.
 */
const knownItem = (
  item: ItineraryStop["item"]
): (ItinerarySaveTarget & { name: string | null }) | null => {
  if (!item) return null

  switch (item.__typename) {
    case "Show":
      return {
        itemType: "SHOW",
        itemID: item.internalID,
        itemSlug: item.slug ?? undefined,
        name: item.name ?? null,
      }
    case "Fair":
      return {
        itemType: "FAIR",
        itemID: item.internalID,
        itemSlug: item.slug ?? undefined,
        name: item.name ?? null,
      }
    case "Location":
      // A stop names the location, not the partner, so `LOCATION` is what it stores — the
      // partner is still where the name falls back to. A location has no slug of its own.
      return {
        itemType: "LOCATION",
        itemID: item.internalID,
        name: item.name ?? item.partner?.name ?? null,
      }
    default:
      return null
  }
}

/**
 * What the plus adds to your own itinerary. `null` when a stop points at no Artsy entity, or
 * one whose entity didn't resolve — either way, nothing to add.
 */
export const itineraryStopSaveTarget = (stop: ItineraryStop): ItinerarySaveTarget | null => {
  const known = knownItem(stop.item)

  return known ? { itemType: known.itemType, itemID: known.itemID, itemSlug: known.itemSlug } : null
}

/**
 * The generated enum carries `"%future added value"` for a category added server-side. Such a
 * stop shows no badge rather than a raw string the UI has no styling for.
 */
export const itineraryStopCategory = (
  category: ItineraryStop["category"]
): ItineraryStopCategory | undefined => {
  switch (category) {
    case "MUSEUM":
    case "GALLERY":
    case "SHOW":
    case "FAIR":
    case "CAFE":
    case "RESTAURANT":
    case "BAR":
    case "HOTEL":
    case "SHOP":
    case "PARK":
    case "LANDMARK":
    case "OTHER":
      return category
    default:
      return undefined
  }
}

/** Backend-formatted for display. e.g. "11am-4pm" */
export const itineraryStopDisplayTime = (stop: ItineraryStop): string => {
  if (stop.startTime && stop.endTime) return `${stop.startTime}-${stop.endTime}`

  return stop.startTime ?? stop.endTime ?? ""
}

/**
 * Flattens the `ShowEventType | FairEvent` union into the one shape the card reads. Only a
 * show event has a kind; a fair event has a name and nothing else the card needs.
 */
export const itineraryStopEvent = (
  stop: ItineraryStop
): { title?: string | null; kind?: string | null; startAt?: string | null } | undefined => {
  const event = stop.event
  if (!event) return undefined

  switch (event.__typename) {
    case "ShowEventType":
      return { title: event.title, kind: event.eventType, startAt: event.startAtISO }
    case "FairEvent":
      return { title: event.name, startAt: event.startAtISO }
    default:
      return undefined
  }
}

/**
 * The entity's own picture, for a stop with no uploaded one. `ItineraryStop.image` is only
 * set when the curator uploaded something, so without this every app-created stop shows an empty box.
 */
const itemImage = (
  item: ItineraryStop["item"]
): { url: string; blurhash?: string | null } | undefined => {
  if (!item) return undefined

  switch (item.__typename) {
    case "Show": {
      const url = item.coverImage?.url
      return url ? { url, blurhash: item.coverImage?.blurhash } : undefined
    }
    case "Fair": {
      const url = item.image?.url
      return url ? { url, blurhash: item.image?.blurhash } : undefined
    }
    case "Location": {
      // A location has no picture of its own; the gallery's profile is the nearest thing.
      const image = item.partner?.profile?.image
      const url = image?.url
      return url ? { url, blurhash: image?.blurhash } : undefined
    }
    default:
      return undefined
  }
}

export const itineraryStopImage = (
  stop: ItineraryStop
): { url: string; blurhash?: string | null } | null => {
  if (stop.image?.url) {
    return { url: stop.image.url, blurhash: stop.image.blurhash }
  }

  return itemImage(stop.item) ?? null
}

/**
 * Where the stop's entity is, for a stop with no coordinates of its own. A curator-typed
 * stop has lat/lng directly; an app-created one has neither, so without this it drops off the map.
 */
const itemCoordinates = (item: ItineraryStop["item"]) => {
  if (!item) return undefined

  switch (item.__typename) {
    case "Show":
    case "Fair":
      return item.location?.coordinates ?? undefined
    case "Location":
      return item.coordinates ?? undefined
    default:
      return undefined
  }
}

export const itineraryStopCoordinates = (
  stop: ItineraryStop
): { lat: number; lng: number } | undefined => {
  if (stop.latitude != null && stop.longitude != null) {
    return { lat: stop.latitude, lng: stop.longitude }
  }

  const fallback = itemCoordinates(stop.item)

  // Both nullable server-side, and a stop is only mappable with both. Left undefined rather
  // than defaulted to 0,0 — the Gulf of Guinea is not a plausible London stop.
  if (fallback?.lat == null || fallback.lng == null) return undefined

  return { lat: fallback.lat, lng: fallback.lng }
}

/**
 * `title` is the editorial override, the only title a stop has of its own — falling back
 * to the item's name, then an empty string, when there's neither.
 */
export const itineraryStopTitle = (stop: ItineraryStop): string =>
  stop.title ?? knownItem(stop.item)?.name ?? ""

/**
 * Server-side the title is nullable; the client needs a required display string, so it
 * falls back to a positional label — sections arrive sorted, so the index is that position.
 */
export const itinerarySectionTitle = (section: ItinerarySection, index: number): string =>
  section.title ?? `Day ${index + 1}`
