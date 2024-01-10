import { ActionType, OwnerType } from "@artsy/cohesion"
import { ClickedActivityPanelTab } from "@artsy/cohesion/dist/Schema/Events/ActivityPanel"
import { MoreIcon, Tabs, Touchable } from "@artsy/palette-mobile"
import { useActionSheet } from "@expo/react-native-action-sheet"
import { ActivityQuery } from "__generated__/ActivityQuery.graphql"
import { useMarkAllNotificationsAsRead } from "app/Scenes/Activity/hooks/useMarkAllNotificationsAsRead"
import { useMarkNotificationsAsSeen } from "app/Scenes/Activity/hooks/useMarkNotificationsAsSeen"
import { goBack, navigate } from "app/system/navigation/navigate"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
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
  const enableNavigateToASingleNotification = useFeatureFlag("AREnableSingleActivityPanelScreen")

  const tracking = useTracking()
  const { showActionSheetWithOptions } = useActionSheet()
  const { markAllNotificationsAsRead } = useMarkAllNotificationsAsRead()

  const handleTabPress: OnTabChangeCallback = (data) => {
    tracking.trackEvent(tracks.clickedActivityPanelTab(data.tabName))
  }

  return (
    <ProvideScreenTrackingWithCohesionSchema
      info={screen({ context_screen_owner_type: OwnerType.activities })}
    >
      <Tabs.TabsWithHeader
        title="Activity"
        onTabChange={handleTabPress}
        headerProps={{
          onBack: goBack,
          rightElements: enableNavigateToASingleNotification && (
            <Touchable
              onPress={() => {
                showActionSheetWithOptions(
                  {
                    options: ["Mark all as read", "Edit Alerts", "Edit Follows", "Cancel"],
                    cancelButtonIndex: 3,
                    useModal: true,
                  },
                  (buttonIndex) => {
                    switch (buttonIndex) {
                      case 0:
                        markAllNotificationsAsRead()
                        break
                      case 1:
                        navigate("settings/alerts")
                        break
                      case 2:
                        navigate("favorites")
                        break
                    }
                  }
                )
              }}
            >
              <MoreIcon fill="black100" accessibilityLabel="Notifications menu" />
            </Touchable>
          ),
        }}
      >
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
    </ProvideScreenTrackingWithCohesionSchema>
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
