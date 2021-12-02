import React, { useState } from "react"
import { View } from "react-native"
import Animated from "react-native-reanimated"

export function useMeasuredView(content: React.ReactNode) {
  const [nativeHeight, setNativeHeight] = useState<Animated.Value<number>>(
    __TEST__ ? new Animated.Value(100) : new Animated.Value(0)
  )

  return {
    nativeHeight,
    jsx: (
      <View
        onLayout={(e) => {
          setNativeHeight(new Animated.Value(e.nativeEvent.layout.height))
        }}
      >
        {content}
      </View>
    ),
  }
}
