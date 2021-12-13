import React, { PropsWithChildren } from "react"
import { FlatListProps, ScrollView } from "react-native"
import Animated from "react-native-reanimated"
import { AnimatableHeaderLargeTitle } from "./AnimatableHeaderLargeTitle"
import { useCollapsibleHeaderContext } from "./CollapsibleHeaderContext"

const AnimatedComponent: typeof ScrollView = Animated.createAnimatedComponent(ScrollView)

export const AnimatableHeaderScrollView = <T extends any>(props: PropsWithChildren<FlatListProps<T>>) => {
  const { children, ...other } = props
  const { scrollOffsetY } = useCollapsibleHeaderContext()

  return (
    <AnimatedComponent
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
    </AnimatedComponent>
  )
}
