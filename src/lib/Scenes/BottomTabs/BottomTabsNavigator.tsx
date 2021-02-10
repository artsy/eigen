import { AppModule } from "lib/AppRegistry"
import { NativeViewController } from "lib/Components/NativeViewController"
import { __unsafe_tabStackNavRefs } from "lib/NativeModules/ARScreenPresenterModule"
import { NavStack } from "lib/navigation/NavStack"
import { useSelectedTab } from "lib/store/GlobalStore"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import React, { useEffect, useRef } from "react"
import { Animated, Platform, View } from "react-native"
import usePrevious from "react-use/lib/usePrevious"
import { BottomTabs } from "./BottomTabs"
import { BottomTabType } from "./BottomTabType"

const TabContent = ({ tabName, rootModuleName }: { tabName: BottomTabType; rootModuleName: AppModule }) => {
  if (Platform.OS === "ios") {
    return (
      <NativeViewController
        viewName="TabNavigationStack"
        viewProps={{
          tabName,
          rootModuleName,
        }}
      />
    )
  }

  return <NavStack id={tabName} ref={__unsafe_tabStackNavRefs[tabName]} rootModuleName={rootModuleName}></NavStack>
}

export const BottomTabsNavigator = () => {
  const selectedTab = useSelectedTab()
  const { bottom } = useScreenDimensions().safeAreaInsets
  return (
    <View style={{ flex: 1, paddingBottom: bottom }}>
      <FadeBetween
        views={[
          <TabContent tabName="home" rootModuleName="Home" />,
          <TabContent tabName="search" rootModuleName="Search" />,
          <TabContent tabName="inbox" rootModuleName="Inbox" />,
          <TabContent tabName="sell" rootModuleName="Sales" />,
          <TabContent tabName="profile" rootModuleName="MyProfile" />,
        ]}
        activeIndex={["home", "search", "inbox", "sell", "profile"].indexOf(selectedTab)}
      />
      <BottomTabs />
    </View>
  )
}

const FadeBetween: React.FC<{ views: JSX.Element[]; activeIndex: number }> = ({ views, activeIndex }) => {
  const hasLoaded = useRef({ [activeIndex]: true }).current
  const opacities = useRef(views.map((_, index) => new Animated.Value(index === activeIndex ? 1 : 0.01))).current
  const lastActiveIndex = usePrevious(activeIndex)

  useEffect(() => {
    if (lastActiveIndex === undefined) {
      return
    }

    if (lastActiveIndex < activeIndex) {
      // fade in screen above, then make previous screen transparent
      opacities[activeIndex].setValue(0)
      requestAnimationFrame(() => {
        Animated.spring(opacities[activeIndex], { toValue: 1, useNativeDriver: true, speed: 100 }).start(() => {
          opacities[lastActiveIndex].setValue(0)
        })
      })
    } else if (lastActiveIndex > activeIndex) {
      // make next screen opaque, then fade out screen above
      opacities[activeIndex].setValue(1)
      requestAnimationFrame(() => {
        Animated.spring(opacities[lastActiveIndex], { toValue: 0, useNativeDriver: true, speed: 100 }).start()
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
