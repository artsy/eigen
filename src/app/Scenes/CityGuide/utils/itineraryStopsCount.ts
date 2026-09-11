interface WithSections {
  readonly sections?: readonly { readonly stopsCount: number }[] | null
}

/**
 * How many stops an itinerary has.
 *
 * Summed client-side because `Itinerary` exposes only `sectionsCount`; the count lives on each
 * section. That means rendering one number fetches every section, which is why
 * `Itinerary.stopsCount` is on the list of API asks.
 */
export const itineraryStopsCount = (itinerary: WithSections) =>
  (itinerary.sections ?? []).reduce((total, section) => total + section.stopsCount, 0)
