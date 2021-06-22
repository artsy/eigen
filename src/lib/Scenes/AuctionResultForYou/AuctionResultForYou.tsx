import { AuctionResultForYou_me } from "__generated__/AuctionResultForYou_me.graphql"
import { AuctionResultForYouContainerQuery } from "__generated__/AuctionResultForYouContainerQuery.graphql"
import { ArtworkFiltersStoreProvider } from "lib/Components/ArtworkFilter/ArtworkFilterStore"
import { AuctionResultFragmentContainer } from "lib/Components/Lists/AuctionResultListItem"
import { PageWithSimpleHeader } from "lib/Components/PageWithSimpleHeader"
import Spinner from "lib/Components/Spinner"
import { LinkText } from "lib/Components/Text/LinkText"
import { PAGE_SIZE } from "lib/data/constants"
import { Fonts } from "lib/data/fonts"
import { navigate } from "lib/navigation/navigate"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { groupBy } from "lodash"
import moment from "moment"
import { Flex, Separator, Text } from "palette"
import React, { useState } from "react"
import { SectionList } from "react-native"
import { RelayPaginationProp } from "react-relay"
import { createPaginationContainer, graphql, QueryRenderer } from "react-relay"
import { Tab } from "../Favorites/Favorites"

interface Props {
  me: AuctionResultForYou_me | null
  relay: RelayPaginationProp
}

export const AuctionResultForYou: React.FC<Props> = ({ me, relay }) => {
  const { hasMore, isLoading, loadMore } = relay
  const [loadingMoreData, setLoadingMoreData] = useState(false)
  const auctionResultData = me?.auctionResultsByFollowedArtists?.edges

  const groupedAuctionResultData = groupBy(auctionResultData, (item) => moment(item!.node!.saleDate!).format("MMM"))

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
        console.log(error.message)
      }
      setLoadingMoreData(false)
    })
  }

  return (
    <PageWithSimpleHeader title="Auction Results for You">
      <ArtworkFiltersStoreProvider>
        <Text
          fontSize={14}
          lineHeight={21}
          textAlign="left"
          color="black60"
          style={{ marginHorizontal: 20, marginVertical: 17 }}
        >
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
          renderItem={({ item }) =>
            item?.node ? (
              <AuctionResultFragmentContainer
                auctionResult={item.node}
                onPress={() => navigate(`/artist/${item.node?.artistID}/auction-result/${item.node?.internalID}`)}
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
              <Separator />
            </Flex>
          )}
          ListFooterComponent={loadingMoreData ? <Spinner style={{ marginTop: 20, marginBottom: 20 }} /> : null}
          style={{ width: useScreenDimensions().width }}
        />
      </ArtworkFiltersStoreProvider>
    </PageWithSimpleHeader>
  )
}

export const AuctionResultForYouContainer = createPaginationContainer(
  AuctionResultForYou,
  {
    me: graphql`
      fragment AuctionResultForYou_me on Me
      @argumentDefinitions(first: { type: "Int", defaultValue: 10 }, after: { type: "String" }) {
        auctionResultsByFollowedArtists(first: $first, after: $after)
          @connection(key: "AuctionResultForYouContainer_auctionResultsByFollowedArtists") {
          totalCount
          edges {
            node {
              ...AuctionResultListItem_auctionResult
              currency
              dateText
              id
              artistID
              internalID
              images {
                thumbnail {
                  url(version: "square140")
                  height
                  width
                  aspectRatio
                }
              }
              estimate {
                low
              }
              mediumText
              organization
              boughtIn
              performance {
                mid
              }
              priceRealized {
                display
                cents
              }
              saleDate
              title
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
      query AuctionResultForYouContainerPaginationQuery($first: Int!, $after: String) {
        me {
          ...AuctionResultForYou_me @arguments(first: $first, after: $after)
        }
      }
    `,
  }
)

export const AuctionResultForYouQueryRenderer: React.FC = () => (
  <QueryRenderer<AuctionResultForYouContainerQuery>
    environment={defaultEnvironment}
    query={graphql`
      query AuctionResultForYouContainerQuery {
        me {
          ...AuctionResultForYou_me
        }
      }
    `}
    variables={{}}
    cacheConfig={{
      force: true,
    }}
    render={renderWithLoadProgress(AuctionResultForYouContainer)}
  />
)
