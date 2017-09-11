import * as React from "react"
import {
  ActivityIndicator,
  Image,
  ImageURISource,
  Text,
  TextInput,
  TextInputProperties,
  View,
  ViewProperties,
} from "react-native"

import styled from "styled-components/native"
import colors from "../../../../data/colors"
import fonts from "../../../../data/fonts"

export interface TextInputProps extends ViewProperties {
  searching?: boolean
  text?: TextInputProperties
  preImage?: ImageURISource | ImageURISource[]
}

const Input = styled.TextInput`
  height: 40;
  background-color: black;
  color: white;
  font-family: "${fonts["garamond-regular"]}";
  font-size: 20;
  flex: 1;
`

const Separator = styled.View`
  background-color: ${colors["gray-regular"]};
  height: 2;
`

const render = (props: TextInputProps) =>
  <View style={[props.style, { flex: 1, maxHeight: 40 }]}>
    <View style={{ flexDirection: "row", height: 40 }}>
      {props.preImage && <Image source={props.preImage} style={{ marginRight: 6, marginTop: 12 }} />}
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
