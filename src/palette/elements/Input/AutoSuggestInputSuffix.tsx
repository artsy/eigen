import React from "react"
import { TextStyle, TouchableWithoutFeedback, View, ViewStyle } from "react-native"
import { Text } from "../Text"

interface AutoSuggestInputType {
  inputValue?: string
  inputTextStyle?: TextStyle
  nextSuggestion: string | null
  containerStyle?: ViewStyle
  onPress: (suggestion: string) => void
}

export const AutoSuggestInputSuffix: React.FC<AutoSuggestInputType> = ({
  inputValue,
  inputTextStyle,
  nextSuggestion,
  containerStyle,
  onPress,
}) => {
  if (!inputValue || !nextSuggestion) {
    return null
  }

  const inputSuffix = nextSuggestion?.slice(inputValue.length) ?? nextSuggestion

  if (inputSuffix) {
    return (
      <TouchableWithoutFeedback onPress={() => onPress(nextSuggestion)}>
        <View style={containerStyle}>
          <Text style={{ ...inputTextStyle, marginLeft: -10 }} color="black60">
            {inputSuffix}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }
  return null
}
