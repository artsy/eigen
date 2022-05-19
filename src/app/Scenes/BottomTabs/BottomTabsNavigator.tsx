import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { AppModule } from "app/AppRegistry"
import { NavStack } from "app/navigation/NavStack"
import React from "react"
import { BottomTabs } from "./BottomTabs"
import { BottomTabType } from "./BottomTabType"

const Tab = createBottomTabNavigator()

const TabContent = ({
  route,
}: {
  route: { params: { tabName: BottomTabType; rootModuleName: AppModule } }
}) => {
  // TODO: simplify this, we probably can get rid of NavStack
  return <NavStack id={route.params.tabName} rootModuleName={route.params.rootModuleName} />
}

export const BottomTabsNavigator = () => {
  return (
    <Tab.Navigator tabBar={() => <BottomTabs />} backBehavior="firstRoute">
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
