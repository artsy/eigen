import { action, Action } from "easy-peasy"
import { GlobalStore } from "./GlobalStore"

export interface LastSavedList {
  internalID: string
  name: string
}

export interface LastSavedListModel {
  lastSavedList: LastSavedList | null
  setLastSavedList: Action<this, LastSavedList | null>
}

export const getLastSavedListModel = (): LastSavedListModel => ({
  lastSavedList: null,
  setLastSavedList: action((state, lastSavedList) => {
    state.lastSavedList = lastSavedList
  }),
})

export const useLastSavedList = () => {
  return GlobalStore.useAppState((state) => state.lastSavedList.lastSavedList)
}
