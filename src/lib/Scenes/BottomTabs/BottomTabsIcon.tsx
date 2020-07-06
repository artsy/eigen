import React, { useEffect, useRef } from "react"
import { Animated, Easing, View } from "react-native"
import styled from "styled-components/native"

export const BottomTabsIcon: React.FC<{
  activeIcon: React.ReactNode
  inactiveIcon: React.ReactNode
  isActive: boolean
}> = ({ activeIcon, inactiveIcon, isActive }) => {
  const activeProgress = useRef(new Animated.Value(isActive ? 1 : 0)).current

  useEffect(() => {
    Animated.timing(activeProgress, {
      toValue: isActive ? 1 : 0,
      useNativeDriver: true,
      easing: Easing.ease,
      duration: 100,
    }).start()
  }, [isActive])

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexGrow: 1 }}>
        <IconWrapper>
          <Animated.View
            style={{
              opacity: Animated.subtract(1, activeProgress),
            }}
          >
            {inactiveIcon}
          </Animated.View>
        </IconWrapper>
        <IconWrapper>
          <Animated.View
            style={{
              opacity: activeProgress,
            }}
          >
            {activeIcon}
          </Animated.View>
        </IconWrapper>
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
