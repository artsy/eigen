import { FollowOption } from "app/Scenes/Favorites/FollowsTab"
import { Action, action, createContextStore } from "easy-peasy"

export type FavoritesTab = "saves" | "follows" | "alerts"

export interface FavoritesContextStoreModel {
  activeTab: FavoritesTab
  headerHeight: number
  showFollowsBottomSheet: boolean
  followOption: FollowOption

  setActiveTab: Action<this, FavoritesTab>
  setHeaderHeight: Action<this, number>
  setShowFollowsBottomSheet: Action<this, boolean>
  setFollowOption: Action<this, FollowOption>
}

export const FavoritesContextStore = createContextStore<FavoritesContextStoreModel>({
  activeTab: "saves",
  headerHeight: 0,
  showFollowsBottomSheet: false,
  followOption: "artists",

  setActiveTab: action((state, payload) => {
    state.activeTab = payload
  }),
  setHeaderHeight: action((state, payload) => {
    state.headerHeight = payload
  }),
  setShowFollowsBottomSheet: action((state, payload) => {
    state.showFollowsBottomSheet = payload
  }),
  setFollowOption: action((state, payload) => {
    state.followOption = payload
  }),
})
