import { Action, action, createContextStore } from "easy-peasy"

interface HomeViewStoreModel {
  trackedSections: string[]

  addTrackedSection: Action<this, string>
}

const HomeViewStoreModel: HomeViewStoreModel = {
  trackedSections: [],

  addTrackedSection: action((state, payload) => {
    if (state.trackedSections.includes(payload)) {
      return
    }
    state.trackedSections.push(payload)
  }),
}

export const HomeViewStore = createContextStore(HomeViewStoreModel)

export const HomeViewStoreProvider = HomeViewStore.Provider
