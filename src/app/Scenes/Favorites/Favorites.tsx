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
import { useScreenScrollContext } from "@artsy/palette-mobile/dist/elements/Screen/ScreenScrollContext"
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from "@react-navigation/material-top-tabs"
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
import Animated, { useAnimatedStyle } from "react-native-reanimated"

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

const FavoritesHeaderTapBar: React.FC<MaterialTopTabBarProps> = ({ state, navigation }) => {
  const setActiveTab = FavoritesContextStore.useStoreActions((actions) => actions.setActiveTab)
  const { trackTappedNavigationTab } = useFavoritesTracking()
  const { currentScrollYAnimated } = useScreenScrollContext()

  const activeRoute = state.routes[state.index].name

  const animatedStyles = useAnimatedStyle(() => ({
    height:
      currentScrollYAnimated.value >= 150 ? 0 : 150 - Math.max(currentScrollYAnimated.value, 0),
    transform: [
      {
        translateY:
          currentScrollYAnimated.value >= 150 ? -150 : Math.min(-currentScrollYAnimated.value, 0),
      },
    ],
  }))

  return (
    <Animated.View style={animatedStyles}>
      <Flex mx={2}>
        <Flex alignItems="flex-end" mb={2}>
          <FavoritesLearnMore />
        </Flex>

        <Text variant="xl">Favorites</Text>

        <Spacer y={2} />
        <Flex flexDirection="row" gap={0.5} mb={2}>
          {Pills.map(({ Icon, title, key }) => {
            const isActive = activeRoute === key
            return (
              <Pill
                selected={isActive}
                onPress={() => {
                  setActiveTab(key)

                  navigation.emit({
                    type: "tabPress",
                    target: key,
                    canPreventDefault: true,
                  })

                  navigation.navigate(key)
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
    </Animated.View>
  )
}

export const FavoriteTopNavigator = createMaterialTopTabNavigator()

export const Favorites = () => {
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
    <FavoritesContextStore.Provider>
      <Screen>
        <Screen.Body fullwidth>
          <FavoriteTopNavigator.Navigator
            tabBar={FavoritesHeaderTapBar}
            screenOptions={{
              swipeEnabled: false,
            }}
            initialRouteName="follows"
          >
            <FavoriteTopNavigator.Screen name="saves" navigationKey="saves" component={SavesTab} />
            <FavoriteTopNavigator.Screen
              name="follows"
              navigationKey="follows"
              component={FollowsTab}
            />
            <FavoriteTopNavigator.Screen
              name="alerts"
              navigationKey="alerts"
              component={AlertsTab}
            />
          </FavoriteTopNavigator.Navigator>
        </Screen.Body>
      </Screen>
    </FavoritesContextStore.Provider>
  )
}
