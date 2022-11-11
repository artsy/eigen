import { action, Action, createContextStore, State } from "easy-peasy"

interface ArtworkModel {
  auctionState: string | null
  selectedEditionId: string | null
  bottomStickyContentHeight: number
  setAuctionState: Action<this, string | null>
  setSelectedEditionId: Action<this, string | null>
}

export type ArtworkState = State<ArtworkModel>

const artworkModel: ArtworkModel = {
  auctionState: null,
  selectedEditionId: null,
  bottomStickyContentHeight: 0,
  setAuctionState: action((state, payload) => {
    state.auctionState = payload
  }),
  setSelectedEditionId: action((state, payload) => {
    state.selectedEditionId = payload
  }),
}

export const ArtworkStore = createContextStore<ArtworkModel>(
  (initialData: ArtworkModel) => ({
    ...artworkModel,
    ...initialData,
  }),
  { name: "SavedSearchStore" }
)

export const ArtworkStoreProvider = ArtworkStore.Provider
