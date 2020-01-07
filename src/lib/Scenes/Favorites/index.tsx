import React from "react"
import { View } from "react-native"
import ScrollableTabView from "react-native-scrollable-tab-view"
import styled from "styled-components/native"

import { Schema, screenTrack } from "lib/utils/track"

import ScrollableTabBar, { ScrollableTab } from "lib/Components/ScrollableTabBar"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"

import DarkNavigationButton from "lib/Components/Buttons/DarkNavigationButton"
import { Fonts } from "lib/data/fonts"

import Artists from "./Components/Artists"
import ArtistsRenderer from "./Components/Artists/Relay/FavoriteArtists"

import Artworks from "./Components/Artworks"
import ArtworksRenderer from "./Components/Artworks/Relay/FavoriteArtworks"

import Categories from "./Components/Categories"
import CategoriesRenderer from "./Components/Categories/Relay/FavoriteCategories"

import Fairs from "./Components/Fairs"
import FairsRenderer from "./Components/Fairs/Relay/FavoriteFairs"

import Shows from "./Components/Shows"
import ShowsRenderer from "./Components/Shows/Relay/FavoriteShows"

import { Flex, Theme } from "@artsy/palette"
import { gravityURL } from "lib/relay/config"

import { Gear } from "lib/Icons/Gear"

const SettingsIcon = styled(Gear)`
  margin-right: 20px;
`

const Title = styled.Text`
  font-family: ${Fonts.GaramondRegular};
  font-size: 30px;
  text-align: left;
  margin-left: 20px;
`

const isStaging = gravityURL.includes("staging")
const isTabVisible = false

const WorksTab = 0
const ArtistsTab = 1
const CategoriesTab = 2
const ShowsTab = 3
const FairsTab = 4

interface Props {
  tracking: any
}

@screenTrack({
  context_screen: Schema.PageNames.SavesAndFollows,
  context_screen_owner_type: null,
})

// @TODO: Implement test on this component https://artsyproduct.atlassian.net/browse/LD-563
class Favorites extends React.Component<Props, null> {
  render() {
    return (
      <Theme>
        <View style={{ flex: 1 }}>
          <ScrollableTabView
            onChangeTab={selectedTab => this.fireTabSelectionAnalytics(selectedTab)}
            renderTabBar={props => (
              <View style={{ marginTop: 20 }}>
                <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
                  <Title>Saves &amp; Follows</Title>
                  <SettingsIcon />
                </Flex>
                <ScrollableTabBar {...props} />
              </View>
            )}
          >
            <ScrollableTab tabLabel="Works">
              <ArtworksRenderer render={renderWithLoadProgress(Artworks)} />
            </ScrollableTab>
            <ScrollableTab tabLabel="Artists">
              <ArtistsRenderer render={renderWithLoadProgress(Artists)} />
            </ScrollableTab>
            <ScrollableTab tabLabel="Shows">
              <ShowsRenderer render={renderWithLoadProgress(Shows)} />
            </ScrollableTab>
            <ScrollableTab tabLabel="Categories">
              <CategoriesRenderer render={renderWithLoadProgress(Categories)} />
            </ScrollableTab>
            {!!isTabVisible && ( // @TODO: hides Fairs tab for now. Revert after v1 of Local Discovery is launched.
              <ScrollableTab tabLabel="Fairs">
                <FairsRenderer render={renderWithLoadProgress(Fairs)} />
              </ScrollableTab>
            )}
          </ScrollableTabView>
          {!!isStaging && <DarkNavigationButton title="Warning: on staging, favourites don't migrate" />}
        </View>
      </Theme>
    )
  }

  fireTabSelectionAnalytics = selectedTab => {
    let eventDetails

    if (selectedTab.i === WorksTab) {
      eventDetails = { action_name: Schema.ActionNames.SavesAndFollowsWorks }
    } else if (selectedTab.i === ArtistsTab) {
      eventDetails = { action_name: Schema.ActionNames.SavesAndFollowsArtists }
    } else if (selectedTab.i === CategoriesTab) {
      eventDetails = { action_name: Schema.ActionNames.SavesAndFollowsCategories }
    } else if (selectedTab.i === ShowsTab) {
      eventDetails = {
        action_name: Schema.ActionNames.SavesAndFollowsShows,
        context_screen: Schema.PageNames.SavesAndFollows,
      }
    } else if (selectedTab.i === FairsTab) {
      eventDetails = { action_name: Schema.ActionNames.SavesAndFollowsFairs }
    }

    this.props.tracking.trackEvent({
      ...eventDetails,
      action_type: Schema.ActionTypes.Tap,
    })
  }
}

export default Favorites
