import { Flex, Skeleton, SkeletonText, Spacer } from "@artsy/palette-mobile"
import { SalesLatestAuctionResultsQuery } from "__generated__/SalesLatestAuctionResultsQuery.graphql"
import { AuctionResultsListItemLoadingSkeleton } from "app/Components/AuctionResultsList"
import { LatestAuctionResultsRail } from "app/Components/LatestAuctionResultsRail"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { graphql, useLazyLoadQuery } from "react-relay"

export const SalesLatestAuctionResultsScreenQuery = graphql`
  query SalesLatestAuctionResultsQuery {
    me {
      ...LatestAuctionResultsRail_me
    }
  }
`

export const SalesLatestAuctionResultsQueryRenderer = withSuspense({
  Component: () => {
    const data = useLazyLoadQuery<SalesLatestAuctionResultsQuery>(
      SalesLatestAuctionResultsScreenQuery,
      {},
      { fetchPolicy: "store-and-network" }
    )

    if (!data.me) {
      return null
    }

    return <LatestAuctionResultsRail me={data.me} />
  },
  LoadingFallback: () => {
    return (
      <Skeleton>
        <Flex mx={2}>
          <SkeletonText variant="sm-display">Artworks Rail</SkeletonText>
          <Spacer y={2} />

          <Flex flexDirection="row" gap={2}>
            <AuctionResultsListItemLoadingSkeleton />
          </Flex>
        </Flex>
      </Skeleton>
    )
  },
  ErrorFallback: ({ error }) => {
    if (__DEV__) {
      console.log("LOGD [SalesLatestAuctionResults] Query Error:", error)
    }
    return null
  },
})
