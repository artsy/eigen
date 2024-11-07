import { Action, action, createContextStore } from "easy-peasy"

interface HomeViewStoreModel {
  trackedSections: string[]
  trackedExperiments: string[]

  addTrackedSection: Action<this, string>
  addTrackedExperiment: Action<this, string>
}

const HomeViewStoreModel: HomeViewStoreModel = {
  trackedSections: [],
  trackedExperiments: [],

  addTrackedSection: action((state, payload) => {
    if (state.trackedSections.includes(payload)) {
      return
    }
    state.trackedSections.push(payload)
  }),
  addTrackedExperiment: action((state, payload) => {
    if (state.trackedExperiments.includes(payload)) {
      return
    }
    state.trackedExperiments.push(payload)
  }),
}

export const HomeViewStore = createContextStore(HomeViewStoreModel)

export const HomeViewStoreProvider = HomeViewStore.Provider
