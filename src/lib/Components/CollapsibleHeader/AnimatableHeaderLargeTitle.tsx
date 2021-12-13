import { useFeatureFlag } from "lib/store/GlobalStore"
import { Text, useSpace } from "palette"
import React from "react"
import Animated, { Extrapolate } from "react-native-reanimated"
import { useCollapsibleHeaderContext } from "./CollapsibleHeaderContext"

export const AnimatableHeaderLargeTitle = () => {
  const isEnabledImprovedAlertsFlow = useFeatureFlag("AREnableImprovedAlertsFlow")
  const space = useSpace()
  const { scrollOffsetY, largeTitleVerticalOffset, largeTitleHeight, largeTitleEndEdge, title } =
    useCollapsibleHeaderContext()

  if (isEnabledImprovedAlertsFlow) {
    const largeTitleOpacity = Animated.interpolate(scrollOffsetY, {
      inputRange: [0, largeTitleEndEdge],
      outputRange: [1, 0],
      extrapolate: Extrapolate.CLAMP,
    })

    return (
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
    )
  }

  return null
}
