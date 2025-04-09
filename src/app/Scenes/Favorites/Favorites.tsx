import { BellIcon, Flex, HeartIcon, MultiplePersonsIcon, Pill, Screen } from "@artsy/palette-mobile"
import { PAGE_SIZE } from "app/Components/constants"
import { AlertsTab } from "app/Scenes/Favorites/AlertsTab"
import { alertsQuery } from "app/Scenes/Favorites/Components/Alerts"
import { FavoritesLearnMore } from "app/Scenes/Favorites/Components/FavoritesLearnMore"
import { followedArtistsQuery } from "app/Scenes/Favorites/Components/FollowedArtists"
import {
  FavoritesContextStore,
  FavoritesTab,
  FavoritesTabType,
} from "app/Scenes/Favorites/FavoritesContextStore"
import { FollowsTab } from "app/Scenes/Favorites/FollowsTab"
import { SavesTab } from "app/Scenes/Favorites/SavesTab"
import { useFavoritesTracking } from "app/Scenes/Favorites/useFavoritesTracking"
import { prefetchQuery } from "app/utils/queryPrefetching"
import { useEffect } from "react"

const Content: React.FC = () => {
  const activeTab = FavoritesContextStore.useStoreState((state) => state.activeTab)

  switch (activeTab) {
    case FavoritesTab.saves:
      return <SavesTab />
    case FavoritesTab.follows:
      return <FollowsTab />
    case FavoritesTab.alerts:
      return <AlertsTab />
  }
}

const Pills: {
  Icon: React.FC<{ fill: string }>
  title: string
  key: FavoritesTab
}[] = [
  {
    Icon: HeartIcon,
    title: "Saves",
    key: FavoritesTab.saves,
  },
  {
    Icon: MultiplePersonsIcon,
    title: "Follows",
    key: FavoritesTab.follows,
  },
  {
    Icon: BellIcon,
    title: "Alerts",
    key: FavoritesTab.alerts,
  },
]

const FavoritesHeader: React.FC<{ initialTab: FavoritesTabType }> = ({ initialTab }) => {
  const setActiveTab = FavoritesContextStore.useStoreActions((actions) => actions.setActiveTab)
  const { activeTab } = FavoritesContextStore.useStoreState((state) => state)
  const { trackTappedNavigationTab } = useFavoritesTracking()

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab)
    }
  }, [initialTab, setActiveTab])

  return (
    <Flex flexDirection="row" gap={0.5} mx={2} mb={2} mt={1}>
      {Pills.map(({ Icon, title, key }) => {
        const isActive = activeTab === key
        return (
          <Pill
            selected={isActive}
            onPress={() => {
              setActiveTab(key)
              trackTappedNavigationTab(key)
            }}
            Icon={() => (
              <Flex mr={0.5} justifyContent="center" bottom="1px">
                <Icon fill={isActive ? "white100" : "black100"} />
              </Flex>
            )}
            key={key}
          >
            {title}
          </Pill>
        )
      })}
    </Flex>
  )
}

export const FavoritesScreen: React.FC<{ initialTab: FavoritesTabType }> = ({ initialTab }) => {
  useEffect(() => {
    prefetchQuery({
      query: followedArtistsQuery,
      variables: {
        count: PAGE_SIZE,
      },
    })

    prefetchQuery({
      query: alertsQuery,
    })
  }, [])

  return (
    <Screen>
      <Screen.AnimatedHeader
        title="Favorites"
        hideLeftElements
        rightElements={<FavoritesLearnMore />}
      />

      <Screen.StickySubHeader title="Favorites" largeTitle separatorComponent={null}>
        <FavoritesHeader initialTab={initialTab} />
      </Screen.StickySubHeader>

      <Screen.Body fullwidth>
        <Content />
      </Screen.Body>
    </Screen>
  )
}

export const Favorites: React.FC<any> = (props) => {
  return (
    <FavoritesContextStore.Provider>
      <FavoritesScreen {...props} />
    </FavoritesContextStore.Provider>
  )
}
