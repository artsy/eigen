import React, { useEffect, useRef } from "react"
import { Animated } from "react-native"

export const PopIn: React.FC<{ xOffset?: number; yOffset?: number }> = ({
  children,
  xOffset,
  yOffset,
}) => {
  const entranceProgress = useRef(new Animated.Value(0)).current
  useEffect(() => {
    Animated.spring(entranceProgress, {
      toValue: 1,
      bounciness: 12,
      speed: 28,
      useNativeDriver: true,
    }).start()
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
            translateY:
              yOffset != null
                ? entranceProgress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [yOffset, 0],
                  })
                : 0,
          },
          {
            translateX:
              xOffset != null
                ? entranceProgress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [xOffset, 0],
                  })
                : 0,
          },
        ],
      }}
    >
      {children}
    </Animated.View>
  )
}
