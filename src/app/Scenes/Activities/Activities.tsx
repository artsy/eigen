import { ActivitiesQuery } from "__generated__/ActivitiesQuery.graphql"
import { Flex, Text } from "palette"
import { Suspense } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ActivitiesList } from "./ActivitiesList"

export const ActivitiesContent = () => {
  const queryData = useLazyLoadQuery<ActivitiesQuery>(
    ActivitiesScreenQuery,
    activitiesQueryVariables
  )

  return <ActivitiesList viewer={queryData.viewer} />
}

export const Activities = () => {
  return (
    <Suspense fallback={<Placeholder />}>
      <ActivitiesContent />
    </Suspense>
  )
}

const Placeholder = () => (
  <Flex flex={1} justifyContent="center" alignItems="center">
    <Text>Loading</Text>
  </Flex>
)

const ActivitiesScreenQuery = graphql`
  query ActivitiesQuery($count: Int, $after: String) {
    viewer {
      ...ActivitiesList_viewer @arguments(count: $count, after: $after)
    }
  }
`

const activitiesQueryVariables = {
  count: 10,
}
