import { useColor } from "@artsy/palette-mobile"
import { useState } from "react"
import { useFps } from "react-fps"
import { Text, TouchableOpacity, View, ViewStyle } from "react-native"

export function FPSCounter({ style }: { style?: ViewStyle }) {
  const { currentFps, avgFps, fps, maxFps } = useFps(20)
  const [opacity, setOpacity] = useState(1)
  const color = useColor()

  const textHeight = 20
  const graphHeight = 40
  const borderWidth = 1
  const viewHeight = textHeight + graphHeight + 2 * borderWidth

  return (
    <View
      style={{
        position: "absolute",
        height: viewHeight,
        width: 86,
        left: 4,
        bottom: 4,
        backgroundColor: color("mono0"),
        borderColor: color("mono100"),
        borderWidth,
        paddingHorizontal: 2,
        opacity,
        ...style,
      }}
    >
      <TouchableOpacity
        accessibilityRole="button"
        onPress={() => {
          setOpacity(opacity === 1 ? 0.15 : 1)
        }}
      >
        <View style={{ height: textHeight }}>
          <Text style={{ fontSize: 10 }}>
            FPS {currentFps} <Text style={{ fontSize: 9 }}>(avg {Number(avgFps).toFixed(1)})</Text>
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            height: graphHeight,
          }}
        >
          {fps.map((val, i) => (
            <View
              key={`${i}`}
              style={{
                backgroundColor: "#6E1EFF",
                height: (graphHeight * val) / maxFps,
                width: 4,
                marginBottom: 2,
              }}
            />
          ))}
        </View>
      </TouchableOpacity>
    </View>
  )
}
