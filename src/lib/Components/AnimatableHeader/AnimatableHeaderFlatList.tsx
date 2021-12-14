import React from "react"
import { FlatList, FlatListProps } from "react-native"
import Animated from "react-native-reanimated"
import { useAnimatableHeaderContext } from "./AnimatableHeaderContext"
import { AnimatableHeaderLargeTitle } from "./AnimatableHeaderLargeTitle"
import { AnimatableHeaderShadow } from "./AnimatableHeaderShadow"

const AnimatedFlatList: typeof FlatList = Animated.createAnimatedComponent(FlatList)

export const AnimatableHeaderFlatList = <T extends any>(props: FlatListProps<T>) => {
  const { ListHeaderComponent, ...other } = props
  const { scrollOffsetY } = useAnimatableHeaderContext()

  return (
    <>
      <AnimatedFlatList
        {...other}
        scrollEventThrottle={0.0000000001}
        ListHeaderComponent={
          <>
            <AnimatableHeaderLargeTitle />
            {ListHeaderComponent}
          </>
        }
        onScroll={Animated.event([
          {
            nativeEvent: {
              contentOffset: { y: scrollOffsetY },
            },
          },
        ])}
      />
      <AnimatableHeaderShadow />
    </>
  )
}
