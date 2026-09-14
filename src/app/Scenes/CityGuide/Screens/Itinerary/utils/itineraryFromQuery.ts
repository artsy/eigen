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
 * Narrows the `Show | Fair | Partner` union to the members this client knows.
 *
 * Relay adds a `"%other"` member for anything the query does not select on, so a member added
 * to the union server-side lands here rather than crashing — it reads as "not a saveable
 * entity" until this client is taught about it.
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
      // A gallery stop points at one of a partner's locations, not at the partner. The
      // location is what carries the address and the opening hours; the partner is what
      // the save control follows and what `/partner/:slug` links to. Without a partner
      // there is nothing to save or link, so the stop reads as unsaveable.
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
 * The save controls are keyed by type and slug, so that is all this carries. `null` for a stop
 * that points at no Artsy entity (a café, a plain address) and for one whose entity did not
 * resolve: either way there is nothing to follow.
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
 * The entity's own picture, for a stop with no uploaded one.
 *
 * `ItineraryStop.image` comes from the stop's own `image_url` column, which is only set when
 * the curator uploaded something. A stop the app creates sends no image, so without this every
 * show, fair and gallery stop would render an empty box.
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
 * Where the stop's entity is, for a stop with no coordinates of its own.
 *
 * A stop only carries `latitude`/`longitude` when a curator typed them in; one the app creates
 * from a show, fair or gallery has neither, so without this every entity-backed stop would be
 * dropped from the map.
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
  // `title` is the editorial override and the only title a stop has of its own. A stop with
  // neither a title nor a resolved item has nothing to show, so it falls back to the item's
  // name before an empty string.
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
  // Server-side the title is nullable; the client uses it as a required display string. The
  // fallback is positional so a section is never unlabelled. Sections arrive sorted by
  // position, so the index is that position.
  title: section.title ?? `Day ${index + 1}`,
  stops: section.stops.map(toStop),
})

/**
 * Maps the GraphQL payload onto the client's own `Itinerary` type, which every component
 * below the screen already speaks. Keeping the adapter here rather than threading fragments
 * through the tree means the map converter, the rows, the header and the preview sheet are
 * untouched by the move off mock data.
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
