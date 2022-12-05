import { BottomTabNavigationProp, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { findFocusedRoute } from "@react-navigation/native"
import { AppModule } from "app/AppRegistry"
import { NavStack } from "app/navigation/NavStack"
import { View } from "react-native"
import { BottomTabs } from "./BottomTabs"
import { BottomTabType } from "./BottomTabType"
import { useBottomTabBarHeight } from "./useBottomTabBarHeight"

const Tab = createBottomTabNavigator()

const TabContent = ({
  route,
  navigation,
}: {
  route: { params: { tabName: BottomTabType; rootModuleName: AppModule } }
  navigation: BottomTabNavigationProp<Record<BottomTabType, object | undefined>>
}) => {
  const bottomTabBarHeight = useBottomTabBarHeight()
  const focusedRoute = findFocusedRoute(navigation.getState())
  const shouldHideBottomTab = (focusedRoute?.params as any)?.shouldHideBottomTab
  const bottomOffset = shouldHideBottomTab ? 0 : bottomTabBarHeight

  // TODO: simplify this, we probably can get rid of NavStack
  return (
    <View style={{ flex: 1, marginBottom: bottomOffset }}>
      <NavStack id={route.params.tabName} rootModuleName={route.params.rootModuleName} />
    </View>
  )
}

export const BottomTabsNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomTabs {...props} />}
      backBehavior="firstRoute"
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name="home"
        component={TabContent}
        initialParams={{ tabName: "home", rootModuleName: "Home" }}
      />
      <Tab.Screen
        name="search"
        component={TabContent}
        initialParams={{ tabName: "search", rootModuleName: "Search" }}
      />
      <Tab.Screen
        name="inbox"
        component={TabContent}
        initialParams={{ tabName: "inbox", rootModuleName: "Inbox" }}
      />
      <Tab.Screen
        name="sell"
        component={TabContent}
        initialParams={{ tabName: "sell", rootModuleName: "Sales" }}
      />
      <Tab.Screen
        name="profile"
        component={TabContent}
        initialParams={{ tabName: "profile", rootModuleName: "MyProfile" }}
      />
    </Tab.Navigator>
  )
}
