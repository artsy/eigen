import { PAGE_SIZE } from "app/Components/constants"
import { MutableRefObject, useEffect, useMemo } from "react"
import { RefetchFnDynamic, RelayPaginationProp, Variables } from "react-relay"
import { FragmentType, OperationType } from "relay-runtime"
import {
  aggregationForFilter,
  filterArtworksParams,
  FilterParamName,
  getSelectedFiltersCounts,
  prepareFilterArtworksParamsForInput,
} from "./ArtworkFilterHelpers"
import { ArtworksFiltersStore, selectedOptionsUnion } from "./ArtworkFilterStore"

// Relay doesn't export their helper type(KeyType), so we have to redefine it here
type RelayData = { " $data"?: unknown; " $fragmentSpreads": FragmentType } | null | undefined

type UseArtworkFiltersOptions<T extends RelayData> = {
  /**
   * @deprecated use the prop `refetch` that is returned from relay hooks instead of HoC relay prop
   */
  relay?: RelayPaginationProp
  aggregations?: unknown
  pageSize?: number
  componentPath?: string
  type?: "filter" | "sort"
  refetchVariables?: Variables | null
  onApply?: () => void
  onRefetch?: (error?: Error | null) => void
  refetchRef?: MutableRefObject<() => void>
  refetch?: RefetchFnDynamic<OperationType, T>
}

export const useArtworkFilters = <T extends RelayData>({
  relay,
  aggregations,
  pageSize = PAGE_SIZE,
  componentPath,
  refetchVariables,
  onApply,
  onRefetch,
  type = "filter",
  refetchRef,
  refetch,
}: UseArtworkFiltersOptions<T>) => {
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

  const _refetch = () => {
    const filterParams = filterArtworksParams(appliedFilters, filterType)
    const refetchArgs = refetchVariables ?? {
      input: prepareFilterArtworksParamsForInput(filterParams),
    }

    if (!!relay) {
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
        refetchArgs
      )
      return
    }

    if (!!refetch) {
      refetch(
        { ...refetchArgs, count: pageSize },
        {
          onComplete: (error) => {
            onRefetch?.(error)
            if (error) {
              const errorMessage = componentPath
                ? `${componentPath} ${type} error: ${error.message}`
                : error.message
              throw new Error(errorMessage)
            }
          },
        }
      )
    }
  }

  if (refetchRef) {
    refetchRef.current = _refetch
  }

  useEffect(() => {
    if (applyFilters) {
      _refetch()

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

  const selectedOption = selectedOptions.find((option) => option.paramName === paramName)

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
