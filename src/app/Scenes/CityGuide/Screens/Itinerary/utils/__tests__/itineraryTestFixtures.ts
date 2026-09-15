import {
  Itinerary,
  ItineraryStop,
} from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"

/** Minimal GraphQL-shaped stop for unit tests. Cast keeps fixtures terse. */
export const makeItineraryStop = (overrides: Record<string, unknown> = {}): ItineraryStop =>
  ({
    internalID: "stop-1",
    title: "Stop title",
    address: null,
    category: null,
    note: null,
    isFreeAdmission: null,
    sourceURL: null,
    eventType: null,
    image: { url: "https://example.com/stop.jpg" },
    event: null,
    latitude: null,
    longitude: null,
    startTime: "10am",
    endTime: "6pm",
    startAtISO: null,
    endAtISO: null,
    item: null,
    ...overrides,
  }) as ItineraryStop

export const makeItinerary = (
  stops: ItineraryStop[],
  overrides: Record<string, unknown> = {}
): Itinerary =>
  ({
    internalID: "itinerary-1",
    citySlug: "london-united-kingdom",
    isCurated: true,
    title: "Test Itinerary",
    sections: [{ internalID: "day-1", title: "Day 1", stops }],
    ...overrides,
  }) as unknown as Itinerary
