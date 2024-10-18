import { THEME } from "@artsy/palette-tokens"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { NavigatorScreenParams } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { HomeStackPrams, HomeTab } from "app/Navigation/AuthenticatedRoutes/HomeTab"
import { InboxStackPrams, InboxTab } from "app/Navigation/AuthenticatedRoutes/InboxTab"
import { ProfileStackPrams, ProfileTab } from "app/Navigation/AuthenticatedRoutes/ProfileTab"
import { SearchStackPrams, SearchTab } from "app/Navigation/AuthenticatedRoutes/SearchTab"
import { SellStackPrams, SellTab } from "app/Navigation/AuthenticatedRoutes/SellTab"
import { SharedRoutesParams } from "app/Navigation/AuthenticatedRoutes/SharedRoutes"
import { BottomTabsIcon } from "app/Scenes/BottomTabs/BottomTabsIcon"
import { useTabBarBadge } from "app/utils/useTabBarBadge"

export type AuthenticatedRoutesParams = {
  Home: NavigatorScreenParams<HomeStackPrams>
  Search: NavigatorScreenParams<SearchStackPrams>
  Profile: NavigatorScreenParams<ProfileStackPrams>
  Inbox: NavigatorScreenParams<InboxStackPrams>
  Sell: NavigatorScreenParams<SellStackPrams>
} & SharedRoutesParams

type TabRoutesParams = {
  home: undefined
  search: undefined
  inbox: undefined
  sell: undefined
  profile: undefined
}

const Tab = createBottomTabNavigator<TabRoutesParams>()

export const TabStackNavigator = createNativeStackNavigator<AuthenticatedRoutesParams>()

export const AuthenticatedRoutes = () => {
  const { unreadConversationsCount } = useTabBarBadge()

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        return {
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            return <BottomTabsIcon tab={route.name} state={focused ? "active" : "inactive"} />
          },
          tabBarActiveTintColor: THEME.colors["black100"],
          tabBarInactiveTintColor: THEME.colors["black60"],
        }
      }}
    >
      <Tab.Screen name="home" component={HomeTab} />
      <Tab.Screen name="search" component={SearchTab} />
      <Tab.Screen
        name="inbox"
        component={InboxTab}
        options={{
          tabBarBadge: unreadConversationsCount,
        }}
      />
      <Tab.Screen name="sell" component={SellTab} />
      <Tab.Screen name="profile" component={ProfileTab} />
    </Tab.Navigator>
  )
}
