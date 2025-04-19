import { useColor, Touchable, TouchableProps } from "@artsy/palette-mobile"

export type TouchableRowProps = TouchableProps

export const TouchableRow: React.FC<TouchableRowProps> = ({ children, ...rest }) => {
  const color = useColor()
  return (
    <Touchable underlayColor={color("mono5")} {...rest}>
      {children}
    </Touchable>
  )
}
