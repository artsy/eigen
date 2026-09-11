import { ItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"

/** Shown before a museum's location line, per the designs. */
const MUSEUM_EMOJI = "🏛"

/**
 * Which card a stop renders as. Inferred rather than stored: the resolved item's type gives
 * show / fair / museum-or-gallery, and a stop with no item at all is a custom one — a cafe, a
 * restaurant, a landmark.
 *
 * `event` is absent deliberately. The designs define an Event card, but `ItineraryStop`
 * exposes only `eventID` — no resolved event and no event kind — so there is nothing to
 * detect it by or render from. See the plan.
 */
export type StopCardKind = "show" | "fair" | "partner" | "custom"

export interface StopCardFields {
  kind: StopCardKind
  /** First line: what the stop is called. */
  title: string
  /** Second line: where it is. Absent on a custom stop, which has no resolved place. */
  subtitle?: string
  /** Third line, left of the dot. Server-formatted; this never parses a date. */
  hours?: string
  /** Third line, right of the dot. */
  admission?: string
  /** Where tapping goes. Absent when nothing is linkable — see `sourceURL` in the plan. */
  href?: string
}

const admissionLabel = (isFreeAdmission: boolean | null | undefined) => {
  if (isFreeAdmission == null) return undefined

  return isFreeAdmission ? "Free" : "Paid Entry"
}

/**
 * The place line for a museum or gallery. The designs ask for "neighborhood location";
 * `Location.neighborhood` was reverted out of Metaphysics, so this falls back to the
 * location's own name and then its city.
 */
const placeLine = (
  location: { readonly name?: string | null; readonly city?: string | null } | null | undefined
) => location?.name ?? location?.city ?? undefined

export interface StopCardItem {
  readonly __typename: string
  readonly name?: string | null
  readonly href?: string | null
  readonly isFreeAdmission?: boolean | null
  readonly partner?: { readonly name?: string | null } | null
  readonly location?: { readonly name?: string | null; readonly city?: string | null } | null
  readonly locations?:
    | readonly (
        | { readonly name?: string | null; readonly city?: string | null }
        | null
        | undefined
      )[]
    | null
}

/**
 * Derives a stop card's lines and destination from the stop and whatever its item resolved to.
 *
 * Kept pure and separate from the component so every combination of type, admission and
 * missing data is testable without rendering — there are more combinations than card layouts.
 */
export const stopCardFields = (stop: ItineraryStop, item?: StopCardItem | null): StopCardFields => {
  // The stop's own admission wins: an author can override what the entity says.
  const admission = admissionLabel(stop.isFreeAdmission ?? item?.isFreeAdmission)
  const hours = stop.displayTime || undefined

  switch (item?.__typename) {
    case "Show":
      return {
        kind: "show",
        // The editorial title wins over the show's own name, as everywhere else.
        title: stop.title || item.name || "",
        // A museum is marked with a building, per the designs. The distinction is the stop's
        // category, since both museums and galleries are Partners.
        subtitle: [stop.category === "MUSEUM" ? MUSEUM_EMOJI : null, item.partner?.name]
          .filter(Boolean)
          .join(" "),
        hours,
        admission,
        href: item.href ?? undefined,
      }

    case "Fair":
      return {
        kind: "fair",
        title: stop.title || item.name || "",
        subtitle: placeLine(item.location),
        hours,
        admission,
        href: item.href ?? undefined,
      }

    case "Partner":
      return {
        kind: "partner",
        title: stop.title || item.name || "",
        // `Partner.location` needs a locationId, so the first of `locations` stands in.
        subtitle: placeLine(item.locations?.[0] ?? item.location),
        hours,
        admission,
        href: item.href ?? undefined,
      }

    default:
      return {
        kind: "custom",
        title: stop.title,
        // The designs put the place's type here — "Cafe", "Landmark" — pulled from the source
        // link. Nothing exposes it, so the stop's address stands in as the nearest thing it
        // does know about where this is.
        subtitle: stop.address,
        hours,
        // No href: a custom stop links to its source URL, which Metaphysics does not expose,
        // and a dead tap target is worse than none.
      }
  }
}
