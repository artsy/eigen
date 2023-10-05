import { Aggregations } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { NewFilterData } from "app/Components/NewArtworkFilter/helpers"
import { assignDeep } from "app/store/persistence"
import { Action, Computed, action, computed, createContextStore } from "easy-peasy"

export interface NewArtworkFilterStoreModel {
  /********************************************************/
  /** State **/
  /********************************************************/

  // A list of filters that are already applied to the current filter state
  appliedFilters: NewFilterData[]
  // A list of filters that have been selected but not yet applied
  notAppliedFilters: NewFilterData[]
  // A combination of applied and not applied filters
  allFilters: Computed<this, NewFilterData[]>

  // An aray representing the available aggregations with the initial set of applied filters
  aggregations: Aggregations

  /********************************************************/
  /** Actions **/
  /********************************************************/

  // Add non applied filters to the list of applied filters

  applyFiltersAction: Action<this>
  // Remove all applied and non applied filters
  clearAllFiltersAction: Action<this>
  // Add a new filter to the list of not applied filters
  selectFilterAction: Action<this, NewFilterData>
  // Set filter aggregations
  setAggregationsAction: Action<this, any>
}

export const getNewArtworkFilterStoreModel = (): NewArtworkFilterStoreModel => ({
  /********************************************************/
  /** State **/
  /********************************************************/

  appliedFilters: [],
  notAppliedFilters: [],
  allFilters: computed((state) => [...state.appliedFilters, ...state.notAppliedFilters]),
  aggregations: [],

  /********************************************************/
  /** Actions **/
  /********************************************************/

  applyFiltersAction: action((state) => {
    state.appliedFilters = [...state.appliedFilters, ...state.notAppliedFilters]
    state.notAppliedFilters = []
  }),
  clearAllFiltersAction: action((state) => {
    state.appliedFilters = []
    state.notAppliedFilters = []
  }),
  selectFilterAction: action((state, filter) => {
    state.notAppliedFilters = [...state.notAppliedFilters, filter]
  }),
  setAggregationsAction: action((state, aggregations) => {
    state.aggregations = aggregations
  }),
})

export function createArtworkFiltersStore() {
  if (__TEST__) {
    ;(getNewArtworkFilterStoreModel() as any).__injectState = action((state, injectedState) => {
      assignDeep(state, injectedState)
    })
  }
  const store = createContextStore<NewArtworkFilterStoreModel>((initialData) => ({
    ...getNewArtworkFilterStoreModel(),
    ...initialData,
  }))
  return store
}

export const NewArtworksFiltersStore = createArtworkFiltersStore()

export const ArtworkFiltersStoreProvider = NewArtworksFiltersStore.Provider
