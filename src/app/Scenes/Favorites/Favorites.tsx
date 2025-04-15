import { ContextModule } from "@artsy/cohesion"
import {
  BellIcon,
  Flex,
  HeartIcon,
  MultiplePersonsIcon,
  Pill,
  Screen,
  Spacer,
  Text,
  useColor,
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

export const Pills: {
  Icon: React.FC<{ fill: string }>
  title: string
  key: FavoritesTab
  contextModule: ContextModule
}[] = [
  {
    Icon: HeartIcon,
    title: "Saves",
    key: "saves",
    contextModule: ContextModule.favoritesSaves,
  },
  {
    Icon: MultiplePersonsIcon,
    title: "Follows",
    key: "follows",
    contextModule: ContextModule.favoritesFollows,
  },
  {
    Icon: BellIcon,
    title: "Alerts",
    key: "alerts",
    contextModule: ContextModule.favoritesAlerts,
  },
]

const FavoritesHeaderTapBar: React.FC<MaterialTopTabBarProps> = ({ state, navigation }) => {
  const color = useColor()

  const activeTab = FavoritesContextStore.useStoreState((state) => state.activeTab)
  const { setActiveTab, setHeaderHeight } = FavoritesContextStore.useStoreActions(
    (actions) => actions
  )

  const { headerHeight } = FavoritesContextStore.useStoreState((state) => state)
  const { trackTappedNavigationTab } = useFavoritesTracking()

  const { currentScrollYAnimated } = useScreenScrollContext()

  const animatedStyles = useAnimatedStyle(() => {
    const translateY =
      currentScrollYAnimated.value >= headerHeight
        ? -headerHeight
        : Math.min(-currentScrollYAnimated.value, 0)

    return {
      transform: [
        {
          translateY,
        },
      ],
    }
  })
  const activeRoute = state.routes[state.index].name

  return (
    <Animated.View
      style={[
        animatedStyles,
        {
          position: "absolute",
          zIndex: 1000,
          backgroundColor: color("mono0"),
          width: "100%",
        },
      ]}
    >
      <Flex
        onLayout={(event) => {
          if (!headerHeight) {
            setHeaderHeight(event.nativeEvent.layout.height)
          }
        }}
      >
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
                    // Make sure to track the tap before changing the active tab
                    trackTappedNavigationTab(key, activeTab)

                    setActiveTab(key)

                    // We are manually emitting the tabPress event here because
                    // the navigation library doesn't emit it when we use the
                    // navigation.navigate() method.
                    navigation.emit({
                      type: "tabPress",
                      target: key,
                      canPreventDefault: true,
                    })

                    navigation.navigate(key)
                  }}
                  Icon={({ fill }) => (
                    <Flex mr={0.5} justifyContent="center">
                      <Icon fill={fill || "mono100"} />
                    </Flex>
                  )}
                  key={key}
                  variant="link"
                >
                  {title}
                </Pill>
              )
            })}
          </Flex>
        </Flex>
      </Flex>
    </Animated.View>
  )
}

export const FavoriteTopNavigator = createMaterialTopTabNavigator()

const Content = () => {
  return (
    <Screen.Body fullwidth>
      <FavoriteTopNavigator.Navigator
        tabBar={FavoritesHeaderTapBar}
        screenOptions={{
          swipeEnabled: false,
        }}
      >
        <FavoriteTopNavigator.Screen name="saves" navigationKey="saves" component={SavesTab} />
        <FavoriteTopNavigator.Screen
          name="follows"
          navigationKey="follows"
          component={FollowsTab}
        />
        <FavoriteTopNavigator.Screen name="alerts" navigationKey="alerts" component={AlertsTab} />
      </FavoriteTopNavigator.Navigator>
    </Screen.Body>
  )
}
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
        <Content />
      </Screen>
    </FavoritesContextStore.Provider>
  )
}
