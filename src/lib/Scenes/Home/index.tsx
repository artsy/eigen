import * as React from "react"
import { View } from "react-native"
import ScrollableTabView from "react-native-scrollable-tab-view"

import WorksForYou from "../../Containers/WorksForYou"
import ForYou from "./Components/ForYou"

import { ForYouRenderer, WorksForYouRenderer } from "../../relay/QueryRenderers"
import renderWithLoadProgress from "../../utils/renderWithLoadProgress"
import TabBar from "./Components/TabBar"

interface TabProps {
  tabLabel: string
}
const Tab: React.SFC<TabProps> = ({ children }) =>
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
        <Tab tabLabel="Auctions" />
      </ScrollableTabView>
    )
  }
}
