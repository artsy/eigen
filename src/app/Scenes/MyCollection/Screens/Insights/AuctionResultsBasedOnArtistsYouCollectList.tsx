import { AuctionResultsBasedOnArtistsYouCollectList_me$key } from "__generated__/AuctionResultsBasedOnArtistsYouCollectList_me.graphql"
import { AuctionResultsBasedOnArtistsYouCollectListQuery } from "__generated__/AuctionResultsBasedOnArtistsYouCollectListQuery.graphql"
import { extractNodes } from "app/utils/extractNodes"
import { Text } from "palette"
import React, { useState } from "react"
import { graphql, useFragment, useLazyLoadQuery, usePaginationFragment } from "react-relay"

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

  const handleLoadMore = () => {
    if (!hasNext || isLoadingNext) {
      return
    }

    loadNext(articlesQueryVariables.count)
  }

  const handleRefresh = () => {
    setRefreshing(true)
    refetch({})
    setRefreshing(false)
  }

  const results = extractNodes(data.myCollectionAuctionResults)

  console.log("LOGD RESULTS = ", results.length, results)

  console.log("data = ", data)
  if (!queryData) {
    return null
  }

  /*   const fragmentData = useFragment<AuctionResultsBasedOnArtistsYouCollectList_me$key>(
    auctionResultsBasedOnArtistsYouCollectListFragment,
    data.me!
  ) */

  return <Text> HELLO </Text>
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
          ...AuctionResultListItem_auctionResult
          id
          internalID
          artistID
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

/*
{
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
*/
