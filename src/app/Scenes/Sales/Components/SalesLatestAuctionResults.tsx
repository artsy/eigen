import { Text } from "@artsy/palette-mobile"
import { SalesLatestAuctionResultsQuery } from "__generated__/SalesLatestAuctionResultsQuery.graphql"
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

    console.log("LOGD [SalesLatestAuctionResults] = ", data)

    if (!data.me) {
      return null
    }

    return <LatestAuctionResultsRail me={data.me} />
  },
  LoadingFallback: () => <Text variant="lg">Loading latest auction results...</Text>,
  ErrorFallback: ({ error }) => {
    if (__DEV__) {
      console.log("LOGD [SalesLatestAuctionResults] Query Error:", error)
    }
    return null
  },
})
