import { Action, action, createContextStore } from "easy-peasy"

export type FavoritesTab = "saves" | "follows" | "alerts"

export interface FavoritesContextStoreModel {
  activeTab: FavoritesTab
  setActiveTab: Action<this, FavoritesTab>
}

export const FavoritesContextStore = createContextStore<FavoritesContextStoreModel>({
  activeTab: "saves",
  setActiveTab: action((state, payload) => {
    state.activeTab = payload
  }),
})
