import { Action, action, createContextStore } from "easy-peasy"

export type FavoritesTab = "saves" | "follows" | "alerts"

export interface FavoritesContextStoreModel {
  activeTab: FavoritesTab
  headerHeight: number

  setActiveTab: Action<this, FavoritesTab>
  setHeaderHeight: Action<this, number>
}

export const FavoritesContextStore = createContextStore<FavoritesContextStoreModel>({
  activeTab: "saves",
  headerHeight: 0,
  setActiveTab: action((state, payload) => {
    state.activeTab = payload
  }),
  setHeaderHeight: action((state, payload) => {
    state.headerHeight = payload
  }),
})
