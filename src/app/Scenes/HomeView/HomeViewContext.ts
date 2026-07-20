import { Action, action, createContextStore } from "easy-peasy"

export interface HomeViewStoreModel {
  trackedSections: string[]
  trackedSectionTypes: string[]
  trackedExperiments: string[]
  viewableSections: string[]
  // Bumped to request a forced refresh of the "live" home view sections. Section-agnostic; each
  // live rail watches this key. Scoped to the HomeView provider.
  liveRefetchKey: number
  // Scope of the latest refresh request. When true (return-to-home), only rails currently in the
  // viewport should refetch. When false (pull-to-refresh), all live rails refetch.
  liveRefetchInViewportOnly: boolean

  addTrackedSection: Action<this, string>
  addTrackedSectionTypes: Action<this, string>
  addTrackedExperiment: Action<this, string>
  setViewableSections: Action<this, string[]>
  bumpLiveRefetchKey: Action<this, { inViewportOnly: boolean } | undefined>
}

export const HomeViewStoreModel: HomeViewStoreModel = {
  trackedSections: [],
  trackedSectionTypes: [],
  trackedExperiments: [],
  viewableSections: [],
  liveRefetchKey: 0,
  liveRefetchInViewportOnly: false,

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
  bumpLiveRefetchKey: action((state, payload) => {
    state.liveRefetchKey += 1
    state.liveRefetchInViewportOnly = payload?.inViewportOnly ?? false
  }),
}

export const HomeViewStore = createContextStore(HomeViewStoreModel)

export const HomeViewStoreProvider = HomeViewStore.Provider
