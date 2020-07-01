import { Flex } from "@artsy/palette"
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
import React from "react"
import { BottomTabsIcon } from "./BottomTabsIcon"

export const BottomTabs: React.FC<{}> = ({}) => {
  const activeTab = useSelectedTab()
  return (
    <Flex flexDirection="row" height="60">
      <BottomTabsIcon
        activeIcon={<HomeActiveIcon />}
        inactiveIcon={<HomeIcon />}
        isActive={activeTab.name === TabName.ARHomeTab}
        title="Home"
      />
      <BottomTabsIcon
        activeIcon={<ExploreActiveIcon />}
        inactiveIcon={<ExploreIcon />}
        isActive={activeTab.name === TabName.ARSearchTab}
        title="Explore"
      />
      <BottomTabsIcon
        activeIcon={<InboxActiveIcon />}
        inactiveIcon={<InboxIcon />}
        isActive={activeTab.name === TabName.ARMessagingTab}
        title="Inbox"
      />
      <BottomTabsIcon
        activeIcon={<ConsignActiveIcon />}
        inactiveIcon={<ConsignIcon />}
        isActive={activeTab.name === TabName.ARSalesTab}
        title="Consign"
      />
      <BottomTabsIcon
        activeIcon={<ProfileActiveIcon />}
        inactiveIcon={<ProfileIcon />}
        isActive={activeTab.name === TabName.ARMyProfileTab}
        title="Profile"
      />
    </Flex>
  )
}
