import {
  itineraryStopCategory,
  itineraryStopDisplayTime,
  itineraryStopEvent,
  itineraryStopTitle,
} from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryStopFields"
import { ItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"
import { DateTime } from "luxon"

const MUSEUM_EMOJI = "🏛"

/**
 * Which card a stop renders as. Inferred rather than stored, from the resolved item's type
 * (show/fair/museum-or-gallery) or its absence (custom). `event` covers a stop naming one.
 */
export type StopCardKind = "show" | "fair" | "partner" | "custom" | "event"

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
  /** Where tapping goes. Absent when nothing is linkable. */
  href?: string
  /**
   * The fourth line the designs give a show with a reception: "Opening Reception today". Only
   * a show event carries a kind, and only a reception earns the line.
   */
  reception?: string
}

/** Gravity's `PartnerShowEvent::EVENT_TYPES` values that the designs call out on the card. */
const RECEPTION_KINDS = ["Opening Reception", "Closing Reception"]

/**
 * "Opening Reception today", when the stop names one and it falls today — the only date
 * comparison in this file; everything else displayed is formatted server-side.
 */
const receptionLine = (stop: ItineraryStop) => {
  const event = itineraryStopEvent(stop)
  const kind = event?.kind

  if (!kind || !RECEPTION_KINDS.includes(kind)) return undefined
  if (!event?.startAt) return undefined

  const startsToday = DateTime.fromISO(event.startAt).hasSame(DateTime.local(), "day")

  return startsToday ? `${kind} today` : undefined
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
      // The curator's title wins, then the event's own name, then the parent's.
      title: title || event?.title || item?.name || "",
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
        reception: receptionLine(stop),
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
        // The designs put the place's type here ("Cafe", "Landmark") pulled from the source
        // link. Nothing exposes it, so the stop's address stands in instead.
        subtitle: stop.address ?? undefined,
        hours,
        admission,
        // Where the curator found it — the only thing a custom stop can link to.
        href: stop.sourceURL ?? undefined,
      }
  }
}
