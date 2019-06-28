import React from "react"

import { Box, Button } from "@artsy/palette"
import { ScrollView, View, ViewProperties } from "react-native"
import { ButtonProps } from "../../Buttons"
import { BodyText, LargeHeadline } from "../Typography/index"

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

/** A label for form element */
export const Label = (props: any) => (
  <BodyText style={{ paddingLeft: 10, flex: 1, textAlign: "left" }}>{props.children}</BodyText>
)

export const FormButton: React.SFC<ButtonProps> = props => (
  <Box style={Object.assign({ width: 174, marginTop: 20 }, props.style)}>
    <Button block width="100%" variant="primaryWhite" onPress={props.onPress}>
      {props.text}
    </Button>
  </Box>
)
