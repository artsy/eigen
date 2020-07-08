import React, { useEffect, useRef } from "react"
import { Animated } from "react-native"

export const PopIn: React.FC = ({ children }) => {
  const entranceProgress = useRef(new Animated.Value(0)).current
  useEffect(() => {
    Animated.spring(entranceProgress, { toValue: 1, bounciness: 10, speed: 18, useNativeDriver: true }).start()
  }, [])
  return (
    <Animated.View
      style={{
        opacity: entranceProgress,
        transform: [
          {
            scale: entranceProgress.interpolate({
              inputRange: [0, 1],
              outputRange: [0.5, 1],
            }),
          },
          {
            translateY: entranceProgress.interpolate({
              inputRange: [0, 1],
              outputRange: [6, 0],
            }),
          },
        ],
      }}
    >
      {children}
    </Animated.View>
  )
}
