import React, { useEffect, useMemo } from "react"
import { Animated } from "react-native"

export const FadeIn: React.FC<{ delay?: number }> = ({ delay = 0, children }) => {
  const showing = useMemo(() => {
    return new Animated.Value(0)
  }, [])
  useEffect(() => {
    Animated.spring(showing, { toValue: 1, useNativeDriver: true, speed: 100, delay }).start()
  }, [])
  return (
    <Animated.View
      style={{
        transform: [
          {
            translateY: showing.interpolate({
              inputRange: [0, 1],
              outputRange: [10, 0],
            }),
          },
        ],
        opacity: showing,
      }}
    >
      {children}
    </Animated.View>
  )
}
