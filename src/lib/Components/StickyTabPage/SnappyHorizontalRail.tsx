import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import React, { useEffect } from "react"
import Animated from "react-native-reanimated"
import { useAnimatedValue } from "./reanimatedHelpers"

export const SnappyHorizontalRail: React.FC<{ offset: number }> = ({ offset, children }) => {
  const currentOffset = useAnimatedValue(-offset)
  const { width } = useScreenDimensions()

  useEffect(
    () => {
      Animated.spring(currentOffset, {
        ...Animated.SpringUtils.makeDefaultConfig(),
        stiffness: 600,
        damping: 120,
        toValue: -offset,
      }).start()
    },
    [offset]
  )

  return (
    <Animated.View
      style={{
        flex: 1,
        width: width * 3,
        flexDirection: "row",
        transform: [
          {
            translateX: currentOffset as any,
          },
        ],
      }}
    >
      {children}
    </Animated.View>
  )
}
