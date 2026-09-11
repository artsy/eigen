import { MOCK_NEIGHBORHOODS } from "app/Scenes/CityGuide/utils/mockCityNeighborhoods"
import { DateTime } from "luxon"

/**
 * A titled group of events. `title` is an opaque display string and carries no meaning:
 * two sections may legitimately share one. Identity is always `id`.
 */
export interface CityEventSection<T> {
  id: string
  title: string
  items: T[]
}

interface HasStartAt {
  start_at?: string | null
}

const DAYS_PER_WEEK = 7
const OPENING_WINDOW_DAYS = 14

/**
 * Buckets upcoming events into two rolling weeks measured from `now`, not calendar weeks.
 *
 * Gravity's `upcoming` scope is `start_at > now && start_at < in_days.days.from_now`
 * (`event_status.rb:26-28`), so a query using `dayThreshold: 14` cannot return anything
 * these two buckets do not cover. We drop out-of-range items anyway rather than trusting
 * the caller to have passed the matching threshold.
 *
 * `now` is injected so the week boundaries are testable.
 */
export const groupByOpeningWeek = <T extends HasStartAt>(
  items: readonly T[],
  now: DateTime
): CityEventSection<T>[] => {
  const nextWeekStart = now.plus({ days: DAYS_PER_WEEK })
  const windowEnd = now.plus({ days: OPENING_WINDOW_DAYS })

  const thisWeek: T[] = []
  const nextWeek: T[] = []

  items.forEach((item) => {
    if (!item.start_at) {
      return
    }

    const startAt = DateTime.fromISO(item.start_at)

    if (!startAt.isValid || startAt >= windowEnd) {
      return
    }

    if (startAt < nextWeekStart) {
      thisWeek.push(item)
    } else {
      nextWeek.push(item)
    }
  })

  return [
    { id: "this-week", title: "This Week", items: thisWeek },
    { id: "next-week", title: "Next Week", items: nextWeek },
  ].filter((section) => section.items.length > 0)
}

interface HasPostalCode {
  location?: { postalCode?: string | null } | null
}

/** The section unmatched events fall into. Always sorted last. */
const FALLBACK_SECTION_ID = "more"

/** Uppercases and strips whitespace. Returns "" for missing, null or blank input. */
export const normalizePostalCode = (postalCode?: string | null): string =>
  (postalCode ?? "").toUpperCase().replace(/\s+/g, "")

/**
 * Groups events by the neighbourhood their postcode falls in, using the editorial table in
 * `mockCityNeighborhoods.ts`.
 *
 * Gravity defaults `postal_code` to "" rather than null (`partner_location.rb:26`), so a
 * blank code must fall through to the fallback instead of prefix-matching everything.
 * Longest prefix wins, so "W10" does not get read as "W1".
 */
export const groupByNeighborhood = <T extends HasPostalCode>(
  items: readonly T[],
  citySlug: string,
  cityName: string
): CityEventSection<T>[] => {
  const defs = MOCK_NEIGHBORHOODS[citySlug] ?? []
  const grouped = new Map<string, T[]>()

  items.forEach((item) => {
    const code = normalizePostalCode(item.location?.postalCode)

    const match = !code
      ? undefined
      : defs.reduce<{ id: string; length: number } | undefined>((best, def) => {
          const longest = def.postalPrefixes
            .filter((prefix) => code.startsWith(prefix))
            .reduce((max, prefix) => Math.max(max, prefix.length), 0)

          if (longest === 0 || (best && best.length >= longest)) {
            return best
          }

          return { id: def.id, length: longest }
        }, undefined)

    const sectionId = match?.id ?? FALLBACK_SECTION_ID
    grouped.set(sectionId, [...(grouped.get(sectionId) ?? []), item])
  })

  const sections = defs
    .filter((def) => grouped.has(def.id))
    .map((def) => ({ id: def.id, title: def.title, items: grouped.get(def.id) as T[] }))

  const fallback = grouped.get(FALLBACK_SECTION_ID)

  if (fallback) {
    sections.push({
      id: FALLBACK_SECTION_ID,
      title: `More in ${cityName}`,
      items: fallback,
    })
  }

  return sections
}
