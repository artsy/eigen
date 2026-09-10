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
    case "Partner":
      // Galleries and museums are both Partners in Artsy's model; the visible distinction
      // between them is the stop's own `category`, not this.
      return { type: "PARTNER", slug: item.slug, name: item.name ?? null }
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
  imageUrl: stop.imageURL ?? "",
  // Both nullable server-side, and a stop is only mappable with both. Left undefined rather
  // than defaulted to 0,0 — the Gulf of Guinea is not a plausible London stop, and the map
  // filters on this being present.
  coordinates:
    stop.latitude != null && stop.longitude != null
      ? { lat: stop.latitude, lng: stop.longitude }
      : undefined,
  saveTarget: toSaveTarget(stop.item),
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
  title: itinerary.name,
  subtitle: itinerary.subtitle ?? "",
  // `resized` asks Gemini for the width the header actually draws instead of pulling the
  // full-size original; `url` is the fallback for an image with no resized variant.
  heroImageUrl: itinerary.heroImage?.resized?.url ?? itinerary.heroImage?.url ?? "",
  authorName: itinerary.authorName ?? "",
  description: itinerary.description ?? "",
  sections: itinerary.sections.map(toSection),
})
