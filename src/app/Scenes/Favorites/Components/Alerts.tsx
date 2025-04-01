import { OwnerType } from "@artsy/cohesion"
import { Flex, Spinner } from "@artsy/palette-mobile"
import { AlertsQuery } from "__generated__/AlertsQuery.graphql"
import { LoadFailureView } from "app/Components/LoadFailureView"
import {
  AlertsListPaginationContainer,
  AlertsListSortByHeader,
} from "app/Scenes/Favorites/Components/AlertsList"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
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

    return (
      <ProvideScreenTrackingWithCohesionSchema
        info={screen({ context_screen_owner_type: OwnerType.savedSearches })}
      >
        <AlertsListPaginationContainer me={data.me} />
      </ProvideScreenTrackingWithCohesionSchema>
    )
  },
  LoadingFallback: () => (
    <Flex flex={1}>
      <AlertsListSortByHeader />
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
