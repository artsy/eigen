import { GlobalStore, useFeatureFlag, useIsStaging } from "app/store/GlobalStore"
import { Flex, Separator, useTheme } from "palette"
import React, { useEffect } from "react"
import useInterval from "react-use/lib/useInterval"
import { useScreenDimensions } from "shared/hooks"
import { BottomTabsButton } from "./BottomTabsButton"
import { ICON_HEIGHT } from "./BottomTabsIcon"

export const BottomTabs: React.FC = () => {
  const { color } = useTheme()

  const unreadConversationCount = GlobalStore.useAppState(
    (state) => state.bottomTabs.sessionState.unreadCounts.unreadConversationCount
  )

  const displayUnreadActivityPanelIndicator = GlobalStore.useAppState(
    (state) => state.bottomTabs.sessionState.displayUnreadActivityPanelIndicator
  )

  useEffect(() => {
    GlobalStore.actions.bottomTabs.fetchAllNotificationsCounts()
  }, [])

  useInterval(() => {
    GlobalStore.actions.bottomTabs.fetchAllNotificationsCounts()
    // run this every 60 seconds
  }, 1000 * 60)

  const isStaging = useIsStaging()
  const enableMyCollectionInsights = useFeatureFlag("AREnableMyCollectionInsights")

  const { bottom } = useScreenDimensions().safeAreaInsets
  return (
    <Flex style={{ paddingBottom: bottom }}>
      <Separator
        style={{
          borderColor: isStaging ? color("devpurple") : color("black10"),
        }}
      />
      <Flex flexDirection="row" height={ICON_HEIGHT} px={1}>
        <BottomTabsButton tab="home" forceDisplayVisualClue={displayUnreadActivityPanelIndicator} />
        <BottomTabsButton tab="search" />
        <BottomTabsButton tab="inbox" badgeCount={unreadConversationCount} />
        <BottomTabsButton tab="sell" />
        <BottomTabsButton
          tab="profile"
          visualClue={enableMyCollectionInsights ? "MyCollectionInsights" : undefined}
        />
      </Flex>
    </Flex>
  )
}
