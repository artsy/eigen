interface WithCounts {
  readonly stopsCount?: number | null
  readonly sections?: readonly { readonly stopsCount: number }[] | null
}

/**
 * How many stops an itinerary has, or `undefined` when nothing knows.
 *
 * `Itinerary.stopsCount` is the answer when present. It is nullable because Gravity's listing
 * endpoint only began sending it recently, and the `sections` fallback cannot cover that case:
 * the listing serializes at `:short`, which omits sections entirely, so a listed itinerary has
 * neither. Returning `undefined` there lets callers omit the line rather than claim zero.
 */
export const itineraryStopsCount = (itinerary: WithCounts) => {
  if (itinerary.stopsCount != null) return itinerary.stopsCount

  const sections = itinerary.sections

  if (!sections?.length) return undefined

  return sections.reduce((total, section) => total + section.stopsCount, 0)
}
