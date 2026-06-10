import { Action, action, createContextStore } from "easy-peasy"

export interface HomeViewStoreModel {
  trackedSections: string[]
  trackedSectionTypes: string[]
  trackedExperiments: string[]
  viewableSections: string[]
  // Bumped to request a forced refresh of the recommended artworks rail
  // (live recommendations). Scoped to the HomeView provider.
  recommendedArtworksRefetchKey: number

  addTrackedSection: Action<this, string>
  addTrackedSectionTypes: Action<this, string>
  addTrackedExperiment: Action<this, string>
  setViewableSections: Action<this, string[]>
  bumpRecommendedArtworksRefetchKey: Action<this>
}

export const HomeViewStoreModel: HomeViewStoreModel = {
  trackedSections: [],
  trackedSectionTypes: [],
  trackedExperiments: [],
  viewableSections: [],
  recommendedArtworksRefetchKey: 0,

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
  bumpRecommendedArtworksRefetchKey: action((state) => {
    state.recommendedArtworksRefetchKey += 1
  }),
}

export const HomeViewStore = createContextStore(HomeViewStoreModel)

export const HomeViewStoreProvider = HomeViewStore.Provider
