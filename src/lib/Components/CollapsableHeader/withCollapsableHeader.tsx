import { useFeatureFlag } from "lib/store/GlobalStore"
import React from "react"
import { ScrollViewProps } from "react-native"
import Animated from "react-native-reanimated"
import { useCollapsableHeaderContext } from "./CollapsableHeaderContext"

export type CollapsableHeaderViewProps<T extends ScrollViewProps> = T & {}

export const withCollapsableHeader = <P extends ScrollViewProps>(Component: React.ComponentType<P>) => {
  const AnimatedComponent = Animated.createAnimatedComponent(Component) as React.ComponentType<ScrollViewProps>

  return (props: React.PropsWithChildren<CollapsableHeaderViewProps<P>>) => {
    const { scrollIndicatorInsets, contentContainerStyle, ...other } = props
    const { scrollOffsetY, headerHeight } = useCollapsableHeaderContext()
    const isEnabledImprovedAlertsFlow = useFeatureFlag("AREnableImprovedAlertsFlow")

    return (
      <AnimatedComponent
        {...other}
        contentContainerStyle={[
          {
            paddingTop: headerHeight * 2,
          },
          contentContainerStyle,
        ]}
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
}
