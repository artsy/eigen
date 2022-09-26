import { ActivityQuery } from "__generated__/ActivityQuery.graphql"
import { Flex, Text } from "palette"
import { Suspense } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ActivityList } from "./ActivityList"

export const ActivityContent = () => {
  const queryData = useLazyLoadQuery<ActivityQuery>(ActivityScreenQuery, activityQueryVariables)

  return <ActivityList viewer={queryData.viewer} />
}

export const Activity = () => {
  return (
    <Suspense fallback={<Placeholder />}>
      <ActivityContent />
    </Suspense>
  )
}

const Placeholder = () => (
  <Flex flex={1} justifyContent="center" alignItems="center">
    <Text>Loading</Text>
  </Flex>
)

const ActivityScreenQuery = graphql`
  query ActivityQuery($count: Int, $after: String) {
    viewer {
      ...ActivityList_viewer @arguments(count: $count, after: $after)
    }
  }
`

const activityQueryVariables = {
  count: 10,
}
