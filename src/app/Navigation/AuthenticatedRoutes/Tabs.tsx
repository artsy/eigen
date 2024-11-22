import { tappedTabBar } from "@artsy/cohesion"
import { Text } from "@artsy/palette-mobile"
import { THEME } from "@artsy/palette-tokens"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { AppModule, modules } from "app/AppRegistry"
import { HomeTab } from "app/Navigation/AuthenticatedRoutes/HomeTab"
import { InboxTab } from "app/Navigation/AuthenticatedRoutes/InboxTab"
import { ProfileTab } from "app/Navigation/AuthenticatedRoutes/ProfileTab"
import { SearchTab } from "app/Navigation/AuthenticatedRoutes/SearchTab"
import { SellTab } from "app/Navigation/AuthenticatedRoutes/SellTab"
import { registerSharedModalRoutes } from "app/Navigation/AuthenticatedRoutes/SharedRoutes"
import { useBottomTabsBadges } from "app/Navigation/Utils/useBottomTabsBadges"
import { BottomTabOption, BottomTabType } from "app/Scenes/BottomTabs/BottomTabType"
import { BottomTabsIcon } from "app/Scenes/BottomTabs/BottomTabsIcon"
import { bottomTabsConfig } from "app/Scenes/BottomTabs/bottomTabsConfig"
import { OnboardingQuiz } from "app/Scenes/Onboarding/OnboardingQuiz/OnboardingQuiz"
import { GlobalStore } from "app/store/GlobalStore"
import { internal_navigationRef } from "app/system/navigation/navigate"
import { postEventToProviders } from "app/utils/track/providers"
import { Platform } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

if (Platform.OS === "ios") {
  require("app/Navigation/AuthenticatedRoutes/NativeScreens")
}

export type AuthenticatedRoutesParams = {
  Home: undefined
  Search: undefined
  Profile: undefined
  Inbox: undefined
  Sell: undefined
} & { [key in AppModule]: undefined }

type TabRoutesParams = {
  home: undefined
  search: undefined
  inbox: undefined
  sell: undefined
  profile: undefined
}

const Tab = createBottomTabNavigator<TabRoutesParams>()

const BOTTOM_TABS_HEIGHT = 60

const AppTabs: React.FC = () => {
  const { tabsBadges } = useBottomTabsBadges()
  const insets = useSafeAreaInsets()

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const currentRoute = internal_navigationRef.current?.getCurrentRoute()?.name
        return {
          headerShown: false,
          tabBarStyle: {
            animate: true,
            position: "absolute",
            height: BOTTOM_TABS_HEIGHT + insets.bottom,
            display:
              currentRoute && modules[currentRoute as AppModule]?.options.hidesBottomTabs
                ? "none"
                : "flex",
          },
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({ focused }) => {
            return <BottomTabsIcon tab={route.name} state={focused ? "active" : "inactive"} />
          },
          tabBarLabel: () => {
            return (
              <Text variant="xxs" style={{ top: -4 }} selectable={false}>
                {bottomTabsConfig[route.name].name}
              </Text>
            )
          },
          tabBarActiveTintColor: THEME.colors["black100"],
          tabBarInactiveTintColor: THEME.colors["black60"],
          ...tabsBadges[route.name],
        }
      }}
      screenListeners={{
        tabPress: (e) => {
          // the tab name is saved in e.target postfixed with random string like sell-Nw_wCNTWwOg95v
          const tabName = Object.keys(bottomTabsConfig).find(
            (tab) => e.target?.startsWith(tab)
          ) as BottomTabType

          if (Object.keys(BottomTabOption).includes(tabName)) {
            GlobalStore.actions.bottomTabs.setSelectedTab(tabName)
            postEventToProviders(
              tappedTabBar({
                tab: bottomTabsConfig[tabName as BottomTabType].analyticsDescription,
                contextScreenOwnerType: BottomTabOption[tabName as BottomTabType],
              })
            )
          }
        },
      }}
    >
      <Tab.Screen name="home" component={HomeTab} />
      <Tab.Screen name="search" component={SearchTab} />
      <Tab.Screen name="inbox" component={InboxTab} />
      <Tab.Screen name="sell" component={SellTab} />
      <Tab.Screen name="profile" component={ProfileTab} />
    </Tab.Navigator>
  )
}

export const AuthenticatedRoutesStack = createNativeStackNavigator()

export const AuthenticatedRoutes: React.FC = () => {
  const onboardingState = GlobalStore.useAppState((state) => state.auth.onboardingState)

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
        {registerSharedModalRoutes()}
      </AuthenticatedRoutesStack.Group>
    </AuthenticatedRoutesStack.Navigator>
  )
}
