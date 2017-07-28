import * as React from "react"
import { ActivityIndicator, Text, TextInput, TextInputProperties, View, ViewProperties } from "react-native"

import styled from "styled-components/native"
import colors from "../../../../data/colors"
import fonts from "../../../../data/fonts"

export interface TextAreaProps extends ViewProperties {
  text?: TextInputProperties
}

const Input = styled.TextInput`
  height: 100%;
  background-color: black;
  color: white;
  font-family: "${fonts["garamond-regular"]}";
  font-size: 20;
  flex: 1;
`

const render = (props: TextAreaProps) =>
  <View style={{ flex: 1, ...props.style }}>
    <View style={{ flexDirection: "row" }}>
      <Input
        autoCapitalize={"sentences"}
        keyboardAppearance="dark"
        placeholderTextColor={colors["gray-medium"]} // TODO: Placeholder isn't multiline.
        selectionColor={colors["gray-medium"]}
        multiline={true}
        numberOfLines={4} // TODO: How to scroll multiline text area?
        {...props.text}
      />
    </View>
  </View>

export default render
