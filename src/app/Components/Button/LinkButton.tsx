import { Text, TextProps, Touchable } from "@artsy/palette-mobile"

export const LinkButton = (props: TextProps) => (
  <Touchable onPress={props.onPress}>
    <Text underline {...props} />
  </Touchable>
)
