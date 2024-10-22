import { Text } from "@artsy/palette-mobile"
import { THEME } from "@artsy/palette-tokens"
import { toTitleCase } from "@artsy/to-title-case"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { AppModule, modules } from "app/AppRegistry"
import { HomeTab } from "app/Navigation/AuthenticatedRoutes/HomeTab"
import { InboxTab } from "app/Navigation/AuthenticatedRoutes/InboxTab"
import { ProfileTab } from "app/Navigation/AuthenticatedRoutes/ProfileTab"
import { SearchTab } from "app/Navigation/AuthenticatedRoutes/SearchTab"
import { SellTab } from "app/Navigation/AuthenticatedRoutes/SellTab"
import { BottomTabsIcon } from "app/Scenes/BottomTabs/BottomTabsIcon"
import { __unsafe_navigationRef } from "app/system/navigation/navigate"
import { useTabBarBadge } from "app/utils/useTabBarBadge"

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

export const TabStackNavigator = createNativeStackNavigator<AuthenticatedRoutesParams>()

export const AuthenticatedRoutes = () => {
  const { unreadConversationsCount } = useTabBarBadge()

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const currentRoute = __unsafe_navigationRef.current?.getCurrentRoute()?.name

        return {
          headerShown: false,
          tabBarStyle: {
            // TODO: Test this with design
            animate: true,
            display:
              currentRoute && modules[currentRoute as AppModule]?.options.hidesBottomTabs
                ? "none"
                : "flex",
          },
          tabBarIcon: ({ focused }) => {
            return <BottomTabsIcon tab={route.name} state={focused ? "active" : "inactive"} />
          },
          tabBarLabel: () => {
            return <Text variant="xxs">{toTitleCase(route.name)}</Text>
          },
          tabBarHideOnKeyboard: true,
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
