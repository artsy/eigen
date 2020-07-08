import { tappedTabBar } from "@artsy/cohesion"
import { color, Sans } from "@artsy/palette"
import { changes, useSelectedTab } from "lib/NativeModules/SelectedTab/SelectedTab"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import React, { useEffect, useRef, useState } from "react"
import { Animated, Easing, TouchableWithoutFeedback, View } from "react-native"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"
import { bottomTabsConfig } from "./bottomTabsConfig"
import { BottomTabsIcon, ICON_HEIGHT, ICON_WIDTH } from "./BottomTabsIcon"
import { BottomTabType } from "./BottomTabType"

export const BottomTabsButton: React.FC<{
  tab: BottomTabType
  badgeCount?: number
}> = ({ tab, badgeCount = 0 }) => {
  const isActive = useSelectedTab() === tab
  const timeout = useRef<ReturnType<typeof setTimeout>>()
  const [isBeingPressed, setIsBeingPressed] = useState(false)
  const navRef = useRef(null)

  const showActiveState = isActive || isBeingPressed

  const activeProgress = useRef(new Animated.Value(showActiveState ? 1 : 0)).current

  useEffect(() => {
    Animated.timing(activeProgress, {
      toValue: showActiveState ? 1 : 0,
      useNativeDriver: true,
      easing: Easing.ease,
      duration: 100,
    }).start()
  }, [showActiveState])

  const tracking = useTracking()

  return (
    <TouchableWithoutFeedback
      ref={navRef}
      onPressIn={() => {
        clearTimeout(timeout.current!)
        setIsBeingPressed(true)
      }}
      onPressOut={() => {
        timeout.current = setTimeout(() => {
          setIsBeingPressed(false)
        }, 150)
      }}
      onPress={() => {
        // need to eagerly update the selected tab state otherwise it can take a while for the tab buttons to
        // update their active state
        changes.emit("selectedTabChanged", tab)
        SwitchBoard.presentNavigationViewController(navRef.current!, bottomTabsConfig[tab].route)
        tracking.trackEvent(tappedTabBar({ tab: bottomTabsConfig[tab].analyticsDescription, badge: badgeCount > 0 }))
      }}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>
        <IconWrapper>
          <BottomTabsIcon tab={tab} state="inactive" />
        </IconWrapper>
        <IconWrapper>
          <Animated.View
            style={{
              opacity: activeProgress,
              backgroundColor: "white",
              width: ICON_WIDTH,
              height: ICON_HEIGHT,
            }}
          >
            <BottomTabsIcon tab={tab} state="active" />
          </Animated.View>
        </IconWrapper>

        {!!badgeCount && (
          <IconWrapper>
            <View style={{ width: ICON_WIDTH, height: ICON_HEIGHT }}>
              <View
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  backgroundColor: "white",
                  padding: 2,
                  borderRadius: 11,
                }}
              >
                {/* we need to create our own 2px border using padding here, otherwise the red background
                    bleeds into the antialiasing around the border :/ */}
                <View
                  style={{
                    flex: 1,
                    height: 18,
                    minWidth: 18,
                    paddingHorizontal: 4,
                    borderRadius: 9,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: color("red100"),
                  }}
                >
                  <Sans size="1" weight="medium" color="white">
                    {badgeCount > 99 ? "99+" : badgeCount}
                  </Sans>
                </View>
              </View>
            </View>
          </IconWrapper>
        )}
      </View>
    </TouchableWithoutFeedback>
  )
}

const IconWrapper = styled(View)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;
`
