import { SaleLotsList_saleArtworksConnection } from "__generated__/SaleLotsList_saleArtworksConnection.graphql"
import { OrderedSaleArtworkSorts } from "lib/Components/ArtworkFilterOptions/SortOptions"
import { FilteredArtworkGridZeroState } from "lib/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { InfiniteScrollArtworksGridContainer } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { ArtworkFilterContext } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { filterArtworksParams, FilterParamName, ViewAsValues } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import { Schema } from "lib/utils/track"
import { Box, color, Flex, Sans } from "palette"
import React, { useContext, useEffect, useState } from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"
import { SaleArtworkListContainer } from "./SaleArtworkList"

interface Props {
  saleArtworksConnection: SaleLotsList_saleArtworksConnection
  relay: RelayPaginationProp
  saleID: string
  saleSlug: string
}

export const SaleLotsList: React.FC<Props> = ({ saleArtworksConnection, relay, saleID, saleSlug }) => {
  const { state, dispatch } = useContext(ArtworkFilterContext)
  const [totalCount, setTotalCount] = useState<number | null>(null)
  const tracking = useTracking()

  const filterParams = filterArtworksParams(state.appliedFilters, state.filterType)
  const viewAsFilter = state.appliedFilters.find((filter) => filter.paramName === FilterParamName.viewAs)
  const counts = saleArtworksConnection.saleArtworksConnection?.counts

  useEffect(() => {
    dispatch({
      type: "setFilterType",
      payload: "saleArtwork",
    })
  }, [])

  useEffect(() => {
    setTotalCount(saleArtworksConnection.saleArtworksConnection?.counts?.total || 0)
  }, [])

  useEffect(() => {
    if (state.applyFilters) {
      // Add the new medium to geneIDs array
      const medium: string[] = []
      if (typeof filterParams.medium === "string") {
        medium.push(filterParams.medium)
      }

      relay.refetchConnection(
        10,
        (error) => {
          if (error) {
            throw new Error("Sale/SaleLotsList filter error: " + error.message)
          }
        },
        { ...filterParams, saleID: saleSlug, geneIDs: medium }
      )
    }
  }, [state.appliedFilters])

  useEffect(() => {
    dispatch({
      type: "setAggregations",
      payload: saleArtworksConnection.saleArtworksConnection?.aggregations,
    })
  }, [])

  const trackClear = (id: string, slug: string) => {
    tracking.trackEvent({
      action_name: "clearFilters",
      context_screen: Schema.ContextModules.Auction,
      context_screen_owner_type: Schema.OwnerEntityTypes.Auction,
      context_screen_owner_id: id,
      context_screen_owner_slug: slug,
      action_type: Schema.ActionTypes.Tap,
    })
  }

  const getSortDescription = () => {
    const sortMode = OrderedSaleArtworkSorts.find((sort) => sort.paramValue === filterParams?.sort || "position")
    if (sortMode) {
      return sortMode.displayText
    }
  }

  if (!saleArtworksConnection.saleArtworksConnection?.edges?.length) {
    return (
      <Box mb="80px">
        <FilteredArtworkGridZeroState id={saleID} slug={saleSlug} trackClear={trackClear} />
      </Box>
    )
  }

  return (
    <Flex flex={1} my={4}>
      <Flex px={2} mb={2}>
        <FilterTitle size="4" ellipsizeMode="tail">
          Sorted by {getSortDescription()?.toLowerCase()}
        </FilterTitle>

        {!!counts?.total && !!totalCount && (
          <FilterDescription size="3t">{`Showing ${counts.total} of ${totalCount}`}</FilterDescription>
        )}
      </Flex>

      {viewAsFilter?.paramValue === ViewAsValues.List ? (
        <SaleArtworkListContainer
          connection={saleArtworksConnection.saleArtworksConnection!}
          hasMore={relay.hasMore}
          loadMore={relay.loadMore}
          isLoading={relay.isLoading}
        />
      ) : (
        <Flex px={2}>
          <InfiniteScrollArtworksGridContainer
            connection={saleArtworksConnection.saleArtworksConnection!}
            hasMore={relay.hasMore}
            loadMore={relay.loadMore}
            showLotLabel
            hidePartner
            hideUrgencyTags
          />
        </Flex>
      )}
    </Flex>
  )
}

export const FilterTitle = styled(Sans)``
export const FilterDescription = styled(Sans)`
  color: ${color("black60")};
`

export const SaleLotsListContainer = createPaginationContainer(
  SaleLotsList,
  {
    saleArtworksConnection: graphql`
      fragment SaleLotsList_saleArtworksConnection on Query
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "String" }
        artistIDs: { type: "[String]", defaultValue: [] }
        geneIDs: { type: "[String]", defaultValue: [] }
        estimateRange: { type: "String", defaultValue: "" }
        sort: { type: "String", defaultValue: "position" }
        saleID: { type: "ID" }
      ) {
        saleArtworksConnection(
          after: $cursor
          saleID: $saleID
          artistIDs: $artistIDs
          geneIDs: $geneIDs
          aggregations: [ARTIST, MEDIUM, TOTAL]
          estimateRange: $estimateRange
          first: $count
          sort: $sort
        ) @connection(key: "SaleLotsList_saleArtworksConnection") {
          aggregations {
            slice
            counts {
              count
              name
              value
            }
          }
          counts {
            total
          }
          edges {
            node {
              id
            }
          }
          ...SaleArtworkList_connection
          ...InfiniteScrollArtworksGrid_connection
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props?.saleArtworksConnection?.saleArtworksConnection
    },
    getVariables(_props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        cursor,
        count,
      }
    },
    query: graphql`
      query SaleLotsListQuery(
        $geneIDs: [String]
        $artistIDs: [String]
        $count: Int!
        $cursor: String
        $estimateRange: String
        $saleID: ID
        $sort: String
      )
      # $saleID: ID
      @raw_response_type {
        ...SaleLotsList_saleArtworksConnection
        @arguments(
          geneIDs: $geneIDs
          artistIDs: $artistIDs
          count: $count
          cursor: $cursor
          sort: $sort
          estimateRange: $estimateRange
          saleID: $saleID
        )
      }
    `,
  }
)
