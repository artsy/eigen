import { color, Flex, Separator } from "@artsy/palette"
import { isStaging } from "lib/relay/config"
import { AppStore } from "lib/store/AppStore"
import { useInterval } from "lib/utils/useInterval"
import React, { useEffect } from "react"
import { BottomTabsButton } from "./BottomTabsButton"
import { ICON_HEIGHT } from "./BottomTabsIcon"

export const BottomTabs: React.FC = () => {
  const unreadConversationCount = AppStore.useAppState(state => state.bottomTabs.sessionState.unreadConversationCount)

  useEffect(() => {
    AppStore.actions.bottomTabs.fetchCurrentUnreadConversationCount()
  }, [])

  useInterval(() => {
    AppStore.actions.bottomTabs.fetchCurrentUnreadConversationCount()
    // run this every 60 seconds
  }, 1000 * 60)

  return (
    <Flex flex={1}>
      <Separator style={{ borderColor: isStaging ? color("purple100") : color("black10") }} />
      <Flex flexDirection="row" height={ICON_HEIGHT} px={1}>
        <BottomTabsButton tab="home" />
        <BottomTabsButton tab="search" />
        <BottomTabsButton tab="inbox" badgeCount={unreadConversationCount} />
        <BottomTabsButton tab="sell" />
        <BottomTabsButton tab="profile" />
      </Flex>
    </Flex>
  )
}
