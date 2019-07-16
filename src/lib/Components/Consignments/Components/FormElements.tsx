import { Box, Button } from "@artsy/palette"
import React from "react"
import { ScrollView, View, ViewProperties } from "react-native"
import { BodyText, LargeHeadline } from "../Typography/index"

export interface FormButtonProps extends ViewProperties {
  /** The text value on the string */
  text: string
  /** Optional callback function, not including it implies the button is not enabled */
  onPress?: React.TouchEventHandler<Button>
  /** Disables the button from executing onPress and shows in distable styling */
  disabled?: boolean
}

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

export const FormButton: React.SFC<FormButtonProps> = props => (
  <Box style={Object.assign({ width: 174, marginTop: 20 }, props.style)}>
    <Button block width={100} variant="primaryWhite" onPress={props.onPress}>
      {props.text}
    </Button>
  </Box>
)
