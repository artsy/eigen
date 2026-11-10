import { Action, action, createContextStore } from "easy-peasy"

export interface SellFlowStoreModel {
  activeArtworkID: string | null
  setActiveArtworkID: Action<this, string>
}

export const sellFlowStoreModel: SellFlowStoreModel = {
  activeArtworkID: null,
  setActiveArtworkID: action((state, artworkID) => {
    state.activeArtworkID = artworkID
  }),
}

export const SellFlowStore = createContextStore<SellFlowStoreModel>((injections) => ({
  ...sellFlowStoreModel,
  ...injections,
}))
