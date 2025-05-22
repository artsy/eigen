import { ActionType, ContextModule, OwnerType, TappedInfoBubble } from "@artsy/cohesion"
import { BellStrokeIcon, FollowArtistIcon, TrendingIcon } from "@artsy/icons/native"
import { Flex, Join, Spacer, Tabs, Text } from "@artsy/palette-mobile"
import { InfoButton } from "app/Components/Buttons/InfoButton"
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
        showLargeHeaderText={false}
        BelowTitleHeaderComponent={() => (
          <Flex px={2}>
            <InfoButton
              trackEvent={() => {
                tracking.trackEvent(tracks.tapFollowsInfo())
              }}
              titleElement={
                <Text variant="lg-display" mr={1}>
                  Follows
                </Text>
              }
              modalTitle="Follows"
              modalContent={
                <Join separator={<Spacer y={2} />}>
                  <Flex flexDirection="row" alignItems="flex-start">
                    <FollowArtistIcon mr={0.5} />
                    <Flex flex={1}>
                      <Text variant="sm-display">
                        Get updates on your favorite artists, including new artworks, shows,
                        exhibitions and more.
                      </Text>
                    </Flex>
                  </Flex>
                  <Flex flexDirection="row" alignItems="flex-start">
                    <TrendingIcon mr={0.5} />
                    <Flex flex={1}>
                      <Text variant="sm-display">
                        Tailor your experience, helping you discover artworks that match your taste.
                      </Text>
                    </Flex>
                  </Flex>
                  <Flex flexDirection="row" alignItems="flex-start">
                    <BellStrokeIcon mr={0.5} />
                    <Flex flex={1}>
                      <Text variant="sm-display">
                        Never miss out by exploring your Activity and receiving timely email
                        updates.
                      </Text>
                    </Flex>
                  </Flex>
                </Join>
              }
            />
          </Flex>
        )}
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

const tracks = {
  tapFollowsInfo: (): TappedInfoBubble => ({
    action: ActionType.tappedInfoBubble,
    context_module: ContextModule.follows,
    context_screen_owner_type: OwnerType.follows,
    subject: "followsHeader",
  }),
}
