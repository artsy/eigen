import { useFeatureFlag } from "lib/store/GlobalStore"
import { Text, useTheme } from "palette"
import React from "react"
import { FlatListProps, ScrollViewProps } from "react-native"
import Animated, { Extrapolate } from "react-native-reanimated"
import { useCollapsibleHeaderContext } from "./CollapsibleHeaderContext"

export type CollapsibleHeaderViewProps<T extends ScrollViewProps> = T & {}

export const withCollapsibleHeader = <P extends ScrollViewProps>(Component: React.ComponentType<P>) => {
  const AnimatedComponent = Animated.createAnimatedComponent(Component) as React.ComponentType<FlatListProps<P>>

  return (props: React.PropsWithChildren<CollapsibleHeaderViewProps<P>>) => {
    const { scrollIndicatorInsets, ListHeaderComponent, ...other } = props
    const { scrollOffsetY, largeTitleVerticalOffset, largeTitleHeight, largeTitleEndEdge, title } =
      useCollapsibleHeaderContext()
    const { space } = useTheme()
    const isEnabledImprovedAlertsFlow = useFeatureFlag("AREnableImprovedAlertsFlow")
    const largeTitleOpacity = Animated.interpolate(scrollOffsetY, {
      inputRange: [0, largeTitleEndEdge],
      outputRange: [1, 0],
      extrapolate: Extrapolate.CLAMP,
    })

    return (
      <AnimatedComponent
        {...other}
        scrollEventThrottle={0.0000000001}
        ListHeaderComponent={
          <>
            {!!isEnabledImprovedAlertsFlow && (
              <Animated.View
                style={{
                  paddingHorizontal: space(2),
                  paddingTop: space(1),
                  paddingBottom: largeTitleVerticalOffset,
                  justifyContent: "center",
                  opacity: largeTitleOpacity,
                }}
                onLayout={(event) => {
                  largeTitleHeight.setValue(new Animated.Value(event.nativeEvent.layout.height))
                }}
              >
                <Text variant="lg">{title}</Text>
              </Animated.View>
            )}
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
    )
  }
}
