import React from "react"

import { ScrollView, TextProperties, View, ViewProperties, ViewStyle } from "react-native"
import { ButtonProps, WhiteButton } from "../../Buttons"
import { BodyText, LargeHeadline } from "../Typography/index"
import Text from "./TextInput"

/** A re-usable full-screen form with a scrollview */
export const Form: React.SFC<{ title?: string }> = props =>
  <ScrollView style={{ flex: 1 }}>
    <View style={{ paddingTop: 40 }}>
      {props.title &&
        <LargeHeadline>
          {props.title}
        </LargeHeadline>}
      <View style={{ padding: 10 }}>
        {(props as any).children}
      </View>
    </View>
  </ScrollView>

/** An individual row inside the form */
export const Row: React.SFC<ViewProperties> = ({ children, ...props }) =>
  <View {...props} style={[props.style, { flexDirection: "row", paddingVertical: 6, alignItems: "center" }]}>
    {children}
  </View>

/** A label for form element */
export const Label = (props: any) =>
  <BodyText style={{ paddingLeft: 10, flex: 1, textAlign: "left" }}>
    {props.children}
  </BodyText>

export const Button: React.SFC<ButtonProps> = props =>
  <WhiteButton {...props} style={Object.assign({ height: 43, width: 174, marginTop: 20 }, props.style)} />
