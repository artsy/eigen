import { action, Action, createContextStore, State } from "easy-peasy"

export interface ArtworkStoreModel {
  auctionState: string | null
  selectedEditionId: string | null
  setAuctionState: Action<this, string | null>
  setSelectedEditionId: Action<this, string | null>
}

export type ArtworkStoreState = State<ArtworkStoreModel>

const artworkModel: ArtworkStoreModel = {
  auctionState: null,
  selectedEditionId: null,
  setAuctionState: action((state, payload) => {
    state.auctionState = payload
  }),
  setSelectedEditionId: action((state, payload) => {
    state.selectedEditionId = payload
  }),
}

export const ArtworkStore = createContextStore<ArtworkStoreModel>(
  (initialData: ArtworkStoreModel) => ({
    ...artworkModel,
    ...initialData,
  }),
  { name: "ArtworkStore" }
)

export const ArtworkStoreProvider = ArtworkStore.Provider
