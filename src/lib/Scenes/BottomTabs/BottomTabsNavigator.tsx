import { AppModuleName } from "lib/AppRegistry"
import { NativeViewController } from "lib/Components/NativeViewController"
import { useSelectedTab } from "lib/store/GlobalStore"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import React, { useEffect, useRef } from "react"
import { Animated, View } from "react-native"
import { BottomTabs } from "./BottomTabs"
import { BottomTabType } from "./BottomTabType"

const NavStack = ({ tabName, rootModuleName }: { tabName: BottomTabType; rootModuleName: AppModuleName }) => {
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

export const BottomTabsNavigator = () => {
  const selectedTab = useSelectedTab()
  const { bottom } = useScreenDimensions().safeAreaInsets
  return (
    <View style={{ flex: 1, paddingBottom: bottom }}>
      <FadeBetween
        views={[
          <NavStack tabName="home" rootModuleName="Home" />,
          <NavStack tabName="search" rootModuleName="Search" />,
          <NavStack tabName="inbox" rootModuleName="Inbox" />,
          <NavStack tabName="sell" rootModuleName="Sales" />,
          <NavStack tabName="profile" rootModuleName="MyProfile" />,
        ]}
        activeIndex={["home", "search", "inbox", "sell", "profile"].indexOf(selectedTab)}
      />
      <BottomTabs />
    </View>
  )
}

const FadeBetween: React.FC<{ views: JSX.Element[]; activeIndex: number }> = ({ views, activeIndex }) => {
  const opacities = useRef(views.map((_, index) => new Animated.Value(index === activeIndex ? 1 : 0))).current
  const lastActiveIndex = usePrevious(activeIndex)
  useEffect(() => {
    if (lastActiveIndex < activeIndex) {
      // fade in screen above, then make previous screen transparent
      Animated.spring(opacities[activeIndex], { toValue: 1, useNativeDriver: true, speed: 100 }).start(() => {
        opacities[lastActiveIndex].setValue(0)
      })
    } else if (lastActiveIndex > activeIndex) {
      // make next screen opaque, then fade out screen above
      opacities[activeIndex].setValue(1)
      requestAnimationFrame(() => {
        Animated.spring(opacities[lastActiveIndex], { toValue: 0, useNativeDriver: true, speed: 100 }).start()
      })
    }
  }, [activeIndex])
  return (
    <View style={{ flex: 1, overflow: "hidden" }}>
      {views.map((v, index) => {
        return (
          (index === activeIndex || index === lastActiveIndex) && (
            <View
              key={index}
              pointerEvents={index === activeIndex ? undefined : "none"}
              style={{ position: "absolute", width: "100%", height: "100%" }}
            >
              <Animated.View style={{ opacity: opacities[index], flex: 1, backgroundColor: "white" }}>
                {v}
              </Animated.View>
            </View>
          )
        )
      })}
    </View>
  )
}

function usePrevious<T>(value: T) {
  const ref = useRef<T>(value)
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}
