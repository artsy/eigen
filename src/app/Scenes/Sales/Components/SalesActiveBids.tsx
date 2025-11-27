import { SalesActiveBidsQuery } from "__generated__/SalesActiveBidsQuery.graphql"
import { SaleListActiveBids } from "app/Scenes/Sales/Components/SaleListActiveBids"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { graphql, useLazyLoadQuery } from "react-relay"

export const SalesActiveBidsScreenQuery = graphql`
  query SalesActiveBidsQuery {
    me {
      ...SaleListActiveBids_me
    }
  }
`

export const SalesActiveBidsQueryRenderer = withSuspense({
  Component: () => {
    const data = useLazyLoadQuery<SalesActiveBidsQuery>(
      SalesActiveBidsScreenQuery,
      {},
      { fetchPolicy: "store-and-network" }
    )

    if (!data.me) {
      return null
    }

    return <SaleListActiveBids me={data.me} />
  },
  LoadingFallback: () => null,
  ErrorFallback: ({ error }) => {
    if (__DEV__) {
      console.error("[SalesActiveBids] Query Error:", error)
    }
    return null
  },
})
