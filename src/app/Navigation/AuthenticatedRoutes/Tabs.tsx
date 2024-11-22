import { tappedTabBar } from "@artsy/cohesion"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { AppModule, modules } from "app/AppRegistry"
import { HomeTab } from "app/Navigation/AuthenticatedRoutes/HomeTab"
import { InboxTab } from "app/Navigation/AuthenticatedRoutes/InboxTab"
import { ProfileTab } from "app/Navigation/AuthenticatedRoutes/ProfileTab"
import { SearchTab } from "app/Navigation/AuthenticatedRoutes/SearchTab"
import { SellTab } from "app/Navigation/AuthenticatedRoutes/SellTab"
import { registerSharedModalRoutes } from "app/Navigation/AuthenticatedRoutes/SharedRoutes"
import { BottomTabOption, BottomTabType } from "app/Scenes/BottomTabs/BottomTabType"
import { BottomTabsButton } from "app/Scenes/BottomTabs/BottomTabsButton"
import { bottomTabsConfig } from "app/Scenes/BottomTabs/bottomTabsConfig"
import { OnboardingQuiz } from "app/Scenes/Onboarding/OnboardingQuiz/OnboardingQuiz"
import { GlobalStore } from "app/store/GlobalStore"
import { internal_navigationRef, switchTab } from "app/system/navigation/navigate"
import { postEventToProviders } from "app/utils/track/providers"
import { Platform } from "react-native"

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

const AppTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const currentRoute = internal_navigationRef.current?.getCurrentRoute()?.name
        return {
          headerShown: false,
          tabBarStyle: {
            animate: true,
            position: "absolute",
            display:
              currentRoute && modules[currentRoute as AppModule]?.options.hidesBottomTabs
                ? "none"
                : "flex",
          },
          tabBarHideOnKeyboard: true,
          tabBarButton: (props) => {
            return <BottomTabsButton tab={route.name} onPress={props.onPress} />
          },
        }
      }}
      screenListeners={{
        tabPress: (e) => {
          // the tab name is saved in e.target postfixed with random string like sell-Nw_wCNTWwOg95v
          const tabName = Object.keys(bottomTabsConfig).find((tab) => e.target?.startsWith(tab))

          if (tabName) {
            switchTab(tabName as BottomTabType)
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
