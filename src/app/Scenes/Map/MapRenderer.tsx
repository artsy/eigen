import { MapRendererQuery } from "__generated__/MapRendererQuery.graphql"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { SafeAreaInsets } from "app/utils/hooks"
import { SpinnerFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { graphql, useLazyLoadQuery } from "react-relay"
import { GlobalMap } from "./GlobalMap"

// Are you seeing "cannot read .fairs of null"? You might need to set your simulator location.

// This sentinel value essentially means, load /all/ records.
// See https://github.com/artsy/metaphysics/pull/1533
const MAX_GRAPHQL_INT = 2147483647

interface MapRendererProps {
  citySlug: string
  hideMapButtons: boolean
  initialCoordinates?: { lat: number; lng: number }
  safeAreaInsets: SafeAreaInsets
  userLocationWithinCity: boolean
}

const mapRendererQuery = graphql`
  query MapRendererQuery($citySlug: String!, $maxInt: Int!) {
    viewer {
      ...GlobalMap_viewer @arguments(citySlug: $citySlug, maxInt: $maxInt)
    }
  }
`

const MapRendererInner: React.FC<MapRendererProps> = (props) => {
  const data = useLazyLoadQuery<MapRendererQuery>(mapRendererQuery, {
    citySlug: props.citySlug,
    maxInt: MAX_GRAPHQL_INT,
  })

  if (!data.viewer) {
    return null
  }

  return <GlobalMap {...props} viewer={data.viewer} />
}

export const MapRenderer = withSuspense<MapRendererProps>({
  Component: MapRendererInner,
  LoadingFallback: SpinnerFallback,
  ErrorFallback: (errorProps) => (
    <LoadFailureView error={errorProps.error} onRetry={errorProps.resetErrorBoundary} />
  ),
})
