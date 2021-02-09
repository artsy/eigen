import { useContext, useEffect } from "react"
import { RelayPaginationProp } from "react-relay"
import { ArtworkFilterContext } from "./ArtworkFiltersStore"
import { filterArtworksParams } from "./FilterArtworksHelpers"

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
    if (relay && state.applyFilters) {
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
