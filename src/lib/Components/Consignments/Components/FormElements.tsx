import * as React from "react"

import { ScrollView, TextProperties, View, ViewProperties, ViewStyle } from "react-native"
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
export const Row: React.SFC<ViewProperties> = props =>
  <View style={[props.style, { flexDirection: "row", paddingVertical: 6, alignItems: "center" }]}>
    {props.children}
  </View>

/** A label for form element */
export const Label = (props: any) =>
  <BodyText style={{ paddingLeft: 10, flex: 1, textAlign: "left" }}>
    {props.children}
  </BodyText>
