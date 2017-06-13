import * as React from "react"
import { ActivityIndicator, Text, TextInput, TextInputProperties, View, ViewProperties } from "react-native"

import styled from "styled-components/native"
import colors from "../../../../data/colors"
import fonts from "../../../../data/fonts"

export interface TextInputProps extends ViewProperties {
  searching?: boolean
  text?: TextInputProperties
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
  <View style={{ flex: 1, ...props.style }}>
    <View style={{ flexDirection: "row" }}>
      <Input
        autoCorrect={false}
        clearButtonMode="while-editing"
        keyboardAppearance="dark"
        placeholderTextColor={colors["gray-medium"]}
        selectionColor={colors["gray-medium"]}
        {...props.text}
      />
      {props.searching ? <ActivityIndicator animating={props.searching} /> : null}
    </View>
    <Separator />
  </View>

export default render
