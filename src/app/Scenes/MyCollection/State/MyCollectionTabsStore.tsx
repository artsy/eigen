import { MyCollectionBottomSheetModalView } from "app/Scenes/MyCollection/Components/MyCollectionBottomSheetModals/MyCollectionBottomSheetModals"
import { Action, action, createContextStore } from "easy-peasy"

export type CollectedTab = "Artworks" | "Artists" | null

export interface MyCollectionTabsStoreModel {
  selectedTab: CollectedTab
  view: MyCollectionBottomSheetModalView
  setSelectedTab: Action<this, CollectedTab>
  setView: Action<this, MyCollectionBottomSheetModalView>
}

export const myCollectionTabsStoreModel: MyCollectionTabsStoreModel = {
  selectedTab: null,
  view: null,
  setSelectedTab: action((state, payload) => {
    state.selectedTab = payload
  }),
  setView: action((state, payload) => {
    state.view = payload
  }),
}

export const MyCollectionTabsStore = createContextStore((injections) => ({
  ...myCollectionTabsStoreModel,
  ...injections,
}))

export const MyCollectionTabsStoreProvider = MyCollectionTabsStore.Provider
