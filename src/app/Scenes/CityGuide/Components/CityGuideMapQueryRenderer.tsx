import { CityGuideMapQueryRendererQuery } from "__generated__/CityGuideMapQueryRendererQuery.graphql"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { CityGuideMap } from "app/Scenes/CityGuide/Components/CityGuideMap"
import { MAX_GRAPHQL_INT } from "app/Scenes/CityGuide/utils/maxGraphQLInt"
import { SpinnerFallback, withSuspense } from "app/utils/hooks/withSuspense"
import { graphql, useLazyLoadQuery } from "react-relay"

// Are you seeing "cannot read .fairs of null"? You might need to set your simulator location.

interface CityGuideMapQueryRendererProps {
  citySlug: string
}

const cityGuideMapQuery = graphql`
  query CityGuideMapQueryRendererQuery($citySlug: String!, $maxInt: Int!) {
    viewer {
      ...CityGuideMap_viewer @arguments(citySlug: $citySlug, maxInt: $maxInt)
    }
  }
`

const CityGuideMapQueryRendererInner: React.FC<CityGuideMapQueryRendererProps> = (props) => {
  const data = useLazyLoadQuery<CityGuideMapQueryRendererQuery>(cityGuideMapQuery, {
    citySlug: props.citySlug,
    maxInt: MAX_GRAPHQL_INT,
  })

  if (!data.viewer) {
    return null
  }

  return <CityGuideMap {...props} viewer={data.viewer} />
}

export const CityGuideMapQueryRenderer = withSuspense<CityGuideMapQueryRendererProps>({
  Component: CityGuideMapQueryRendererInner,
  LoadingFallback: SpinnerFallback,
  ErrorFallback: (errorProps) => (
    <LoadFailureView error={errorProps.error} onRetry={errorProps.resetErrorBoundary} />
  ),
})
