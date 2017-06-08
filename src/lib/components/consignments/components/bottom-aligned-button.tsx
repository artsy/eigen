import * as React from "react"
import { KeyboardAvoidingView, View } from "react-native"

import styled from "styled-components/native"
import colors from "../../../../data/colors"
import fonts from "../../../../data/fonts"

const ButtonText = styled.Text`
  color: white
  font-family: "${fonts["avant-garde-regular"]}"
  flex: 1
  text-align: center
  font-size: 14
`

const Body = styled.TouchableOpacity`
  height: 56
  margin-bottom: 20
  padding-top: 18
`

const Separator = styled.View`
  background-color: ${colors["gray-regular"]}
  height: 1
`

export interface BottomAlignedProps {
  onPress: () => void
  children: any[]
}

const render = (props: BottomAlignedProps) =>
  <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={60} style={{ flex: 1 }}>

    {props.children}

    <View key="space-eater" style={{ flexGrow: 1 }} />
    <Separator key="separator" />
    <Body key="button" onPress={props.onPress}>
      <ButtonText>DONE</ButtonText>
    </Body>
  </KeyboardAvoidingView>

// Export a pure component version
export default class BottomAlignedButton extends React.PureComponent<BottomAlignedProps, null> {
  render() {
    return render(this.props)
  }
}
