import React from "react"
import { Dimensions, KeyboardAvoidingView, View } from "react-native"

export interface BottomAlignedProps extends React.Props<JSX.Element> {
  onPress: () => void
  verticalOffset?: number
  buttonComponent: any
}

// TODO: Remove this once React Native has been updated
const isPhoneX = Dimensions.get("window").height === 812 && Dimensions.get("window").width === 375
const defaultVerticalOffset = isPhoneX ? 30 : 15

const BottomAlignedButtonWrapper: React.SFC<BottomAlignedProps> = props => (
  <KeyboardAvoidingView
    behavior="padding"
    keyboardVerticalOffset={props.verticalOffset || defaultVerticalOffset}
    style={{ flex: 1 }}
  >
    <View key="space-eater" style={{ flexGrow: 1 }}>
      {props.children}
    </View>

    {props.buttonComponent}
  </KeyboardAvoidingView>
)

export default BottomAlignedButtonWrapper
