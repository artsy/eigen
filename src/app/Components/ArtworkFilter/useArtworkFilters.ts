import { PAGE_SIZE } from "app/Components/constants"
import { MutableRefObject, useEffect, useMemo } from "react"
import { RefetchFnDynamic, RelayPaginationProp, Variables } from "react-relay"
import { OperationType } from "relay-runtime"
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
  // this property is used to pass a refetch function from a parent component that uses relay hooks
  relayPaginationHookRefetch?: RefetchFnDynamic<OperationType, any>
}

export const useArtworkFilters = ({
  relay,
  relayPaginationHookRefetch,
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

    if (relayPaginationHookRefetch) {
      relayPaginationHookRefetch(
        refetchVariables ?? {
          input: prepareFilterArtworksParamsForInput(
            filterArtworksParams(appliedFilters, filterType)
          ),
          pageSize,
        }
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
