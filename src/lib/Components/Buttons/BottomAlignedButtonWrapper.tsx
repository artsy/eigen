import React from "react"
import { View } from "react-native"
import { ArtsyKeyboardAvoidingView } from "../ArtsyKeyboardAvoidingView"

export interface BottomAlignedProps extends React.Props<JSX.Element> {
  onPress?: () => void
  buttonComponent: any
}

export const BottomAlignedButtonWrapper: React.FC<BottomAlignedProps> = (props) => (
  <ArtsyKeyboardAvoidingView>
    <View key="space-eater" style={{ flexGrow: 1 }}>
      {props.children}
    </View>

    {props.buttonComponent}
  </ArtsyKeyboardAvoidingView>
)
