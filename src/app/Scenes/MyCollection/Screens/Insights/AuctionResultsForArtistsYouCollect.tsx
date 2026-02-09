import { BackButton, Screen, useSpace } from "@artsy/palette-mobile"
import { AuctionResultsForArtistsYouCollectQuery } from "__generated__/AuctionResultsForArtistsYouCollectQuery.graphql"
import { AuctionResultsForArtistsYouCollect_me$key } from "__generated__/AuctionResultsForArtistsYouCollect_me.graphql"
import { AuctionResultsList, LoadingSkeleton } from "app/Components/AuctionResultsList"
// eslint-disable-next-line no-restricted-imports
import { goBack, navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import React, { Suspense, useState } from "react"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

const PAGE_SIZE = 20
const TITLE = "Recently Sold at Auctions"
const SUBTITLE = "Stay up-to-date on the prices your artists achieve at auctions"

export const ListOfresults: React.FC<{}> = () => {
  const queryData = useLazyLoadQuery<AuctionResultsForArtistsYouCollectQuery>(
    AuctionResultsForArtistsYouCollectScreenQuery,
    articlesQueryVariables,
    { fetchPolicy: "store-and-network" }
  )

  const { data, loadNext, hasNext, isLoadingNext, refetch } = usePaginationFragment<
    AuctionResultsForArtistsYouCollectQuery,
    AuctionResultsForArtistsYouCollect_me$key
  >(auctionResultsForArtistsYouCollectFragment, queryData.me)

  const [refreshing, setRefreshing] = useState<boolean>(false)

  const auctionResults = extractNodes(data?.myCollectionAuctionResults)

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
    <>
      <Screen.AnimatedHeader onBack={goBack} title={TITLE} />
      <Screen.StickySubHeader title={TITLE} subTitle={SUBTITLE} />
      <Screen.Body fullwidth>
        <AuctionResultsList
          auctionResults={auctionResults}
          refreshing={refreshing}
          handleRefresh={handleRefresh}
          onEndReached={handleLoadMore}
          onItemPress={(item: any) => {
            navigate(`/artist/${item.artistID}/auction-result/${item.internalID}`)
          }}
          isLoadingNext={isLoadingNext}
        />
      </Screen.Body>
    </>
  )
}

export const AuctionResultsForArtistsYouCollect: React.FC = () => {
  const space = useSpace()

  return (
    <Screen>
      <Suspense fallback={<LoadingSkeleton title={TITLE} subTitle={SUBTITLE} />}>
        <ListOfresults />
      </Suspense>

      <BackButton
        style={{
          padding: space(2),
          position: "absolute",
        }}
        onPress={goBack}
      />
    </Screen>
  )
}

const auctionResultsForArtistsYouCollectFragment = graphql`
  fragment AuctionResultsForArtistsYouCollect_me on Me
  @refetchable(queryName: "AuctionResultsForArtistsYouCollect_meRefetch")
  @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, after: { type: "String" }) {
    myCollectionAuctionResults(first: $count, after: $after, state: PAST)
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
    me @optionalField {
      ...AuctionResultsForArtistsYouCollect_me @arguments(count: $count, after: $after)
    }
  }
`

const articlesQueryVariables = {
  count: PAGE_SIZE,
}
