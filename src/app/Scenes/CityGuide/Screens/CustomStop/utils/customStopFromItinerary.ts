import { ItineraryStopCategory } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"

/**
 * A stop the curator typed in rather than picked from Artsy. Only the fields the screen shows,
 * plus what "add to itinerary" copies.
 */
export interface CustomStop {
  id: string
  title: string
  address?: string
  category?: ItineraryStopCategory
  /** The editorial paragraph. `note` server-side. */
  description?: string
  /** Where the curator found it. Leads off Artsy. */
  sourceURL?: string
  isFreeAdmission?: boolean
  /** Server-formatted for display; this never parses a date. */
  hours?: string
  imageUrl?: string
  coordinates?: { lat: number; lng: number }
  isOnMyItineraries?: boolean | null
  myItineraries?: readonly { readonly internalID: string }[] | null
}

/** Typed structurally rather than off the generated query, so the deriver is testable alone. */
interface PayloadStop {
  readonly internalID: string
  readonly title?: string | null
  readonly address?: string | null
  readonly category?: string | null
  readonly note?: string | null
  readonly sourceURL?: string | null
  readonly isFreeAdmission?: boolean | null
  readonly latitude?: number | null
  readonly longitude?: number | null
  readonly startTime?: string | null
  readonly endTime?: string | null
  readonly image?: { readonly url?: string | null } | null
  readonly item?: { readonly __typename: string } | null
  readonly isOnMyItineraries?: boolean | null
  readonly myItineraries?: readonly { readonly internalID: string }[] | null
}

interface PayloadItinerary {
  readonly sections: readonly { readonly stops: readonly PayloadStop[] }[]
}

/**
 * The generated enum carries `"%future added value"` for a category added server-side. Such a
 * stop shows no badge rather than a raw string the UI has no styling for.
 */
const toCategory = (category: string | null | undefined): ItineraryStopCategory | undefined => {
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

const toHours = (stop: PayloadStop) => {
  if (stop.startTime && stop.endTime) return `${stop.startTime}-${stop.endTime}`

  return stop.startTime ?? stop.endTime ?? undefined
}

/**
 * Finds one custom stop in an itinerary payload. Returns `null` both when the stop isn't
 * there and when it turns out to have an Artsy entity — that stop has its own page instead.
 */
export const customStopFromItinerary = (
  itinerary: PayloadItinerary | null | undefined,
  stopId: string
): CustomStop | null => {
  const stop = itinerary?.sections
    .flatMap((section) => section.stops)
    .find((candidate) => candidate.internalID === stopId)

  if (!stop || stop.item) return null

  return {
    id: stop.internalID,
    title: stop.title ?? "",
    address: stop.address ?? undefined,
    category: toCategory(stop.category),
    description: stop.note ?? undefined,
    sourceURL: stop.sourceURL ?? undefined,
    isFreeAdmission: stop.isFreeAdmission ?? undefined,
    hours: toHours(stop),
    imageUrl: stop.image?.url ?? undefined,
    // Both nullable server-side, and a stop is only mappable with both.
    coordinates:
      stop.latitude != null && stop.longitude != null
        ? { lat: stop.latitude, lng: stop.longitude }
        : undefined,
    isOnMyItineraries: stop.isOnMyItineraries,
    myItineraries: stop.myItineraries,
  }
}

/** What "add to itinerary" copies. A custom stop has no entity, so it is its own fields. */
export const customStopInput = (stop: CustomStop) => ({
  sourceStopID: stop.id,
  title: stop.title,
  address: stop.address,
  note: stop.description,
  sourceURL: stop.sourceURL,
  category: stop.category,
  isFreeAdmission: stop.isFreeAdmission,
  latitude: stop.coordinates?.lat,
  longitude: stop.coordinates?.lng,
  isOnMyItineraries: stop.isOnMyItineraries,
  myItineraries: stop.myItineraries,
})
