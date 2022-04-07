import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { AppModule } from "app/AppRegistry"
import { NavStack } from "app/navigation/NavStack"
import React, { useEffect, useRef } from "react"
import { Animated, View } from "react-native"
import usePrevious from "react-use/lib/usePrevious"
import { BottomTabs } from "./BottomTabs"
import { BottomTabType } from "./BottomTabType"

const Tab = createBottomTabNavigator()

const TabContent = ({
  route,
}: {
  route: { params: { tabName: BottomTabType; rootModuleName: AppModule } }
}) => {
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

const FadeBetween: React.FC<{ views: JSX.Element[]; activeIndex: number }> = ({
  views,
  activeIndex,
}) => {
  const hasLoaded = useRef({ [activeIndex]: true }).current
  const opacities = useRef(
    views.map((_, index) => new Animated.Value(index === activeIndex ? 1 : 0.01))
  ).current
  const lastActiveIndex = usePrevious(activeIndex)

  useEffect(() => {
    if (lastActiveIndex === undefined) {
      return
    }

    if (lastActiveIndex < activeIndex) {
      // fade in screen above, then make previous screen transparent
      opacities[activeIndex].setValue(0)
      requestAnimationFrame(() => {
        Animated.spring(opacities[activeIndex], {
          toValue: 1,
          useNativeDriver: true,
          speed: 100,
        }).start(() => {
          opacities[lastActiveIndex].setValue(0)
        })
      })
    } else if (lastActiveIndex > activeIndex) {
      // make next screen opaque, then fade out screen above
      opacities[activeIndex].setValue(1)
      requestAnimationFrame(() => {
        Animated.spring(opacities[lastActiveIndex], {
          toValue: 0,
          useNativeDriver: true,
          speed: 100,
        }).start()
      })
    }

    hasLoaded[activeIndex] = true
  }, [activeIndex, lastActiveIndex])

  return (
    <View style={{ flex: 1, overflow: "hidden" }}>
      {views.map((v, index) => {
        return (
          <View
            key={index}
            pointerEvents={index === activeIndex ? undefined : "none"}
            style={{ position: "absolute", width: "100%", height: "100%" }}
          >
            <Animated.View style={{ opacity: opacities[index], flex: 1, backgroundColor: "white" }}>
              {!!(hasLoaded[index] || index === activeIndex) && v}
            </Animated.View>
          </View>
        )
      })}
    </View>
  )
}
