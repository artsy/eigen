import { Box, SpaceProps } from "palette"
import React from "react"
import { View } from "react-native"

interface ScreenMarginProps extends SpaceProps {
  ref?: React.Ref<View>
}

export const ScreenMargin: React.FC<ScreenMarginProps> = ({ children, ...rest }) => {
  return (
    <Box px="2" {...rest}>
      {children}
    </Box>
  )
}
