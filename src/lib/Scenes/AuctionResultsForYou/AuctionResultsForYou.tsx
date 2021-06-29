import { AuctionResultsForYou_me } from "__generated__/AuctionResultsForYou_me.graphql"
import { AuctionResultsForYouContainerQuery } from "__generated__/AuctionResultsForYouContainerQuery.graphql"
import { ArtworkFiltersStoreProvider } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { AuctionResultFragmentContainer } from "lib/Components/Lists/AuctionResultListItem"
import { PageWithSimpleHeader } from "lib/Components/PageWithSimpleHeader"
import { LinkText } from "lib/Components/Text/LinkText"
import { PAGE_SIZE } from "lib/data/constants"
import { Fonts } from "lib/data/fonts"
import { navigate } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { extractNodes } from "lib/utils/extractNodes"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { groupBy } from "lodash"
import moment from "moment"
import { Flex, Separator, Spinner, Text } from "palette"
import React, { useState } from "react"
import { SectionList } from "react-native"
import { RelayPaginationProp } from "react-relay"
import { createPaginationContainer, graphql, QueryRenderer } from "react-relay"
import { Tab } from "../Favorites/Favorites"

interface Props {
  me: AuctionResultsForYou_me | null
  relay: RelayPaginationProp
}

export const AuctionResultsForYou: React.FC<Props> = ({ me, relay }) => {
  const { hasMore, isLoading, loadMore } = relay
  const [loadingMoreData, setLoadingMoreData] = useState(false)
  const auctionResultData = extractNodes(me?.auctionResultsByFollowedArtists)
  const groupedAuctionResultData = groupBy(auctionResultData, (item) => moment(item!.saleDate!).format("MMM"))
  const groupedAuctionResultSectionData = Object.keys(groupedAuctionResultData).map((key) => {
    return { date: key, data: groupedAuctionResultData[key] }
  })

  const loadMoreArtworks = () => {
    if (!hasMore() || isLoading()) {
      return
    }

    setLoadingMoreData(true)
    loadMore(PAGE_SIZE, (error) => {
      if (error) {
        console.error(error.message)
      }
      setLoadingMoreData(false)
    })
  }

  return (
    <PageWithSimpleHeader title="Auction Results for You">
      <ArtworkFiltersStoreProvider>
        <Text fontSize={14} lineHeight={21} textAlign="left" color="black60" mx={20} my={17}>
          The latest auction results for the {""}
          <LinkText onPress={() => navigate("/favorites", { passProps: { initialTab: Tab.artists } })}>
            artists you follow
          </LinkText>
          . You can also look up more auction results on the insights tab on any artist’s page.
        </Text>
        <SectionList
          sections={groupedAuctionResultSectionData}
          onEndReachedThreshold={0.5}
          onEndReached={loadMoreArtworks}
          keyExtractor={(item, index) => item.internalID + index.toString()}
          renderItem={({ item }) =>
            item ? (
              <AuctionResultFragmentContainer
                auctionResult={item}
                onPress={() => navigate(`/artist/${item.artistID}/auction-result/${item.internalID}`)}
              />
            ) : (
              <></>
            )
          }
          renderSectionHeader={({ section: { date } }) => (
            <Text
              textAlign="left"
              color="black"
              style={{ fontFamily: Fonts.Unica77LLRegular, fontSize: 18, marginLeft: 20 }}
            >
              {date}
            </Text>
          )}
          ItemSeparatorComponent={() => (
            <Flex px={2}>
              <Separator borderColor={"black5"} />
            </Flex>
          )}
          ListFooterComponent={
            loadingMoreData ? (
              <Flex my={2} flexDirection="row" justifyContent="center">
                <Spinner />
              </Flex>
            ) : null
          }
          style={{ width: useScreenDimensions().width }}
        />
      </ArtworkFiltersStoreProvider>
    </PageWithSimpleHeader>
  )
}

export const AuctionResultsForYouContainer = createPaginationContainer(
  AuctionResultsForYou,
  {
    me: graphql`
      fragment AuctionResultsForYou_me on Me
      @argumentDefinitions(first: { type: "Int", defaultValue: 10 }, after: { type: "String" }) {
        auctionResultsByFollowedArtists(first: $first, after: $after)
          @connection(key: "AuctionResultsForYouContainer_auctionResultsByFollowedArtists") {
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
      query AuctionResultsForYouContainerPaginationQuery($first: Int!, $after: String) {
        me {
          ...AuctionResultsForYou_me @arguments(first: $first, after: $after)
        }
      }
    `,
  }
)

export const AuctionResultsForYouQueryRenderer: React.FC = () => (
  <QueryRenderer<AuctionResultsForYouContainerQuery>
    environment={defaultEnvironment}
    query={graphql`
      query AuctionResultsForYouContainerQuery {
        me {
          ...AuctionResultsForYou_me
        }
      }
    `}
    variables={{}}
    cacheConfig={{
      force: true,
    }}
    render={renderWithLoadProgress(AuctionResultsForYouContainer)}
  />
)
