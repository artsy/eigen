import React, { useImperativeHandle, useRef } from "react"
import { ViewStyle } from "react-native"
import Animated from "react-native-reanimated"
import { useAnimatedValue } from "./reanimatedHelpers"

export interface SnappyHorizontalRail {
  setOffset(offset: number): void
}
export const SnappyHorizontalRail = React.forwardRef<
  SnappyHorizontalRail,
  React.PropsWithChildren<{ initialOffset?: number; width: number; style?: ViewStyle }>
>(({ children, initialOffset = 0, width, style }, ref) => {
  const currentOffset = useAnimatedValue(-initialOffset)
  const currentAnimation = useRef<Animated.BackwardCompatibleWrapper>()

  useImperativeHandle(
    ref,
    () => ({
      setOffset(offset) {
        if (currentAnimation.current) {
          currentAnimation.current.stop()
        }
        currentAnimation.current = Animated.spring(currentOffset, {
          ...Animated.SpringUtils.makeDefaultConfig(),
          stiffness: 600,
          damping: 120,
          toValue: -offset,
        })

        currentAnimation.current.start(() => {
          currentAnimation.current = undefined
        })
      },
    }),
    []
  )

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        {
          flex: 1,
          width,
          flexDirection: "row",
          transform: [
            {
              translateX: currentOffset as any,
            },
          ],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  )
})
