import { Screen, Skeleton, SkeletonBox, SkeletonText, Spacer, Text } from "@artsy/palette-mobile"
import { ScreenName_data$key } from "__generated__/ScreenName_data.graphql"
import { ScreenNameQuery } from "__generated__/ScreenNameQuery.graphql"
import { goBack } from "app/system/navigation/navigate"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

// Main Component
interface ScreenNameProps {
  data: ScreenName_data$key
}

export const ScreenName: React.FC<ScreenNameProps> = (props) => {
  const data = useFragment(fragment, props.data)

  return (
    <Screen>
      <Screen.AnimatedHeader title={data.title} onBack={goBack} />
      <Screen.Body>
        <Screen.ScrollView>
          <Text variant="lg">{data.title}</Text>
          <Spacer y={2} />
        </Screen.ScrollView>
      </Screen.Body>
    </Screen>
  )
}

// Fragment
const fragment = graphql`
  fragment ScreenName_data on EntityType {
    internalID
    slug
    title
  }
`

// Placeholder
export const ScreenNamePlaceholder: React.FC = () => (
  <Screen>
    <Screen.AnimatedHeader />
    <Screen.Body>
      <Skeleton>
        <SkeletonText variant="xl">Loading</SkeletonText>
        <Spacer y={2} />
        <SkeletonBox height={200} />
      </Skeleton>
    </Screen.Body>
  </Screen>
)

// Query
export const ScreenNameQuery = graphql`
  query ScreenNameQuery($id: ID!) @relay_test_operation {
    entity(id: $id) {
      ...ScreenName_data
    }
  }
`

// QueryRenderer (export this for routes.tsx)
interface ScreenNameQueryRendererProps {
  id: string
}

export const ScreenNameQueryRenderer: React.FC<ScreenNameQueryRendererProps> = withSuspense({
  Component: ({ id }) => {
    const data = useLazyLoadQuery<ScreenNameQuery>(ScreenNameQuery, { id })

    if (!data.entity) return null

    return <ScreenName data={data.entity} />
  },
  LoadingFallback: ScreenNamePlaceholder,
})
