import { ActionType, OwnerType } from "@artsy/cohesion"
import { ClickedActivityPanelTab } from "@artsy/cohesion/dist/Schema/Events/ActivityPanel"
import { MoreIcon, Tabs, Touchable } from "@artsy/palette-mobile"
import { useActionSheet } from "@expo/react-native-action-sheet"
import { ActivityContainer } from "app/Scenes/Activity/ActivityContainer"
import { NewActivityScreen } from "app/Scenes/Activity/NewActivityScreen"
import { useMarkAllNotificationsAsRead } from "app/Scenes/Activity/hooks/useMarkAllNotificationsAsRead"
import { goBack, navigate } from "app/system/navigation/navigate"

import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { OnTabChangeCallback } from "react-native-collapsible-tab-view"
import { useTracking } from "react-tracking"

export const Activity = () => {
  const enableNavigateToASingleNotification = useFeatureFlag("AREnableSingleActivityPanelScreen")

  const tracking = useTracking()
  const { showActionSheetWithOptions } = useActionSheet()
  const { markAllNotificationsAsRead } = useMarkAllNotificationsAsRead()
  const showPartnerOffersInActivity = useFeatureFlag("ARShowPartnerOffersInActivity")

  const handleTabPress: OnTabChangeCallback = (data) => {
    tracking.trackEvent(tracks.clickedActivityPanelTab(data.tabName))
  }

  if (showPartnerOffersInActivity) {
    return (
      <ProvideScreenTrackingWithCohesionSchema
        info={screen({ context_screen_owner_type: OwnerType.activities })}
      >
        <NewActivityScreen />
      </ProvideScreenTrackingWithCohesionSchema>
    )
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

const tracks = {
  clickedActivityPanelTab: (tabName: string): ClickedActivityPanelTab => ({
    action: ActionType.clickedActivityPanelTab,
    tab_name: tabName,
  }),
}
