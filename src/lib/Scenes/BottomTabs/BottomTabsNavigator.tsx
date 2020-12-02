import { NavigationContainerRef } from "@react-navigation/native"
import { ModalStack } from "lib/ModalStack"
import { setTabStackNavRefs } from "lib/navigation/navigate"
import { NavStack } from "lib/NavStack"
import { useSelectedTab } from "lib/store/GlobalStore"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import React, { useEffect, useRef } from "react"
import { Animated, View } from "react-native"
import { BottomTabs } from "./BottomTabs"
import { BottomTabType } from "./BottomTabType"

export const BottomTabsNavigator = () => {
  const selectedTab = useSelectedTab()
  const { bottom } = useScreenDimensions().safeAreaInsets
  const tabRefs = useRef<Record<BottomTabType, NavigationContainerRef | null>>({
    home: null,
    search: null,
    inbox: null,
    sell: null,
    profile: null,
  }).current
  useEffect(() => {
    setTabStackNavRefs(tabRefs)
  }, [])
  return (
    <View style={{ flex: 1, paddingBottom: bottom }}>
      <FadeBetween
        views={[
          <NavStack ref={(ref) => (tabRefs.home = ref)} rootModuleName="Home" />,
          <NavStack ref={(ref) => (tabRefs.search = ref)} rootModuleName="MyProfile" />,
          <NavStack ref={(ref) => (tabRefs.inbox = ref)} rootModuleName="MyProfile" />,
          <NavStack ref={(ref) => (tabRefs.sell = ref)} rootModuleName="Sales" />,
          <NavStack ref={(ref) => (tabRefs.profile = ref)} rootModuleName="MyProfile" />,
        ]}
        activeIndex={["home", "search", "inbox", "sell", "profile"].indexOf(selectedTab)}
      />
      <BottomTabs />
      <ModalStack />
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
