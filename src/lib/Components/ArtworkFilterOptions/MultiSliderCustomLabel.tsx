import { LabelProps } from "@ptomasroos/react-native-multi-slider"
import { color } from "palette"
import React from "react"
import { Animated, StyleSheet, Text, View } from "react-native"

const width = 50
const pointerWidth = width * 0.47

interface LabelBaseProps {
  position: number
  value: string | number
  pressed: boolean
}

const LabelBase: React.FC<LabelBaseProps> = ({ position, value, pressed }) => {
  const scaleValue = React.useRef(new Animated.Value(0.1)) // Behaves oddly if set to 0
  const cachedPressed = React.useRef(pressed)

  React.useEffect(() => {
    Animated.timing(scaleValue.current, {
      toValue: pressed ? 1 : 0.1,
      duration: 200,
      delay: pressed ? 0 : 2000,
      useNativeDriver: false,
    }).start()
    cachedPressed.current = pressed
  }, [pressed])

  if (Number.isFinite(position) && Number.isFinite(value)) {
    return (
      <Animated.View
        style={[
          styles.sliderLabel,
          {
            left: position - width / 2,
            transform: [{ translateY: width }, { scale: scaleValue.current }, { translateY: -width }],
          },
        ]}
      >
        <View style={styles.pointer} />
        <Text style={styles.sliderLabelText}>{value}</Text>
      </Animated.View>
    )
  }
  return null
}

export const CustomLabel = (props: LabelProps) => {
  const {
    oneMarkerValue,
    twoMarkerValue,
    oneMarkerLeftPosition,
    twoMarkerLeftPosition,
    oneMarkerPressed,
    twoMarkerPressed,
  } = props

  return (
    <View style={styles.parentView}>
      <LabelBase position={oneMarkerLeftPosition} value={oneMarkerValue} pressed={oneMarkerPressed} />
      <LabelBase position={twoMarkerLeftPosition} value={twoMarkerValue} pressed={twoMarkerPressed} />
    </View>
  )
}

const styles = StyleSheet.create({
  parentView: {
    position: "relative",
  },
  sliderLabel: {
    position: "absolute",
    justifyContent: "center",
    bottom: "100%",
    width,
    height: width,
  },
  sliderLabelText: {
    textAlign: "center",
    lineHeight: width,
    borderRadius: width / 2,
    borderWidth: 2,
    borderColor: "black",
    backgroundColor: "white",
    flex: 1,
    fontSize: 18,
    color: color("black10"),
  },
  pointer: {
    position: "absolute",
    bottom: -pointerWidth / 4,
    left: (width - pointerWidth) / 2,
    transform: [{ rotate: "45deg" }],
    width: pointerWidth,
    height: pointerWidth,
    backgroundColor: "black",
  },
})
