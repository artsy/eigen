import { Action, action, createContextStore } from "easy-peasy"

interface HomeViewStoreModel {
  trackedSections: string[]
  trackedSectionTypes: string[]
  trackedExperiments: string[]
  visibleSections: string[]

  addTrackedSection: Action<this, string>
  addTrackedSectionTypes: Action<this, string>
  addTrackedExperiment: Action<this, string>
  setVisibleSections: Action<this, string[]>
}

const HomeViewStoreModel: HomeViewStoreModel = {
  trackedSections: [],
  trackedSectionTypes: [],
  trackedExperiments: [],
  visibleSections: [],

  addTrackedSection: action((state, payload) => {
    if (state.trackedSections.includes(payload)) {
      return
    }
    state.trackedSections.push(payload)
  }),
  addTrackedSectionTypes: action((state, payload) => {
    if (state.trackedSectionTypes.includes(payload)) {
      return
    }
    state.trackedSectionTypes.push(payload)
  }),
  addTrackedExperiment: action((state, payload) => {
    if (state.trackedExperiments.includes(payload)) {
      return
    }
    state.trackedExperiments.push(payload)
  }),
  setVisibleSections: action((state, payload) => {
    state.visibleSections = payload
  }),
}

export const HomeViewStore = createContextStore(HomeViewStoreModel)

export const HomeViewStoreProvider = HomeViewStore.Provider
