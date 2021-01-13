import { ArtistInsightsAuctionResults_artist } from "__generated__/ArtistInsightsAuctionResults_artist.graphql"
import { ORDERED_AUCTION_RESULTS_SORTS } from "lib/Components/ArtworkFilterOptions/SortOptions"
import Spinner from "lib/Components/Spinner"
import { PAGE_SIZE } from "lib/data/constants"
import { navigate } from "lib/navigation/navigate"
import { ArtworkFilterContext } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { filterArtworksParams } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import { extractNodes } from "lib/utils/extractNodes"
import { Flex, Separator, Text } from "palette"
import React, { useCallback, useContext, useEffect, useState } from "react"
import { FlatList } from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import styled from "styled-components/native"
import { useScreenDimensions } from "../../../utils/useScreenDimensions"
import { AuctionResultFragmentContainer } from "../../Lists/AuctionResult"

interface Props {
  artist: ArtistInsightsAuctionResults_artist
  relay: RelayPaginationProp
}

const ArtistInsightsAuctionResults: React.FC<Props> = ({ artist, relay }) => {
  const { state, dispatch } = useContext(ArtworkFilterContext)
  const filterParams = filterArtworksParams(state.appliedFilters, "auctionResult")

  useEffect(() => {
    dispatch({
      type: "setFilterType",
      payload: "auctionResult",
    })
  }, [])

  useEffect(() => {
    if (state.applyFilters) {
      relay.refetchConnection(
        PAGE_SIZE,
        (error) => {
          if (error) {
            throw new Error("ArtistInsights/ArtistAuctionResults filter error: " + error.message)
          }
        },
        filterParams
      )
    }
  }, [state.appliedFilters])

  const auctionResults = extractNodes(artist.auctionResultsConnection)
  const [loadingMoreData, setLoadingMoreData] = useState(false)

  const getSortDescription = useCallback(() => {
    const sortMode = ORDERED_AUCTION_RESULTS_SORTS.find((sort) => sort.paramValue === filterParams?.sort)
    if (sortMode) {
      return sortMode.displayText
    }
  }, [filterParams])

  const loadMoreAuctionResults = () => {
    if (!relay.hasMore() || relay.isLoading()) {
      return
    }
    setLoadingMoreData(true)
    relay.loadMore(PAGE_SIZE, (error) => {
      if (error) {
        console.log(error.message)
      }
      setLoadingMoreData(false)
    })
  }

  return (
    <FlatList
      data={auctionResults}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <AuctionResultFragmentContainer
          auctionResult={item}
          onPress={() => navigate(`/artist/${artist?.slug!}/auction-result/${item.internalID}`)}
        />
      )}
      ListHeaderComponent={() => (
        <Flex px={2}>
          <Text variant="title">Auction results</Text>
          <SortMode variant="small" color="black60">
            Sorted by {getSortDescription()?.toLowerCase()}
          </SortMode>
          <Separator mt="2" />
        </Flex>
      )}
      ItemSeparatorComponent={() => (
        <Flex px={2}>
          <Separator />
        </Flex>
      )}
      style={{ width: useScreenDimensions().width, left: -20 }}
      onEndReached={loadMoreAuctionResults}
      ListFooterComponent={loadingMoreData ? <Spinner style={{ marginTop: 20, marginBottom: 20 }} /> : null}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  )
}

export const SortMode = styled(Text)``

export const ArtistInsightsAuctionResultsPaginationContainer = createPaginationContainer(
  ArtistInsightsAuctionResults,
  {
    artist: graphql`
      fragment ArtistInsightsAuctionResults_artist on Artist
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "String" }
        sort: { type: "AuctionResultSorts", defaultValue: DATE_DESC }
      ) {
        slug
        auctionResultsConnection(first: $count, after: $cursor, sort: $sort)
          @connection(key: "artist_auctionResultsConnection") {
          edges {
            node {
              id
              internalID
              ...AuctionResult_auctionResult
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props?.artist.auctionResultsConnection
    },
    getVariables(_props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        cursor,
        count,
      }
    },
    query: graphql`
      query ArtistInsightsAuctionResultsQuery(
        $count: Int!
        $cursor: String
        $sort: AuctionResultSorts
        $artistID: String!
      ) {
        artist(id: $artistID) {
          ...ArtistInsightsAuctionResults_artist @arguments(count: $count, cursor: $cursor, sort: $sort)
        }
      }
    `,
  }
)
