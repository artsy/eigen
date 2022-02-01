import React, { useImperativeHandle, useMemo, useState } from "react"
import { LayoutAnimation } from "react-native"
import Animated from "react-native-reanimated"
import { useAnimatedValue } from "./StickyTabPage/reanimatedHelpers"

export interface Disappearable {
  disappear(): Promise<void>
}
export const Disappearable = React.forwardRef<
  Disappearable,
  React.PropsWithChildren<{ animateScale?: boolean }>
>(({ children, animateScale = true }, ref) => {
  const opacity = useAnimatedValue(1)
  const scale = animateScale
    ? useMemo(() => {
        return Animated.interpolate(opacity, {
          inputRange: [0, 1],
          outputRange: [0.92, 1],
        })
      }, [])
    : 1
  const [showContent, setShowContent] = useState(true)

  useImperativeHandle(
    ref,
    () => ({
      async disappear() {
        // first the content fades away and shrinks a little
        await new Promise<void>((resolve) => {
          if (__TEST__) {
            // .start doesn't exist at test time
            resolve()
            return
          }
          Animated.spring(opacity, {
            ...Animated.SpringUtils.makeDefaultConfig(),
            stiffness: 800,
            damping: 320,
            restSpeedThreshold: 0.1,
            toValue: 0,
          }).start(() => resolve())
        })
        // then we configure an animation layout to happen before removing the content
        await new Promise<void>((resolve) => {
          LayoutAnimation.configureNext(
            LayoutAnimation.create(210, "easeInEaseOut", "opacity"),
            resolve
          )
          setShowContent(false)
        })
      },
    }),
    []
  )

  return showContent ? (
    <Animated.View style={[{ opacity, transform: [{ scale }], overflow: "hidden" }]}>
      {children}
    </Animated.View>
  ) : null
})
