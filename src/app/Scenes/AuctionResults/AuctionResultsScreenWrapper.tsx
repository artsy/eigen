import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, Text } from "@artsy/palette-mobile"
import { AuctionResultsScreenWrapperContainerQuery } from "__generated__/AuctionResultsScreenWrapperContainerQuery.graphql"
import { AuctionResultsScreenWrapper_me$data } from "__generated__/AuctionResultsScreenWrapper_me.graphql"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { AuctionResultsList, LoadingSkeleton } from "app/Components/AuctionResultsList"
import { navigate } from "app/system/navigation/navigate"
import { defaultEnvironment } from "app/system/relay/createEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import React, { useState } from "react"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"

interface Props {
  me: AuctionResultsScreenWrapper_me$data
  relay: RelayPaginationProp
  state?: AuctionResultsState
}

const PAGE_SIZE = 20

export const AuctionResultsScreenContent: React.FC<Props> = ({
  me,
  relay,
  state = AuctionResultsState.ALL,
}) => {
  const { hasMore, isLoading, loadMore, refetchConnection } = relay
  const [loadingMoreData, setLoadingMoreData] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const { trackEvent } = useTracking()
  const auctionResults = extractNodes(me?.auctionResultsByFollowedArtists)

  const loadMoreArtworks = () => {
    if (!hasMore() || isLoading()) {
      return
    }

    setLoadingMoreData(true)
    loadMore(PAGE_SIZE, (error) => {
      if (error) {
        console.error("AuctionResultsForArtistsYouFollow.tsx #loadMoreArtworks", error.message)
      }
      setLoadingMoreData(false)
    })
  }

  const handleRefresh = () => {
    setRefreshing(true)
    refetchConnection(PAGE_SIZE, (error) => {
      if (error) {
        console.error("AuctionResultsForArtistsYouFollow.tsx #handleRefresh", error.message)
      }
    })
    setRefreshing(false)
  }
  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({
        context_screen_owner_type: OwnerType.auctionResultsForArtistsYouFollow,
      })}
    >
      <ArtworkFiltersStoreProvider>
        <Flex flex={1}>
          <AuctionResultsList
            auctionResults={auctionResults}
            refreshing={refreshing}
            handleRefresh={handleRefresh}
            onEndReached={loadMoreArtworks}
            onItemPress={(item: any) => {
              trackEvent(tracks.tapAuctionGroup(item.internalID))
              navigate(`/artist/${item.artistID}/auction-result/${item.internalID}`)
            }}
            ListHeaderComponent={() => <ListHeader state={state} />}
            isLoadingNext={loadingMoreData}
            floatingHeaderTitle={getTitleByState(state)}
          />
        </Flex>
      </ArtworkFiltersStoreProvider>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

export const ListHeader: React.FC<{ state: AuctionResultsState }> = ({ state }) => {
  return (
    <Flex mx={2}>
      <Text variant="lg-display" mb={0.5}>
        {getTitleByState(state)}
      </Text>
      <Text variant="xs">{getDescriptionByState(state)}</Text>
    </Flex>
  )
}

export const AuctionResultsScreenWrapperContainer = createPaginationContainer(
  AuctionResultsScreenContent,
  {
    me: graphql`
      fragment AuctionResultsScreenWrapper_me on Me
      @argumentDefinitions(
        first: { type: "Int", defaultValue: 10 }
        after: { type: "String" }
        state: { type: "AuctionResultsState", defaultValue: ALL }
      ) {
        auctionResultsByFollowedArtists(first: $first, after: $after, state: $state)
          @connection(key: "AuctionResultsScreenWrapperContainer_auctionResultsByFollowedArtists") {
          totalCount
          edges {
            node {
              saleDate
              internalID
              artistID
              ...AuctionResultListItem_auctionResult
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props?.me?.auctionResultsByFollowedArtists
    },
    getVariables(_props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        after: cursor,
        count,
      }
    },
    query: graphql`
      query AuctionResultsScreenWrapperContainerPaginationQuery(
        $first: Int!
        $after: String
        $state: AuctionResultsState!
      ) {
        me {
          ...AuctionResultsScreenWrapper_me @arguments(first: $first, after: $after, state: $state)
        }
      }
    `,
  }
)

const AuctionResultsScreenWrapperQuery = graphql`
  query AuctionResultsScreenWrapperContainerQuery($state: AuctionResultsState!) {
    me {
      ...AuctionResultsScreenWrapper_me @arguments(state: $state)
    }
  }
`

export enum AuctionResultsState {
  PAST = "PAST",
  UPCOMING = "UPCOMING",
  ALL = "ALL",
}

const getTitleByState = (state: AuctionResultsState) => {
  switch (state) {
    case AuctionResultsState.PAST:
      return "Latest Auction Results"
    case AuctionResultsState.UPCOMING:
      return "Upcoming Auction Results"
    case AuctionResultsState.ALL:
      return "Latest Auction Results"
  }
}

const getDescriptionByState = (state: AuctionResultsState) => {
  switch (state) {
    case AuctionResultsState.PAST:
      return "See auction results for the artists you follow"
    case AuctionResultsState.UPCOMING:
      return "Discover upcoming auctions for artists you follow"
    case AuctionResultsState.ALL:
      return "See auction results for the artists you follow"
  }
}

export const AuctionResultsScreenScreenWrapperQueryQueryRenderer: React.FC<{
  state: AuctionResultsState
}> = ({ state = AuctionResultsState.ALL }) => {
  return (
    <QueryRenderer<AuctionResultsScreenWrapperContainerQuery>
      environment={defaultEnvironment}
      query={AuctionResultsScreenWrapperQuery}
      variables={{
        state,
      }}
      cacheConfig={{
        force: true,
      }}
      render={renderWithPlaceholder({
        Container: AuctionResultsScreenWrapperContainer,
        renderPlaceholder: () => {
          return (
            <LoadingSkeleton
              title={getTitleByState(state)}
              listHeader={<ListHeader state={state} />}
            />
          )
        },
        initialProps: {
          state,
        },
      })}
    />
  )
}

export const tracks = {
  tapAuctionGroup: (auctionResultId: string) => ({
    action: ActionType.tappedAuctionResultGroup,
    context_module: ContextModule.auctionResultsForArtistsYouFollow,
    context_screen_owner_type: OwnerType.auctionResultsForArtistsYouFollow,
    destination_screen_owner_type: OwnerType.auctionResult,
    destination_screen_owner_id: auctionResultId,
    type: "thumbnail",
  }),
}
