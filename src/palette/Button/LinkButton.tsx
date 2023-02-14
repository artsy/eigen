import { Touchable, Text, TextProps } from ".."

export const LinkButton = (props: TextProps) => (
  <Touchable onPress={props.onPress}>
    <Text underline {...props} />
  </Touchable>
)
