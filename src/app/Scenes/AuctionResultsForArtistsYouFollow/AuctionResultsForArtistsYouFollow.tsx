import { ActionType, ContextModule, OwnerType, tappedLink } from "@artsy/cohesion"
import { AuctionResultsForArtistsYouFollow_me } from "__generated__/AuctionResultsForArtistsYouFollow_me.graphql"
import { AuctionResultsForArtistsYouFollowContainerQuery } from "__generated__/AuctionResultsForArtistsYouFollowContainerQuery.graphql"
import { ArtworkFiltersStoreProvider } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { AuctionResultsList, LoadingSkeleton } from "app/Components/AuctionResultsList"
import { PAGE_SIZE } from "app/Components/constants"
import { PageWithSimpleHeader } from "app/Components/PageWithSimpleHeader"
import { navigate } from "app/navigation/navigate"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { groupBy } from "lodash"
import moment from "moment"
import { Flex, LinkText, Text } from "palette"
import React, { useState } from "react"
import { RelayPaginationProp } from "react-relay"
import { createPaginationContainer, graphql, QueryRenderer } from "react-relay"
import { useTracking } from "react-tracking"
import { Tab } from "../Favorites/Favorites"

interface Props {
  me: AuctionResultsForArtistsYouFollow_me | null
  relay: RelayPaginationProp
}

export const AuctionResultsForArtistsYouFollow: React.FC<Props> = ({ me, relay }) => {
  const { hasMore, isLoading, loadMore, refetchConnection } = relay
  const [loadingMoreData, setLoadingMoreData] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const { trackEvent } = useTracking()
  const allAuctionResults = extractNodes(me?.auctionResultsByFollowedArtists)
  const groupedAuctionResults = groupBy(allAuctionResults, (item) =>
    moment(item!.saleDate!).format("YYYY-MM")
  )

  const groupedAuctionResultSections = Object.entries(groupedAuctionResults).map(
    ([date, auctionResults]) => {
      const sectionTitle = moment(date).format("MMMM")

      return { sectionTitle, data: auctionResults }
    }
  )

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
      <PageWithSimpleHeader title="Auction Results for Artists You Follow">
        <ArtworkFiltersStoreProvider>
          <AuctionResultsList
            sections={groupedAuctionResultSections}
            refreshing={refreshing}
            handleRefresh={handleRefresh}
            onEndReached={loadMoreArtworks}
            ListHeaderComponent={<ListHeader />}
            onItemPress={(item: any) => {
              trackEvent(tracks.tapAuctionGroup(item.internalID))
              navigate(`/artist/${item.artistID}/auction-result/${item.internalID}`)
            }}
            isLoadingNext={loadingMoreData}
          />
        </ArtworkFiltersStoreProvider>
      </PageWithSimpleHeader>
    </ProvideScreenTrackingWithCohesionSchema>
  )
}

export const ListHeader: React.FC = () => {
  const { trackEvent } = useTracking()
  return (
    <Flex>
      <Text fontSize={14} lineHeight={21} textAlign="left" color="black60" mx={20} my={17}>
        The latest auction results for the {""}
        <LinkText
          onPress={() => {
            trackEvent(tracks.tappedLink)
            navigate("/favorites", { passProps: { initialTab: Tab.artists } })
          }}
        >
          artists you follow
        </LinkText>
        . You can also look up more auction results on the insights tab on any artist’s page.
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
        return (
          <LoadingSkeleton
            title="Auction Results for Artists You Follow"
            listHeader={<ListHeader />}
          />
        )
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
  tappedLink: tappedLink({
    contextModule: ContextModule.auctionResultsForArtistsYouFollow,
    contextScreenOwnerType: OwnerType.auctionResultsForArtistsYouFollow,
    destinationPath: "/favorites",
  }),
}
