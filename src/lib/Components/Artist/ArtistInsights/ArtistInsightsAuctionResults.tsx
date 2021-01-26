import { ArtistInsightsAuctionResults_artist } from "__generated__/ArtistInsightsAuctionResults_artist.graphql"
import { ORDERED_AUCTION_RESULTS_SORTS } from "lib/Components/ArtworkFilterOptions/SortOptions"
import { FilteredArtworkGridZeroState } from "lib/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { InfoButton } from "lib/Components/Buttons/InfoButton"
import Spinner from "lib/Components/Spinner"
import { PAGE_SIZE } from "lib/data/constants"
import { navigate } from "lib/navigation/navigate"
import { ArtworkFilterContext } from "lib/utils/ArtworkFilter/ArtworkFiltersStore"
import { filterArtworksParams } from "lib/utils/ArtworkFilter/FilterArtworksHelpers"
import { extractNodes } from "lib/utils/extractNodes"
import { Box, Flex, Separator, Spacer, Text } from "palette"
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

  // We are using the same logic used in Force but it might be useful
  // to adjust metaphysics to support aggregations like other filters in the app
  useEffect(() => {
    dispatch({
      type: "setAggregations",
      payload: [
        {
          slice: "earliestCreatedYear",
          counts: [
            {
              value: artist.auctionResultsConnection?.createdYearRange?.startAt || artist.birthday,
              name: "earliestCreatedYear",
            },
          ],
        },
        {
          slice: "latestCreatedYear",
          counts: [
            {
              value: artist.auctionResultsConnection?.createdYearRange?.endAt || new Date().getFullYear(),
              name: "latestCreatedYear",
            },
          ],
        },
      ],
    })
  }, [])

  const renderAuctionResultsModal = () => (
    <>
      <Text>
        These auction results bring together sale data from top auction houses around the world, including Christies,
        Sotheby’s, Phillips, Bonhams, and Heritage. Results are updated daily.
      </Text>
      <Spacer mb={2} />
      <Text>
        Please note that the sale price includes the hammer price and buyer’s premium, as well as any other additional
        fees (e.g., Artist’s Resale Rights).
      </Text>
      <Spacer mb={2} />
    </>
  )

  if (!auctionResults.length) {
    return (
      <Box my="80px">
        <FilteredArtworkGridZeroState id={artist.id} slug={artist.slug} />
      </Box>
    )
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
          <Flex flexDirection="row" alignItems="center">
            <InfoButton
              title={"Auction Results"}
              modalTitle={"Auction Results"}
              modalContent={renderAuctionResultsModal()}
            />
          </Flex>
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
        allowEmptyCreatedDates: { type: "Boolean", defaultValue: true }
        categories: { type: "[String]" }
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "String" }
        earliestCreatedYear: { type: "Int", defaultValue: 1000 }
        latestCreatedYear: { type: "Int", defaultValue: 2050 }
        sizes: { type: "[ArtworkSizes]" }
        sort: { type: "AuctionResultSorts", defaultValue: DATE_DESC }
      ) {
        birthday
        slug
        id
        auctionResultsConnection(
          after: $cursor
          allowEmptyCreatedDates: $allowEmptyCreatedDates
          categories: $categories
          earliestCreatedYear: $earliestCreatedYear
          first: $count
          latestCreatedYear: $latestCreatedYear
          sizes: $sizes
          sort: $sort
        ) @connection(key: "artist_auctionResultsConnection") {
          createdYearRange {
            startAt
            endAt
          }
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
        $allowEmptyCreatedDates: Boolean
        $artistID: String!
        $categories: [String]
        $count: Int!
        $cursor: String
        $earliestCreatedYear: Int
        $latestCreatedYear: Int
        $sizes: [ArtworkSizes]
        $sort: AuctionResultSorts
      ) {
        artist(id: $artistID) {
          ...ArtistInsightsAuctionResults_artist
            @arguments(
              allowEmptyCreatedDates: $allowEmptyCreatedDates
              categories: $categories
              count: $count
              cursor: $cursor
              earliestCreatedYear: $earliestCreatedYear
              latestCreatedYear: $latestCreatedYear
              sizes: $sizes
              sort: $sort
            )
        }
      }
    `,
  }
)
