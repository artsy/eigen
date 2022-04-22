import { PAGE_SIZE } from "app/Components/constants"
import { MutableRefObject, useEffect, useMemo } from "react"
import { RelayPaginationProp, Variables } from "react-relay"
import {
  aggregationForFilter,
  filterArtworksParams,
  FilterParamName,
  getSelectedFiltersCounts,
  prepareFilterArtworksParamsForInput,
} from "./ArtworkFilterHelpers"
import { ArtworksFiltersStore, selectedOptionsUnion } from "./ArtworkFilterStore"

interface UseArtworkFiltersOptions {
  relay?: RelayPaginationProp
  aggregations?: unknown
  pageSize?: number
  componentPath?: string
  type?: "filter" | "sort"
  refetchVariables?: Variables | null
  onApply?: () => void
  onRefetch?: (error?: Error | null) => void
  refetchRef?: MutableRefObject<() => void>
}

export const useArtworkFilters = ({
  relay,
  aggregations,
  pageSize = PAGE_SIZE,
  componentPath,
  refetchVariables,
  onApply,
  onRefetch,
  type = "filter",
  refetchRef,
}: UseArtworkFiltersOptions) => {
  const setAggregationsAction = ArtworksFiltersStore.useStoreActions(
    (state) => state.setAggregationsAction
  )
  const appliedFilters = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)
  const applyFilters = ArtworksFiltersStore.useStoreState((state) => state.applyFilters)
  const filterType = ArtworksFiltersStore.useStoreState((state) => state.filterType)

  useEffect(() => {
    if (!aggregations) {
      return
    }
    setAggregationsAction(aggregations)
  }, [])

  const refetch = () => {
    if (relay !== undefined) {
      const filterParams = filterArtworksParams(appliedFilters, filterType)

      relay.refetchConnection(
        pageSize,
        (error) => {
          if (onRefetch) {
            onRefetch(error)
          }
          if (error) {
            const errorMessage = componentPath
              ? `${componentPath} ${type} error: ${error.message}`
              : error.message
            throw new Error(errorMessage)
          }
        },
        refetchVariables ?? { input: prepareFilterArtworksParamsForInput(filterParams) }
      )
    }
  }

  if (refetchRef) {
    refetchRef.current = refetch
  }

  useEffect(() => {
    if (applyFilters) {
      refetch()

      if (onApply) {
        onApply()
      }
    }
  }, [appliedFilters])
}

export const useArtworkFiltersAggregation = ({ paramName }: { paramName: FilterParamName }) => {
  const aggregations = ArtworksFiltersStore.useStoreState((state) => state.aggregations)
  const selectedFilters = ArtworksFiltersStore.useStoreState((state) => state.selectedFilters)
  const filterType = ArtworksFiltersStore.useStoreState((state) => state.filterType)
  const previouslyAppliedFilters = ArtworksFiltersStore.useStoreState(
    (state) => state.previouslyAppliedFilters
  )

  const aggregation = aggregationForFilter(paramName, aggregations)

  const selectedOptions = selectedOptionsUnion({
    selectedFilters,
    previouslyAppliedFilters,
    filterType,
  })

  const selectedOption = selectedOptions.find((option) => option.paramName === paramName)!

  return {
    aggregation,
    selectedOption,
  }
}

export const useSelectedFiltersCount = () => {
  const appliedFilters = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)
  return useMemo(
    () =>
      Object.values(getSelectedFiltersCounts(appliedFilters)).reduce(
        (prev, value) => prev + value,
        0
      ),
    [appliedFilters]
  )
}
