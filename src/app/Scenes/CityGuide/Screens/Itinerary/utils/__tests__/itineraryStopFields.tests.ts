import { makeItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/__tests__/itineraryTestFixtures"
import {
  formatItineraryStopOpeningHours,
  itineraryStopCoordinates,
  itineraryStopDisplayTime,
  itineraryStopOpeningHoursInput,
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

  it("shows whichever of days/hours a line has, alone, when the other is blank", () => {
    expect(formatItineraryStopOpeningHours([{ days: "Sunday", hours: null }])).toBe("Sunday")
    expect(formatItineraryStopOpeningHours([{ days: null, hours: "Closed" }])).toBe("Closed")
  })

  it("drops a line with neither field set", () => {
    expect(
      formatItineraryStopOpeningHours([
        { days: "Monday–Thursday, Saturday", hours: "10am–5pm" },
        { days: null, hours: null },
        { days: "Sunday", hours: "Closed" },
      ])
    ).toBe("Monday–Thursday, Saturday 10am–5pm\nSunday Closed")
  })
})

describe("itineraryStopOpeningHoursInput", () => {
  it("coerces a null field to an empty string", () => {
    expect(itineraryStopOpeningHoursInput([{ days: "Sunday", hours: null }])).toEqual([
      { days: "Sunday", hours: "" },
    ])
  })

  it("drops a line left entirely blank", () => {
    expect(
      itineraryStopOpeningHoursInput([
        { days: "Sat – Thurs", hours: "10am–5pm" },
        { days: null, hours: null },
      ])
    ).toEqual([{ days: "Sat – Thurs", hours: "10am–5pm" }])
  })
})

describe("itineraryStopDisplayTime", () => {
  // Switching a stop to MUSEUM/GALLERY in Forque hides the date pickers but leaves whatever
  // start/end it already had, so a stop can carry both — the lines are what the editor
  // actually meant, and win outright over the legacy time.
  it("prefers the stop's own opening-hours lines over its legacy start/end time", () => {
    expect(
      itineraryStopDisplayTime(
        stop({
          startTime: "10am",
          endTime: "5pm",
          openingHours: [{ days: "Sat – Thurs", hours: "11am–6pm" }],
        })
      )
    ).toBe("Sat – Thurs 11am–6pm")
  })

  it("prefers the curator's own start/end time over displayOpeningHours, absent any lines", () => {
    expect(
      itineraryStopDisplayTime(
        stop({
          startTime: "10am",
          endTime: "5pm",
          openingHours: [],
          displayOpeningHours: [{ days: "Sat – Thurs", hours: "10am–5pm" }],
        })
      )
    ).toBe("10am-5pm")
  })

  it("falls back to displayOpeningHours for any stop kind, not only a museum or gallery", () => {
    expect(
      itineraryStopDisplayTime(
        stop({
          category: "SHOW",
          startTime: null,
          endTime: null,
          displayOpeningHours: [
            { days: "Sat – Thurs", hours: "10am–5pm" },
            { days: "Fri", hours: "10am–8:30pm" },
          ],
        })
      )
    ).toBe("Sat – Thurs 10am–5pm\nFri 10am–8:30pm")
  })

  it("is empty when the stop has neither its own time nor any displayOpeningHours", () => {
    expect(
      itineraryStopDisplayTime(stop({ startTime: null, endTime: null, displayOpeningHours: [] }))
    ).toBe("")
  })
})
