/**
 * How many stops an itinerary has, or `undefined` when nothing knows — a listing serializes
 * at `:short`, and older responses omit `stopsCount`, so callers can omit the line.
 */
export const itineraryStopsCount = (itinerary: { readonly stopsCount?: number | null }) =>
  itinerary.stopsCount ?? undefined
