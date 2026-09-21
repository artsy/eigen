import {
  makeItinerary,
  makeItineraryStop,
} from "app/Scenes/CityGuide/Screens/Itinerary/utils/__tests__/itineraryTestFixtures"
import {
  itineraryStopTarget,
  itineraryStopTargets,
} from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryStopTarget"
import { ItineraryStop } from "app/Scenes/CityGuide/Screens/Itinerary/utils/itineraryTypes"

describe("itineraryStopTarget", () => {
  it("targets a show's item, carrying the stop's own membership and share token along", () => {
    expect(
      itineraryStopTarget(
        makeItineraryStop({
          internalID: "stop-1",
          isOnMyItineraries: true,
          myItineraries: [{ internalID: "a" }],
          item: { __typename: "Show", internalID: "show-1", name: "A great show" },
        }),
        "share-token"
      )
    ).toEqual({
      itemType: "SHOW",
      itemID: "show-1",
      isOnMyItineraries: true,
      myItineraries: [{ internalID: "a" }],
      sourceStopID: "stop-1",
      sourceShareToken: "share-token",
    })
  })

  it("copies a custom stop's own fields rather than pointing at an entity", () => {
    expect(
      itineraryStopTarget(
        makeItineraryStop({
          internalID: "stop-2",
          title: "Coffee at London Cafe",
          address: "12 Bermondsey Street",
          note: "Great flat white",
          sourceURL: "https://example.com",
          category: "MUSEUM",
          isFreeAdmission: true,
          latitude: 51.5,
          longitude: -0.1,
          item: null,
        }),
        "share-token"
      )
    ).toEqual({
      sourceStopID: "stop-2",
      sourceShareToken: "share-token",
      isOnMyItineraries: undefined,
      myItineraries: undefined,
      title: "Coffee at London Cafe",
      address: "12 Bermondsey Street",
      note: "Great flat white",
      sourceURL: "https://example.com",
      category: "MUSEUM",
      isFreeAdmission: true,
      latitude: 51.5,
      longitude: -0.1,
    })
  })

  // A stop whose entity didn't resolve (a server-side member this client doesn't know) has
  // nothing to point at and no fields of its own — `ItineraryStopRow` renders no plus for one.
  it("is null for a stop with an unresolved entity", () => {
    expect(
      itineraryStopTarget(
        makeItineraryStop({
          item: { __typename: "%other" } as unknown as ItineraryStop["item"],
        })
      )
    ).toBeNull()
  })
})

describe("itineraryStopTargets", () => {
  it("flattens every section's stops, in reading order, skipping unresolved ones", () => {
    const itinerary = makeItinerary([], {
      sections: [
        {
          internalID: "day-1",
          title: "Day 1",
          stops: [
            makeItineraryStop({
              internalID: "stop-1",
              item: { __typename: "Show", internalID: "show-1", name: "First" },
            }),
            makeItineraryStop({
              internalID: "stop-2",
              item: { __typename: "%other" } as unknown as ItineraryStop["item"],
            }),
          ],
        },
        {
          internalID: "day-2",
          title: "Day 2",
          stops: [
            makeItineraryStop({
              internalID: "stop-3",
              item: { __typename: "Fair", internalID: "fair-1", name: "Second" },
            }),
          ],
        },
      ],
    })

    const targets = itineraryStopTargets(itinerary.sections, "share-token")

    expect(targets).toHaveLength(2)
    expect(targets[0]).toMatchObject({ itemType: "SHOW", itemID: "show-1" })
    expect(targets[1]).toMatchObject({ itemType: "FAIR", itemID: "fair-1" })
  })
})
