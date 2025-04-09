import { Action, action, createContextStore } from "easy-peasy"

export enum FavoritesTab {
  saves = "saves",
  follows = "follows",
  alerts = "alerts",
}

export type FavoritesTabType = FavoritesTab.alerts | FavoritesTab.follows | FavoritesTab.saves
export interface FavoritesContextStoreModel {
  activeTab: FavoritesTabType
  setActiveTab: Action<this, FavoritesTab>
}

export const FavoritesContextStore = createContextStore<FavoritesContextStoreModel>({
  activeTab: FavoritesTab.saves,
  setActiveTab: action((state, payload) => {
    state.activeTab = payload
  }),
})
