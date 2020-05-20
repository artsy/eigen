import React from "react"
import { TouchableWithoutFeedback, View } from "react-native"
// @ts-ignore STRICTNESS_MIGRATION
import ScrollableTabView from "react-native-scrollable-tab-view"
import styled from "styled-components/native"

import { Schema, screenTrack } from "lib/utils/track"

import { ScrollableTab, ScrollableTabBar } from "lib/Components/ScrollableTabBar"

import { DarkNavigationButton } from "lib/Components/Buttons/DarkNavigationButton"
import { Fonts } from "lib/data/fonts"

import { Box, Flex, SettingsIcon as _SettingsIcon, Theme } from "@artsy/palette"
import { gravityURL } from "lib/relay/config"

import * as SwitchBoard from "lib/NativeModules/SwitchBoard"
import { FavoriteArtistsRenderer } from "./Pages/FavoriteArtists"
import { FavouriteCategoriesRenderer } from "./Pages/FavoriteCategories"
import { FavoriteFairsRenderer } from "./Pages/FavoriteFairs"
import { FavoriteShowsRenderer } from "./Pages/FavoriteShows"
import { SavedWorksRenderer } from "./Pages/SavedWorks"

const SettingsIcon = styled(_SettingsIcon)`
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
  context_screen_owner_type: null as any,
})
// @TODO: Implement test on this component https://artsyproduct.atlassian.net/browse/LD-563
export class Favorites extends React.Component<Props> {
  render() {
    return (
      <Theme>
        <View style={{ flex: 1 }}>
          <ScrollableTabView
            // @ts-ignore STRICTNESS_MIGRATION
            onChangeTab={selectedTab => this.fireTabSelectionAnalytics(selectedTab)}
            // @ts-ignore STRICTNESS_MIGRATION
            renderTabBar={props => (
              <View style={{ marginTop: 20 }}>
                <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
                  <Title>Saves &amp; Follows</Title>
                  <TouchableWithoutFeedback
                    // @ts-ignore STRICTNESS_MIGRATION
                    onPress={() => SwitchBoard.presentNavigationViewController(this, "ios-settings")}
                  >
                    <Box>
                      <SettingsIcon width={24} height={24} />
                    </Box>
                  </TouchableWithoutFeedback>
                </Flex>
                <ScrollableTabBar {...props} />
              </View>
            )}
          >
            <ScrollableTab tabLabel="Works">
              <SavedWorksRenderer />
            </ScrollableTab>
            <ScrollableTab tabLabel="Artists">
              <FavoriteArtistsRenderer />
            </ScrollableTab>
            <ScrollableTab tabLabel="Shows">
              <FavoriteShowsRenderer />
            </ScrollableTab>
            <ScrollableTab tabLabel="Categories">
              <FavouriteCategoriesRenderer />
            </ScrollableTab>
            {!!isTabVisible && ( // @TODO: hides Fairs tab for now. Revert after v1 of Local Discovery is launched.
              <ScrollableTab tabLabel="Fairs">
                <FavoriteFairsRenderer />
              </ScrollableTab>
            )}
          </ScrollableTabView>
          {!!isStaging && <DarkNavigationButton title="Warning: on staging, favourites don't migrate" />}
        </View>
      </Theme>
    )
  }

  fireTabSelectionAnalytics = (selectedTab: { i: number }) => {
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
