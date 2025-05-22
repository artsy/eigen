import { Flex, Spinner } from "@artsy/palette-mobile"
import { AlertsQuery } from "__generated__/AlertsQuery.graphql"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { AlertsListPaginationContainer } from "app/Scenes/Favorites/Components/AlertsList"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { graphql, useLazyLoadQuery } from "react-relay"

export const alertsQuery = graphql`
  query AlertsQuery {
    me {
      ...AlertsList_me
    }
  }
`

export const AlertsQueryRenderer = withSuspense({
  Component: ({}) => {
    const data = useLazyLoadQuery<AlertsQuery>(
      alertsQuery,
      {},
      {
        fetchPolicy: "store-and-network",
      }
    )

    if (!data?.me) {
      return null
    }

    return <AlertsListPaginationContainer me={data.me} />
  },
  LoadingFallback: () => (
    <Flex flex={1}>
      <Flex flex={1} justifyContent="center" alignItems="center">
        <Spinner />
      </Flex>
    </Flex>
  ),
  ErrorFallback: (fallbackProps) => {
    return (
      <LoadFailureView
        onRetry={fallbackProps.resetErrorBoundary}
        useSafeArea={false}
        error={fallbackProps.error}
        trackErrorBoundary={false}
      />
    )
  },
})
