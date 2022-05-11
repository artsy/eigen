import { ActionType, ContextModule, OwnerType, tappedLink } from "@artsy/cohesion"
import { AuctionResultsForArtistsYouFollow_me } from "__generated__/AuctionResultsForArtistsYouFollow_me.graphql"
import { AuctionResultsForArtistsYouFollowContainerQuery } from "__generated__/AuctionResultsForArtistsYouFollowContainerQuery.graphql"
import { AuctionResulstList } from "app/Components/AuctionResulstList"
import { PAGE_SIZE } from "app/Components/constants"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { navigate } from "app/navigation/navigate"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { extractNodes } from "app/utils/extractNodes"
import { PlaceholderBox, PlaceholderText } from "app/utils/placeholders"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { groupBy } from "lodash"
import moment from "moment"
import { Flex, LinkText, Separator, Spacer, Text } from "palette"
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
    <AuctionResulstList
      header="Auction Results"
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
  )
}

const ListHeader: React.FC<{}> = ({}) => {
  const { trackEvent } = useTracking()

  return (
    <Flex>
      <Text variant="lg" mx={20} mt={2}>
        Auction Results for Artists You Follow
      </Text>
      <Text variant="xs" mx={20} mt={1} mb={2}>
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
      renderPlaceholder: LoadingSkeleton,
    })}
  />
)

const LoadingSkeleton = () => {
  const placeholderResults = []
  for (let i = 0; i < 8; i++) {
    placeholderResults.push(
      <React.Fragment key={i}>
        <Spacer height={20} />
        <Flex flexDirection="row" pl={1} flexGrow={1}>
          {/* Image */}
          <PlaceholderBox width={60} height={60} />
          <Spacer width={15} />
          <Flex flexDirection="row" justifyContent="space-between" py={0.5} flexGrow={1}>
            <Flex>
              {/* Artist name */}
              <PlaceholderText width={100} />
              {/* Artwork name */}
              <PlaceholderText width={150} />
              {/* Artwork medium */}
              <PlaceholderText width={125} />
              {/* Auction Date & Place */}
              <PlaceholderText width={100} />
            </Flex>
            <Flex alignItems="flex-end" pr={1}>
              {/* Price */}
              <PlaceholderText width={40} />
              {/* Mid estimate */}
              <PlaceholderText width={65} />
            </Flex>
          </Flex>
        </Flex>
        <Spacer height={10} />
        <Separator borderColor="black10" />
      </React.Fragment>
    )
  }
  return (
    <>
      <FancyModalHeader hideBottomDivider />
      <ListHeader />
      <Flex mx={2}>
        <Spacer height={20} />
        <PlaceholderText height={24} width={100 + Math.random() * 50} />
        <Spacer height={10} />
        <Separator borderColor="black10" />
        {placeholderResults}
      </Flex>
    </>
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
  tappedLink: tappedLink({
    contextModule: ContextModule.auctionResultsForArtistsYouFollow,
    contextScreenOwnerType: OwnerType.auctionResultsForArtistsYouFollow,
    destinationPath: "/favorites",
  }),
}
