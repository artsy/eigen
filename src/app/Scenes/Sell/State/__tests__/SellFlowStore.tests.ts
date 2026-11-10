import { sellFlowStoreModel } from "app/Scenes/Sell/State/SellFlowStore"
import { createStore } from "easy-peasy"

describe("SellFlowStore", () => {
  it("keeps the condition step for the same work and clears it for a new one", () => {
    const store = createStore(sellFlowStoreModel)

    store.getActions().setActiveArtworkID("work-1")
    store.getActions().setRating("FAIR")
    store.getActions().setAskingPrice("3200")

    store.getActions().setActiveArtworkID("work-1")
    expect(store.getState().conditionStep).toMatchObject({ rating: "FAIR", askingPrice: "3200" })

    store.getActions().setActiveArtworkID("work-2")
    expect(store.getState().conditionStep).toEqual({
      rating: null,
      photos: [],
      notes: "",
      askingPrice: "",
    })
  })
})
