import React from "react"
import { View } from "react-native"
import ScrollableTabView from "react-native-scrollable-tab-view"
import styled from "styled-components/native"

import TabBar, { Tab } from "lib/Components/TabBar"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"

import Headline from "lib/Components/Text/Headline"
import fonts from "lib/data/fonts"

import Artists from "./Components/Artists"
import ArtistsRenderer from "./Components/Artists/Relay/ArtistsRenderer"

import Works from "./Components/Works"
import WorksRenderer from "./Components/Works/Relay/WorksRenderer"

const Title = styled.Text`
  font-family: ${fonts["garamond-regular"]};
  font-size: 30px;
  text-align: left;
  margin-left: 20px;
  margin-top: 20px;
`

class Favorites extends React.Component<null, null> {
  render() {
    return (
      <ScrollableTabView
        renderTabBar={props =>
          <View>
            <Title>Saves &amp; Follows</Title>
            <TabBar {...props} />
          </View>}
      >
        <Tab tabLabel="Works">
          <WorksRenderer render={renderWithLoadProgress(Works)} />
        </Tab>
        <Tab tabLabel="Artists">
          <ArtistsRenderer render={renderWithLoadProgress(Artists)} />
        </Tab>
        <Tab tabLabel="Categories">
          <View />
        </Tab>
      </ScrollableTabView>
    )
  }
}

export default Favorites
