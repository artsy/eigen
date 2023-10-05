import { Aggregations } from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { NewFilterData } from "app/Components/NewArtworkFilter/helpers"
import { assignDeep } from "app/store/persistence"
import { Action, action, createContextStore } from "easy-peasy"
import { isEqual } from "lodash"

export interface NewArtworkFilterStoreModel {
  /********************************************************/
  /** State **/
  /********************************************************/

  // A list of filters that are already applied to the current filter state
  previouslyAppliedFilters: NewFilterData[]
  // A list of filters that should be selected
  selectedFilters: NewFilterData[]

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
  // Remoove a filter from the list of not applied filters
  removeFilterAction: Action<this, NewFilterData>
}

export const getNewArtworkFilterStoreModel = (): NewArtworkFilterStoreModel => ({
  /********************************************************/
  /** State **/
  /********************************************************/

  previouslyAppliedFilters: [],
  selectedFilters: [],
  aggregations: [],

  /********************************************************/
  /** Actions **/
  /********************************************************/

  applyFiltersAction: action((state) => {
    state.previouslyAppliedFilters = [...state.selectedFilters]
    state.selectedFilters = []
  }),
  clearAllFiltersAction: action((state) => {
    state.selectedFilters = []
  }),
  selectFilterAction: action((state, filter) => {
    const alreadySelected = state.selectedFilters.find((appliedFilter) => {
      if (isEqual(appliedFilter, filter)) {
        return true
      }
      return false
    })

    // No need to add a filter that is already selected or applied
    if (!alreadySelected) {
      state.selectedFilters = [...state.selectedFilters, filter]
    }
  }),
  setAggregationsAction: action((state, aggregations) => {
    state.aggregations = aggregations
  }),
  removeFilterAction: action((state, filter) => {
    const valueToBeRemovedIndex = state.selectedFilters.findIndex((appliedFilter) => {
      if (isEqual(appliedFilter, filter)) {
        return true
      }
      return false
    })

    if (valueToBeRemovedIndex > -1) {
      // only splice array when item is found
      state.selectedFilters.splice(valueToBeRemovedIndex, 1) // 2nd parameter means remove one item only
    }
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

export const NewArtworkFiltersStoreProvider = NewArtworksFiltersStore.Provider
