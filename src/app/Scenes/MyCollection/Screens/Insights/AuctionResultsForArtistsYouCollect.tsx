import { AuctionResultsForArtistsYouCollect_me$key } from "__generated__/AuctionResultsForArtistsYouCollect_me.graphql"
import { AuctionResultsForArtistsYouCollectQuery } from "__generated__/AuctionResultsForArtistsYouCollectQuery.graphql"
import { AuctionResultsList, LoadingSkeleton } from "app/Components/AuctionResultsList"
import { PageWithSimpleHeader } from "app/Components/PageWithSimpleHeader"
import { navigate } from "app/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
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

  const auctionResults = extractNodes(data.myCollectionAuctionResults)

  const handleRefresh = () => {
    setRefreshing(true)
    refetch({ count: articlesQueryVariables.count }, { onComplete: () => setRefreshing(false) })
    setRefreshing(false)
  }

  const handleLoadMore = () => {
    if (!hasNext || isLoadingNext) {
      return
    }

    loadNext(articlesQueryVariables.count)
  }

  return (
    <PageWithSimpleHeader title="Auction Results for Artists You Collect">
      <AuctionResultsList
        auctionResults={auctionResults}
        refreshing={refreshing}
        handleRefresh={handleRefresh}
        onEndReached={handleLoadMore}
        ListHeaderComponent={<ListHeader />}
        onItemPress={(item: any) => {
          navigate(`/artist/${item.artistID}/auction-result/${item.internalID}`)
        }}
        isLoadingNext={isLoadingNext}
      />
    </PageWithSimpleHeader>
  )
}

export const AuctionResultsForArtistsYouCollect: React.FC = () => {
  return (
    <Suspense
      fallback={
        <LoadingSkeleton
          title="Auction Results for Artists You Collect"
          listHeader={<ListHeader />}
        />
      }
    >
      <ListOfresults />
    </Suspense>
  )
}

export const ListHeader: React.FC = () => {
  return (
    <Flex>
      <Text fontSize={14} lineHeight={21} textAlign="left" color="black60" mx={20} my={17}>
        The latest auction results for the artists you collect.
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
