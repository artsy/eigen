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
import { Colors } from "../../../../data/colors"
import { Fonts } from "../../../../data/fonts"

export interface TextInputProps extends ViewProperties {
  searching?: boolean
  readonly?: boolean
  text?: TextInputProperties
  preImage?: ImageURISource | ImageURISource[]
}

const Input = styled.TextInput`
  height: 40;
  background-color: black;
  color: white;
  font-family: "${Fonts.GaramondRegular}";
  font-size: 20;
  flex: 1;
`

const Separator = styled.View`
  background-color: white;
  height: 1;
`

const WritableInput = (props: TextInputProps) =>
  <Input
    autoCorrect={false}
    clearButtonMode="while-editing"
    keyboardAppearance="dark"
    placeholderTextColor={Colors.GraySemibold}
    selectionColor={Colors.GrayMedium}
    {...props.text}
  />

const ReadOnlyInput = (props: TextInputProps) =>
  <Text style={{ color: Colors.White, fontFamily: Fonts.GaramondRegular, fontSize: 20 }}>
    {props.text.value}
  </Text>

const render = (props: TextInputProps) =>
  <View style={[props.style, { flex: 1, maxHeight: 40 }]}>
    <View style={{ flexDirection: "row", height: 40 }}>
      {props.preImage && <Image source={props.preImage} style={{ marginRight: 6, marginTop: 12 }} />}
      {props.readonly ? ReadOnlyInput(props) : WritableInput(props)}

      {props.searching ? <ActivityIndicator animating={props.searching} /> : null}
    </View>
    <Separator />
  </View>

export default render
