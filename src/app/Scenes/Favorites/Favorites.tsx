import { Flex, Text } from "@artsy/palette-mobile"
import DarkNavigationButton from "app/Components/Buttons/DarkNavigationButton"

import { StickyTabPage, TabProps } from "app/Components/StickyTabPage/StickyTabPage"
import { StickyTabPageTabBar } from "app/Components/StickyTabPage/StickyTabPageTabBar"
import { useIsStaging } from "app/utils/hooks/useIsStaging"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import { compact } from "lodash"
import { View, ViewProps } from "react-native"
import { useTracking } from "react-tracking"
import { FavoriteArtistsQueryRenderer } from "./FavoriteArtists"
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

  const tabs: TabProps[] = compact([
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
          staticHeaderContent={<StickyHeaderContent />}
          stickyHeaderContent={
            <StickyTabPageTabBar
              onTabPress={({ label }) => {
                fireTabSelectionAnalytics(label as Tab)
              }}
            />
          }
        />
        {!!isStaging && (
          <DarkNavigationButton title="Warning: on staging, favourites don't migrate" />
        )}
      </View>
    </ProvideScreenTracking>
  )
}

const StickyHeaderContent: React.FC = ({}) => {
  return (
    <Flex mt={4}>
      <Text variant="lg-display" m={2}>
        Follows
      </Text>
    </Flex>
  )
}
