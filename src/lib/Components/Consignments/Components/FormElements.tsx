import React from "react"
import { ScrollView, View, ViewProperties } from "react-native"
import { LargeHeadline } from "../Typography/index"

/** A re-usable full-screen form with a scrollview */
export const Form: React.SFC<{ title?: string }> = props => (
  <ScrollView style={{ flex: 1 }}>
    <View style={{ paddingTop: 40 }}>
      {props.title && <LargeHeadline>{props.title}</LargeHeadline>}
      <View style={{ padding: 10 }}>{(props as any).children}</View>
    </View>
  </ScrollView>
)

/** An individual row inside the form */
export const Row: React.SFC<ViewProperties> = ({ children, ...props }) => (
  <View {...props} style={[props.style, { flexDirection: "row", paddingVertical: 6, alignItems: "center" }]}>
    {children}
  </View>
)
