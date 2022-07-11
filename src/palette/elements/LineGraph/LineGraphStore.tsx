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
  availableMediums: string[]
  averagePrice: string
  selectedMedium: string
  totalLots: number
  selectedDuration: Duration
}

export interface LineGraphStoreModel extends LineGraphStoreState {
  setSelectedMedium: Action<this, string>
  setActiveIndex: Action<this, ActiveIndex>
  setSelectedDuration: Action<this, Duration>
}

type StoreInitialState = Pick<
  LineGraphStoreState,
  "averagePrice" | "availableMediums" | "totalLots"
>

export const getToastStoreModel = ({
  availableMediums,
  averagePrice,
  totalLots,
}: StoreInitialState): LineGraphStoreModel => ({
  // State
  activeIndex: {
    averagePrice: null,
    numberOfLots: null,
    year: null,
  },
  availableMediums,
  averagePrice,
  selectedMedium: "All",
  totalLots,
  selectedDuration: Duration.Last3Years,

  // Actions
  setSelectedMedium: action((state, payload) => {
    state.selectedMedium = payload
  }),
  setActiveIndex: action((state, payload) => {
    state.activeIndex = payload
  }),
  setSelectedDuration: action((state, payload) => {
    state.selectedDuration = payload
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
