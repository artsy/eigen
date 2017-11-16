import React from "react"
import { View } from "react-native"
import ScrollableTabView from "react-native-scrollable-tab-view"

import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Router } from "lib/utils/router"

import WorksForYou from "lib/Containers/WorksForYou"
import ForYou from "./Components/ForYou"
import Sales from "./Components/Sales"

import { ForYouRenderer, WorksForYouRenderer } from "lib/relay/QueryRenderers"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import SalesRenderer from "./Components/Sales/Relay/SalesRenderer"

import DarkNavigationButton from "lib/Components/Buttons/DarkNavigationButton"
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
      <View style={{ flex: 1 }}>
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
        <DarkNavigationButton
          title="Sell works from your collection through Artsy"
          onPress={this.openLink.bind(this)}
        />
      </View>
    )
  }

  openLink() {
    SwitchBoard.presentNavigationViewController(this, Router.ConsignmentsStartSubmission)
  }
}
