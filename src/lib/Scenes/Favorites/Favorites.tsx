import React from "react"
import { View, ViewProps } from "react-native"

import { ProvideScreenTracking, Schema } from "lib/utils/track"

import DarkNavigationButton from "lib/Components/Buttons/DarkNavigationButton"

import { StickyTabPage, TabProps } from "lib/Components/StickyTabPage/StickyTabPage"
import { StickyTabPageTabBar } from "lib/Components/StickyTabPage/StickyTabPageTabBar"
import { useIsStaging } from "lib/store/GlobalStore"
import { compact } from "lodash"
import { Flex, SettingsIcon as _SettingsIcon, Text } from "palette"
import { useTracking } from "react-tracking"
import { useEnableMyCollection } from "../MyCollection/MyCollection"
import { FavoriteArtistsQueryRenderer } from "./FavoriteArtists"
import { FavoriteArtworksQueryRenderer } from "./FavoriteArtworks"
import { FavoriteCategoriesQueryRenderer } from "./FavoriteCategories"
import { FavoriteShowsQueryRenderer } from "./FavoriteShows"

export enum Tab {
  works = "Works",
  artists = "Artists",
  shows = "Shows",
  categories = "Categories",
}

interface Props extends ViewProps {
  initialTab: Tab
}

export const Favorites: React.FC<Props> = ({ initialTab = Tab.works }) => {
  const tracking = useTracking()
  const isStaging = useIsStaging()

  const fireTabSelectionAnalytics = (selectedTab: Tab) => {
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

    tracking.trackEvent({
      ...eventDetails,
      action_type: Schema.ActionTypes.Tap,
    })
  }

  const enableMyCollection = useEnableMyCollection()

  const showFavoriteArtworksTab = !enableMyCollection

  const tabs: TabProps[] = compact([
    showFavoriteArtworksTab && {
      title: Tab.works,
      content: <FavoriteArtworksQueryRenderer />,
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
  ])

  // default to first tab for initialTab
  let finalInitialTab = tabs[0].title
  if (tabs.find((tab) => (tab.title as Tab) === initialTab)) {
    finalInitialTab = initialTab
  } else {
    console.warn("Specified Initial Tab is not available in tabs array.")
  }

  // Set initial Tab
  tabs.forEach((tab) => {
    tab.initial = tab.title === finalInitialTab
  })

  return (
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.SavesAndFollows,
        context_screen_owner_type: null,
      }}
    >
      <View style={{ flex: 1 }}>
        <StickyTabPage
          tabs={tabs}
          staticHeaderContent={
            enableMyCollection ? (
              <StickyHeaderContent enableMyCollection={enableMyCollection} />
            ) : (
              <></>
            )
          }
          stickyHeaderContent={
            enableMyCollection ? (
              <StickyTabPageTabBar
                onTabPress={({ label }) => {
                  fireTabSelectionAnalytics(label as Tab)
                }}
              />
            ) : (
              <>
                <StickyHeaderContent enableMyCollection={enableMyCollection} />
                <StickyTabPageTabBar
                  onTabPress={({ label }) => {
                    fireTabSelectionAnalytics(label as Tab)
                  }}
                />
              </>
            )
          }
        />
        {!!isStaging && (
          <DarkNavigationButton title="Warning: on staging, favourites don't migrate" />
        )}
      </View>
    </ProvideScreenTracking>
  )
}

const StickyHeaderContent: React.FC<{ enableMyCollection: boolean }> = ({ enableMyCollection }) => {
  return (
    <Flex mt={enableMyCollection ? 4 : 2}>
      {enableMyCollection ? (
        <Text variant="lg" m={2}>
          Follows
        </Text>
      ) : (
        <Text variant="md" weight="medium" textAlign="center">
          Saves and Follows
        </Text>
      )}
    </Flex>
  )
}
