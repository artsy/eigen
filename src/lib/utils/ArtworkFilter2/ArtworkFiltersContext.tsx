import { createContextStore } from "easy-peasy"
import { ArtworkFiltersStore } from "./ArtworkFiltersStore"

export const ArtworkFiltersStoreContext = createContextStore<ArtworkFiltersStore>(ArtworkFiltersStore)

export const ArtworkFiltersStoreProvider = ArtworkFiltersStoreContext.Provider

/**
 * Artwork Filters Store State
 */

export const appliedFiltersState = ArtworkFiltersStoreContext.useStoreState((state) => state.appliedFilters)
export const selectedFiltersState = ArtworkFiltersStoreContext.useStoreState((state) => state.selectedFilters)
export const previouslyAppliedFiltersState = ArtworkFiltersStoreContext.useStoreState(
  (state) => state.previouslyAppliedFilters
)
export const applyFiltersState = ArtworkFiltersStoreContext.useStoreState((state) => state.applyFilters)
export const aggregationsState = ArtworkFiltersStoreContext.useStoreState((state) => state.aggregations)
export const filterTypeState = ArtworkFiltersStoreContext.useStoreState((state) => state.filterType)
export const countsState = ArtworkFiltersStoreContext.useStoreState((state) => state.counts)

/**
 * Artwork Filters Store Actions
 */
export const applyFiltersAction = ArtworkFiltersStoreContext.useStoreActions((action) => action.applyFiltersAction)
export const selectFiltersAction = ArtworkFiltersStoreContext.useStoreActions((action) => action.selectFiltersAction)
export const clearAllAction = ArtworkFiltersStoreContext.useStoreActions((action) => action.clearAllAction)
export const resetFiltersAction = ArtworkFiltersStoreContext.useStoreActions((action) => action.resetFiltersAction)
export const clearFiltersZeroStateAction = ArtworkFiltersStoreContext.useStoreActions(
  (action) => action.clearFiltersZeroStateAction
)
export const setAggregationsAction = ArtworkFiltersStoreContext.useStoreActions(
  (action) => action.setAggregationsAction
)
export const setFiltersCountAction = ArtworkFiltersStoreContext.useStoreActions(
  (action) => action.setFiltersCountAction
)
export const setFilterTypeAction = ArtworkFiltersStoreContext.useStoreActions((action) => action.setFilterTypeAction)
export const setInitialFilterStateAction = ArtworkFiltersStoreContext.useStoreActions(
  (action) => action.setInitialFilterStateAction
)
