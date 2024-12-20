import { action, Action, createContextStore } from "easy-peasy"

export interface InfiniteDiscoveryContextModel {
  count: number
  currentIndex: number
  goToPrevious: Action<this>
  goToNext: Action<this>
}

export const initialModel: InfiniteDiscoveryContextModel = {
  // TODO: this needs to come from the result of the query
  count: 10,
  currentIndex: 0,
  goToPrevious: action((state) => {
    if (state.currentIndex > 0) {
      state.currentIndex = state.currentIndex - 1
    }
  }),
  goToNext: action((state) => {
    if (state.currentIndex < state.count - 1) {
      state.currentIndex = state.currentIndex + 1
    }
  }),
}

export const InfiniteDiscoveryContext = createContextStore((runtimeModel) => {
  return {
    ...initialModel,
    ...runtimeModel,
  }
})
