import { AuctionResultsBasedOnArtistsYouCollectList_me$key } from "__generated__/AuctionResultsBasedOnArtistsYouCollectList_me.graphql"
import { AuctionResultsBasedOnArtistsYouCollectListQuery } from "__generated__/AuctionResultsBasedOnArtistsYouCollectListQuery.graphql"
import { extractNodes } from "app/utils/extractNodes"
import { Text } from "palette"
import React from "react"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

export const AuctionResultsBasedOnArtistsYouCollectList: React.FC<{}> = () => {
  const data = useLazyLoadQuery<AuctionResultsBasedOnArtistsYouCollectListQuery>(
    AuctionResultsBasedOnArtistsYouCollectListScreenQuery,
    {}
  )
  if (!data) {
    return null
  }

  const fragmentData = useFragment<AuctionResultsBasedOnArtistsYouCollectList_me$key>(
    auctionResultsBasedOnArtistsYouCollectListFragment,
    data.me!
  )
  const results = extractNodes(fragmentData.myCollectionAuctionResults)

  console.log("LOGD RESULTS = ", results.length, results)
  return <Text> HELLO </Text>
}

const auctionResultsBasedOnArtistsYouCollectListFragment = graphql`
  fragment AuctionResultsBasedOnArtistsYouCollectList_me on Me {
    myCollectionAuctionResults(first: 1) {
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
  query AuctionResultsBasedOnArtistsYouCollectListQuery {
    me {
      ...AuctionResultsBasedOnArtistsYouCollectList_me
    }
  }
`
