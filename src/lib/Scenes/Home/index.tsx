import React from "react"
import { View } from "react-native"
import ScrollableTabView from "react-native-scrollable-tab-view"
import styled from "styled-components/native"

import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Router } from "lib/utils/router"

import WorksForYou from "lib/Containers/WorksForYou"
import ForYou from "./Components/ForYou"
import Sales from "./Components/Sales"

import { ForYouRenderer, WorksForYouRenderer } from "lib/relay/QueryRenderers"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import SalesRenderer from "./Components/Sales/Relay/SalesRenderer"

import DarkNavigationButton from "lib/Components/Buttons/DarkNavigationButton"
import TabBar, { Tab } from "lib/Components/TabBar"

const TabBarContainer = styled.View`margin-top: 20px;`

export default class Home extends React.Component<null, null> {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollableTabView
          renderTabBar={props =>
            <TabBarContainer>
              <TabBar {...props} />
            </TabBarContainer>}
        >
          {/* FIXME:
      A thin space has been added in front of the tab label names to compensate for trailing space added by the
      wider letter-spacing. Going forward, this would ideally be dealt with through letter indentation. */}
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
