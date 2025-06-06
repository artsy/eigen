import { ActionType, OwnerType, Screen, tappedTabBar } from "@artsy/cohesion"
import { Flex, Text, useColor } from "@artsy/palette-mobile"
import { BottomTabBarProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { PlatformPressable } from "@react-navigation/elements"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { FavoritesTab } from "app/Navigation/AuthenticatedRoutes/FavoritesTab"
import { HomeTab } from "app/Navigation/AuthenticatedRoutes/HomeTab"
import { InboxTab } from "app/Navigation/AuthenticatedRoutes/InboxTab"
import { ProfileTab } from "app/Navigation/AuthenticatedRoutes/ProfileTab"
import { SearchTab } from "app/Navigation/AuthenticatedRoutes/SearchTab"
import { modalRoutes } from "app/Navigation/AuthenticatedRoutes/modalRoutes"
import { internal_navigationRef } from "app/Navigation/Navigation"
import { AppModule } from "app/Navigation/routes"
import { modules } from "app/Navigation/utils/modules"
import { useBottomTabsBadges } from "app/Navigation/utils/useBottomTabsBadges"
import { BottomTabOption, BottomTabType } from "app/Scenes/BottomTabs/BottomTabType"
import { BottomTabsIcon } from "app/Scenes/BottomTabs/BottomTabsIcon"
import { bottomTabsConfig, useSearchTabName } from "app/Scenes/BottomTabs/bottomTabsConfig"
import { OnboardingQuiz } from "app/Scenes/Onboarding/OnboardingQuiz/OnboardingQuiz"
import { GlobalStore } from "app/store/GlobalStore"
import { useIsStaging } from "app/utils/hooks/useIsStaging"
import { postEventToProviders } from "app/utils/track/providers"
import { useCallback } from "react"
import { InteractionManager, PixelRatio, Platform } from "react-native"
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

if (Platform.OS === "ios") {
  require("app/Navigation/AuthenticatedRoutes/NativeScreens")
}

export type AuthenticatedRoutesParams = {
  Home: undefined
  Search: undefined
  Profile: undefined
  Inbox: undefined
  Favorites: undefined
} & { [key in AppModule]: undefined }

type TabRoutesParams = {
  home: undefined
  search: undefined
  inbox: undefined
  favorites: undefined
  profile: undefined
}

const Tab = createBottomTabNavigator<TabRoutesParams>()

const BOTTOM_TABS_HEIGHT = PixelRatio.getFontScale() < 1.5 ? 65 : 85

const TabBar = (props: BottomTabBarProps) => {
  const color = useColor()
  const insets = useSafeAreaInsets()
  const searchTabName = useSearchTabName()
  const isStaging = useIsStaging()

  const currentRoute = internal_navigationRef.current?.getCurrentRoute()?.name

  const stagingTabBarStyle = {
    borderColor: color("devpurple"),
    borderTopWidth: 1,
  }

  const hideBottomTabs =
    currentRoute && modules[currentRoute as AppModule]?.options?.hidesBottomTabs

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(hideBottomTabs ? 0 : BOTTOM_TABS_HEIGHT + insets.bottom, {
        duration: 200,
      }),
      // animate: true,
      ...(isStaging ? stagingTabBarStyle : {}),
    }
  })

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          position: "absolute",
          width: "100%",
          bottom: 0,
          backgroundColor: "red",
          flexDirection: "row",
          justifyContent: "space-between",
        },
      ]}
    >
      {props.navigation.getState().routes.map((route) => {
        const isActive =
          route.name === props.navigation.getState().routes[props.navigation.getState().index].name

        const tabName =
          route.name === "search"
            ? searchTabName
            : bottomTabsConfig[route.name as BottomTabType].name

        return (
          <Flex key={route.key}>
            <PlatformPressable
              {...props.descriptors[route.key].options.tabBarButton}
              android_ripple={{ color: "transparent" }} // Disables the ripple effect for Android
            >
              <BottomTabsIcon
                tab={route.name as BottomTabType}
                state={isActive ? "active" : "inactive"}
              />

              <Flex
                // flex={1}
                // position="absolute"
                // alignItems="flex-end"
                alignItems="center"
                backgroundColor="blue10"
              >
                <Text
                  variant="xxs"
                  selectable={false}
                  textAlign="center"
                  color="mono100"
                  numberOfLines={1}
                >
                  {tabName}
                </Text>
              </Flex>
            </PlatformPressable>
          </Flex>
        )
      })}
    </Animated.View>
  )
}

