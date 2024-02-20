import { ActionType, OwnerType } from "@artsy/cohesion"
import { ClickedActivityPanelTab } from "@artsy/cohesion/dist/Schema/Events/ActivityPanel"
import { Tabs } from "@artsy/palette-mobile"
import { ActivityContainer } from "app/Scenes/Activity/ActivityContainer"
import { NewActivityScreen } from "app/Scenes/Activity/NewActivityScreen"
import { goBack } from "app/system/navigation/navigate"

import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { ProvideScreenTrackingWithCohesionSchema } from "app/utils/track"
import { screen } from "app/utils/track/helpers"
import { OnTabChangeCallback } from "react-native-collapsible-tab-view"
import { useTracking } from "react-tracking"

export const Activity = () => {
  const enableNewActivityPanelManagement = useFeatureFlag("AREnableNewActivityPanelManagement")

  const tracking = useTracking()

  const handleTabPress: OnTabChangeCallback = (data) => {
    tracking.trackEvent(tracks.clickedActivityPanelTab(data.tabName))
  }

  if (enableNewActivityPanelManagement) {
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
        }}
        headerHeight={40}
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
