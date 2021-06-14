import React, { useRef, useState } from "react"
import { View } from "react-native"
import Animated from "react-native-reanimated"

export function useAutoCollapsingMeasuredView(content: React.ReactChild) {
  const [nativeHeight, setNativeHeight] = useState<Animated.Value<number> | null>(
    __TEST__ ? new Animated.Value(100) : null
  )
  const animation = useRef<Animated.BackwardCompatibleWrapper | null>(null)

  return {
    nativeHeight,
    jsx: (
      <Animated.View style={{ height: nativeHeight!, overflow: "hidden" }}>
        <View
          // on initial render this elem should dictate the parent's height
          // afterwards the parent's height should be controlled by the nativeHeight value
          // and this component should be able to grow and shrink freely, hence the absolute positioning.
          style={
            nativeHeight
              ? {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                }
              : undefined
          }
          onLayout={(e) => {
            if (nativeHeight) {
              if (animation.current) {
                animation.current.stop()
              }
              animation.current = Animated.spring(nativeHeight, {
                ...Animated.SpringUtils.makeDefaultConfig(),
                stiffness: 600,
                damping: 120,
                toValue: e.nativeEvent.layout.height,
              })
              animation.current.start(() => {
                animation.current = null
              })
            } else {
              setNativeHeight(new Animated.Value(e.nativeEvent.layout.height))
            }
          }}
        >
          {content}
        </View>
      </Animated.View>
    ),
  }
}
