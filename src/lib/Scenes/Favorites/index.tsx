import React from "react"
import { NativeModules, View } from "react-native"
import ScrollableTabView from "react-native-scrollable-tab-view"
import styled from "styled-components/native"

import TabBar, { Tab } from "lib/Components/TabBar"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"

import Headline from "lib/Components/Text/Headline"
import fonts from "lib/data/fonts"

import Artists from "./Components/Artists"
import ArtistsRenderer from "./Components/Artists/Relay/ArtistsRenderer"

import DarkNavigationButton from "lib/Components/Buttons/DarkNavigationButton"
import { gravityURL } from "lib/relay/config"
import Artworks from "./Components/Artworks"
import ArtworksRenderer from "./Components/Artworks/Relay/ArtworksRenderer"

const Title = styled.Text`
  font-family: ${fonts["garamond-regular"]};
  font-size: 30px;
  text-align: left;
  margin-left: 20px;
  margin-top: 20px;
`

const isStaging = gravityURL.includes("staging")

class Favorites extends React.Component<null, null> {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollableTabView
          renderTabBar={props =>
            <View>
              <Title>Saves &amp; Follows</Title>
              <TabBar {...props} />
            </View>}
        >
          <Tab tabLabel="Works">
            <ArtworksRenderer render={renderWithLoadProgress(Artworks)} />
          </Tab>
          <Tab tabLabel="Artists">
            <ArtistsRenderer render={renderWithLoadProgress(Artists)} />
          </Tab>
          <Tab tabLabel="Categories">
            <View />
          </Tab>
        </ScrollableTabView>
        {isStaging && <DarkNavigationButton title="Warning: on staging favourites don't migrate" />}
      </View>
    )
  }
}

export default Favorites
