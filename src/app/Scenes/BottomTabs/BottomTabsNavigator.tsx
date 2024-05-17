import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { AppModule } from "app/AppRegistry"
import { NavStack } from "app/system/navigation/NavStack"
import { useAndroidGoBack } from "app/utils/hooks/useBackHandler"
import { BottomTabType } from "./BottomTabType"
import { BottomTabs } from "./BottomTabs"

const Tab = createBottomTabNavigator()

const TabContent = ({
  route,
}: {
  route: { params: { tabName: BottomTabType; rootModuleName: AppModule } }
}) => {
  useAndroidGoBack()
  // TODO: simplify this, we probably can get rid of NavStack
  return <NavStack id={route.params.tabName} rootModuleName={route.params.rootModuleName} />
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
        initialParams={{ tabName: "sell", rootModuleName: "Sell" }}
      />
      <Tab.Screen
        name="profile"
        component={TabContent}
        initialParams={{ tabName: "profile", rootModuleName: "MyProfile" }}
      />
    </Tab.Navigator>
  )
}
