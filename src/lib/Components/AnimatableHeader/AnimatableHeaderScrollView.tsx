import React from "react"
import { ScrollView, ScrollViewProps } from "react-native"
import Animated from "react-native-reanimated"
import { useAnimatableHeaderContext } from "./AnimatableHeaderContext"
import { AnimatableHeaderLargeTitle } from "./AnimatableHeaderLargeTitle"
import { AnimatableHeaderShadow } from "./AnimatableHeaderShadow"

const AnimatedScrollView: typeof ScrollView = Animated.createAnimatedComponent(ScrollView)

export const AnimatableHeaderScrollView: React.FC<ScrollViewProps> = (props) => {
  const { children, ...other } = props
  const { scrollOffsetY } = useAnimatableHeaderContext()

  return (
    <>
      <AnimatedScrollView
        {...other}
        scrollEventThrottle={0.0000000001}
        onScroll={Animated.event([
          {
            nativeEvent: {
              contentOffset: { y: scrollOffsetY },
            },
          },
        ])}
      >
        <AnimatableHeaderLargeTitle />
        {children}
      </AnimatedScrollView>
      <AnimatableHeaderShadow />
    </>
  )
}
