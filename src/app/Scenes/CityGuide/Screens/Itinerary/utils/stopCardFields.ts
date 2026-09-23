import {
  itineraryStopCategory,
  itineraryStopDisplayTime,
  itineraryStopEvent,
  itineraryStopTitle,
} from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryStopFields"
import {
  ItineraryStop,
  ItineraryStopCategory,
} from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { Show } from "app/Scenes/CityGuide/utils/types"
import { DateTime } from "luxon"

const MUSEUM_EMOJI = "🏛"

/** Display label for a custom stop's category. MUSEUM/GALLERY/SHOW/FAIR never reach here — they
 * only apply to a stop with a resolved item, which renders through its own case below. */
export const CUSTOM_CATEGORY_LABELS: Partial<Record<ItineraryStopCategory, string>> = {
  CAFE: "Cafe",
  RESTAURANT: "Restaurant",
  BAR: "Bar",
  HOTEL: "Hotel",
  SHOP: "Shop",
  PARK: "Park",
  LANDMARK: "Landmark",
  OTHER: "Other",
}

/**
 * Which card a stop renders as. Inferred rather than stored, from the resolved item's type
 * (show/fair/museum-or-gallery) or its absence (custom). `event` covers a stop naming one.
 */
export type StopCardKind = "show" | "fair" | "partner" | "custom" | "event"

export interface StopCardFields {
  kind: StopCardKind
  /** First line: what the stop is called. An event's kind leads it — see `eventKind`. */
  title: string
  /**
   * Bolded ahead of the title, which then carries what the event belongs to: "**Closing
   * Reception**: Cecily Brown". Only an event that knows its kind has one.
   */
  eventKind?: string
  /** Second line: where it is. Absent on a custom stop, which has no resolved place. */
  subtitle?: string
  /** Third line, left of the dot. Server-formatted; this never parses a date. */
  hours?: string
  /** Third line, right of the dot. */
  admission?: string
  /** Where tapping goes. Absent when nothing is linkable. */
  href?: string
}

/**
 * An event's first line in two parts: what kind of event it is, which the card bolds, then the
 * show it belongs to — "Closing Reception: Cecily Brown".
 *
 * The kind is whatever Gravity's `event_type` says — free text, not a fixed set (Metaphysics
 * only rewrites "Other" to "Event"), so nothing here matches against a list of known kinds.
 * Only a show's event carries one; a fair's has just its own name, which the designs give it
 * alone. With no kind, or nothing for it to belong to, the title stands on its own.
 */
const eventTitleParts = (
  event: { kind?: string | null; title?: string | null } | undefined,
  parentName: string | null | undefined,
  /** The curator's editorial title, which leads wherever the event names nothing itself. */
  curatorTitle: string
): { eventKind?: string; title: string } => {
  const kind = event?.kind

  if (kind && parentName) return { eventKind: kind, title: parentName }

  return { title: curatorTitle || event?.title || parentName || kind || "" }
}

/**
 * "Oct 15" — an event stop's hours alone ("4pm-5pm") don't say which day, unlike a venue's
 * recurring daily hours, so its own event's date goes in front of them.
 */
const eventDateLabel = (startAt: string | null | undefined) => {
  if (!startAt) return undefined

  const date = DateTime.fromISO(startAt, { zone: "utc" })

  return date.isValid ? date.toFormat("MMM d") : undefined
}

const admissionLabel = (isFreeAdmission: boolean | null | undefined) => {
  if (isFreeAdmission == null) return undefined

  return isFreeAdmission ? "Free" : "Paid Entry"
}

/**
 * The place line for a museum or gallery. Falls back to name then city — the designs wanted
 * "neighborhood location" via `Location.neighborhood`, which was reverted out of Metaphysics.
 */
const placeLine = (
  location: { readonly name?: string | null; readonly city?: string | null } | null | undefined
) => location?.name ?? location?.city ?? undefined

