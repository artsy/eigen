import {
  heldCount,
  selectionChanges,
  stopMutationInput,
} from "app/Scenes/CityGuide/Components/AddToItinerarySheet/utils/itineraryStopTargets"

describe("selectionChanges", () => {
  // A row nobody touched must fire no mutation, or Done would re-add what is already there.
  it("reports only what changed", () => {
    expect(selectionChanges(["a", "b"], ["b", "c"])).toEqual({ added: ["c"], removed: ["a"] })
  })

  it("reports nothing when the ticks are untouched", () => {
    expect(selectionChanges(["a", "b"], ["a", "b"])).toEqual({ added: [], removed: [] })
  })
})

describe("stopMutationInput", () => {
  // The landmine: these two are membership hints for the sheet's own UI, never fields
  // `createItineraryStopInput`/`CustomStopInput` accept — a real mutation would 400 if they
  // ever leaked through.
  it("strips isOnMyItineraries and myItineraries", () => {
    expect(
      stopMutationInput({
        itemType: "SHOW",
        itemID: "show-1",
        isOnMyItineraries: true,
        myItineraries: [{ internalID: "a" }],
      })
    ).toEqual({ itemType: "SHOW", itemID: "show-1" })
  })

  // Also a landmine: `itemSlug` is for `addedStopToItinerary`'s tracking only.
  it("strips itemSlug", () => {
    expect(
      stopMutationInput({
        itemType: "SHOW",
        itemID: "show-1",
        itemSlug: "frida-kahlo",
      })
    ).toEqual({ itemType: "SHOW", itemID: "show-1" })
  })

  it("leaves every other field untouched", () => {
    expect(
      stopMutationInput({
        title: "Coffee at London Cafe",
        sourceStopID: "source-stop",
        sourceShareToken: "source-token",
        address: "12 Bermondsey Street",
      })
    ).toEqual({
      title: "Coffee at London Cafe",
      sourceStopID: "source-stop",
      sourceShareToken: "source-token",
      address: "12 Bermondsey Street",
    })
  })
})

describe("heldCount", () => {
  const target = (itineraryIDs: string[]) => ({
    itemType: "SHOW" as const,
    itemID: "show-1",
    myItineraries: itineraryIDs.map((internalID) => ({ internalID })),
  })

  it("counts only the targets that name this itinerary", () => {
    expect(heldCount([target(["a"]), target(["b"]), target(["a", "b"])], "a")).toBe(2)
  })

  it("is zero when nothing names this itinerary", () => {
    expect(heldCount([target(["b"])], "a")).toBe(0)
  })

  it("is zero for a target with no membership data at all", () => {
    expect(heldCount([{ itemType: "SHOW", itemID: "show-1" }], "a")).toBe(0)
  })
})
