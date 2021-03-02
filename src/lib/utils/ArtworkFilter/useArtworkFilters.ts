import { useContext, useEffect } from "react"
import { RelayPaginationProp } from "react-relay"
import { ArtworkFilterContext, selectedOptionsUnion } from "./ArtworkFiltersStore"
import { aggregationForFilter, filterArtworksParams, FilterParamName } from "./FilterArtworksHelpers"

export const useArtworkFilters = ({
  relay,
  aggregations,
}: { relay?: RelayPaginationProp; aggregations?: unknown } = {}) => {
  const { dispatch, state } = useContext(ArtworkFilterContext)
  const filterParams = filterArtworksParams(state.appliedFilters, state.filterType)

  useEffect(() => {
    if (!aggregations) {
      return
    }

    dispatch({ type: "setAggregations", payload: aggregations })
  }, [aggregations])

  useEffect(() => {
    if (relay !== undefined && state.applyFilters) {
      relay.refetchConnection(
        30,
        (error) => {
          if (error) {
            throw error
          }
        },
        filterParams
      )
    }
  }, [relay, state.appliedFilters, filterParams])

  return {
    dispatch,
    state,
    filterParams,
  }
}

export const useArtworkFiltersAggregation = ({ paramName }: { paramName: FilterParamName }) => {
  const { dispatch, state } = useContext(ArtworkFilterContext)

  const aggregation = aggregationForFilter(paramName, state.aggregations)

  const selectedOptions = selectedOptionsUnion({
    selectedFilters: state.selectedFilters,
    previouslyAppliedFilters: state.previouslyAppliedFilters,
    filterType: state.filterType,
  })

  const selectedOption = selectedOptions.find((option) => option.paramName === paramName)!

  return {
    dispatch,
    state,
    aggregation,
    selectedOption,
  }
}
