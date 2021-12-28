import { GlobalStore, useIsStaging, useVisualClue } from "lib/store/GlobalStore"
import { Flex, Separator, useTheme } from "palette"
import React, { useEffect } from "react"
import { Text } from "react-native"
import useInterval from "react-use/lib/useInterval"
import { BottomTabsButton } from "./BottomTabsButton"
import { ICON_HEIGHT } from "./BottomTabsIcon"

export const BottomTabs: React.FC = () => {
  const { color } = useTheme()

  const unreadConversationCount = GlobalStore.useAppState(
    (state) => state.bottomTabs.sessionState.unreadConversationCount
  )

  useEffect(() => {
    GlobalStore.actions.bottomTabs.fetchCurrentUnreadConversationCount()
  }, [])

  useInterval(() => {
    GlobalStore.actions.bottomTabs.fetchCurrentUnreadConversationCount()
    // run this every 60 seconds
  }, 1000 * 60)

  const isStaging = useIsStaging()
  const { lastSeenVisualClue } = useVisualClue()

  return (
    <Flex>
      <Separator
        style={{
          borderColor: isStaging ? color("devpurple") : color("black10"),
        }}
      />
      <Flex flexDirection="row" height={ICON_HEIGHT} px={1}>
        <BottomTabsButton tab="home" visualClue="TestClue1" />
        <BottomTabsButton tab="search" visualClue="TestClue1" />
        <BottomTabsButton tab="inbox" badgeCount={unreadConversationCount} visualClue="TestClue1" />
        <BottomTabsButton tab="sell" visualClue="TestClue1" />
        <BottomTabsButton tab="profile" visualClue="TestClue1" />
        <Text>{lastSeenVisualClue}</Text>
      </Flex>
    </Flex>
  )
}
