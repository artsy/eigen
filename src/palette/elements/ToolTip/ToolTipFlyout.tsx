import { Flex } from "palette/elements/Flex"
import { Text } from "palette/elements/Text"
import { useColor } from "palette/hooks"
import { useEffect } from "react"
import { TouchableWithoutFeedback, ViewStyle } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"

interface Props {
  containerStyle?: ViewStyle
  tapToDismiss?: boolean
  height: number
  width: number
  onToolTipPress?: () => void
  onClose: () => void
  position?: "TOP" | "BOTTOM"
  testID?: string
  text?: string
}

export const ToolTipFlyout: React.FC<Props> = ({
  containerStyle,
  tapToDismiss,
  height,
  width,
  onClose,
  onToolTipPress,
  testID,
  text,
}) => {
  const initialBoxDimensions = { height: 0, width: 0 }
  const boxDimensions = useSharedValue(initialBoxDimensions)

  const animationStyle = useAnimatedStyle(() => ({
    height: withTiming(boxDimensions.value.height, {
      duration: 500,
    }),
    width: withTiming(boxDimensions.value.width, {
      duration: 500,
    }),
  }))

  useEffect(() => {
    if (text) {
      boxDimensions.value = {
        height,
        width,
      }
    } else {
      boxDimensions.value = initialBoxDimensions
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, height, width])

  const color = useColor()

  const handleClose = () => {
    onClose()
  }

  const onPress = () => {
    onToolTipPress?.()
    if (tapToDismiss) {
      handleClose()
    }
  }

  return (
    <TouchableWithoutFeedback onPress={onPress} testID={testID}>
      <Animated.View
        style={[
          {
            backgroundColor: color("black100"),
            position: "absolute",
            alignSelf: "center",
          },
          containerStyle,
          animationStyle,
        ]}
      >
        <Flex justifyContent="center" alignItems="center" bg="black100">
          <ToolTipTextContainer text={text} />
        </Flex>
      </Animated.View>
    </TouchableWithoutFeedback>
  )
}

/** Please Be careful applying any styling here. This forms the basis with which we measure
 * in advance how large we can inflate a tooltip.
 */
export const ToolTipTextContainer: React.FC<{ text?: string }> = ({ text }) => {
  const color = useColor()
  return (
    <Text variant="xs" color={color("white100")} pb={0.5}>
      {text}
    </Text>
  )
}
