import { MyCollectionBottomSheetModalKind } from "app/Scenes/MyCollection/Components/MyCollectionBottomSheetModals/MyCollectionBottomSheetModals"
import { Action, action, createContextStore } from "easy-peasy"

export type CollectedTab = "Artworks" | "Artists" | null

type ViewPayload =
  | {
      viewKind: "Add" | null
    }
  | {
      viewKind: "Artist"
      id: string
      artworksCount: number | null
    }
export interface MyCollectionTabsStoreModel {
  selectedTab: CollectedTab
  viewKind: MyCollectionBottomSheetModalKind
  id: string | null
  artworksCount: number | null
  setSelectedTab: Action<this, CollectedTab>
  setViewKind: Action<this, ViewPayload>
}

export const myCollectionTabsStoreModel: MyCollectionTabsStoreModel = {
  selectedTab: null,
  viewKind: null,
  id: null,
  artworksCount: null,
  setSelectedTab: action((state, payload) => {
    state.selectedTab = payload
  }),
  setViewKind: action((state, payload) => {
    // Reset the id if the modal is closed
    switch (payload.viewKind) {
      case null:
        state.viewKind = null
        state.id = null
        break

      case "Add":
        state.viewKind = "Add"
        break

      default:
        state.viewKind = payload.viewKind
        state.id = payload.id
        state.artworksCount = payload.artworksCount
        break
    }
  }),
}

export const MyCollectionTabsStore = createContextStore((injections) => ({
  ...myCollectionTabsStoreModel,
  ...injections,
}))

export const MyCollectionTabsStoreProvider = MyCollectionTabsStore.Provider
