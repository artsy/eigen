import { SalesAuctionsOverviewQuery } from "__generated__/SalesAuctionsOverviewQuery.graphql"
import { CurrentlyRunningAuctions } from "app/Scenes/Sales/CurrentlyRunningAuctions"
import { UpcomingAuctions } from "app/Scenes/Sales/UpcomingAuctions"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { graphql, useLazyLoadQuery } from "react-relay"

interface SalesAuctionsOverviewProps {
  setCurrentSalesCountOnParent: (count: number) => void
  setUpcomingSalesCountOnParent: (count: number) => void
}

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

export const SalesAuctionsOverviewQueryRenderer = withSuspense<SalesAuctionsOverviewProps>({
  Component: ({ setCurrentSalesCountOnParent, setUpcomingSalesCountOnParent }) => {
    const data = useLazyLoadQuery<SalesAuctionsOverviewQuery>(
      SalesAuctionsOverviewScreenQuery,
      {},
      { fetchPolicy: "store-and-network" }
    )

    return (
      <>
        <CurrentlyRunningAuctions
          sales={data.currentlyRunningAuctions}
          setSalesCountOnParent={setCurrentSalesCountOnParent}
        />

        <UpcomingAuctions
          sales={data.upcomingAuctions}
          setSalesCountOnParent={setUpcomingSalesCountOnParent}
        />
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
