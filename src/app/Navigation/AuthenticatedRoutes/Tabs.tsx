import { ActionType, OwnerType, Screen, tappedTabBar } from "@artsy/cohesion"
import { Flex, Text, useColor } from "@artsy/palette-mobile"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { PlatformPressable } from "@react-navigation/elements"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { ProgressiveOnboardingPriceRangeHome } from "app/Components/ProgressiveOnboarding/ProgressiveOnboardingPriceRangeHome"
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
import { bottomTabsConfig } from "app/Scenes/BottomTabs/bottomTabsConfig"
import { OnboardingQuiz } from "app/Scenes/Onboarding/OnboardingQuiz/OnboardingQuiz"
import { GlobalStore } from "app/store/GlobalStore"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { useIsStaging } from "app/utils/hooks/useIsStaging"
import { postEventToProviders } from "app/utils/track/providers"
import { useCallback } from "react"
import { Easing, InteractionManager, PixelRatio, Platform } from "react-native"
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

export const BOTTOM_TABS_HEIGHT = PixelRatio.getFontScale() < 1.5 ? 65 : 85
export const TAB_BAR_ANIMATION_DURATION = 300

const AppTabs: React.FC = () => {
  const { tabsBadges } = useBottomTabsBadges()
  const color = useColor()
  const isStaging = useIsStaging()
  const insets = useSafeAreaInsets()

  const enableProgressiveOnboardingPriceRangeHome = useFeatureFlag(
    "AREnableProgressiveOnboardingPriceRangeHome"
  )

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
        // we are handling the tracking of the favorites tab withing the screen, as well as home
        // https://artsy.slack.com/archives/C05EQL4R5N0/p1744919145046069
        if (tabName !== "favorites" && tabName !== "home") {
          postEventToProviders(tabsTracks.tabScreenView(tabName))
        }
      }
    },
    [selectedTab]
  )

  const stagingTabBarStyle = {
    borderColor: color("devpurple"),
    borderTopWidth: 1,
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const currentRoute = internal_navigationRef.current?.getCurrentRoute()?.name

        const hidesBottomTabs =
          currentRoute && modules[currentRoute as AppModule]?.options?.hidesBottomTabs

        return {
          animation: "fade",
          headerShown: false,
          tabBarStyle: {
            animate: true,
            position: "absolute",
            height: BOTTOM_TABS_HEIGHT + insets.bottom,

            ...(isStaging ? stagingTabBarStyle : {}),
          },
          tabBarHideOnKeyboard: true,
          tabBarVisible: hidesBottomTabs,
          tabBarVisibilityAnimationConfig: {
            show: {
              animation: "timing",
              config: {
                duration: TAB_BAR_ANIMATION_DURATION,
                easing: Easing.inOut(Easing.ease),
              },
            },
            hide: {
              animation: "timing",
              config: {
                duration: TAB_BAR_ANIMATION_DURATION,
                easing: Easing.inOut(Easing.ease),
              },
            },
          },
          tabBarIcon: ({ focused }) => {
            const Icon = () => {
              return (
                <Flex pt={1}>
                  <BottomTabsIcon tab={route.name} state={focused ? "active" : "inactive"} />
                </Flex>
              )
            }

            const WrappedIcon = () => {
              return (
                <ProgressiveOnboardingPriceRangeHome>
                  <Icon />
                </ProgressiveOnboardingPriceRangeHome>
              )
            }

            if (route.name === "profile" && enableProgressiveOnboardingPriceRangeHome) {
              return <WrappedIcon />
            }

            return <Icon />
          },
          tabBarButton: (props) => (
            <PlatformPressable
              {...props}
              android_ripple={{ color: "transparent" }} // Disables the ripple effect for Android
            />
          ),
          tabBarLabelPosition: "below-icon",
          tabBarLabel: () => {
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
                  {bottomTabsConfig[route.name].name}
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
