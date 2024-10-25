import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { AppModule, modules } from "app/AppRegistry"
import { HomeTab } from "app/Navigation/AuthenticatedRoutes/HomeTab"
import { InboxTab } from "app/Navigation/AuthenticatedRoutes/InboxTab"
import { ProfileTab } from "app/Navigation/AuthenticatedRoutes/ProfileTab"
import { SearchTab } from "app/Navigation/AuthenticatedRoutes/SearchTab"
import { SellTab } from "app/Navigation/AuthenticatedRoutes/SellTab"
import { BottomTabsButton } from "app/Scenes/BottomTabs/BottomTabsButton"
import { __unsafe_navigationRef } from "app/system/navigation/navigate"
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

export const TabStackNavigator = createNativeStackNavigator<AuthenticatedRoutesParams>()

export const AuthenticatedRoutes = () => {
  // TODO: Look into other ways of getting this
  // const { unreadConversationsCount } = useTabBarBadge()

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const currentRoute = __unsafe_navigationRef.current?.getCurrentRoute()?.name
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
          tabBarButton: (props) => <BottomTabsButton tab={route.name} {...props} />,
        }
      }}
    >
      <Tab.Screen name="home" component={HomeTab} />
      <Tab.Screen name="search" component={SearchTab} />
      <Tab.Screen
        name="inbox"
        component={InboxTab}
        options={{
          tabBarBadge: 3,
        }}
      />
      <Tab.Screen name="sell" component={SellTab} />
      <Tab.Screen name="profile" component={ProfileTab} />
    </Tab.Navigator>
  )
}
