import { ItineraryScreenQuery$data } from "__generated__/ItineraryScreenQuery.graphql"
import { itineraryFromQuery } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryFromQuery"

type QueryItinerary = NonNullable<ItineraryScreenQuery$data["itinerary"]>
type QueryStop = QueryItinerary["sections"][number]["stops"][number]

const stop = (overrides: Partial<QueryStop>): QueryStop =>
  ({
    internalID: "stop-1",
    title: "Stop title",
    address: null,
    category: "GALLERY",
    note: null,
    isFreeAdmission: null,
    sourceURL: null,
    eventType: null,
    image: null,
    event: null,
    latitude: null,
    longitude: null,
    startTime: null,
    endTime: null,
    startAtISO: null,
    endAtISO: null,
    item: null,
    ...overrides,
  }) as QueryStop

const itinerary = (stops: QueryStop[]): QueryItinerary =>
  ({
    internalID: "guide",
    isCurated: true,
    citySlug: "london-united-kingdom",
    title: "Guide",
    subtitle: null,
    description: null,
    authorName: null,
    heroImage: null,
    sections: [{ internalID: "day-1", title: "Day 1", stops }],
  }) as QueryItinerary

const firstStop = (stops: QueryStop[]) => itineraryFromQuery(itinerary(stops)).sections[0].stops[0]

// A stop only carries coordinates when a curator typed them in, so a stop the app created
// from a show, fair or gallery would otherwise never reach the map.
describe("a stop's coordinates", () => {
  it("prefers the stop's own over the item's", () => {
    const result = firstStop([
      stop({
        latitude: 51.5,
        longitude: -0.1,
        item: {
          __typename: "Show",
          location: { coordinates: { lat: 40, lng: -70 } },
        } as QueryStop["item"],
      }),
    ])

    expect(result.coordinates).toEqual({ lat: 51.5, lng: -0.1 })
  })

  it("falls back to a show's location", () => {
    const result = firstStop([
      stop({
        item: {
          __typename: "Show",
          location: { coordinates: { lat: 51.52, lng: -0.09 } },
        } as QueryStop["item"],
      }),
    ])

    expect(result.coordinates).toEqual({ lat: 51.52, lng: -0.09 })
  })

  it("falls back to a fair's location", () => {
    const result = firstStop([
      stop({
        item: {
          __typename: "Fair",
          location: { coordinates: { lat: 51.53, lng: -0.08 } },
        } as QueryStop["item"],
      }),
    ])

    expect(result.coordinates).toEqual({ lat: 51.53, lng: -0.08 })
  })

  it("falls back to a gallery's own coordinates", () => {
    const result = firstStop([
      stop({
        item: {
          __typename: "Location",
          coordinates: { lat: 51.54, lng: -0.07 },
        } as QueryStop["item"],
      }),
    ])

    expect(result.coordinates).toEqual({ lat: 51.54, lng: -0.07 })
  })

  // Left undefined rather than defaulted to 0,0 — the Gulf of Guinea is not a plausible
  // London stop, and the map filters on this being present.
  it("leaves a half-placed item unmapped", () => {
    const result = firstStop([
      stop({
        item: {
          __typename: "Show",
          location: { coordinates: { lat: 51.5, lng: null } },
        } as QueryStop["item"],
      }),
    ])

    expect(result.coordinates).toBeUndefined()
  })

  it("leaves a stop with no item unmapped", () => {
    expect(firstStop([stop({})]).coordinates).toBeUndefined()
  })
})
