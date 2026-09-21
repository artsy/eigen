import {
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
