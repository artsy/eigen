import { BottomTabBarProps } from "@react-navigation/bottom-tabs"
import { findFocusedRoute } from "@react-navigation/native"
import { AppModule, modules } from "app/AppRegistry"
import { GlobalStore, useFeatureFlag, useIsStaging } from "app/store/GlobalStore"
import { Flex, Separator, useTheme } from "palette"
import React, { useEffect } from "react"
import useInterval from "react-use/lib/useInterval"
import { useScreenDimensions } from "shared/hooks"
import { BottomTabsButton } from "./BottomTabsButton"
import { ICON_HEIGHT } from "./BottomTabsIcon"

export const BottomTabs: React.FC<BottomTabBarProps> = (props) => {
  const { color } = useTheme()
  const focusedRoute = findFocusedRoute(props.state)
  const params = focusedRoute?.params as any
  const module = modules[params?.moduleName as AppModule]
  const enableArtworkRedesign = useFeatureFlag("ARArtworkRedesingPhase2")
  const unreadConversationsCount = GlobalStore.useAppState(
    (state) => state.bottomTabs.sessionState.unreadCounts.conversations
  )

  const displayUnseenNotificationsIndicator = GlobalStore.useAppState(
    (state) => state.bottomTabs.sessionState.displayUnseenNotificationsIndicator
  )

  useEffect(() => {
    GlobalStore.actions.bottomTabs.fetchNotificationsInfo()
  }, [])

  useInterval(() => {
    GlobalStore.actions.bottomTabs.fetchNotificationsInfo()
    // run this every 60 seconds
  }, 1000 * 60)

  const isStaging = useIsStaging()

  const { bottom } = useScreenDimensions().safeAreaInsets

  if (enableArtworkRedesign && module?.options?.hidesBottomTabs) {
    return null
  }

  return (
    <Flex position="absolute" left={0} right={0} bottom={0} paddingBottom={bottom} bg="white100">
      <Separator
        style={{
          borderColor: isStaging ? color("devpurple") : color("black10"),
        }}
      />
      <Flex flexDirection="row" height={ICON_HEIGHT} px={1}>
        <BottomTabsButton tab="home" forceDisplayVisualClue={displayUnseenNotificationsIndicator} />
        <BottomTabsButton tab="search" />
        <BottomTabsButton tab="inbox" badgeCount={unreadConversationsCount} />
        <BottomTabsButton tab="sell" />
        <BottomTabsButton tab="profile" visualClue="MyCollectionInsights" />
      </Flex>
    </Flex>
  )
}