export interface StopCardItem {
  readonly __typename: string
  readonly name?: string | null
  readonly city?: string | null
  readonly href?: string | null
  readonly isFreeAdmission?: boolean | null
  /** A Show or Fair's own running dates, e.g. "Feb 25 - May 24". Absent on a venue itself. */
  readonly exhibitionPeriod?: string | null
  readonly partner?: { readonly name?: string | null; readonly href?: string | null } | null
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
 * Derives a stop card's lines and destination from the stop and whatever its item resolved
 * to. Kept pure and separate from the component so every combination is testable without rendering.
 */
export const stopCardFields = (stop: ItineraryStop, item?: StopCardItem | null): StopCardFields => {
  // The stop's own admission wins: an author can override what the entity says.
  const admission = admissionLabel(stop.isFreeAdmission ?? item?.isFreeAdmission)
  const hours = itineraryStopDisplayTime(stop) || undefined
  const title = itineraryStopTitle(stop)
  const category = itineraryStopCategory(stop.category)
  const event = itineraryStopEvent(stop)

  // An event at a venue, checked before the item's type — an event stop also carries the
  // show/fair it belongs to, which is where its place and href (it has none of its own) come from.
  if (stop.eventType) {
    // The stop's own date wins, as with title and admission elsewhere in here — a curator's
    // override beats what the linked event says. Falls back to the event's own date when the
    // curator set none.
    const eventDate = eventDateLabel(stop.startAtISO ?? event?.startAt)

    return {
      kind: "event",
      ...eventTitleParts(event, item?.name, title),
      subtitle: item?.partner?.name ?? placeLine(item?.locations?.[0] ?? item?.location),
      hours: [eventDate, hours].filter(Boolean).join(", ") || undefined,
      admission,
      href: item?.href ?? stop.sourceURL ?? undefined,
    }
  }

  switch (item?.__typename) {
    case "Show":
      return {
        kind: "show",
        // The editorial title wins over the show's own name, as everywhere else.
        title: title || item.name || "",
        // A museum is marked with a building, per the designs. The distinction is the stop's
        // category, since both museums and galleries are Partners.
        subtitle: [category === "MUSEUM" ? MUSEUM_EMOJI : null, item.partner?.name]
          .filter(Boolean)
          .join(" "),
        // The curator's own visiting hours win when set; otherwise the show's running dates —
        // more useful than a blank line, and what tells you it's even on during your trip.
        hours: hours || item.exhibitionPeriod || undefined,
        admission,
        href: item.href ?? undefined,
      }

    case "Fair":
      return {
        kind: "fair",
        title: title || item.name || "",
        subtitle: placeLine(item.location),
        hours: hours || item.exhibitionPeriod || undefined,
        admission,
        href: item.href ?? undefined,
      }

    case "Partner":
      return {
        kind: "partner",
        title: title || item.name || "",
        // `Partner.location` needs a locationId, so the first of `locations` stands in.
        subtitle: placeLine(item.locations?.[0] ?? item.location),
        hours,
        admission,
        href: item.href ?? undefined,
      }

    // A gallery or museum stop points at one of the partner's locations, not at the partner.
    // The location carries the address; the partner carries the name and the href.
    case "Location":
      return {
        kind: "partner",
        title: title || item.partner?.name || item.name || "",
        subtitle: placeLine(item),
        hours,
        admission,
        href: item.partner?.href ?? undefined,
      }

    default:
      return {
        kind: "custom",
        title,
        // The designs put the place's type here ("Cafe", "Landmark"). Falls back to the
        // address when the curator left the category unset.
        subtitle: (category && CUSTOM_CATEGORY_LABELS[category]) || stop.address || undefined,
        hours,
        admission,
        // Where the curator found it — the only thing a custom stop can link to.
        href: stop.sourceURL ?? undefined,
      }
  }
}

/**
 * The same card for a show the city guide has in hand directly — its own map, rather than an
 * itinerary — so a show pin's preview reads like the stop it would become. A show has no
 * visiting hours of its own in that query, so its running dates stand in, as they do for a
 * stop with no hours set.
 */
export const showCardFields = (show: Show): StopCardFields => ({
  kind: "show",
  title: show.name ?? "",
  subtitle: show.partner?.name ?? undefined,
  hours: show.exhibition_period ?? undefined,
  admission: admissionLabel(show.isFreeAdmission),
  href: show.href ?? undefined,
})
