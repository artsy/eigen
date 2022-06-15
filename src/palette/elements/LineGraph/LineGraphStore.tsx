import { action, Action, createContextStore } from "easy-peasy"

interface ActiveIndex {
  averagePrice: string | null
  numberOfLots: number | null
  year: number | null
}

export enum Duration {
  Last3Years = "3-years",
  Last8Years = "8-years",
}

interface LineGraphStoreState {
  activeIndex: ActiveIndex
  averagePrice: string
  selectedMedium: string | null
  totalLots: number
  selectedDuration: Duration
}

export interface LineGraphStoreModel extends LineGraphStoreState {
  setSelectedMedium: Action<this, string | null>
  setActiveIndex: Action<this, ActiveIndex>
}

type StoreInitialState = Pick<LineGraphStoreState, "averagePrice" | "totalLots">

export const getToastStoreModel = ({
  averagePrice,
  totalLots,
}: StoreInitialState): LineGraphStoreModel => ({
  // State
  activeIndex: {
    averagePrice: null,
    numberOfLots: null,
    year: null,
  },
  averagePrice,
  selectedMedium: null,
  totalLots,
  selectedDuration: Duration.Last3Years,

  // Actions
  setSelectedMedium: action((state, payload) => {
    state.selectedMedium = payload
  }),
  setActiveIndex: action((state, payload) => {
    state.activeIndex = payload
  }),
})

const createLineGraphStore = () => {
  const store = createContextStore<LineGraphStoreModel, StoreInitialState>((initialData) => ({
    ...getToastStoreModel(initialData!),
  }))
  return store
}

export const LineGraphStore = createLineGraphStore()
export const LineGraphStoreProvider = LineGraphStore.Provider
