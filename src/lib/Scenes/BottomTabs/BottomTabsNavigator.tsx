import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { AppModule } from "lib/AppRegistry"
import { NavStack } from "lib/navigation/NavStack"
import React, { useEffect } from "react"
import { View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { BottomTabs } from "./BottomTabs"
import { BottomTabType } from "./BottomTabType"

const Tab = createBottomTabNavigator()

const TabContent = ({ route }: { route: { params: { tabName: BottomTabType; rootModuleName: AppModule } } }) => {
  return <NavStack id={route.params.tabName} rootModuleName={route.params.rootModuleName}></NavStack>
}

let bootstrapQueue: null | Array<() => Promise<void>> = []

export async function afterBottomTabsBootstrap<T>(cb: () => Promise<T> | T) {
  if (!bootstrapQueue) {
    // already bootstrapped
    return await cb()
  }
  return new Promise<T>((resolve, reject) => {
    bootstrapQueue?.push(async () => {
      try {
        resolve(await cb())
      } catch (e) {
        reject(e)
      }
    })
  })
}

async function flushBootstrapQueue() {
  while (bootstrapQueue?.length) {
    const cb = bootstrapQueue.shift()
    await cb?.()
  }
  bootstrapQueue = null
}

export const BottomTabsNavigator = () => {
  const { bottom: paddingBottom } = useSafeAreaInsets()
  useEffect(() => {
    flushBootstrapQueue()
  }, [])
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