const AppTabs: React.FC = () => {
  const { tabsBadges } = useBottomTabsBadges()
  const color = useColor()
  const searchTabName = useSearchTabName()

  const selectedTab = GlobalStore.useAppState((state) => state.bottomTabs.sessionState.selectedTab)

  const handleTabPress = useCallback(
    (e) => {
      // the tab name is saved in e.target postfixed with random string like sell-Nw_wCNTWwOg95v
      const tabName = Object.keys(bottomTabsConfig).find(
        (tab) => e.target?.startsWith(tab)
      ) as BottomTabType

      if (Object.keys(BottomTabOption).includes(tabName) && selectedTab !== tabName) {
        GlobalStore.actions.bottomTabs.setSelectedTab(tabName)
        postEventToProviders(
          tappedTabBar({
            tab: bottomTabsConfig[tabName as BottomTabType].analyticsDescription,
            contextScreenOwnerType: BottomTabOption[tabName as BottomTabType],
          })
        )
        // we are handling the tracking of the favorites tab withing the screen
        // https://artsy.slack.com/archives/C05EQL4R5N0/p1744919145046069
        if (tabName !== "favorites") {
          postEventToProviders(tabsTracks.tabScreenView(tabName))
        }
      }
    },
    [selectedTab]
  )

  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={({ route }) => {
        return {
          animation: "fade",
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({ focused }) => {
            return (
              <Flex pt={1}>
                <BottomTabsIcon tab={route.name} state={focused ? "active" : "inactive"} />
              </Flex>
            )
          },
          tabBarButton: (props) => (
            <PlatformPressable
              {...props}
              android_ripple={{ color: "transparent" }} // Disables the ripple effect for Android
            />
          ),
          tabBarLabelPosition: "below-icon",
          tabBarLabel: () => {
            const tabName =
              route.name === "search" ? searchTabName : bottomTabsConfig[route.name].name

            return (
              <Flex
                flex={1}
                position="absolute"
                alignItems="flex-end"
                justifyContent="flex-end"
                height={BOTTOM_TABS_HEIGHT}
                pb={0.5}
              >
                <Text
                  variant="xxs"
                  selectable={false}
                  textAlign="center"
                  color="mono100"
                  numberOfLines={1}
                >
                  {tabName}
                </Text>
              </Flex>
            )
          },
          tabBarActiveTintColor: color("mono100"),
          tabBarInactiveTintColor: color("mono100"),
        }
      }}
      screenListeners={{
        tabPress: (e) => {
          // The goal of this is to queue up the tab press event to be handled after the tab has changed
          InteractionManager.runAfterInteractions(() => {
            handleTabPress(e)
          })
        },
      }}
    >
      <Tab.Screen name="home" component={HomeTab} options={{ ...tabsBadges["home"] }} />
      <Tab.Screen name="search" component={SearchTab} />
      <Tab.Screen name="inbox" component={InboxTab} options={{ ...tabsBadges["inbox"] }} />
      <Tab.Screen
        name="favorites"
        component={FavoritesTab}
        options={{ ...tabsBadges["favorites"] }}
      />
      <Tab.Screen name="profile" component={ProfileTab} options={{ ...tabsBadges["profile"] }} />
    </Tab.Navigator>
  )
}

export const AuthenticatedRoutesStack = createNativeStackNavigator()

export const AuthenticatedRoutes: React.FC = () => {
  const onboardingState = GlobalStore.useAppState((state) => state.onboarding.onboardingState)

  if (onboardingState === "incomplete") {
    return <OnboardingQuiz />
  }

  return (
    <AuthenticatedRoutesStack.Navigator>
      <AuthenticatedRoutesStack.Group>
        <AuthenticatedRoutesStack.Screen
          name="AppTabs"
          component={AppTabs}
          options={{ headerShown: false }}
        />
        {modalRoutes()}
      </AuthenticatedRoutesStack.Group>
    </AuthenticatedRoutesStack.Navigator>
  )
}

export const tabsTracks = {
  tabScreenView: (tab: BottomTabType): Screen => {
    let tabScreen = OwnerType.home
    switch (tab) {
      case "home":
        tabScreen = OwnerType.home
        break
      case "inbox":
        tabScreen = OwnerType.inbox
        break
      case "profile":
        tabScreen = OwnerType.profile
        break
      case "search":
        tabScreen = OwnerType.search
        break
      case "favorites":
        /**
         * Make sure tabScreen matches the default activeTab in FavoritesContextStore
         */
        tabScreen = OwnerType.favoritesSaves
        break
    }

    return {
      context_screen_owner_type: tabScreen,
      action: ActionType.screen,
    }
  },
}
