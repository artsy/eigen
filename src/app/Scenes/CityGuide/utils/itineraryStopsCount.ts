interface WithCounts {
  readonly stopsCount?: number | null
  readonly sections?: readonly { readonly stopsCount: number }[] | null
}

/**
 * How many stops an itinerary has, or `undefined` when nothing knows — a listing serializes
 * at `:short`, which omits both `stopsCount` and `sections`, so callers can omit the line.
 */
export const itineraryStopsCount = (itinerary: WithCounts) => {
  if (itinerary.stopsCount != null) return itinerary.stopsCount

  const sections = itinerary.sections

  if (!sections?.length) return undefined

  return sections.reduce((total, section) => total + section.stopsCount, 0)
}
