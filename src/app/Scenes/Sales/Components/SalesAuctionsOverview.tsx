import { SalesAuctionsOverviewQuery } from "__generated__/SalesAuctionsOverviewQuery.graphql"
import { CurrentlyRunningAuctions } from "app/Scenes/Sales/CurrentlyRunningAuctions"
import { UpcomingAuctions } from "app/Scenes/Sales/UpcomingAuctions"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { graphql, useLazyLoadQuery } from "react-relay"

export const SalesAuctionsOverviewScreenQuery = graphql`
  query SalesAuctionsOverviewQuery {
    currentlyRunningAuctions: viewer {
      ...CurrentlyRunningAuctions_viewer
    }
    upcomingAuctions: viewer {
      ...UpcomingAuctions_viewer
    }
  }
`

export const SalesAuctionsOverviewQueryRenderer = withSuspense({
  Component: ({}) => {
    const data = useLazyLoadQuery<SalesAuctionsOverviewQuery>(
      SalesAuctionsOverviewScreenQuery,
      {},
      { fetchPolicy: "store-and-network" }
    )

    return (
      <>
        <CurrentlyRunningAuctions sales={data.currentlyRunningAuctions} />

        <UpcomingAuctions sales={data.upcomingAuctions} />
      </>
    )
  },
  LoadingFallback: () => null,
  ErrorFallback: ({ error }) => {
    if (__DEV__) {
      console.error("[SalesAuctions] Query Error:", error)
    }
    return null
  },
})
