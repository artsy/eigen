import { color, Flex, Separator } from "@artsy/palette"
import { isStaging } from "lib/relay/config"
import React from "react"
import { BottomTabsButton } from "./BottomTabsButton"
import { ICON_HEIGHT } from "./BottomTabsIcon"

export const BottomTabs: React.FC<{}> = ({}) => {
  return (
    <Flex flex={1}>
      <Separator style={{ borderColor: isStaging ? color("purple100") : color("black10") }} />
      <Flex flexDirection="row" height={ICON_HEIGHT} px={1}>
        <BottomTabsButton tab="home" />
        <BottomTabsButton tab="search" />
        <BottomTabsButton tab="inbox" />
        <BottomTabsButton tab="sell" />
        <BottomTabsButton tab="profile" />
      </Flex>
    </Flex>
  )
}
