import React from "react"
import { View } from "react-native"
import ScrollableTabView from "react-native-scrollable-tab-view"
import styled from "styled-components/native"

import WorksForYou from "lib/Containers/WorksForYou"

import ForYou from "./Components/ForYou"
import Sales from "./Components/Sales"

import { ForYouRenderer, WorksForYouRenderer } from "lib/relay/QueryRenderers"
import SalesRenderer from "./Components/Sales/Relay/SalesRenderer"

import TabBar, { Tab } from "lib/Components/TabBar"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"

const TabBarContainer = styled.View`margin-top: 20px;`

export default class Home extends React.Component<null, null> {
  render() {
    return (
      <ScrollableTabView
        renderTabBar={props =>
          <TabBarContainer>
            <TabBar {...props} />
          </TabBarContainer>}
      >
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
