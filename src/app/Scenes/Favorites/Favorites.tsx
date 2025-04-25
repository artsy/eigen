import {
  BellIcon,
  Flex,
  HeartIcon,
  MultiplePersonsIcon,
  Pill,
  Screen,
  Spacer,
  Text,
  useScreenDimensions,
} from "@artsy/palette-mobile"
import { useScreenScrollContext } from "@artsy/palette-mobile/dist/elements/Screen/ScreenScrollContext"
import { BOTTOM_TABS_HEIGHT } from "@artsy/palette-mobile/dist/elements/Screen/StickySubHeader"
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
import { Platform } from "react-native"
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
  const { setActiveTab, setHeaderHeight } = FavoritesContextStore.useStoreActions(
    (actions) => actions
  )

  const { headerHeight } = FavoritesContextStore.useStoreState((state) => state)
  const { trackTappedNavigationTab } = useFavoritesTracking()

  const activeRoute = state.routes[state.index].name

  return (
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
                  trackTappedNavigationTab(key)
                }}
                Icon={({ fill }) => (
                  <Flex mr={0.5} justifyContent="center">
                    <Icon fill={fill || "mono100"} />
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
    </Flex>
  )
}

export const FavoriteTopNavigator = createMaterialTopTabNavigator()

const Content = () => {
  const { currentScrollYAnimated } = useScreenScrollContext()
  const { headerHeight } = FavoritesContextStore.useStoreState((state) => state)
  const { height: screenHeight } = useScreenDimensions()

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      {
        translateY:
          currentScrollYAnimated.value >= headerHeight
            ? -headerHeight
            : Math.min(-currentScrollYAnimated.value, 0),
      },
    ],
  }))

  return (
    <Animated.View style={[animatedStyles, { height: screenHeight + headerHeight }]}>
      <Screen.Body fullwidth>
        <FavoriteTopNavigator.Navigator
          tabBar={FavoritesHeaderTapBar}
          screenOptions={{
            swipeEnabled: false,
          }}
          layout={({ children }) => {
            return (
              <Flex
                flex={1}
                style={{
                  //   // Extra padding to make sure the last item is not covered
                  paddingBottom: Platform.OS === "ios" ? headerHeight : BOTTOM_TABS_HEIGHT,
                }}
              >
                {children}
              </Flex>
            )
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
    </Animated.View>
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
