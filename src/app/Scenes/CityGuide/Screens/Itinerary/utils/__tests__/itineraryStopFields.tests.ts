import { makeItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/__tests__/itineraryTestFixtures"
import {
  formatItineraryStopOpeningHours,
  itineraryStopCoordinates,
  itineraryStopDisplayTime,
} from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryStopFields"
import { ItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"

const stop = (overrides: Record<string, unknown> = {}) => makeItineraryStop(overrides)

describe("itineraryStopCoordinates", () => {
  it("prefers the stop's own over the item's", () => {
    expect(
      itineraryStopCoordinates(
        stop({
          latitude: 51.5,
          longitude: -0.1,
          item: {
            __typename: "Show",
            location: { coordinates: { lat: 40, lng: -70 } },
          } as ItineraryStop["item"],
        })
      )
    ).toEqual({ lat: 51.5, lng: -0.1 })
  })

  it("falls back to a show's location", () => {
    expect(
      itineraryStopCoordinates(
        stop({
          item: {
            __typename: "Show",
            location: { coordinates: { lat: 51.52, lng: -0.09 } },
          } as ItineraryStop["item"],
        })
      )
    ).toEqual({ lat: 51.52, lng: -0.09 })
  })

  it("falls back to a fair's location", () => {
    expect(
      itineraryStopCoordinates(
        stop({
          item: {
            __typename: "Fair",
            location: { coordinates: { lat: 51.53, lng: -0.08 } },
          } as ItineraryStop["item"],
        })
      )
    ).toEqual({ lat: 51.53, lng: -0.08 })
  })

  it("falls back to a gallery's own coordinates", () => {
    expect(
      itineraryStopCoordinates(
        stop({
          item: {
            __typename: "Location",
            coordinates: { lat: 51.54, lng: -0.07 },
          } as ItineraryStop["item"],
        })
      )
    ).toEqual({ lat: 51.54, lng: -0.07 })
  })

  // Left undefined rather than defaulted to 0,0 — the Gulf of Guinea is not a plausible
  // London stop, and the map filters on this being present.
  it("leaves a half-placed item unmapped", () => {
    expect(
      itineraryStopCoordinates(
        stop({
          item: {
            __typename: "Show",
            location: { coordinates: { lat: 51.5, lng: null } },
          } as ItineraryStop["item"],
        })
      )
    ).toBeUndefined()
  })

  it("leaves a stop with no item unmapped", () => {
    expect(itineraryStopCoordinates(stop({}))).toBeUndefined()
  })
})

describe("formatItineraryStopOpeningHours", () => {
  it("puts each day's hours on its own line", () => {
    expect(
      formatItineraryStopOpeningHours([
        { days: "Sat – Thurs", hours: "10am–5pm" },
        { days: "Fri", hours: "10am–8:30pm" },
      ])
    ).toBe("Sat – Thurs 10am–5pm\nFri 10am–8:30pm")
  })
})

describe("itineraryStopDisplayTime", () => {
  it("shows a museum's weekly opening hours over its own start/end time", () => {
    expect(
      itineraryStopDisplayTime(
        stop({
          category: "MUSEUM",
          startTime: "10am",
          endTime: "5pm",
          openingHours: [
            { days: "Sat – Thurs", hours: "10am–5pm" },
            { days: "Fri", hours: "10am–8:30pm" },
          ],
        })
      )
    ).toBe("Sat – Thurs 10am–5pm\nFri 10am–8:30pm")
  })

  it("shows a gallery's weekly opening hours over its own start/end time", () => {
    expect(
      itineraryStopDisplayTime(
        stop({
          category: "GALLERY",
          openingHours: [{ days: "Tues – Sat", hours: "11am–6pm" }],
        })
      )
    ).toBe("Tues – Sat 11am–6pm")
  })

  it("falls back to start/end time when a museum has no opening hours on file", () => {
    expect(
      itineraryStopDisplayTime(
        stop({ category: "MUSEUM", startTime: "10am", endTime: "5pm", openingHours: [] })
      )
    ).toBe("10am-5pm")
  })

  it("ignores opening hours for a stop type that isn't a museum or gallery", () => {
    expect(
      itineraryStopDisplayTime(
        stop({
          category: "SHOW",
          startTime: "11am",
          endTime: "4pm",
          openingHours: [{ days: "Sat – Thurs", hours: "10am–5pm" }],
        })
      )
    ).toBe("11am-4pm")
  })
})
