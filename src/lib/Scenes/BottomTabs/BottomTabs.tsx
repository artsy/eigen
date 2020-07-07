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
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { isStaging } from "lib/relay/config"
import React, { useRef, useState } from "react"
import { BottomTabsIcon } from "./BottomTabsIcon"

export const BottomTabs: React.FC<{}> = ({}) => {
  const _activeTab = useSelectedTab().name
  const [activeTab, setActiveTab] = useState(_activeTab)
  const navRef = useRef(null)
  return (
    <Flex flex={1} ref={navRef}>
      <Separator style={{ borderColor: isStaging ? color("purple100") : color("black10") }} />
      <Flex flexDirection="row" height="52" pb="5" px={1}>
        <BottomTabsIcon
          activeIcon={<HomeActiveIcon />}
          inactiveIcon={<HomeIcon />}
          isActive={activeTab === TabName.ARHomeTab}
          onPress={() => {
            setActiveTab(TabName.ARHomeTab)
            SwitchBoard.presentNavigationViewController(navRef.current!, "/")
          }}
        />
        <BottomTabsIcon
          activeIcon={<ExploreActiveIcon />}
          inactiveIcon={<ExploreIcon />}
          isActive={activeTab === TabName.ARSearchTab}
          onPress={() => {
            setActiveTab(TabName.ARSearchTab)
            SwitchBoard.presentNavigationViewController(navRef.current!, "/search")
          }}
        />
        <BottomTabsIcon
          activeIcon={<InboxActiveIcon />}
          inactiveIcon={<InboxIcon />}
          isActive={activeTab === TabName.ARMessagingTab}
          onPress={() => {
            setActiveTab(TabName.ARMessagingTab)
            SwitchBoard.presentNavigationViewController(navRef.current!, "/inbox")
          }}
        />
        <BottomTabsIcon
          activeIcon={<ConsignActiveIcon />}
          inactiveIcon={<ConsignIcon />}
          isActive={activeTab === TabName.ARSalesTab}
          onPress={() => {
            setActiveTab(TabName.ARSalesTab)
            SwitchBoard.presentNavigationViewController(navRef.current!, "/sales")
          }}
        />
        <BottomTabsIcon
          activeIcon={<ProfileActiveIcon />}
          inactiveIcon={<ProfileIcon />}
          isActive={activeTab === TabName.ARMyProfileTab}
          onPress={() => {
            setActiveTab(TabName.ARMyProfileTab)
            SwitchBoard.presentNavigationViewController(navRef.current!, "/my-profile")
          }}
        />
      </Flex>
    </Flex>
  )
}
