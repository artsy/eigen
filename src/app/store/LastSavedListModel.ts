import { action, Action } from "easy-peasy"
import { GlobalStore } from "./GlobalStore"

export interface LastSavedList {
  internalID: string
  name: string
  default: boolean
}

export interface LastSavedListModel {
  lastSavedList: LastSavedList | null
  setLastSavedList: Action<this, LastSavedList | null>
  forgetListIfMatches: Action<this, string>
  renameListIfMatches: Action<this, { internalID: string; name: string }>
}

export const getLastSavedListModel = (): LastSavedListModel => ({
  lastSavedList: null,
  setLastSavedList: action((state, lastSavedList) => {
    state.lastSavedList = lastSavedList
  }),
  forgetListIfMatches: action((state, internalID) => {
    if (state.lastSavedList?.internalID === internalID) {
      state.lastSavedList = null
    }
  }),
  renameListIfMatches: action((state, { internalID, name }) => {
    if (state.lastSavedList?.internalID === internalID) {
      state.lastSavedList = { ...state.lastSavedList, name }
    }
  }),
})

export const useLastSavedList = () => {
  return GlobalStore.useAppState((state) => state.lastSavedList.lastSavedList)
}
