import { useColor } from "@artsy/palette-mobile"
import { Touchable, TouchableProps } from "@artsy/palette-mobile"

export type TouchableRowProps = TouchableProps

export const TouchableRow: React.FC<TouchableRowProps> = ({ children, ...rest }) => {
  const color = useColor()
  return (
    <Touchable underlayColor={color("black5")} {...rest}>
      {children}
    </Touchable>
  )
}
