import * as React from "react"
import { KeyboardAvoidingView, TouchableOpacity, View } from "react-native"

import styled from "styled-components/native"
import colors from "../../../../data/colors"
import fonts from "../../../../data/fonts"

const ButtonText = styled.Text`
  color: white;
  font-family: "${fonts["avant-garde-regular"]}";
  flex: 1;
  text-align: center;
  font-size: 14;
`

const Separator = styled.View`
  background-color: ${colors["gray-regular"]};
  height: 1;
`
export interface ButtonBodyStyle {
  backgroundColor: string
  height: number
  marginBottom: number
  paddingTop: number
}

export interface BottomAlignedProps {
  onPress: () => void
  children?: any[]
  bodyStyle: ButtonBodyStyle
  buttonText: string
}

const render = (props: BottomAlignedProps) =>
  <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={60} style={{ flex: 1 }}>

    <View key="space-eater" style={{ flexGrow: 1 }}>
      {props.children}
    </View>
    <Separator key="separator" />
    <TouchableOpacity key="button" onPress={props.onPress} style={props.bodyStyle}>
      <ButtonText>{props.buttonText}</ButtonText>
    </TouchableOpacity>
  </KeyboardAvoidingView>

export default class BottomAlignedButton extends React.Component<BottomAlignedProps, null> {
  render() {
    return render(this.props)
  }
}
