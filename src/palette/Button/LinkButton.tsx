import { Text, TextProps } from "@artsy/palette-mobile"
import { Touchable } from ".."

export const LinkButton = (props: TextProps) => (
  <Touchable onPress={props.onPress}>
    <Text underline {...props} />
  </Touchable>
)
