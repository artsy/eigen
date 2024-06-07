import { Flex, useTheme, Separator } from "@artsy/palette-mobile"
import { BottomTabBarProps } from "@react-navigation/bottom-tabs"
import { findFocusedRoute } from "@react-navigation/native"
import { AppModule, modules } from "app/AppRegistry"
import { GlobalStore } from "app/store/GlobalStore"
import { useIsStaging } from "app/utils/hooks/useIsStaging"
import { useEffect } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import useInterval from "react-use/lib/useInterval"
import { BOTTOM_TABS_TEXT_HEIGHT, BottomTabsButton } from "./BottomTabsButton"
import { ICON_HEIGHT } from "./BottomTabsIcon"

export const FETCH_NOTIFICATIONS_INFO_INTERVAL = 60 * 1000 // every 60 seconds
export const BOTTOM_TABS_HEIGHT = ICON_HEIGHT + BOTTOM_TABS_TEXT_HEIGHT

export const BottomTabs: React.FC<BottomTabBarProps> = (props) => {
  const { color } = useTheme()
  const focusedRoute = findFocusedRoute(props.state)
  const params = focusedRoute?.params as any
  const module = modules[params?.moduleName as AppModule]
  const unreadConversationsCount = GlobalStore.useAppState(
    (state) => state.bottomTabs.sessionState.unreadCounts.conversations
  )
  const hasUnseenNotifications = GlobalStore.useAppState(
    (state) => state.bottomTabs.hasUnseenNotifications
  )

  useEffect(() => {
    GlobalStore.actions.bottomTabs.fetchNotificationsInfo()
  }, [])

  useInterval(() => {
    GlobalStore.actions.bottomTabs.fetchNotificationsInfo()
    // run this every 60 seconds
  }, FETCH_NOTIFICATIONS_INFO_INTERVAL)

  const isStaging = useIsStaging()

  const { bottom } = useSafeAreaInsets()

  if (module?.options?.hidesBottomTabs) {
    return null
  }

  return (
    <Flex position="absolute" left={0} right={0} bottom={0} pb={`${bottom}px`} bg="white100">
      <Separator
        style={{
          borderColor: isStaging ? color("devpurple") : color("black10"),
        }}
      />
      <Flex flexDirection="row" height={BOTTOM_TABS_HEIGHT} px={1}>
        <BottomTabsButton tab="home" forceDisplayVisualClue={hasUnseenNotifications} />
        <BottomTabsButton tab="search" />
        <BottomTabsButton tab="inbox" badgeCount={unreadConversationsCount} />
        <BottomTabsButton tab="sell" />
        <BottomTabsButton tab="profile" visualClue="MyCollectionInsights" />
      </Flex>
    </Flex>
  )
}
