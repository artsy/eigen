import { AuctionResultsForArtistsYouCollect_me$key } from "__generated__/AuctionResultsForArtistsYouCollect_me.graphql"
import { AuctionResultsForArtistsYouCollectQuery } from "__generated__/AuctionResultsForArtistsYouCollectQuery.graphql"
import { AuctionResulstList, LoadingSkeleton } from "app/Components/AuctionResulstList"
import { navigate } from "app/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { ProvidePlaceholderContext } from "app/utils/placeholders"
import { groupBy } from "lodash"
import moment from "moment"
import { Flex, Text } from "palette"
import React, { Suspense, useState } from "react"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

const articlesQueryVariables = {
  count: 10,
}

export const ListOfresults: React.FC<{}> = () => {
  const queryData = useLazyLoadQuery<AuctionResultsForArtistsYouCollectQuery>(
    AuctionResultsForArtistsYouCollectScreenQuery,
    articlesQueryVariables
  )

  const { data, loadNext, hasNext, isLoadingNext, refetch } = usePaginationFragment<
    AuctionResultsForArtistsYouCollectQuery,
    AuctionResultsForArtistsYouCollect_me$key
  >(auctionResultsForArtistsYouCollectFragment, queryData.me!)

  const [refreshing, setRefreshing] = useState<boolean>(false)

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

  return (
    <AuctionResulstList
      header="Auction Results"
      sections={groupedAuctionResultSections}
      refreshing={refreshing}
      handleRefresh={handleRefresh}
      onEndReached={handleLoadMore}
      ListHeaderComponent={<ListHeader />}
      onItemPress={(item: any) => {
        navigate(`/artist/${item.artistID}/auction-result/${item.internalID}`)
      }}
      isLoadingNext={isLoadingNext}
    />
  )
}

export const AuctionResultsForArtistsYouCollect: React.FC = () => {
  return (
    <ProvidePlaceholderContext>
      <Suspense fallback={<LoadingSkeleton listHeader={<ListHeader />} />}>
        <ListOfresults />
      </Suspense>
    </ProvidePlaceholderContext>
  )
}

const ListHeader: React.FC<{}> = () => {
  return (
    <Flex>
      <Text variant="lg" mx={20} mt={2}>
        Auction Results
      </Text>
      <Text variant="xs" mx={20} mt={1} mb={2}>
        The latest auction results for the artists you collect
      </Text>
    </Flex>
  )
}
const auctionResultsForArtistsYouCollectFragment = graphql`
  fragment AuctionResultsForArtistsYouCollect_me on Me
  @refetchable(queryName: "AuctionResultsForArtistsYouCollect_meRefetch")
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

const AuctionResultsForArtistsYouCollectScreenQuery = graphql`
  query AuctionResultsForArtistsYouCollectQuery($count: Int, $after: String) {
    me {
      ...AuctionResultsForArtistsYouCollect_me @arguments(count: $count, after: $after)
    }
  }
`
