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
        <Tab tabLabel="Artists">
          <WorksForYouRenderer render={renderWithLoadProgress(WorksForYou)} />
        </Tab>
        <Tab tabLabel="For You">
          <ForYouRenderer render={renderWithLoadProgress(ForYou)} />
        </Tab>
        <Tab tabLabel="Auctions">
          <SalesRenderer render={renderWithLoadProgress(Sales)} />
        </Tab>
      </ScrollableTabView>
    )
  }
}
