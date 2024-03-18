import { THEME } from "@artsy/palette-tokens"
import themeGet from "@styled-system/theme-get"
import { TextInput, TextInputProps } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import styled from "styled-components"

interface InputProps extends TextInputProps {
  value: string
  onChangeText: (text: string) => void
  isFocused?: boolean
}

export const Input: React.FC<InputProps> = ({ value, onChangeText, isFocused = false }) => {
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
    <AnimatedStyledInput
      value={value}
      onChangeText={handleChangeText}
      style={animatedStyles}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  )
}

const StyledInput = styled(TextInput)`
  padding: ${themeGet("space.1")};
  font-family: ${themeGet("fonts.sans.regular")};
  border-radius: 4px;
`

const AnimatedStyledInput = Animated.createAnimatedComponent(StyledInput)
