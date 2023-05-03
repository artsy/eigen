import { Action, action, createContextStore } from "easy-peasy"

export type CollectedTab = "Artworks" | "Artists" | null

export interface MyCollectionTabsStoreModel {
  selectedTab: CollectedTab
  setSelectedTab: Action<this, CollectedTab>
}

const myCollectionTabsStoreModel: MyCollectionTabsStoreModel = {
  selectedTab: null,
  setSelectedTab: action((state, payload) => {
    state.selectedTab = payload
  }),
}
export const MyCollectionTabsStore = createContextStore(myCollectionTabsStoreModel)

export const MyCollectionTabsStoreProvider = MyCollectionTabsStore.Provider
