import { LoadFailureView } from "app/Components/LoadFailureView"
import { cityGuideCitiesQuery } from "app/Scenes/CityGuide/hooks/useCityGuideCities"
import { FallbackProps } from "react-error-boundary"
import { fetchQuery, useRelayEnvironment } from "react-relay"

/**
 * Both City Guide routes hide the navigation header, so this keeps a back button. Retry
 * refetches first: an empty list is cached in the store, and a plain remount reads it back.
 */
export const CityGuideCitiesLoadFailure: React.FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  const environment = useRelayEnvironment()

  const retry = () => {
    fetchQuery(environment, cityGuideCitiesQuery, {}, { fetchPolicy: "network-only" })
      .toPromise()
      .catch(() => null)
      .finally(resetErrorBoundary)
  }

  return <LoadFailureView error={error} onRetry={retry} showBackButton />
}
