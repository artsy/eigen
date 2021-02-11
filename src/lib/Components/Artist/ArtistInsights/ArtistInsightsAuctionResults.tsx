import {
  ActionType,
  ContextModule,
  OwnerType,
  TappedAuctionResultGroup,
  tappedInfoBubble,
  TappedInfoBubbleArgs,
} from "@artsy/cohesion"
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
import { Box, bullet, color, Flex, Separator, Spacer, Text } from "palette"
import React, { useCallback, useContext, useEffect, useState } from "react"
import { FlatList } from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"
import { useScreenDimensions } from "../../../utils/useScreenDimensions"
import { AuctionResultFragmentContainer } from "../../Lists/AuctionResult"

interface Props {
  artist: ArtistInsightsAuctionResults_artist
  relay: RelayPaginationProp
}

const ArtistInsightsAuctionResults: React.FC<Props> = ({ artist, relay }) => {
  const tracking = useTracking()
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
      <Spacer my={1} />
      <Text>
        These auction results bring together sale data from top auction houses around the world, including
        Christie&rsquo;s, Sotheby&rsquo;s, Phillips, Bonhams, and Heritage. Results are updated daily.
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

  const resultsString = Number(artist.auctionResultsConnection?.totalCount) > 1 ? "results" : "result"

  return (
    <FlatList
      data={auctionResults}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <AuctionResultFragmentContainer
          auctionResult={item}
          onPress={() => {
            tracking.trackEvent(tracks.tapAuctionGroup(item.internalID, artist.id))
            navigate(`/artist/${artist?.slug!}/auction-result/${item.internalID}`)
          }}
        />
      )}
      ListHeaderComponent={() => (
        <Flex px={2}>
          <Flex flexDirection="row" alignItems="center">
            <InfoButton
              titleElement={
                <Text variant="title" mr={0.5}>
                  Auction Results
                </Text>
              }
              trackEvent={() => {
                tracking.trackEvent(tappedInfoBubble(tracks.tapAuctionResultsInfo()))
              }}
              modalTitle={"Auction Results"}
              maxModalHeight={310}
              modalContent={renderAuctionResultsModal()}
            />
          </Flex>
          <SortMode variant="small" color="black60">
            {!!artist.auctionResultsConnection?.totalCount &&
              new Intl.NumberFormat().format(artist.auctionResultsConnection.totalCount)}{" "}
            {resultsString} {bullet} Sorted by {getSortDescription()?.toLowerCase()}
          </SortMode>
          <Separator borderColor={color("black5")} mt="2" />
        </Flex>
      )}
      ItemSeparatorComponent={() => (
        <Flex px={2}>
          <Separator borderColor={color("black5")} />
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
          totalCount
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

export const tracks = {
  tapAuctionGroup: (auctionId: string, artistId: string): TappedAuctionResultGroup => ({
    action: ActionType.tappedAuctionResultGroup,
    context_module: ContextModule.auctionResults,
    context_screen_owner_type: OwnerType.artistInsights,
    context_screen_owner_id: artistId,
    destination_screen_owner_type: OwnerType.auctionResult,
    destination_screen_owner_id: auctionId,
    type: "thumbnail",
  }),

  tapAuctionResultsInfo: (): TappedInfoBubbleArgs => ({
    contextModule: ContextModule.auctionResults,
    contextScreenOwnerType: OwnerType.artistInsights,
    subject: "auctionResults",
  }),
}
