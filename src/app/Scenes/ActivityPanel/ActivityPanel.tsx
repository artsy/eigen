import { ActivityPanelQuery } from "__generated__/ActivityPanelQuery.graphql"
import { Flex, Text } from "palette"
import { Suspense } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ActivityPanelList } from "./ActivityPanelList"

export const ActivityPanelContent = () => {
  const queryData = useLazyLoadQuery<ActivityPanelQuery>(ActivityPanelScreenQuery, {})

  return <ActivityPanelList viewer={queryData.viewer} />
}

export const ActivityPanel = () => {
  return (
    <Suspense fallback={<Placeholder />}>
      <ActivityPanelContent />
    </Suspense>
  )
}

const Placeholder = () => (
  <Flex flex={1} justifyContent="center" alignItems="center">
    <Text>Loading</Text>
  </Flex>
)

const ActivityPanelScreenQuery = graphql`
  query ActivityPanelQuery {
    viewer {
      ...ActivityPanelList_viewer
    }
  }
`
