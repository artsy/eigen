import React, { useRef } from "react"
import { View } from "react-native"
import Animated from "react-native-reanimated"

export function useAutoCollapsingMeasuredView(content: React.ReactChild | null) {
  const nativeHeight = useRef<Animated.Value<number>>(
    __TEST__ ? new Animated.Value(100) : new Animated.Value(-1)
  ).current

  return {
    nativeHeight,
    jsx: (
      <Animated.View style={{ height: nativeHeight!, overflow: "hidden" }}>
        <View
          // on initial render this elem should dictate the parent's height
          // afterwards the parent's height should be controlled by the nativeHeight value
          // and this component should be able to grow and shrink freely, hence the absolute positioning.
          style={
            Animated.neq(nativeHeight, new Animated.Value(-1))
              ? {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                }
              : undefined
          }
          onLayout={(e) => {
            nativeHeight.setValue(e.nativeEvent.layout.height)
          }}
        >
          {content}
        </View>
      </Animated.View>
    ),
  }
}
