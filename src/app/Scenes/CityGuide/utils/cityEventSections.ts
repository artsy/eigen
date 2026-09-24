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
 * Out-of-range items are dropped rather than trusting the caller passed a matching threshold.
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

interface HasCityGuideNeighborhood {
  location?: { cityGuideNeighborhood?: { slug: string } | null } | null
}

export interface CityNeighborhoodDef {
  slug: string
  name: string
}

/** The section unmatched events fall into. Always sorted last. */
const FALLBACK_SECTION_ID = "more"

/**
 * Groups events by the neighbourhood Metaphysics matched on their location, in the order
 * `neighborhoods` (the city's own display order) lists them. Events with no match fall
 * through to a "More in <cityName>" section, last.
 */
export const groupByNeighborhood = <T extends HasCityGuideNeighborhood>(
  items: readonly T[],
  neighborhoods: readonly CityNeighborhoodDef[],
  cityName: string
): CityEventSection<T>[] => {
  const grouped = new Map<string, T[]>()
  // Metaphysics picks a location's city from its own coordinates, so a show near a boundary can
  // carry another city's slug. Anything this city doesn't list falls back instead of vanishing.
  const known = new Set(neighborhoods.map((neighborhood) => neighborhood.slug))

  items.forEach((item) => {
    const slug = item.location?.cityGuideNeighborhood?.slug
    const sectionId = slug && known.has(slug) ? slug : FALLBACK_SECTION_ID
    grouped.set(sectionId, [...(grouped.get(sectionId) ?? []), item])
  })

  const sections = neighborhoods
    .filter((neighborhood) => grouped.has(neighborhood.slug))
    .map((neighborhood) => ({
      id: neighborhood.slug,
      title: neighborhood.name,
      items: grouped.get(neighborhood.slug) as T[],
    }))

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
