import { Action, action, createContextStore } from "easy-peasy"

export interface HomeViewStoreModel {
  trackedSections: string[]
  trackedSectionTypes: string[]
  trackedExperiments: string[]
  viewableSections: string[]
  liveRefetchKey: number
  addTrackedSection: Action<this, string>
  addTrackedSectionTypes: Action<this, string>
  addTrackedExperiment: Action<this, string>
  setViewableSections: Action<this, string[]>
  bumpLiveRefetchKey: Action<this>
}

export const HomeViewStoreModel: HomeViewStoreModel = {
  trackedSections: [],
  trackedSectionTypes: [],
  trackedExperiments: [],
  viewableSections: [],
  liveRefetchKey: 0,

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
  setViewableSections: action((state, payload) => {
    state.viewableSections = payload
  }),
  bumpLiveRefetchKey: action((state) => {
    state.liveRefetchKey += 1
  }),
}

export const HomeViewStore = createContextStore(HomeViewStoreModel)

export const HomeViewStoreProvider = HomeViewStore.Provider
