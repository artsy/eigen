import { MyCollectionBottomSheetModalKind } from "app/Scenes/MyCollection/Components/MyCollectionBottomSheetModals/MyCollectionBottomSheetModals"
import { Action, action, createContextStore } from "easy-peasy"

export type CollectedTab = "Artworks" | "Artists" | null

type ViewPayload =
  | {
      viewKind: "Add" | null
    }
  | {
      viewKind: "Artist"
      artistId: string
      interestId: string
    }

export type MyCollectionNavigationTab = "Artworks" | "Artists" | "Insights"
export interface MyCollectionTabsStoreModel {
  activeNavigationTab: MyCollectionNavigationTab
  selectedTab: CollectedTab
  viewKind: MyCollectionBottomSheetModalKind
  artistId: string | null
  interestId: string | null
  setSelectedTab: Action<this, CollectedTab>
  setViewKind: Action<this, ViewPayload>
  setActiveNavigationTab: Action<this, MyCollectionNavigationTab>
}

export const myCollectionTabsStoreModel: MyCollectionTabsStoreModel = {
  activeNavigationTab: "Artworks",
  selectedTab: null,
  viewKind: null,
  artistId: null,
  interestId: null,
  setSelectedTab: action((state, payload) => {
    state.selectedTab = payload
  }),
  setViewKind: action((state, payload) => {
    // Reset the id if the modal is closed
    switch (payload.viewKind) {
      case null:
        state.viewKind = null
        state.interestId = null
        state.artistId = null
        break

      case "Add":
        state.viewKind = "Add"
        break

      default:
        state.viewKind = payload.viewKind
        state.artistId = payload.artistId
        state.interestId = payload.interestId
        break
    }
  }),
  setActiveNavigationTab: action((state, payload) => {
    state.activeNavigationTab = payload
  }),
}

export const MyCollectionTabsStore = createContextStore((injections) => ({
  ...myCollectionTabsStoreModel,
  ...injections,
}))

export const MyCollectionTabsStoreProvider = MyCollectionTabsStore.Provider
