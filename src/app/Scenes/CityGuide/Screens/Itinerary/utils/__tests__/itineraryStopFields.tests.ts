import { makeItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/__tests__/itineraryTestFixtures"
import {
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

describe("itineraryStopDisplayTime", () => {
  it("shows only the date range for a whole-day stop spanning multiple days", () => {
    expect(
      itineraryStopDisplayTime(
        stop({
          startAtISO: "2026-09-24T00:00:00.000Z",
          endAtISO: "2026-09-27T23:59:00.000Z",
          timeZone: "utc",
        })
      )
    ).toEqual("Sep 24 – 27")
  })

  it("shows a single date for a whole-day stop lasting one day", () => {
    expect(
      itineraryStopDisplayTime(
        stop({
          startAtISO: "2026-09-24T00:00:00.000Z",
          endAtISO: "2026-09-24T23:59:00.000Z",
          timeZone: "utc",
        })
      )
    ).toEqual("Sep 24")
  })

  it("spells out the month on both ends when a whole-day stop crosses a month boundary", () => {
    expect(
      itineraryStopDisplayTime(
        stop({
          startAtISO: "2026-09-30T00:00:00.000Z",
          endAtISO: "2026-10-02T23:59:00.000Z",
          timeZone: "utc",
        })
      )
    ).toEqual("Sep 30 – Oct 2")
  })

  it("checks the whole-day window against the stop's own time zone, not UTC", () => {
    // 00:00-23:59 in New York is 04:00-03:59 the next day in UTC — not whole-day by a naive UTC check.
    expect(
      itineraryStopDisplayTime(
        stop({
          startAtISO: "2026-09-24T04:00:00.000Z",
          endAtISO: "2026-09-25T03:59:00.000Z",
          timeZone: "America/New_York",
        })
      )
    ).toEqual("Sep 24")
  })

  it("shows the formatted hours for a normal timed range, unchanged", () => {
    expect(
      itineraryStopDisplayTime(stop({ startTime: "11am", endTime: "4pm", timeZone: "utc" }))
    ).toEqual("11am-4pm")
  })

  it("shows a single formatted time when only one end is set, unchanged", () => {
    expect(itineraryStopDisplayTime(stop({ startTime: "11am", endTime: null }))).toEqual("11am")
  })

  it("shows nothing for a stop with no times at all, unchanged", () => {
    expect(itineraryStopDisplayTime(stop({ startTime: null, endTime: null }))).toEqual("")
  })
})
