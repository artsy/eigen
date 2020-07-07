import { color, Flex, Separator } from "@artsy/palette"
import { isStaging } from "lib/relay/config"
import React from "react"
import { BottomTabsButton } from "./BottomTabsButton"
import { ICON_HEIGHT } from "./BottomTabsIcon"

// This file must match "ARTabType.m/h"

export const BottomTabs: React.FC<{}> = ({}) => {
  return (
    <Flex flex={1}>
      <Separator style={{ borderColor: isStaging ? color("purple100") : color("black10") }} />
      <Flex flexDirection="row" height={ICON_HEIGHT} px={1}>
        <BottomTabsButton tab="home" />
        <BottomTabsButton tab="search" />
        <BottomTabsButton tab="inbox" badgeCount={2} />
        <BottomTabsButton tab="sell" />
        <BottomTabsButton tab="profile" />
      </Flex>
    </Flex>
  )
}
