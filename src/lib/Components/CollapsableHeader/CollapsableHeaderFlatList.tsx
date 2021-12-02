import { useFeatureFlag } from "lib/store/GlobalStore"
import { Box, useTheme } from "palette"
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
  const { scrollOffsetY } = useCollapsableHeaderContext()
  const isEnabledImprovedAlertsFlow = useFeatureFlag("AREnableImprovedAlertsFlow")
  const headerContainerHeight = space(6)

  return (
    <AnimatedFlatList
      {...other}
      ListHeaderComponent={() => (
        <>
          {isEnabledImprovedAlertsFlow && <Box height={headerContainerHeight} />}
          {ListHeaderComponent}
        </>
      )}
      scrollEventThrottle={0.0000000001}
      scrollIndicatorInsets={{
        ...scrollIndicatorInsets,
        top: isEnabledImprovedAlertsFlow ? headerContainerHeight : scrollIndicatorInsets?.top,
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
