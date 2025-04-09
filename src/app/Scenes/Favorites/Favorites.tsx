import {
  BellIcon,
  Flex,
  HeartIcon,
  MultiplePersonsIcon,
  Pill,
  Screen,
  Spacer,
  Text,
} from "@artsy/palette-mobile"
import { PAGE_SIZE } from "app/Components/constants"
import { AlertsTab } from "app/Scenes/Favorites/AlertsTab"
import { alertsQuery } from "app/Scenes/Favorites/Components/Alerts"
import { FavoritesLearnMore } from "app/Scenes/Favorites/Components/FavoritesLearnMore"
import { followedArtistsQuery } from "app/Scenes/Favorites/Components/FollowedArtists"
import { FavoritesContextStore, FavoritesTab } from "app/Scenes/Favorites/FavoritesContextStore"
import { FollowsTab } from "app/Scenes/Favorites/FollowsTab"
import { SavesTab } from "app/Scenes/Favorites/SavesTab"
import { useFavoritesTracking } from "app/Scenes/Favorites/useFavoritesTracking"
import { prefetchQuery } from "app/utils/queryPrefetching"
import { useEffect } from "react"

const Content: React.FC = () => {
  const activeTab = FavoritesContextStore.useStoreState((state) => state.activeTab)

  switch (activeTab) {
    case "saves":
      return <SavesTab />
    case "follows":
      return <FollowsTab />
    case "alerts":
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
    key: "saves",
  },
  {
    Icon: MultiplePersonsIcon,
    title: "Follows",
    key: "follows",
  },
  {
    Icon: BellIcon,
    title: "Alerts",
    key: "alerts",
  },
]

const FavoritesHeader = () => {
  const setActiveTab = FavoritesContextStore.useStoreActions((actions) => actions.setActiveTab)
  const { activeTab } = FavoritesContextStore.useStoreState((state) => state)
  const { trackTappedNavigationTab } = useFavoritesTracking()

  return (
    <Flex mx={2}>
      <Flex alignItems="flex-end">
        <FavoritesLearnMore />
        <Spacer y={2} />
      </Flex>

      <Text variant="xl">Favorites</Text>

      <Spacer y={2} />
      <Flex flexDirection="row" gap={0.5} mb={2}>
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
    </Flex>
  )
}

export const FavoritesScreen: React.FC = () => {
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
      <FavoritesHeader />

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
