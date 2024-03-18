import { Text } from "@artsy/palette-mobile"
import { THEME } from "@artsy/palette-tokens"
import themeGet from "@styled-system/theme-get"
import { TextInput, TextInputProps } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import styled from "styled-components"

interface InputProps extends TextInputProps {
  value: string
  onChangeText: (text: string) => void
  isFocused?: boolean
  required?: boolean
}

export const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  isFocused = false,
  required = false,
}) => {
  const focused = useSharedValue(isFocused ?? false)

  const handleChangeText = (text: string) => {
    onChangeText(text)
  }

  const animatedStyles = useAnimatedStyle(() => {
    return {
      borderWidth: 1,
      borderColor: withTiming(focused.value ? THEME.colors.black60 : THEME.colors.black30),
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
      <AnimatedStyledInput
        value={value}
        onChangeText={handleChangeText}
        style={animatedStyles}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {!!required && (
        <Text color="black60" variant="xs" paddingX="15px">
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
