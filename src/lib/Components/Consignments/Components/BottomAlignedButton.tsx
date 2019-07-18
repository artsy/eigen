import React from "react"
import { KeyboardAvoidingView, NativeModules, StatusBarIOS, TouchableOpacity, View } from "react-native"

import { Colors } from "lib/data/colors"
import { Fonts } from "lib/data/fonts"
import styled from "styled-components/native"

const ButtonText = styled.Text`
  color: white;
  font-family: "${Fonts.AvantGardeRegular}";
  flex: 1;
  text-align: center;
  font-size: 14;
`

const Separator = styled.View`
  background-color: ${Colors.GraySemibold};
  height: 1;
`

export interface ButtonBodyStyle {
  backgroundColor: string
  height: number
  marginBottom: number
  paddingTop: number
}

export interface BottomAlignedProps extends React.Props<JSX.Element> {
  onPress: () => void
  bodyStyle: ButtonBodyStyle
  buttonText: string
  disabled?: boolean
  verticalOffset?: number
}

const { StatusBarManager } = NativeModules

export class BottomAlignedButton extends React.Component<BottomAlignedProps> {
  state = { statusBarHeight: 0 }
  statusBarListener = null

  componentDidMount() {
    if (StatusBarManager && StatusBarManager.getHeight) {
      StatusBarManager.getHeight(statusBarFrameData => {
        this.setState({ statusBarHeight: statusBarFrameData.height })
      })
      this.statusBarListener = StatusBarIOS.addListener("statusBarFrameWillChange", statusBarData => {
        this.setState({ statusBarHeight: statusBarData.frame.height })
      })
    }
  }

  componentWillUnmount() {
    this.statusBarListener.remove()
  }
  render() {
    const { buttonText, onPress, children, bodyStyle, disabled } = this.props
    return (
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={this.state.statusBarHeight} style={{ flex: 1 }}>
        <View key="space-eater" style={{ flexGrow: 1 }}>
          {children}
        </View>

        <Separator key="separator" />
        <TouchableOpacity key="button" onPress={onPress} style={bodyStyle} disabled={disabled}>
          <ButtonText>{buttonText}</ButtonText>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    )
  }
}
