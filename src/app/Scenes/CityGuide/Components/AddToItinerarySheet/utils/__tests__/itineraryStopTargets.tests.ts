import {
  PayloadItinerary,
  findStopForTarget,
  itinerariesHoldingTarget,
  selectionChanges,
} from "app/Scenes/CityGuide/Components/AddToItinerarySheet/utils/itineraryStopTargets"

const itinerary = (internalID: string, stops: object[]): PayloadItinerary =>
  ({
    internalID,
    title: internalID,
    sections: [{ internalID: `${internalID}-my-stops`, title: "My Stops", stops }],
  }) as PayloadItinerary

const showStop = (stopId: string, showId: string) => ({
  internalID: stopId,
  item: { __typename: "Show", internalID: showId },
})

describe("findStopForTarget", () => {
  // Metaphysics has no "is this on my itinerary" field, so the sheet works it out itself.
  it("finds the stop pointing at the entity", () => {
    const result = findStopForTarget(itinerary("a", [showStop("stop-1", "show-1")]), {
      itemType: "SHOW",
      itemID: "show-1",
    })

    expect(result?.internalID).toBe("stop-1")
  })

  it("ignores a stop of another type with the same id", () => {
    const result = findStopForTarget(
      itinerary("a", [{ internalID: "stop-1", item: { __typename: "Fair", internalID: "x-1" } }]),
      { itemType: "SHOW", itemID: "x-1" }
    )

    expect(result).toBeUndefined()
  })

  it("ignores a custom stop, which points at nothing", () => {
    const result = findStopForTarget(itinerary("a", [{ internalID: "stop-1", item: null }]), {
      itemType: "SHOW",
      itemID: "show-1",
    })

    expect(result).toBeUndefined()
  })

  it("looks through every section", () => {
    const withDays = {
      internalID: "a",
      title: "A",
      sections: [
        { internalID: "day-1", title: "Day 1", stops: [] },
        { internalID: "my-stops", title: "My Stops", stops: [showStop("stop-9", "show-1")] },
      ],
    } as PayloadItinerary

    expect(findStopForTarget(withDays, { itemType: "SHOW", itemID: "show-1" })?.internalID).toBe(
      "stop-9"
    )
  })
})

describe("itinerariesHoldingTarget", () => {
  it("lists only the itineraries holding the entity", () => {
    const result = itinerariesHoldingTarget(
      [
        itinerary("a", [showStop("stop-1", "show-1")]),
        itinerary("b", []),
        itinerary("c", [showStop("stop-2", "show-1")]),
      ],
      { itemType: "SHOW", itemID: "show-1" }
    )

    expect(result).toEqual(["a", "c"])
  })

  it("uses the membership itineraries returned with the stop", () => {
    const result = itinerariesHoldingTarget(
      [itinerary("a", []), itinerary("b", []), itinerary("c", [])],
      {
        itemType: "SHOW",
        itemID: "show-1",
        myItineraries: [{ internalID: "b" }],
      }
    )

    expect(result).toEqual(["b"])
  })
})

describe("selectionChanges", () => {
  // A row nobody touched must fire no mutation, or Done would re-add what is already there.
  it("reports only what changed", () => {
    expect(selectionChanges(["a", "b"], ["b", "c"])).toEqual({ added: ["c"], removed: ["a"] })
  })

  it("reports nothing when the ticks are untouched", () => {
    expect(selectionChanges(["a", "b"], ["a", "b"])).toEqual({ added: [], removed: [] })
  })
})
