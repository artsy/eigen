import { ActionType } from "@artsy/cohesion"
import { ClickedActivityPanelTab } from "@artsy/cohesion/dist/Schema/Events/ActivityPanel"
import { NotificationTypesEnum } from "__generated__/ActivityItem_item.graphql"
import { ActivityQuery } from "__generated__/ActivityQuery.graphql"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { StickyTabPage, TabProps } from "app/Components/StickyTabPage/StickyTabPage"
import { goBack } from "app/navigation/navigate"
import { Flex } from "palette"
import { Suspense } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"
import { useTracking } from "react-tracking"
import { ActivityList } from "./ActivityList"
import { ActivityTabPlaceholder } from "./ActivityTabPlaceholder"
import { NotificationType } from "./types"
import { getNotificationTypes } from "./utils/getNotificationTypes"

interface ActivityProps {
  type: NotificationType
}

export const ActivityContent: React.FC<ActivityProps> = ({ type }) => {
  const types = getNotificationTypes(type)
  const queryData = useLazyLoadQuery<ActivityQuery>(
    ActivityScreenQuery,
    {
      count: 10,
      types,
    },
    {
      fetchPolicy: "store-and-network",
    }
  )

  return <ActivityList viewer={queryData.viewer} me={queryData.me} type={type} />
}

export const ActivityContainer: React.FC<ActivityProps> = (props) => {
  return (
    <Suspense fallback={<ActivityTabPlaceholder />}>
      <ActivityContent {...props} />
    </Suspense>
  )
}

export const Activity = () => {
  const tracking = useTracking()

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

  const handleTabPress = (tabIndex: number) => {
    const tab = tabs[tabIndex]
    tracking.trackEvent(tracks.clickedActivityPanelTab(tab.title))
  }

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
        shouldTrackEventOnTabClick={false}
        onTabPress={handleTabPress}
      />
    </Flex>
  )
}

const ActivityScreenQuery = graphql`
  query ActivityQuery($count: Int, $after: String, $types: [NotificationTypesEnum]) {
    viewer {
      ...ActivityList_viewer @arguments(count: $count, after: $after, types: $types)
    }
    me {
      ...ActivityList_me
    }
  }
`

const tracks = {
  clickedActivityPanelTab: (tabName: string): ClickedActivityPanelTab => ({
    action: ActionType.clickedActivityPanelTab,
    tab_name: tabName,
  }),
}
