import { ItineraryScreenQuery$data } from "__generated__/ItineraryScreenQuery.graphql"
import {
  Itinerary,
  ItinerarySaveTarget,
  ItinerarySection,
  ItineraryStop,
} from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"

type QueryItinerary = NonNullable<ItineraryScreenQuery$data["itinerary"]>
type QuerySection = QueryItinerary["sections"][number]
type QueryStop = QuerySection["stops"][number]

/**
 * Narrows the `Show | Fair | Partner` union to the members this client knows. Relay adds a
 * `"%other"` member for anything unselected, so a server-side addition lands here, not a crash.
 */
const knownItem = (
  item: QueryStop["item"]
): { type: ItinerarySaveTarget["type"]; slug: string; name: string | null } | null => {
  if (!item) return null

  switch (item.__typename) {
    case "Show":
      return { type: "SHOW", slug: item.slug, name: item.name ?? null }
    case "Fair":
      return { type: "FAIR", slug: item.slug, name: item.name ?? null }
    case "Location":
      // A gallery stop points at a partner's location, not the partner — the location carries
      // the address, the partner is what's followed and linked. No partner means unsaveable.
      if (!item.partner?.slug) return null
      // Galleries and museums are both Partners in Artsy's model; the visible distinction
      // between them is the stop's own `category`, not this.
      return {
        type: "PARTNER",
        slug: item.partner.slug,
        name: item.name ?? item.partner.name ?? null,
      }
    default:
      return null
  }
}

/**
 * The save controls are keyed by type and slug, so that is all this carries. `null` when a
 * stop points at no Artsy entity, or one whose entity didn't resolve — either way, nothing to follow.
 */
const toSaveTarget = (item: QueryStop["item"]): ItinerarySaveTarget | null => {
  const known = knownItem(item)

  return known ? { type: known.type, slug: known.slug } : null
}

/**
 * The generated enum carries `"%future added value"` for a category added server-side. Such a
 * stop shows no badge rather than a raw string the UI has no styling for.
 */
const toCategory = (category: QueryStop["category"]): ItineraryStop["category"] => {
  switch (category) {
    case "MUSEUM":
    case "GALLERY":
    case "SHOW":
    case "FAIR":
      return category
    default:
      return undefined
  }
}

const toDisplayTime = (stop: QueryStop): string => {
  if (stop.startTime && stop.endTime) return `${stop.startTime}-${stop.endTime}`

  return stop.startTime ?? stop.endTime ?? ""
}

/**
 * Flattens the `ShowEventType | FairEvent` union into the one shape the card reads. Only a
 * show event has a kind; a fair event has a name and nothing else the card needs.
 */
const toEvent = (event: QueryStop["event"]): ItineraryStop["event"] => {
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
const itemImageUrl = (item: QueryStop["item"]) => {
  if (!item) return undefined

  switch (item.__typename) {
    case "Show":
      return item.coverImage?.url ?? undefined
    case "Fair":
      return item.image?.url ?? undefined
    case "Location":
      // A location has no picture of its own; the gallery's profile is the nearest thing.
      return item.partner?.profile?.image?.url ?? undefined
    default:
      return undefined
  }
}

/**
 * Where the stop's entity is, for a stop with no coordinates of its own. A curator-typed
 * stop has lat/lng directly; an app-created one has neither, so without this it drops off the map.
 */
const itemCoordinates = (item: QueryStop["item"]) => {
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

const toCoordinates = (stop: QueryStop): ItineraryStop["coordinates"] => {
  if (stop.latitude != null && stop.longitude != null) {
    return { lat: stop.latitude, lng: stop.longitude }
  }

  const fallback = itemCoordinates(stop.item)

  // Both nullable server-side, and a stop is only mappable with both. Left undefined rather
  // than defaulted to 0,0 — the Gulf of Guinea is not a plausible London stop.
  if (fallback?.lat == null || fallback.lng == null) return undefined

  return { lat: fallback.lat, lng: fallback.lng }
}

const toStop = (stop: QueryStop): ItineraryStop => ({
  id: stop.internalID,
  // `title` is the editorial override, the only title a stop has of its own — falling back
  // to the item's name, then an empty string, when there's neither.
  title: stop.title ?? knownItem(stop.item)?.name ?? "",
  address: stop.address ?? undefined,
  category: toCategory(stop.category),
  displayTime: toDisplayTime(stop),
  startAt: stop.startAtISO ?? undefined,
  endAt: stop.endAtISO ?? undefined,
  note: stop.note ?? undefined,
  isFreeAdmission: stop.isFreeAdmission ?? undefined,
  sourceURL: stop.sourceURL ?? undefined,
  eventType: stop.eventType ?? undefined,
  event: toEvent(stop.event),
  imageUrl: stop.image?.url ?? itemImageUrl(stop.item) ?? "",
  coordinates: toCoordinates(stop),
  saveTarget: toSaveTarget(stop.item),
  cardItem: stop.item ?? undefined,
})

const toSection = (section: QuerySection, index: number): ItinerarySection => ({
  id: section.internalID,
  // Server-side the title is nullable; the client needs a required display string, so it
  // falls back to a positional label — sections arrive sorted, so the index is that position.
  title: section.title ?? `Day ${index + 1}`,
  stops: section.stops.map(toStop),
})

/**
 * Maps the GraphQL payload onto the client's own `Itinerary` type, which every component
 * below the screen already speaks, so the adapter lives here instead of threading fragments.
 */
export const itineraryFromQuery = (itinerary: QueryItinerary): Itinerary => ({
  id: itinerary.internalID,
  isCurated: itinerary.isCurated,
  citySlug: itinerary.citySlug,
  title: itinerary.title,
  subtitle: itinerary.subtitle ?? "",
  // `url(version:)` rather than `resized(width:)`: Gravity sends the versioned URLs it
  // generated but not the original's dimensions, and `resized` scales from those.
  heroImageUrl: itinerary.heroImage?.url ?? "",
  authorName: itinerary.authorName ?? "",
  description: itinerary.description ?? "",
  sections: itinerary.sections.map(toSection),
})
