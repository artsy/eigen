import React, { useImperativeHandle, useRef } from "react"
import Animated from "react-native-reanimated"
import { useAnimatedValue } from "./reanimatedHelpers"

export interface SnappyHorizontalRail {
  setOffset(offset: number): void
}
export const SnappyHorizontalRail = React.forwardRef<
  SnappyHorizontalRail,
  React.PropsWithChildren<{ initialOffset?: number; width: number }>
>(({ children, initialOffset = 0, width }, ref) => {
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
          currentAnimation.current = null
        })
      },
    }),
    []
  )

  return (
    <Animated.View
      style={{
        flex: 1,
        width,
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
})
