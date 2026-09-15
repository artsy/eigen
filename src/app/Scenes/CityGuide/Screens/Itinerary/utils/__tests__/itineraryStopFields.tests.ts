import { makeItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/__tests__/itineraryTestFixtures"
import { itineraryStopCoordinates } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryStopFields"
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
