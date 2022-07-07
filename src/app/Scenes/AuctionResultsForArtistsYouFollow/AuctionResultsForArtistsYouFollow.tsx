import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { AuctionResultsForArtistsYouFollow_me$data } from "__generated__/AuctionResultsForArtistsYouFollow_me.graphql"
import { AuctionResultsForArtistsYouFollowContainerQuery } from "__generated__/AuctionResultsForArtistsYouFollowContainerQuery.graphql"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { AuctionResultsList, LoadingSkeleton } from "app/Components/AuctionResultsList"
import { navigate } from "app/navigation/navigate"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { Flex, Text } from "palette"
import React, { useState } from "react"
import { createPaginationContainer, graphql, QueryRenderer, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"

interface Props {
  me: AuctionResultsForArtistsYouFollow_me$data | null
  relay: RelayPaginationProp
}

const PAGE_SIZE = 20

export const AuctionResultsForArtistsYouFollow: React.FC<Props> = ({ me, relay }) => {
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
            ListHeaderComponent={ListHeader}
            isLoadingNext={loadingMoreData}
            floatingHeaderTitle="Latest Auction Results"
          />
        </Flex>
      </ArtworkFiltersStoreProvider>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

export const ListHeader: React.FC = () => {
  return (
    <Flex mx={2}>
      <Text variant="lg" mb={0.5}>
        Latest Auction Results
      </Text>
      <Text variant="xs">
        Get all the latest prices achieved at auctions for the artists you follow.
      </Text>
    </Flex>
  )
}

export const AuctionResultsForArtistsYouFollowContainer = createPaginationContainer(
  AuctionResultsForArtistsYouFollow,
  {
    me: graphql`
      fragment AuctionResultsForArtistsYouFollow_me on Me
      @argumentDefinitions(first: { type: "Int", defaultValue: 10 }, after: { type: "String" }) {
        auctionResultsByFollowedArtists(first: $first, after: $after)
          @connection(
            key: "AuctionResultsForArtistsYouFollowContainer_auctionResultsByFollowedArtists"
          ) {
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
      query AuctionResultsForArtistsYouFollowContainerPaginationQuery(
        $first: Int!
        $after: String
      ) {
        me {
          ...AuctionResultsForArtistsYouFollow_me @arguments(first: $first, after: $after)
        }
      }
    `,
  }
)

export const AuctionResultsForArtistsYouFollowScreenQuery = graphql`
  query AuctionResultsForArtistsYouFollowContainerQuery {
    me {
      ...AuctionResultsForArtistsYouFollow_me
    }
  }
`

export const AuctionResultsForArtistsYouFollowQueryRenderer: React.FC = () => (
  <QueryRenderer<AuctionResultsForArtistsYouFollowContainerQuery>
    environment={defaultEnvironment}
    query={AuctionResultsForArtistsYouFollowScreenQuery}
    variables={{}}
    cacheConfig={{
      force: true,
    }}
    render={renderWithPlaceholder({
      Container: AuctionResultsForArtistsYouFollowContainer,
      renderPlaceholder: () => {
        return <LoadingSkeleton title="Latest Auction Results" listHeader={<ListHeader />} />
      },
    })}
  />
)

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
