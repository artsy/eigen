import { ActionType } from "@artsy/cohesion"
import { ClickedActivityPanelTab } from "@artsy/cohesion/dist/Schema/Events/ActivityPanel"
import { Tabs } from "@artsy/palette-mobile"
import { ActivityQuery } from "__generated__/ActivityQuery.graphql"

import { useMarkNotificationsAsSeen } from "app/Scenes/Activity/hooks/useMarkNotificationsAsSeen"
import { Suspense } from "react"
import { OnTabChangeCallback } from "react-native-collapsible-tab-view"
import { graphql, useLazyLoadQuery } from "react-relay"
import { useTracking } from "react-tracking"
import { ActivityList } from "./ActivityList"
import { ActivityTabPlaceholder } from "./ActivityTabPlaceholder"
import { NotificationType } from "./types"
import { getNotificationTypes } from "./utils/getNotificationTypes"

interface ActivityProps {
  type: NotificationType
}

export const ActivityContainer: React.FC<ActivityProps> = (props) => {
  return (
    <Suspense fallback={<ActivityTabPlaceholder />}>
      <ActivityContent {...props} />
    </Suspense>
  )
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

  useMarkNotificationsAsSeen()

  return <ActivityList viewer={queryData.viewer} me={queryData.me} type={type} />
}

export const Activity = () => {
  const tracking = useTracking()

  const handleTabPress: OnTabChangeCallback = (data) => {
    tracking.trackEvent(tracks.clickedActivityPanelTab(data.tabName))
  }

  return (
    <Tabs.TabsWithHeader title="Activity" onTabChange={handleTabPress}>
      <Tabs.Tab name="All" label="All">
        <Tabs.Lazy>
          <ActivityContainer type="all" />
        </Tabs.Lazy>
      </Tabs.Tab>
      <Tabs.Tab name="Alerts" label="Alerts">
        <Tabs.Lazy>
          <ActivityContainer type="alerts" />
        </Tabs.Lazy>
      </Tabs.Tab>
    </Tabs.TabsWithHeader>
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
