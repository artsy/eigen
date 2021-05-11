import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { AppModule } from "lib/AppRegistry"
import { NavStack } from "lib/navigation/NavStack"
import React from "react"
import { View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { BottomTabs } from "./BottomTabs"
import { BottomTabType } from "./BottomTabType"

const Tab = createBottomTabNavigator()

const TabContent = ({ route }: { route: { params: { tabName: BottomTabType; rootModuleName: AppModule } } }) => {
  return <NavStack id={route.params.tabName} rootModuleName={route.params.rootModuleName}></NavStack>
}

export const BottomTabsNavigator = () => {
  const { bottom: paddingBottom } = useSafeAreaInsets()
  return (
    <View style={{ flex: 1, paddingBottom }}>
      <Tab.Navigator tabBar={() => <BottomTabs />} backBehavior="firstRoute">
        <Tab.Screen name="home" component={TabContent} initialParams={{ tabName: "home", rootModuleName: "Home" }} />
        <Tab.Screen
          name="search"
          component={TabContent}
          initialParams={{ tabName: "search", rootModuleName: "Search" }}
        />
        <Tab.Screen name="inbox" component={TabContent} initialParams={{ tabName: "inbox", rootModuleName: "Inbox" }} />
        <Tab.Screen name="sell" component={TabContent} initialParams={{ tabName: "sell", rootModuleName: "Sales" }} />
        <Tab.Screen
          name="profile"
          component={TabContent}
          initialParams={{ tabName: "profile", rootModuleName: "MyProfile" }}
        />
      </Tab.Navigator>
    </View>
  )
}
