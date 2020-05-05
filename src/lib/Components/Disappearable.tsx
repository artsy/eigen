import React, { useImperativeHandle, useMemo, useState } from "react"
import { LayoutAnimation } from "react-native"
import Animated from "react-native-reanimated"
import { useAnimatedValue } from "./StickyTabPage/reanimatedHelpers"

const spring = (val: Animated.Value<number>, props: { toValue: number }) => {
  return new Promise(resolve => {
    Animated.spring(val, {
      ...Animated.SpringUtils.makeDefaultConfig(),
      stiffness: 800,
      damping: 320,
      ...props,
      restSpeedThreshold: 0.1,
    }).start(resolve)
  })
}
export interface Disappearable {
  disappear(): Promise<void>
}
export const Disappearable = React.forwardRef<Disappearable, React.PropsWithChildren<{}>>(({ children }, ref) => {
  const opacity = useAnimatedValue(1)
  const scale = useMemo(() => {
    return Animated.interpolate(opacity, {
      inputRange: [0, 1],
      outputRange: [0.92, 1],
    })
  }, [])
  const [showContent, setShowContent] = useState(true)

  useImperativeHandle(
    ref,
    () => ({
      async disappear() {
        // first the thing fades away and shrinks a little
        await spring(opacity, { toValue: 0 })
        // then we remove the content to avoid content reflow when we set the container size to 0
        await new Promise(resolve => {
          LayoutAnimation.configureNext(LayoutAnimation.create(210, "easeInEaseOut", "opacity"), resolve)
          setShowContent(false)
        })
      },
    }),
    []
  )

  return showContent ? (
    <Animated.View style={[{ opacity, transform: [{ scale }], overflow: "hidden" }]}>{children}</Animated.View>
  ) : null
})
