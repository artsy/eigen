import { NotificationTypesEnum } from "__generated__/ActivityItem_item.graphql"
import { ActivityQuery } from "__generated__/ActivityQuery.graphql"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { StickyTabPage, TabProps } from "app/Components/StickyTabPage/StickyTabPage"
import { goBack } from "app/navigation/navigate"
import { Flex, Text } from "palette"
import { Suspense } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"
import { ActivityList } from "./ActivityList"
import { NotificationType } from "./types"

interface ActivityProps {
  type: NotificationType
}

export const ActivityContent: React.FC<ActivityProps> = ({ type }) => {
  const types = getNotificationTypes(type)
  const queryData = useLazyLoadQuery<ActivityQuery>(ActivityScreenQuery, {
    count: 10,
    types,
  })

  return <ActivityList viewer={queryData.viewer} type={type} />
}

export const ActivityContainer: React.FC<ActivityProps> = (props) => {
  return (
    <Suspense fallback={<Placeholder />}>
      <ActivityContent {...props} />
    </Suspense>
  )
}

export const Activity = () => {
  const tabs: TabProps[] = [
    {
      title: "All",
      content: <ActivityContainer type="all" />,
      initial: true,
    },
    {
      title: "Alerts",
      content: <ActivityContainer type="alerts" />,
    },
  ]

  return (
    <Flex flex={1}>
      <StickyTabPage
        tabs={tabs}
        staticHeaderContent={
          <FancyModalHeader onLeftButtonPress={goBack} hideBottomDivider>
            Activity
          </FancyModalHeader>
        }
        disableBackButtonUpdate
      />
    </Flex>
  )
}

const Placeholder = () => (
  <Flex flex={1} justifyContent="center" alignItems="center">
    <Text>Loading</Text>
  </Flex>
)

const ActivityScreenQuery = graphql`
  query ActivityQuery($count: Int, $after: String, $types: [NotificationTypesEnum]) {
    viewer {
      ...ActivityList_viewer @arguments(count: $count, after: $after, types: $types)
    }
  }
`

const getNotificationTypes = (type: NotificationType): NotificationTypesEnum[] | undefined => {
  if (type === "alerts") {
    return ["ARTWORK_ALERT"]
  }

  return []
}
