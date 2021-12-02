import { useFeatureFlag } from "lib/store/GlobalStore"
import { useTheme } from "palette"
import React, { PropsWithChildren } from "react"
import { FlatListProps } from "react-native"
import { FlatList } from "react-native-gesture-handler"
import Animated from "react-native-reanimated"
import { useCollapsableHeaderContext } from "./CollapsableHeaderContext"

const AnimatedFlatList: typeof FlatList = Animated.createAnimatedComponent(FlatList)

export interface CollapsableHeaderFlatListProps<T> extends FlatListProps<T> {}

export function CollapsableHeaderFlatList<T extends any>(props: PropsWithChildren<CollapsableHeaderFlatListProps<T>>) {
  const { ListHeaderComponent, scrollIndicatorInsets, ...other } = props
  const { space } = useTheme()
  const { scrollOffsetY, stickyHeaderContentHeight } = useCollapsableHeaderContext()
  const isEnabledImprovedAlertsFlow = useFeatureFlag("AREnableImprovedAlertsFlow")
  const headerContainerHeight = space(6)
  const totalStickyHeaderHeight = Animated.add(headerContainerHeight * 2, stickyHeaderContentHeight)

  return (
    <AnimatedFlatList
      {...other}
      ListHeaderComponent={() => (
        <>
          {isEnabledImprovedAlertsFlow && <Animated.View style={{ height: totalStickyHeaderHeight }} />}
          {ListHeaderComponent}
        </>
      )}
      scrollEventThrottle={0.0000000001}
      scrollIndicatorInsets={{
        ...scrollIndicatorInsets,
        top: isEnabledImprovedAlertsFlow ? headerContainerHeight * 2 : scrollIndicatorInsets?.top,
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
