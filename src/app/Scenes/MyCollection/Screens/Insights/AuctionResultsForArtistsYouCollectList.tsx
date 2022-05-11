import { AuctionResultsForArtistsYouCollectList_me$key } from "__generated__/AuctionResultsForArtistsYouCollectList_me.graphql"
import { AuctionResultsForArtistsYouCollectListQuery } from "__generated__/AuctionResultsForArtistsYouCollectListQuery.graphql"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { ListHeader } from "app/Components/ListHeader"
import { AuctionResultListItemFragmentContainer } from "app/Components/Lists/AuctionResultListItem"
import { navigate } from "app/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { useScreenDimensions } from "app/utils/useScreenDimensions"
import { groupBy } from "lodash"
import moment from "moment"
import { Flex, Spinner, Text } from "palette"
import React, { useState } from "react"
import { NativeScrollEvent, NativeSyntheticEvent, RefreshControl, SectionList } from "react-native"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

const articlesQueryVariables = {
  count: 10,
}

export const AuctionResultsForArtistsYouCollectList: React.FC<{}> = () => {
  const queryData = useLazyLoadQuery<AuctionResultsForArtistsYouCollectListQuery>(
    AuctionResultsForArtistsYouCollectListScreenQuery,
    articlesQueryVariables
  )

  const { data, loadNext, hasNext, isLoadingNext, refetch } = usePaginationFragment<
    AuctionResultsForArtistsYouCollectListQuery,
    AuctionResultsForArtistsYouCollectList_me$key
  >(auctionResultsForArtistsYouCollectListFragment, queryData.me!)

  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [showHeader, setShowHeader] = useState<boolean>(false)

  const allAuctionResults = extractNodes(data.myCollectionAuctionResults)

  const groupedAuctionResults = groupBy(allAuctionResults, (item) =>
    moment(item!.saleDate!).format("YYYY-MM")
  )

  const groupedAuctionResultSections = Object.entries(groupedAuctionResults).map(
    ([date, auctionResults]) => {
      const sectionTitle = moment(date).format("MMMM")

      return { sectionTitle, data: auctionResults }
    }
  )

  const handleRefresh = () => {
    setRefreshing(true)
    refetch({ count: articlesQueryVariables.count })
    setRefreshing(false)
  }

  const handleLoadMore = () => {
    if (!hasNext || isLoadingNext) {
      return
    }

    loadNext(articlesQueryVariables.count)
  }

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (event.nativeEvent.contentOffset.y > 40) {
      setShowHeader(true)
    } else {
      setShowHeader(false)
    }
  }

  return (
    <Flex flexDirection="column" justifyContent="space-between" height="100%">
      <FancyModalHeader hideBottomDivider>{!!showHeader && "Auction Results"} </FancyModalHeader>
      <SectionList
        testID="Results_Section_List"
        onScroll={(event) => handleScroll(event)}
        sections={groupedAuctionResultSections}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        onEndReached={handleLoadMore}
        keyExtractor={(item) => item.internalID}
        stickySectionHeadersEnabled
        ListHeaderComponent={() => {
          return (
            <ListHeader
              title="Auction Results"
              subtitle="The latest auction results for the artists you collect."
            />
          )
        }}
        renderSectionHeader={({ section: { sectionTitle } }) => (
          <Flex mx="2">
            <Text variant="md">{sectionTitle}</Text>
          </Flex>
        )}
        renderItem={({ item }) =>
          item ? (
            <Flex>
              <AuctionResultListItemFragmentContainer
                auctionResult={item}
                showArtistName
                onPress={() => {
                  navigate(`/artist/${item.artistID}/auction-result/${item.internalID}`)
                }}
              />
            </Flex>
          ) : (
            <></>
          )
        }
        ListFooterComponent={
          isLoadingNext ? (
            <Flex my={3} flexDirection="row" justifyContent="center">
              <Spinner />
            </Flex>
          ) : null
        }
        style={{ width: useScreenDimensions().width, paddingBottom: 40 }}
      />
    </Flex>
  )
}

const auctionResultsForArtistsYouCollectListFragment = graphql`
  fragment AuctionResultsForArtistsYouCollectList_me on Me
  @refetchable(queryName: "AuctionResultsForArtistsYouCollectList_meRefetch")
  @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, after: { type: "String" }) {
    myCollectionAuctionResults(first: $count, after: $after)
      @connection(key: "AuctionResults_myCollectionAuctionResults") {
      totalCount
      edges {
        node {
          id
          internalID
          artistID
          saleDate
          ...AuctionResultListItem_auctionResult
        }
      }
    }
  }
`

const AuctionResultsForArtistsYouCollectListScreenQuery = graphql`
  query AuctionResultsForArtistsYouCollectListQuery($count: Int, $after: String) {
    me {
      ...AuctionResultsForArtistsYouCollectList_me @arguments(count: $count, after: $after)
    }
  }
`
