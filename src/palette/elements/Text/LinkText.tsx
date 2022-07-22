import { Text, TextProps } from "./Text"

export const LinkText = ({ style, ...props }: TextProps) => (
  <Text {...props} style={[style, { textDecorationLine: "underline" }]} />
)
