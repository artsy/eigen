import { Box, SpacingUnitTheme } from "palette"
import { View } from "react-native"
import { SpaceProps } from "styled-system"

interface ScreenMarginProps extends SpaceProps<SpacingUnitTheme> {
  ref?: React.Ref<View>
}

export const ScreenMargin: React.FC<ScreenMarginProps> = ({ children, ...rest }) => {
  return (
    <Box px={2} {...rest}>
      {children}
    </Box>
  )
}
