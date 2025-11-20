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

    if (!data.me) {
      return null
    }

    return <LatestAuctionResultsRail me={data.me} />
  },
  LoadingFallback: () => null,
  ErrorFallback: ({ error }) => {
    if (__DEV__) {
      console.error("[SalesLatestAuctionResults] Query Error:", error)
    }
    return null
  },
})
