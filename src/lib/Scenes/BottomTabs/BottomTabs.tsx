import { color, Flex, Separator } from "@artsy/palette"
import { ConsignActiveIcon } from "lib/Icons/bottom-tab-icons/ConsignActiveIcon"
import { ConsignIcon } from "lib/Icons/bottom-tab-icons/ConsignIcon"
import { ExploreIcon } from "lib/Icons/bottom-tab-icons/ExploreIcon"
import { ExploreActiveIcon } from "lib/Icons/bottom-tab-icons/ExporeActiveIcon"
import { HomeActiveIcon } from "lib/Icons/bottom-tab-icons/HomeActiveIcon"
import { HomeIcon } from "lib/Icons/bottom-tab-icons/HomeIcon"
import { InboxActiveIcon } from "lib/Icons/bottom-tab-icons/InboxActiveIcon"
import { InboxIcon } from "lib/Icons/bottom-tab-icons/InboxIcon"
import { ProfileActiveIcon } from "lib/Icons/bottom-tab-icons/ProfileActiveIcon"
import { ProfileIcon } from "lib/Icons/bottom-tab-icons/ProfileIcon"
import { useSelectedTab } from "lib/NativeModules/SelectedTab/SelectedTab"
import { TabName } from "lib/NativeModules/SelectedTab/TabName"
import { isStaging } from "lib/relay/config"
import React from "react"
import { BottomTabsIcon } from "./BottomTabsIcon"

export const BottomTabs: React.FC<{}> = ({}) => {
  const activeTab = useSelectedTab()
  return (
    <Flex flex={1}>
      <Separator style={{ borderColor: isStaging ? color("purple100") : color("black10") }} />
      <Flex flexDirection="row" height="52" pb="5" px={1}>
        <BottomTabsIcon
          activeIcon={<HomeActiveIcon />}
          inactiveIcon={<HomeIcon />}
          isActive={activeTab.name === TabName.ARHomeTab}
        />
        <BottomTabsIcon
          activeIcon={<ExploreActiveIcon />}
          inactiveIcon={<ExploreIcon />}
          isActive={activeTab.name === TabName.ARSearchTab}
        />
        <BottomTabsIcon
          activeIcon={<InboxActiveIcon />}
          inactiveIcon={<InboxIcon />}
          isActive={activeTab.name === TabName.ARMessagingTab}
        />
        <BottomTabsIcon
          activeIcon={<ConsignActiveIcon />}
          inactiveIcon={<ConsignIcon />}
          isActive={activeTab.name === TabName.ARSalesTab}
        />
        <BottomTabsIcon
          activeIcon={<ProfileActiveIcon />}
          inactiveIcon={<ProfileIcon />}
          isActive={activeTab.name === TabName.ARMyProfileTab}
        />
      </Flex>
    </Flex>
  )
}
