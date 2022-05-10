import { AuctionResultsBasedOnArtistsYouCollectList_me$key } from "__generated__/AuctionResultsBasedOnArtistsYouCollectList_me.graphql"
import { AuctionResultsBasedOnArtistsYouCollectListQuery } from "__generated__/AuctionResultsBasedOnArtistsYouCollectListQuery.graphql"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { AuctionResultListItemFragmentContainer } from "app/Components/Lists/AuctionResultListItem"
import { navigate } from "app/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { useScreenDimensions } from "app/utils/useScreenDimensions"
import { groupBy } from "lodash"
import moment from "moment"
import { Flex, Spinner, Text } from "palette"
import React, { useState } from "react"
import { RefreshControl, SectionList } from "react-native"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

const articlesQueryVariables = {
  count: 10,
}

export const AuctionResultsBasedOnArtistsYouCollectList: React.FC<{}> = () => {
  const queryData = useLazyLoadQuery<AuctionResultsBasedOnArtistsYouCollectListQuery>(
    AuctionResultsBasedOnArtistsYouCollectListScreenQuery,
    articlesQueryVariables
  )

  const { data, loadNext, hasNext, isLoadingNext, refetch } = usePaginationFragment<
    AuctionResultsBasedOnArtistsYouCollectListQuery,
    AuctionResultsBasedOnArtistsYouCollectList_me$key
  >(auctionResultsBasedOnArtistsYouCollectListFragment, queryData.me!)

  const [refreshing, setRefreshing] = useState(false)

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
    refetch({})
    setRefreshing(false)
  }

  const handleLoadMore = () => {
    if (!hasNext || isLoadingNext) {
      return
    }

    loadNext(articlesQueryVariables.count)
  }

  console.log("LOGD data = ", data)
  if (!queryData) {
    return null
  }

  const ListHeader: React.FC = () => {
    return (
      <Flex>
        <Text variant="lg" mx={20} mt={2}>
          Auction Results
        </Text>
        <Text variant="xs" mx={20} mt={1} mb={2}>
          The latest auction results for the artists you collect.
        </Text>
      </Flex>
    )
  }

  /*
TODO: ideally add header in Animated element wothout having exeptions

  const { headerElement, scrollProps } = useStickyScrollHeader({
    header: (
      <Flex flex={1} pl={6} pr={4} pt={0.5} flexDirection="row">
        <Text variant="sm" numberOfLines={1} style={{ flexShrink: 1 }}>
          Auction Results
        </Text>
      </Flex>
    ),
  })


const renderItems = (item: any) => {
    return (
      <AuctionResultListItemFragmentContainer
        auctionResult={item}
        showArtistName
        onPress={() => {
          navigate(`/artist/${item.artistID}/auction-result/${item.internalID}`)
        }}
      />
    )
  } */

  return (
    <Flex flexDirection="column" justifyContent="space-between" height="100%">
      <FancyModalHeader hideBottomDivider />
      <SectionList
        sections={groupedAuctionResultSections}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        onEndReached={handleLoadMore}
        keyExtractor={(item) => item.internalID}
        stickySectionHeadersEnabled
        ListHeaderComponent={ListHeader}
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
            <Flex my={2} flexDirection="row" justifyContent="center">
              <Spinner />
            </Flex>
          ) : null
        }
        style={{ width: useScreenDimensions().width, paddingBottom: 40 }}
      />
    </Flex>
  )
}

const auctionResultsBasedOnArtistsYouCollectListFragment = graphql`
  fragment AuctionResultsBasedOnArtistsYouCollectList_me on Me
  @refetchable(queryName: "AuctionResultsBasedOnArtistsYouCollectList_meRefetch")
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

const AuctionResultsBasedOnArtistsYouCollectListScreenQuery = graphql`
  query AuctionResultsBasedOnArtistsYouCollectListQuery($count: Int, $after: String) {
    me {
      ...AuctionResultsBasedOnArtistsYouCollectList_me @arguments(count: $count, after: $after)
    }
  }
`
