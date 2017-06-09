import * as React from "react"
import { ActivityIndicator, Text, TextInput, View } from "react-native"

import styled from "styled-components/native"
import colors from "../../../../data/colors"
import fonts from "../../../../data/fonts"

export interface TextInputProps {
  query: string
  searching?: boolean
  textDidChange?: (text: string) => void
  placeholder: string
}

const Input = styled.TextInput`
  height: 40;
  background-color: black;
  color: white;
  font-family: "${fonts["garamond-regular"]}";
  font-size: 20;
  border-bottom-color: white;
  border-bottom-width: 1;
  flex: 1;
`

const Separator = styled.View`
  background-color: ${colors["gray-regular"]};
  height: 1;
`

const render = (props: TextInputProps) =>
  <View>
    <View style={{ flexDirection: "row" }}>
      <Input
        autoFocus={typeof jest === "undefined" /* TODO: https://github.com/facebook/jest/issues/3707 */}
        autoCorrect={false}
        clearButtonMode="while-editing"
        onChangeText={props.textDidChange}
        placeholder={props.placeholder}
        keyboardAppearance="dark"
        placeholderTextColor={colors["gray-medium"]}
        value={props.query}
        returnKeyType="search"
        selectionColor={colors["gray-medium"]}
      />
      <ActivityIndicator animating={props.searching} />
    </View>
    <Separator />
  </View>

export default render
