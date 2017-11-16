import React from "react"
import { View } from "react-native"
import ScrollableTabView from "react-native-scrollable-tab-view"

import WorksForYou from "lib/Containers/WorksForYou"

import ForYou from "./Components/ForYou"
import Sales from "./Components/Sales"

import { ForYouRenderer, WorksForYouRenderer } from "lib/relay/QueryRenderers"
import SalesRenderer from "./Components/Sales/Relay/SalesRenderer"

import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import TabBar from "./Components/TabBar"

interface TabProps {
  tabLabel: string
}

export const Tab: React.SFC<TabProps> = ({ children }) =>
  <View style={{ flex: 1 }}>
    {children}
  </View>

export default class Home extends React.Component<null, null> {
  render() {
    return (
      <ScrollableTabView renderTabBar={() => <TabBar />}>
        {/* A thin space has been added in front of the tab label names to compensate for trailing space
        added by the wider letter-spacing. Going forward,
        this would ideally be dealt with through letter indentation.  */}
        <Tab tabLabel=" Artists">
          <WorksForYouRenderer render={renderWithLoadProgress(WorksForYou)} />
        </Tab>
        <Tab tabLabel=" For You">
          <ForYouRenderer render={renderWithLoadProgress(ForYou)} />
        </Tab>
        <Tab tabLabel=" Auctions">
          <SalesRenderer render={renderWithLoadProgress(Sales)} />
        </Tab>
      </ScrollableTabView>
    )
  }
}
