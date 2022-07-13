import { Text, TextProps, Touchable } from "palette"

export const LinkButton = (props: TextProps) => (
  <Touchable onPress={props.onPress}>
    <Text underline {...props} />
  </Touchable>
)
