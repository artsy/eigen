import { SalesAuctionsQuery } from "__generated__/SalesAuctionsQuery.graphql"
import { CurrentlyRunningAuctions } from "app/Scenes/Sales/CurrentlyRunningAuctions"
import { UpcomingAuctions } from "app/Scenes/Sales/UpcomingAuctions"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { graphql, useLazyLoadQuery } from "react-relay"

interface SalesAuctionsProps {
  setCurrentSalesCountOnParent: (count: number) => void
  setUpcomingSalesCountOnParent: (count: number) => void
}

export const SalesAuctionsScreenQuery = graphql`
  query SalesAuctionsQuery {
    currentlyRunningAuctions: viewer {
      ...CurrentlyRunningAuctions_viewer
    }
    upcomingAuctions: viewer {
      ...UpcomingAuctions_viewer
    }
  }
`

export const SalesAuctionsQueryRenderer = withSuspense<SalesAuctionsProps>({
  Component: ({ setCurrentSalesCountOnParent, setUpcomingSalesCountOnParent }) => {
    const data = useLazyLoadQuery<SalesAuctionsQuery>(
      SalesAuctionsScreenQuery,
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
