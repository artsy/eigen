import React from "react"
import { View } from "react-native"

import { Schema, screenTrack } from "lib/utils/track"

import DarkNavigationButton from "lib/Components/Buttons/DarkNavigationButton"

import { Sans, SettingsIcon as _SettingsIcon, Theme } from "@artsy/palette"
import { StickyTabPage } from "lib/Components/StickyTabPage/StickyTabPage"
import { StickyTabPageTabBar } from "lib/Components/StickyTabPage/StickyTabPageTabBar"
import { gravityURL } from "lib/relay/config"
import { FavoriteArtistsQueryRenderer } from "./FavoriteArtists"
import { FavoriteArtworksQueryRenderer } from "./FavoriteArtworks"
import { FavoriteCategoriesQueryRenderer } from "./FavoriteCategories"
import { FavoriteShowsQueryRenderer } from "./FavoriteShows"

const isStaging = gravityURL.includes("staging")

enum Tab {
  works = "Works",
  artists = "Artists",
  shows = "Shows",
  categories = "Categories",
}

interface Props {
  tracking: any
}

@screenTrack({
  context_screen: Schema.PageNames.SavesAndFollows,
  // @ts-ignore STRICTNESS_MIGRATION
  context_screen_owner_type: null,
})
// @TODO: Implement test on this component https://artsyproduct.atlassian.net/browse/LD-563
class Favorites extends React.Component<Props> {
  render() {
    return (
      <Theme>
        <View style={{ flex: 1 }}>
          <StickyTabPage
            tabs={[
              {
                title: Tab.works,
                content: <FavoriteArtworksQueryRenderer />,
                initial: true,
              },
              {
                title: Tab.artists,
                content: <FavoriteArtistsQueryRenderer />,
              },
              {
                title: Tab.shows,
                content: <FavoriteShowsQueryRenderer />,
              },
              {
                title: Tab.categories,
                content: <FavoriteCategoriesQueryRenderer />,
              },
            ]}
            staticHeaderContent={<></>}
            stickyHeaderContent={
              <View style={{ marginTop: 20 }}>
                <Sans size="4" weight="medium" textAlign="center">
                  Saves and Follows
                </Sans>
                <StickyTabPageTabBar
                  onTabPress={({ label }) => {
                    this.fireTabSelectionAnalytics(label as Tab)
                  }}
                />
              </View>
            }
          />
          {!!isStaging && <DarkNavigationButton title="Warning: on staging, favourites don't migrate" />}
        </View>
      </Theme>
    )
  }

  fireTabSelectionAnalytics = (selectedTab: Tab) => {
    let eventDetails

    if (selectedTab === Tab.works) {
      eventDetails = { action_name: Schema.ActionNames.SavesAndFollowsWorks }
    } else if (selectedTab === Tab.artists) {
      eventDetails = { action_name: Schema.ActionNames.SavesAndFollowsArtists }
    } else if (selectedTab === Tab.categories) {
      eventDetails = { action_name: Schema.ActionNames.SavesAndFollowsCategories }
    } else if (selectedTab === Tab.shows) {
      eventDetails = {
        action_name: Schema.ActionNames.SavesAndFollowsShows,
        context_screen: Schema.PageNames.SavesAndFollows,
      }
    }

    this.props.tracking.trackEvent({
      ...eventDetails,
      action_type: Schema.ActionTypes.Tap,
    })
  }
}

export default Favorites
