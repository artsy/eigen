import { Flex, Text, Touchable, useSpace } from "@artsy/palette-mobile"
import { THEME } from "@artsy/palette-tokens"
import themeGet from "@styled-system/theme-get"
import { TextInput, TextInputProps } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import styled from "styled-components"

interface InputProps extends TextInputProps {
  value: string
  onChangeText: (text: string) => void
  required?: boolean
  onHintPress?: () => void
  hintText?: string
  label?: string
}

export const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  required = false,
  hintText = "What's this?",
  ...props
}) => {
  const focused = useSharedValue(!!value)
  const space = useSpace()

  const handleChangeText = (text: string) => {
    onChangeText(text)
  }

  const styles = {
    fontFamily: THEME.fonts.sans,
    // TODO: This should be THEME.textVariants["sm-display"].fontSize
    // But this doesn't match the design which shows 16px
    fontSize: 16,
    lineHeight: 20,
    minHeight: 56,
  }

  const textInputAnimatedStyles = useAnimatedStyle(() => {
    return {
      borderWidth: 1,
      borderColor: withTiming(focused.value || value ? THEME.colors.black60 : THEME.colors.black30),
    }
  })

  const labelStyles = {
    // this is neeeded too make sure the label is on top of the input
    backgroundColor: "white",
    marginLeft: 15,
    marginRight: space(0.5),
    paddingHorizontal: space(0.5),
    zIndex: 100,
  }
  const labelAnimatedStyles = useAnimatedStyle(() => {
    const shouldShrink = focused.value || value

    return {
      color: withTiming(shouldShrink ? THEME.colors.blue100 : THEME.colors.black30),
      top: withTiming(shouldShrink || value ? 13 : 40),
      fontSize: withTiming(
        shouldShrink
          ? parseInt(THEME.textVariants["xs"].fontSize, 10)
          : parseInt(THEME.textVariants["sm-display"].fontSize, 10)
      ),
      fontFamily: THEME.fonts.sans,
    }
  })

  const handleFocus = () => {
    focused.value = true
  }

  const handleBlur = () => {
    focused.value = false
  }

  return (
    <>
      {!!props.onHintPress && (
        <Touchable onPress={props.onHintPress} haptic="impactLight">
          <Text underline variant="xs" color="black60" textAlign="right" mb={0.5}>
            {hintText}
          </Text>
        </Touchable>
      )}

      {!!props.label && (
        <Flex flexDirection="row" zIndex={100}>
          <AnimatedText
            style={[labelStyles, labelAnimatedStyles]}
            numberOfLines={1}
            // @ts-expect-error
            pointerEvents="none" // do not respond to touch events
          >
            {props.label}
          </AnimatedText>
        </Flex>
      )}

      <AnimatedStyledInput
        value={value}
        onChangeText={handleChangeText}
        style={[styles, textInputAnimatedStyles]}
        onFocus={handleFocus}
        onBlur={handleBlur}
        // placeholder={props.label}
      />
      {!!required && (
        <Text color="black60" variant="xs" paddingX="15px" mt={0.5}>
          * Required
        </Text>
      )}
    </>
  )
}

const StyledInput = styled(TextInput)`
  padding: 15px;
  font-family: ${themeGet("fonts.sans.regular")};
  border-radius: 4px;
`

const AnimatedStyledInput = Animated.createAnimatedComponent(StyledInput)
const AnimatedText = Animated.createAnimatedComponent(Text)
