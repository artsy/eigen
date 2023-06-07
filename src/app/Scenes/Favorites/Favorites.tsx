import { Tabs } from "@artsy/palette-mobile"
import { goBack } from "app/system/navigation/navigate"
import { ProvideScreenTracking, Schema } from "app/utils/track"

import { IndexChangeEventData } from "react-native-collapsible-tab-view/lib/typescript/src/types"
import { useTracking } from "react-tracking"
import { FavoriteArtistsQueryRenderer } from "./FavoriteArtists"
import { FavoriteCategoriesQueryRenderer } from "./FavoriteCategories"
import { FavoriteShowsQueryRenderer } from "./FavoriteShows"

const Tab = {
  works: {
    label: "Works",
    name: "works",
  },
  artists: {
    label: "Artists",
    name: "artists",
  },
  shows: {
    label: "Shows",
    name: "shows",
  },
  categories: {
    label: "Categories",
    name: "categories",
  },
} as const

export const Favorites: React.FC = () => {
  const tracking = useTracking()

  const fireTabSelectionAnalytics = (selectedTab: IndexChangeEventData) => {
    let eventDetails

    if (selectedTab.tabName === Tab.works.name) {
      eventDetails = { action_name: Schema.ActionNames.SavesAndFollowsWorks }
    } else if (selectedTab.tabName === Tab.artists.name) {
      eventDetails = { action_name: Schema.ActionNames.SavesAndFollowsArtists }
    } else if (selectedTab.tabName === Tab.categories.name) {
      eventDetails = { action_name: Schema.ActionNames.SavesAndFollowsCategories }
    } else if (selectedTab.tabName === Tab.shows.name) {
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

  return (
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.SavesAndFollows,
        context_screen_owner_type: null,
      }}
    >
      <Tabs.TabsWithHeader
        title="Follows"
        onTabChange={fireTabSelectionAnalytics}
        headerProps={{ onBack: goBack }}
      >
        <Tabs.Tab name={Tab.artists.name} label={Tab.artists.label}>
          <Tabs.Lazy>
            <FavoriteArtistsQueryRenderer />
          </Tabs.Lazy>
        </Tabs.Tab>
        <Tabs.Tab name={Tab.shows.name} label={Tab.shows.label}>
          <Tabs.Lazy>
            <FavoriteShowsQueryRenderer />
          </Tabs.Lazy>
        </Tabs.Tab>
        <Tabs.Tab name={Tab.categories.name} label={Tab.categories.label}>
          <Tabs.Lazy>
            <FavoriteCategoriesQueryRenderer />
          </Tabs.Lazy>
        </Tabs.Tab>
      </Tabs.TabsWithHeader>
    </ProvideScreenTracking>
  )
}
