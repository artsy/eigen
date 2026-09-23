import { makeItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/__tests__/itineraryTestFixtures"
import {
  itineraryStopCoordinates,
  itineraryStopDisplayTime,
} from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryStopFields"
import { ItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"

const stop = (overrides: Record<string, unknown> = {}) => makeItineraryStop(overrides)

describe("itineraryStopDisplayTime", () => {
  it("trims a zero minute off each end, but keeps a non-zero one", () => {
    expect(itineraryStopDisplayTime(stop({ startTime: "11:00am", endTime: "6:40pm" }))).toEqual(
      "11am-6:40pm"
    )
  })

  it("trims a zero minute for both ends of a whole-hour range", () => {
    expect(itineraryStopDisplayTime(stop({ startTime: "8:00pm", endTime: "11:00pm" }))).toEqual(
      "8pm-11pm"
    )
  })
})

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
