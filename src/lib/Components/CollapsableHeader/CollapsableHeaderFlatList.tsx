import { useFeatureFlag } from "lib/store/GlobalStore"
import React, { PropsWithChildren } from "react"
import { FlatListProps } from "react-native"
import { FlatList } from "react-native-gesture-handler"
import Animated from "react-native-reanimated"
import { CollapsableContentOffset } from "./CollapsableHeaderContentOffset"
import { useCollapsableHeaderContext } from "./CollapsableHeaderContext"

const AnimatedFlatList: typeof FlatList = Animated.createAnimatedComponent(FlatList)

export interface CollapsableHeaderFlatListProps<T> extends FlatListProps<T> {}

export function CollapsableHeaderFlatList<T extends any>(props: PropsWithChildren<CollapsableHeaderFlatListProps<T>>) {
  const { ListHeaderComponent, scrollIndicatorInsets, ...other } = props
  const { scrollOffsetY, headerHeight } = useCollapsableHeaderContext()
  const isEnabledImprovedAlertsFlow = useFeatureFlag("AREnableImprovedAlertsFlow")

  return (
    <AnimatedFlatList
      {...other}
      ListHeaderComponent={() => (
        <>
          {isEnabledImprovedAlertsFlow && <CollapsableContentOffset />}
          {ListHeaderComponent}
        </>
      )}
      scrollEventThrottle={0.0000000001}
      scrollIndicatorInsets={{
        ...scrollIndicatorInsets,
        top: isEnabledImprovedAlertsFlow ? headerHeight * 2 : scrollIndicatorInsets?.top,
      }}
      onScroll={Animated.event([
        {
          nativeEvent: {
            contentOffset: { y: scrollOffsetY },
          },
        },
      ])}
    />
  )
}
