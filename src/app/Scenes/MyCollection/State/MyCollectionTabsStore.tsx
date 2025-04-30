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
  artistId: string | null
  filtersCount: number
  interestId: string | null
  isFilterModalVisible: boolean
  selectedTab: CollectedTab
  setActiveNavigationTab: Action<this, MyCollectionNavigationTab>
  setFiltersCount: Action<this, number>
  setIsFilterModalVisible: Action<this, boolean>
  setSelectedTab: Action<this, CollectedTab>
  setViewKind: Action<this, ViewPayload>
  viewKind: MyCollectionBottomSheetModalKind
}

export const myCollectionTabsStoreModel: MyCollectionTabsStoreModel = {
  activeNavigationTab: "Artworks",
  artistId: null,
  filtersCount: 0,
  interestId: null,
  isFilterModalVisible: false,
  selectedTab: null,
  viewKind: null,
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
  setIsFilterModalVisible: action((state, payload) => {
    state.isFilterModalVisible = payload
  }),
  setFiltersCount: action((state, payload) => {
    state.filtersCount = payload
  }),
}

export const MyCollectionTabsStore = createContextStore((injections) => ({
  ...myCollectionTabsStoreModel,
  ...injections,
}))

export const MyCollectionTabsStoreProvider = MyCollectionTabsStore.Provider
