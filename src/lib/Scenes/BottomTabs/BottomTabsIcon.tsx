import { Sans } from "@artsy/palette"
import React, { useEffect, useRef } from "react"
import { Animated, View } from "react-native"
import styled from "styled-components/native"

export const BottomTabsIcon: React.FC<{
  activeIcon: React.ReactNode
  inactiveIcon: React.ReactNode
  title: string
  isActive: boolean
}> = ({ activeIcon, inactiveIcon, title, isActive }) => {
  const activeProgress = useRef(new Animated.Value(isActive ? 1 : 0)).current

  useEffect(() => {
    Animated.spring(activeProgress, {
      toValue: isActive ? 1 : 0,
      useNativeDriver: true,
      bounciness: 10,
      speed: 20,
    }).start()
  }, [isActive])

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexGrow: 1 }}>
        <IconWrapper>
          <Animated.View
            style={{
              opacity: isActive
                ? // exiting, disappear quickly
                  activeProgress.interpolate({
                    inputRange: [0, 0.5],
                    outputRange: [1, 0],
                  })
                : // entering, appear instantly and let active icon fade out to reveal
                  1,
              transform: [
                {
                  scale: isActive
                    ? // exiting, shrink down while fading
                      activeProgress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1],
                      })
                    : // entering, don't do anything
                      1,
                },
              ],
            }}
          >
            {inactiveIcon}
          </Animated.View>
        </IconWrapper>
        <IconWrapper>
          <Animated.View
            style={{
              opacity: activeProgress,
              transform: [
                {
                  scale: activeProgress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.9, 1],
                  }),
                },
              ],
            }}
          >
            {activeIcon}
          </Animated.View>
        </IconWrapper>
      </View>
      <View style={{ flexGrow: 0, flexShrink: 1 }}>
        <Sans size="2" textAlign="center" color={isActive ? "black" : "black60"}>
          {title}
        </Sans>
      </View>
    </View>
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
