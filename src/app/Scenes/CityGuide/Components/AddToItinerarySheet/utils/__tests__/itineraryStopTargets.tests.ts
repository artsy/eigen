import { selectionChanges } from "app/Scenes/CityGuide/Components/AddToItinerarySheet/utils/itineraryStopTargets"

describe("selectionChanges", () => {
  // A row nobody touched must fire no mutation, or Done would re-add what is already there.
  it("reports only what changed", () => {
    expect(selectionChanges(["a", "b"], ["b", "c"])).toEqual({ added: ["c"], removed: ["a"] })
  })

  it("reports nothing when the ticks are untouched", () => {
    expect(selectionChanges(["a", "b"], ["a", "b"])).toEqual({ added: [], removed: [] })
  })
})
