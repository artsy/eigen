import * as React from "react"
import { View } from "react-native"
import ScrollableTabView from "react-native-scrollable-tab-view"
import { default as Artists } from "../../Containers/Home"
import WorksForYou from "../../Containers/WorksForYou"
import { HomeRenderer, WorksForYouRenderer } from "../../relay/QueryRenderers"
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
          <HomeRenderer render={renderWithLoadProgress(Artists)} />
        </Tab>
        <Tab tabLabel="For you">
          <WorksForYouRenderer render={renderWithLoadProgress(WorksForYou)} />
        </Tab>
        <Tab tabLabel="Auctions" />
      </ScrollableTabView>
    )
  }
}
